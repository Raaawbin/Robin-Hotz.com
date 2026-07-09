/* ============================================================
   Theme-Bootstrap — MUSS im <head> ohne defer geladen werden,
   damit das Theme vor dem ersten Rendern gesetzt ist (kein Blitzen).
   Logik:
   - Gespeicherte Wahl: localStorage "theme-pref" = system | light | dark
   - Default "system": folgt der Browser-/OS-Einstellung
     (prefers-color-scheme) und reagiert live auf Änderungen.
   - main.js nutzt window.themePref zum Umschalten per Dropdown.
   ============================================================ */
(function () {
  'use strict';
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

  /* Öffentliche API für main.js (Dropdown) */
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
})();
