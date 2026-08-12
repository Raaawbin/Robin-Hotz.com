/* ============================================================
   Seiten-Interaktion: Scroll-Navigation, mobiles Menü,
   Umschalter-Dropdowns für Sprache und Theme.
   (Theme-/Sprachlogik liegt in theme.js —
    window.themePref und window.langPref)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Zentrale Seitenbausteine: Header + Footer ----------
     Alle Seiten enthalten nur noch [data-site-header] und [data-site-footer].
     Pfade werden aus der URL dieser JS-Datei berechnet und funktionieren
     dadurch auch in Unterordnern. */
  var scriptUrl = document.currentScript && document.currentScript.src;
  var siteRoot = new URL('../', scriptUrl || window.location.href);
  function siteUrl(path) { return new URL(path, siteRoot).href; }

  var fileName = window.location.pathname.split('/').pop() || 'index.html';
  var activePage = document.body.getAttribute('data-nav-page') || '';
  if (!activePage) {
    if (fileName === 'index.html' || fileName === 'index-new.html' || fileName === 'index-old.html') activePage = 'home';
    else if (fileName === 'solutions.html' || fileName === 'solutions-new.html') activePage = 'solutions';
    else if (fileName === 'references.html') activePage = 'references';
    else if (fileName === 'about.html' || fileName === 'cv.html') activePage = 'about';
    else if (fileName === 'contact.html') activePage = 'contact';
  }
  function current(page) { return activePage === page ? ' aria-current="page"' : ''; }

  var headerMount = document.querySelector('[data-site-header]');
  if (headerMount) {
    headerMount.outerHTML =
      '<a class="skip" href="' + new URL('#main', window.location.href).href + '"><span class="lang-de">Zum Inhalt springen</span><span class="lang-en">Skip to content</span></a>' +
      '<header class="site-head" id="siteHead">' +
        '<div class="nav">' +
          '<a class="brand" href="' + siteUrl('index.html') + '" aria-label="Robin Hotz">' +
            '<img class="logo-on-dark" src="' + siteUrl('assets/images/logo-clean-dark.webp') + '" alt="Robin Hotz">' +
            '<img class="logo-on-light" src="' + siteUrl('assets/images/logo-clean-light.webp') + '" alt="Robin Hotz">' +
          '</a>' +
          '<nav class="menu" id="menu" aria-label="Hauptnavigation">' +
            '<a href="' + siteUrl('index.html') + '"' + current('home') + '><span class="lang-de">Start</span><span class="lang-en">Home</span></a>' +
            '<span class="navitem">' +
              '<a class="navlink" href="' + siteUrl('solutions.html') + '"' + current('solutions') + '><span class="lang-de">Lösungen</span><span class="lang-en">Solutions</span><span class="caret" aria-hidden="true"></span></a>' +
              '<span class="dropdown">' +
                '<a href="' + siteUrl('solutions.html#moderation') + '"><span class="lang-de">Moderation</span><span class="lang-en">Facilitation</span></a>' +
                '<a href="' + siteUrl('solutions.html#coaching') + '">Coaching</a>' +
                '<a href="' + siteUrl('solutions.html#visualisierung') + '"><span class="lang-de">Visualisierung</span><span class="lang-en">Visualisation</span></a>' +
              '</span>' +
            '</span>' +
            '<a href="' + siteUrl('references.html') + '"' + current('references') + '><span class="lang-de">Referenzen</span><span class="lang-en">References</span></a>' +
            '<a href="' + siteUrl('about.html') + '"' + current('about') + '><span class="lang-de">Über mich</span><span class="lang-en">About</span></a>' +
            '<span class="navitem drop-ctl" id="langCtl">' +
              '<button class="ctl-btn" type="button" aria-haspopup="listbox" aria-expanded="false">' +
                '<span class="icon icon-globe sm" aria-hidden="true"></span><span class="ctl-label">DE</span><span class="caret" aria-hidden="true"></span>' +
              '</button>' +
              '<span class="dropdown" role="listbox" aria-label="Sprache wählen">' +
                '<button type="button" role="option" data-lang="de" aria-selected="true">Deutsch</button>' +
                '<button type="button" role="option" data-lang="en" aria-selected="false">English</button>' +
              '</span>' +
            '</span>' +
            '<span class="navitem drop-ctl" id="themeCtl">' +
              '<button class="ctl-btn" type="button" aria-haspopup="listbox" aria-expanded="false">' +
                '<span class="theme-dot" aria-hidden="true"></span><span class="ctl-label">Light</span><span class="caret" aria-hidden="true"></span>' +
              '</button>' +
              '<span class="dropdown" role="listbox" aria-label="Darstellung wählen">' +
                '<button type="button" role="option" data-set-theme="light" aria-selected="false">Light</button>' +
                '<button type="button" role="option" data-set-theme="dark" aria-selected="false">Dark</button>' +
              '</span>' +
            '</span>' +
            '<a class="btn nav-cta" href="' + siteUrl('contact.html') + '"' + current('contact') + '><span class="lang-de">Kontakt</span><span class="lang-en">Contact</span></a>' +
          '</nav>' +
          '<button class="burger" id="burger" aria-expanded="false" aria-controls="menu">' +
            '<span class="visually-hidden lang-de">Menü öffnen</span><span class="visually-hidden lang-en">Open menu</span>' +
            '<span class="icon icon-burger" aria-hidden="true"></span>' +
          '</button>' +
        '</div>' +
      '</header>';
  }

  var footerMount = document.querySelector('[data-site-footer]');
  if (footerMount) {
    footerMount.outerHTML =
      '<footer class="site-foot">' +
        '<div class="wrap">' +
          '<div class="foot-grid">' +
            '<div class="foot-brand">' +
              '<img class="lang-de" src="' + siteUrl('assets/images/logo-cream.webp') + '" alt="Robin Hotz, Moderation für Veränderung">' +
              '<img class="lang-en" src="' + siteUrl('assets/images/logo-cream-en.webp') + '" alt="Robin Hotz, Facilitation for Change">' +
            '</div>' +
            '<nav class="foot-col" aria-label="Seiten">' +
              '<h4><span class="lang-de">Seiten</span><span class="lang-en">Pages</span></h4>' +
              '<a href="' + siteUrl('index.html') + '"><span class="lang-de">Start</span><span class="lang-en">Home</span></a>' +
              '<a href="' + siteUrl('solutions.html') + '"><span class="lang-de">Lösungen</span><span class="lang-en">Solutions</span></a>' +
              '<a href="' + siteUrl('references.html') + '"><span class="lang-de">Referenzen</span><span class="lang-en">References</span></a>' +
              '<a href="' + siteUrl('about.html') + '"><span class="lang-de">Über mich</span><span class="lang-en">About</span></a>' +
              '<a href="' + siteUrl('contact.html') + '"><span class="lang-de">Kontakt</span><span class="lang-en">Contact</span></a>' +
            '</nav>' +
            '<div class="foot-col">' +
              '<h4><span class="lang-de">Kontakt</span><span class="lang-en">Contact</span></h4>' +
              '<a class="c-plain" href="mailto:rh@visualfacilitators.com"><span class="icon icon-mail sm" aria-hidden="true"></span>rh@visualfacilitators.com</a>' +
              '<a href="https://www.linkedin.com/in/robin-hotz-2688491a3/" target="_blank" rel="noopener"><span class="icon icon-linkedin sm" aria-hidden="true"></span>LinkedIn</a>' +
              '<a href="https://www.instagram.com/robin.visual.coach/" target="_blank" rel="noopener"><span class="icon icon-instagram sm" aria-hidden="true"></span>Instagram</a>' +
              '<a href="https://share.google/VscmN0hO51CdECujJ" target="_blank" rel="noopener"><span class="icon icon-pin sm" aria-hidden="true"></span>Berlin</a>' +
            '</div>' +
          '</div>' +
          '<div class="foot-bottom">' +
            '<span>© ' + new Date().getFullYear() + ' Robin Hotz</span>' +
            '<span><a href="' + siteUrl('imprint.html') + '"><span class="lang-de">Impressum</span><span class="lang-en">Imprint</span></a> &nbsp;·&nbsp; <a href="' + siteUrl('privacy.html') + '"><span class="lang-de">Datenschutz</span><span class="lang-en">Privacy</span></a> &nbsp;·&nbsp; <a href="' + siteUrl('subpages/terms.html') + '"><span class="lang-de">AGB</span><span class="lang-en">GTC</span></a></span>' +
            '<span><span class="lang-de">Moderation für Veränderung</span><span class="lang-en">Facilitation for change</span></span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

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

  /* ---------- Lightbox: Projekt- und Beispielfotos gross anzeigen ---------- */
  var shots = [].slice.call(document.querySelectorAll('.case-shot img'));
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img alt="">' +
      '<button class="lb-close" type="button" aria-label="Schließen">' +
      '<span class="icon icon-close" aria-hidden="true"></span></button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');

    function openLb(img) {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    shots.forEach(function (img) {
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', function () { openLb(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLb(img);
        }
      });
    });
    lb.addEventListener('click', closeLb); /* Klick irgendwo schließt */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLb();
    });
  }
})();
