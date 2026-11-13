// Single-page behaviour: mobile menu, case-study switcher and reveal-on-scroll. The page renders fully without it.
(function () {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Case studies: one story open at a time, chosen from the three boxes.
  var tabs = document.querySelectorAll('.case-tab');
  // On phones the cards stack, so each story moves directly under its own card.
  var tabsWrap = document.querySelector('.case-tabs');
  var panels = Array.prototype.map.call(tabs, function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var narrow = window.matchMedia('(max-width: 960px)');
  function placePanels() {
    if (!tabsWrap) return;
    if (narrow.matches) {
      tabs.forEach(function (t, i) { if (panels[i]) t.after(panels[i]); });
    } else {
      var anchor = tabsWrap;
      panels.forEach(function (p) { if (p) { anchor.after(p); anchor = p; } });
    }
  }
  placePanels();
  if (narrow.addEventListener) narrow.addEventListener('change', placePanels);
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var els = document.querySelectorAll('.reveal');
  if (!document.documentElement.classList.contains('js-on')) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach(function (el) { io.observe(el); });
})();
