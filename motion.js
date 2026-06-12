/* =========================================================================
   motion.js — lightweight reveal + cursor + magnetic interactions.
   Self-contained (does not require GSAP/Lenis to function). Fails open:
   if anything throws, all content remains visible.
   ========================================================================= */
(function () {
  'use strict';

  var docEl = document.documentElement;

  // Clear any page-transition curtain left by the inline sessionStorage guard.
  try {
    docEl.classList.remove('vera-curtain');
    sessionStorage.removeItem('vera-tr');
  } catch (e) {}

  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function init() {
    initReveals();
    initCursor();
    initNavScroll();
    initMobileNav();
    initMagnetic();
  }

  /* ---------------------------- Mobile nav toggle ---------------------------- */
  function initMobileNav() {
    var navEl = document.querySelector('.nav, .nav--floating');
    var toggle = navEl && navEl.querySelector('.nav-toggle');
    if (!navEl || !toggle) return;
    var links = navEl.querySelector('.nav-links');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navEl.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (links) {
      links.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navEl.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
    document.addEventListener('click', function (e) {
      if (navEl.classList.contains('menu-open') && !navEl.contains(e.target)) {
        navEl.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------- Reveals ---------------------------- */
  function initReveals() {
    var nodes = document.querySelectorAll(
      '[data-reveal], [data-reveal-lines], [data-reveal-child]'
    );
    if (!nodes.length) return;

    // If IntersectionObserver is unavailable or motion is reduced, just show.
    if (prefersReduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-in');
      return;
    }

    // Gate the hidden pre-state on motion-ready so JS-off never hides content.
    docEl.classList.add('motion-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;
        el.style.transitionDelay = delay + 's';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    nodes.forEach(function (el) { io.observe(el); });

    // Safety net: reveal anything still hidden after 3s (e.g. tab was backgrounded).
    setTimeout(function () {
      nodes.forEach(function (el) { el.classList.add('is-in'); });
    }, 3000);
  }

  /* ---------------------------- Custom cursor ---------------------------- */
  function initCursor() {
    var dot = document.querySelector('.cursor-dot');
    var label = document.querySelector('.cursor-label');
    if (!dot) return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

    var x = 0, y = 0;
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      if (label) label.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(12px,12px)';
    });

    document.addEventListener('mousedown', function () { dot.classList.add('is-press'); });
    document.addEventListener('mouseup', function () { dot.classList.remove('is-press'); });

    var targets = document.querySelectorAll('[data-cursor], a, button');
    targets.forEach(function (t) {
      t.addEventListener('mouseenter', function () {
        dot.classList.add('is-hover');
        var text = t.getAttribute('data-cursor');
        if (label && text) { label.textContent = text; label.classList.add('is-visible'); }
      });
      t.addEventListener('mouseleave', function () {
        dot.classList.remove('is-hover');
        if (label) label.classList.remove('is-visible');
      });
    });
  }

  /* ---------------------------- Nav shadow on scroll ---------------------------- */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 8) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------- Magnetic buttons ---------------------------- */
  function initMagnetic() {
    if (prefersReduced) return;
    var els = document.querySelectorAll('[data-magnetic]');
    els.forEach(function (el) {
      var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.25;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (mx * strength) + 'px,' + (my * strength) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
