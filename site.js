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
      // Phones: no switching. Every story shows, each under its own card.
      tabsWrap.classList.add('cases-static');
      tabs.forEach(function (t, i) { if (panels[i]) { t.after(panels[i]); panels[i].hidden = false; } t.tabIndex = -1; });
    } else {
      tabsWrap.classList.remove('cases-static');
      var anchor = tabsWrap;
      panels.forEach(function (p, i) {
        if (!p) return;
        anchor.after(p); anchor = p;
        p.hidden = tabs[i].getAttribute('aria-selected') !== 'true';
        tabs[i].removeAttribute('tabindex');
      });
    }
  }
  placePanels();
  if (narrow.addEventListener) narrow.addEventListener('change', placePanels);
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (narrow.matches) return;
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

/* Email links. Phones hand mailto: to the mail app, but most desktop browsers
   have no mail app set up, so the click does nothing. On desktop (mouse or
   trackpad) open a Gmail compose window in a new tab instead. */
(function () {
  var desktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  document.addEventListener('click', function (e) {
    if (!desktop || !desktop.matches || e.defaultPrevented) return;
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    var to = a.getAttribute('href').slice(7).split('?')[0];
    e.preventDefault();
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to), '_blank', 'noopener');
  });
})();
