/* =====================================================================
   robin-hotz.com | lang.js
   Sprachumschalter DE/EN + Menü-Verhalten
   Prinzip: Beide Sprachen stehen im Markup (.lang-de / .lang-en).
   Dieses Skript setzt <html lang="de|en">, CSS blendet die inaktive aus.
   Optional pro Seite: <html data-title-de="…" data-title-en="…"
                             data-desc-de="…"  data-desc-en="…">
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'rh_lang';

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

  function apply(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'de';
    var root = document.documentElement;
    root.setAttribute('lang', lang);

    /* Titel und Meta-Description mitwechseln, falls hinterlegt */
    var t = root.getAttribute('data-title-' + lang);
    if (t) document.title = t;
    var d = root.getAttribute('data-desc-' + lang);
    var meta = document.querySelector('meta[name="description"]');
    if (d && meta) meta.setAttribute('content', d);

    /* Umschalter-Zustand */
    var btns = document.querySelectorAll('.lang-switch button[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  window.rhSetLang = function (lang, persist) {
    apply(lang);
    if (persist) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  };

  /* Sprache so früh wie möglich setzen (vermeidet Aufblitzen) */
  document.documentElement.setAttribute('lang', pick());

  function init() {
    apply(pick());

    /* Umschalter-Klicks */
    document.querySelectorAll('.lang-switch button[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { window.rhSetLang(b.getAttribute('data-lang'), true); });
    });

    /* Mobiles Menü */
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('menu');
    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* Jahr im Footer */
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
