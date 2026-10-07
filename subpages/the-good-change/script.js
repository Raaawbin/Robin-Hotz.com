/* THE GOOD CHANGE · VISION · B2B landing page · script.js
   1. Language switch DE/EN: both languages live in the markup (.lang-de / .lang-en).
      This script sets <html lang>, CSS hides the inactive one. Same priority and storage
      key as js/lang.js on robin-hotz.com: ?lang= parameter, saved choice, browser language.
      Attributes: data-alt-en (img alt) and data-label-en (aria-label) carry the English text.
   2. Page interactions: mobile menu, knot, VISION stations, services, network rail, hello button.
   Loaded in <head> without defer, so the language is set before the first paint. */
(function () {
  'use strict';

  var KEY = 'rh_lang';
  var root = document.documentElement;

  /* UI strings that only live in JavaScript */
  var T = {
    de: { menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', knotBefore: 'Viele Fäden, kein Muster.', knotAfter: 'Ein Faden, eine Richtung.' },
    en: { menuOpen: 'Open menu', menuClose: 'Close menu', knotBefore: 'Many threads, no pattern.', knotAfter: 'One thread, one direction.' }
  };

  function pick() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'de' || q === 'en') return q;
    } catch (e) {}
    var stored;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored === 'de' || stored === 'en') return stored;
    var nav = (navigator.language || 'de').toLowerCase();
    return nav.indexOf('en') === 0 ? 'en' : 'de';
  }

  var lang = pick();
  root.setAttribute('lang', lang);

  function swapAttr(attr, key, l) {
    document.querySelectorAll('[data-' + key + '-en]').forEach(function (el) {
      if (!el.hasAttribute('data-' + key + '-de')) el.setAttribute('data-' + key + '-de', el.getAttribute(attr) || '');
      el.setAttribute(attr, el.getAttribute('data-' + key + '-' + l));
    });
  }

  var onLang = [];
  function apply(l) {
    if (l !== 'de' && l !== 'en') l = 'de';
    lang = l;
    root.setAttribute('lang', l);
    var t = root.getAttribute('data-title-' + l);
    if (t) document.title = t;
    var d = root.getAttribute('data-desc-' + l);
    var meta = document.querySelector('meta[name="description"]');
    if (d && meta) meta.setAttribute('content', d);
    swapAttr('alt', 'alt', l);
    swapAttr('aria-label', 'label', l);
    document.querySelectorAll('.lang-switch button[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false');
    });
    onLang.forEach(function (fn) { fn(l); });
  }

  window.rhSetLang = function (l, persist) {
    apply(l);
    if (persist) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
    var clamp = function (v, a, b) { a = a || 0; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)); };

    $('#year').textContent = new Date().getFullYear();

    /* ── Language switch ── */
    $$('.lang-switch button[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { window.rhSetLang(b.getAttribute('data-lang'), true); });
    });

    /* ── Mobile menu ── */
    var burger = $('.burger'), menu = $('#mobile-menu');
    function toggleMenu(open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? T[lang].menuClose : T[lang].menuOpen);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { toggleMenu(!document.body.classList.contains('menu-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });
    onLang.push(function (l) {
      burger.setAttribute('aria-label', document.body.classList.contains('menu-open') ? T[l].menuClose : T[l].menuOpen);
    });

    /* Smooth path through points (Catmull-Rom to cubic Bezier) */
    function smooth(pts, t) {
      var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        var c1 = [p1[0] + (p2[0] - p0[0]) * t / 3, p1[1] + (p2[1] - p0[1]) * t / 3];
        var c2 = [p2[0] - (p3[0] - p1[0]) * t / 3, p2[1] - (p3[1] - p1[1]) * t / 3];
        d += ' C' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      return d;
    }

    /* ── Knot: unties once when it comes into view (time based, not scroll linked) ── */
    var knot = $('#knot'), knotPath = $('#knot-path'), knotLabel = $('#knot-label');
    var seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    var N = 44, tangled = [], straight = [];
    for (var i = 0; i < N; i++) {
      var a = i * 2.35 + rnd() * 1.4, rad = 46 + rnd() * 150;
      tangled.push([280 + Math.cos(a) * rad * 1.15, 210 + Math.sin(a) * rad * .82]);
      straight.push([20 + (520 * i) / (N - 1), 220 + Math.sin(i / (N - 1) * Math.PI * 2) * 26]);
    }
    tangled[0] = [10, 300]; tangled[N - 1] = [550, 120];
    var mix = function (x, y, t) { return x + (y - x) * t; };
    var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var loose = false;
    function setKnotLabel() { knotLabel.textContent = loose ? T[lang].knotAfter : T[lang].knotBefore; }
    function drawKnot(p) {
      var pts = tangled.map(function (pt, k) {
        var local = ease(clamp(p * 1.35 - (k / N) * .35));
        return [mix(pt[0], straight[k][0], local), mix(pt[1], straight[k][1], local)];
      });
      knotPath.setAttribute('d', smooth(pts, .9));
      var e = ease(p);
      knotPath.style.stroke = 'rgb(' + Math.round(mix(0, 2, e)) + ',' + Math.round(mix(0, 152, e)) + ',' + Math.round(mix(0, 85, e)) + ')';
      knotPath.style.strokeWidth = mix(1.8, 3.2, e);
      loose = p > .95;
      knot.classList.toggle('is-loose', loose);
      setKnotLabel();
    }
    function playKnot() {
      if (reduce) { drawKnot(1); return; }
      var t0 = performance.now(), dur = 2800;
      var step = function (now) { var p = clamp((now - t0 - 500) / dur); drawKnot(p); if (p < 1) requestAnimationFrame(step); };
      drawKnot(0); requestAnimationFrame(step);
    }
    drawKnot(reduce ? 1 : 0);
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { playKnot(); o.disconnect(); } }, { threshold: .5 }).observe(knot);
    $('#knot-replay').addEventListener('click', playKnot);
    onLang.push(setKnotLabel);

    /* ── VISION: static landscape, stations by click and keyboard ── */
    var tabs = $$('.vtab'), panels = $$('.vpanel');
    var stops = [[110, 268], [318, 168], [500, 252], [706, 150], [884, 244], [1086, 140]];
    var routeD = smooth([[16, 352]].concat(stops, [[1170, 92]]), .75);
    $('#route').setAttribute('d', routeD);
    $('#flow').setAttribute('d', routeD);
    var hills = $$('.vmap .hill'), dayTexts = $$('.vmap .daylabel, .vmap .daysub');
    var days = $$('.vday'), dayBtns = $$('.vday__letters button'), word = $$('#vision-word span');
    var current = 0;
    function select(n, focus) {
      n = (n + 6) % 6; current = n;
      var day = Math.floor(n / 2);
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === n));
        t.tabIndex = k === n ? 0 : -1;
        t.classList.toggle('is-done', k < n);
      });
      panels.forEach(function (p, k) { p.hidden = k !== n; p.classList.toggle('is-shown', k === n); });
      hills.forEach(function (h) { h.classList.toggle('is-on', +h.dataset.day === day); });
      dayTexts.forEach(function (t) { t.classList.toggle('is-on', +t.dataset.day === day); });
      days.forEach(function (d) { d.classList.toggle('is-on', +d.dataset.day === day); });
      dayBtns.forEach(function (b) { b.classList.toggle('is-on', +b.dataset.go === n); });
      word.forEach(function (w, k) { w.classList.toggle('is-on', k === n); });
      $('#vcount').textContent = String(n + 1).padStart(2, '0') + ' / 06';
      if (focus) tabs[n].focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k); });
      t.addEventListener('keydown', function (e) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (step) { e.preventDefault(); select(current + step, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(5, true); }
      });
    });
    $('#vprev').addEventListener('click', function () { select(current - 1); });
    $('#vnext').addEventListener('click', function () { select(current + 1); });
    dayBtns.concat(word).forEach(function (b) { b.addEventListener('click', function () { select(+b.dataset.go); }); });
    select(0);

    /* ── Services accordion ── */
    $$('.svc__item').forEach(function (item) {
      var btn = $('.svc__btn', item);
      btn.addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    /* ── Network rail ── */
    var rail = $('#rail');
    $$('[data-rail]').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = rail.querySelector('.mate');
        rail.scrollBy({ left: +b.dataset.rail * (card.offsetWidth + 16) * 2, behavior: reduce ? 'auto' : 'smooth' });
      });
    });

    /* ── Floating hello: hide over CTA and footer ── */
    var hello = $('#hello'), zones = new Map();
    var zoneIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { zones.set(e.target, e.isIntersecting); });
      hello.classList.toggle('is-hidden', Array.from(zones.values()).some(Boolean));
    }, { threshold: .05 });
    [$('#kontakt'), $('.footer')].forEach(function (z) { zoneIO.observe(z); });

    apply(lang);
  });
})();
