/* =====================================================================
   robin-hotz.com | Rebrand | theme.js
   Theme- und Sprachstart. Wird blockierend im <head> geladen, damit
   Darstellung und Sprache vor dem ersten Rendern feststehen.

   Theme:   localStorage "theme-pref" = light | dark | system
            Ohne gespeicherte Wahl startet die Seite dunkel.
   Sprache: localStorage "rh_lang" = de | en, ?lang=de|en hat Vorrang,
            danach die Browsersprache.
   Beide Schlüssel teilt sich die Rebrand-Seite mit den übrigen Seiten
   von robin-hotz.com, damit eine Wahl beim Seitenwechsel erhalten bleibt.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- Theme ---------- */
  var THEME_KEY = 'theme-pref';
  var DEFAULT_THEME = 'dark';
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function validTheme(pref) {
    return pref === 'light' || pref === 'dark' || pref === 'system' ? pref : DEFAULT_THEME;
  }

  var themePreference = DEFAULT_THEME;
  try { themePreference = validTheme(localStorage.getItem(THEME_KEY)); } catch (e) { /* Speicher gesperrt */ }

  function resolveTheme(pref) {
    return pref === 'system' ? (systemDark.matches ? 'dark' : 'light') : pref;
  }

  function applyTheme(pref) {
    var theme = resolveTheme(pref);
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#06070b' : '#f6f5fb');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme, pref: pref } }));
  }

  window.themePref = {
    get: function () { return themePreference; },
    set: function (pref) {
      themePreference = validTheme(pref);
      try { localStorage.setItem(THEME_KEY, themePreference); } catch (e) { /* Speicher gesperrt */ }
      applyTheme(themePreference);
    }
  };

  if (systemDark.addEventListener) {
    systemDark.addEventListener('change', function () {
      if (themePreference === 'system') applyTheme('system');
    });
  }

  applyTheme(themePreference);

  /* ---------- Sprache ---------- */
  var LANG_KEY = 'rh_lang';

  function pickLang() {
    try {
      var fromUrl = new URLSearchParams(location.search).get('lang');
      if (fromUrl === 'de' || fromUrl === 'en') return fromUrl;
    } catch (e) { /* sehr alte Browser */ }
    var stored;
    try { stored = localStorage.getItem(LANG_KEY); } catch (e) { /* Speicher gesperrt */ }
    if (stored === 'de' || stored === 'en') return stored;
    return (navigator.language || 'de').toLowerCase().indexOf('en') === 0 ? 'en' : 'de';
  }

  function applyLang(lang) {
    lang = lang === 'en' ? 'en' : 'de';
    root.setAttribute('lang', lang);
    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    var desc = root.getAttribute('data-desc-' + lang);
    var meta = document.querySelector('meta[name="description"]');
    if (desc && meta) meta.setAttribute('content', desc);
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  window.langPref = {
    get: function () { return root.getAttribute('lang') === 'en' ? 'en' : 'de'; },
    set: function (lang) {
      lang = lang === 'en' ? 'en' : 'de';
      /* Ein geteilter ?lang-Link soll nach dem Neuladen die neue Wahl behalten. */
      try {
        var url = new URL(location.href);
        url.searchParams.set('lang', lang);
        history.replaceState(history.state, '', url.href);
      } catch (e) { /* sehr alte Browser */ }
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* Speicher gesperrt */ }
      applyLang(lang);
    }
  };

  applyLang(pickLang());
})();
