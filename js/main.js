/* ============================================================
   Seiten-Interaktion: Scroll-Navigation, mobiles Menü,
   Umschalter-Dropdowns für Sprache und Theme.
   (Theme-/Sprachlogik liegt in theme.js —
    window.themePref und window.langPref)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Navigation: transparent → Glasleiste ---------- */
  var head = document.getElementById('siteHead');
  function onScroll() {
    head.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobiles Menü ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) head.classList.add('scrolled'); else onScroll();
  });

  /* ---------- Umschalter-Dropdowns (Klick öffnet/schließt) ---------- */
  var ctls = [].slice.call(document.querySelectorAll('.drop-ctl'));

  function closeAll(except) {
    ctls.forEach(function (c) {
      if (c !== except) {
        c.classList.remove('open');
        c.querySelector('.ctl-btn').setAttribute('aria-expanded', 'false');
      }
    });
  }
  ctls.forEach(function (ctl) {
    var btn = ctl.querySelector('.ctl-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = ctl.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(open ? ctl : null);
    });
  });
  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });

  /* Auswahl in einem Umschalter-Dropdown markieren + Label setzen */
  function select(ctl, value, attr, labelText) {
    ctl.querySelectorAll('[' + attr + ']').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute(attr) === value ? 'true' : 'false');
    });
    ctl.querySelector('.ctl-label').textContent = labelText;
    ctl.classList.remove('open');
    ctl.querySelector('.ctl-btn').setAttribute('aria-expanded', 'false');
  }

  /* ---------- Theme (Light / Dark) ----------
     Label und Optionen heißen in beiden Sprachen Light/Dark.
     Ohne gespeicherte Wahl folgt die Seite der Systemeinstellung;
     markiert wird immer der tatsächlich aktive Modus. */
  var themeCtl = document.getElementById('themeCtl');
  var THEME_LABELS = { light: 'Light', dark: 'Dark' };
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function syncTheme() {
    select(themeCtl, currentTheme(), 'data-set-theme', THEME_LABELS[currentTheme()]);
  }
  syncTheme();
  themeCtl.querySelectorAll('[data-set-theme]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.themePref.set(btn.getAttribute('data-set-theme'));
      syncTheme();
    });
  });
  /* Label aktuell halten, wenn das System-Theme live wechselt */
  window.addEventListener('themechange', function () {
    themeCtl.querySelector('.ctl-label').textContent = THEME_LABELS[currentTheme()];
    themeCtl.querySelectorAll('[data-set-theme]').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-set-theme') === currentTheme() ? 'true' : 'false');
    });
  });

  /* ---------- Sprache (DE / EN) ---------- */
  var langCtl = document.getElementById('langCtl');
  var LANG_LABELS = { de: 'DE', en: 'EN' };
  function syncLang() {
    select(langCtl, window.langPref.get(), 'data-lang', LANG_LABELS[window.langPref.get()]);
  }
  syncLang();
  langCtl.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.langPref.set(btn.getAttribute('data-lang'));
      syncLang();
    });
  });
  window.addEventListener('langchange', syncLang);
})();
