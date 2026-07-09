/* ============================================================
   Theme- und Sprach-Bootstrap — MUSS im <head> ohne defer
   geladen werden, damit beides vor dem ersten Rendern gesetzt
   ist (kein Aufblitzen).

   Theme:  localStorage "theme-pref" = system | light | dark
           Default "system" folgt der Browser-/OS-Einstellung
           (prefers-color-scheme) und reagiert live auf Wechsel.
   Sprache: localStorage "rh_lang" = de | en (gleicher Key wie
           lang.js der übrigen Seiten → Wahl gilt seitenweit).
           Default: Browsersprache; ?lang=de|en übersteuert.
           CSS blendet .lang-de/.lang-en passend zu <html lang> aus;
           Titel + Meta-Description wechseln über data-title-… und data-desc-….
   main.js nutzt window.themePref / window.langPref für die Dropdowns.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Theme ---------- */
  var KEY = 'theme-pref';
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function resolve(pref) {
    return pref === 'system' ? (mq.matches ? 'dark' : 'light') : pref;
  }
  function apply(pref) {
    var theme = resolve(pref);
    document.documentElement.setAttribute('data-theme', theme);
    /* Browser-Chrome (Adressleiste mobil) mitfärben */
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#141210' : '#FFFFFF');
    /* UI (z. B. Umschalter-Label) über den Wechsel informieren */
    try {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme, pref: pref } }));
    } catch (e) { /* sehr alte Browser */ }
  }

  window.themePref = {
    get: stored,
    set: function (pref) {
      try { localStorage.setItem(KEY, pref); } catch (e) { /* privater Modus o. ä. */ }
      apply(pref);
    }
  };

  /* Bei "System" live auf OS-Wechsel reagieren */
  if (mq.addEventListener) {
    mq.addEventListener('change', function () {
      if (stored() === 'system') apply('system');
    });
  }

  apply(stored());

  /* ---------- Sprache ---------- */
  var LKEY = 'rh_lang';

  function pickLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'de' || q === 'en') return q;
    } catch (e) {}
    var s;
    try { s = localStorage.getItem(LKEY); } catch (e) {}
    if (s === 'de' || s === 'en') return s;
    var nav = (navigator.language || 'de').toLowerCase();
    return nav.indexOf('en') === 0 ? 'en' : 'de';
  }
  function applyLang(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'de';
    var root = document.documentElement;
    root.setAttribute('lang', lang);
    /* Titel und Meta-Description mitwechseln, falls hinterlegt */
    var t = root.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var d = root.getAttribute('data-desc-' + lang);
    var meta = document.querySelector('meta[name="description"]');
    if (d && meta) meta.setAttribute('content', d);
    try {
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
    } catch (e) {}
  }

  window.langPref = {
    get: function () {
      return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'de';
    },
    set: function (lang) {
      try { localStorage.setItem(LKEY, lang); } catch (e) {}
      applyLang(lang);
    }
  };

  applyLang(pickLang());
})();
