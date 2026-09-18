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
      '<a class="skip" href="#main"><span class="lang-de">Zum Inhalt springen</span><span class="lang-en">Skip to content</span></a>' +
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
              '<button class="ctl-btn" type="button" aria-expanded="false">' +
                '<span class="icon icon-globe sm" aria-hidden="true"></span><span class="ctl-label">DE</span><span class="caret" aria-hidden="true"></span>' +
              '</button>' +
              '<span class="dropdown" role="group" aria-label="Sprache wählen">' +
                '<button type="button" data-lang="de" aria-pressed="true">Deutsch</button>' +
                '<button type="button" data-lang="en" aria-pressed="false">English</button>' +
              '</span>' +
            '</span>' +
            '<span class="navitem drop-ctl" id="themeCtl">' +
              '<button class="ctl-btn" type="button" aria-expanded="false">' +
                '<span class="theme-dot" aria-hidden="true"></span><span class="ctl-label">Light</span><span class="caret" aria-hidden="true"></span>' +
              '</button>' +
              '<span class="dropdown" role="group" aria-label="Darstellung wählen">' +
                '<button type="button" data-set-theme="light" aria-pressed="false">Light</button>' +
                '<button type="button" data-set-theme="dark" aria-pressed="false">Dark</button>' +
              '</span>' +
            '</span>' +
            '<a class="btn nav-cta" href="' + siteUrl('contact.html') + '"' + current('contact') + '><span class="lang-de">Kontakt</span><span class="lang-en">Contact</span></a>' +
          '</nav>' +
          '<button type="button" class="burger" id="burger" aria-expanded="false" aria-controls="menu">' +
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

  /* ---------- Navigation and disclosure controls ---------- */
  var head = document.getElementById('siteHead');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var mobile = window.matchMedia('(max-width: 980px)');
  var ctls = Array.from(document.querySelectorAll('.drop-ctl'));

  function onScroll() {
    if (head) head.classList.toggle('scrolled', window.scrollY > 40 || !!(menu && menu.classList.contains('open')));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeAll(except) {
    ctls.forEach(function (ctl) {
      if (ctl === except) return;
      ctl.classList.remove('open');
      ctl.querySelector('.ctl-btn').setAttribute('aria-expanded', 'false');
    });
  }
  function setMenu(open, restoreFocus) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    var en = document.documentElement.lang === 'en';
    burger.setAttribute('aria-label', en ? (open ? 'Close menu' : 'Open menu') : (open ? 'Menü schließen' : 'Menü öffnen'));
    if (!open) closeAll(null);
    if (restoreFocus) burger.focus();
    onScroll();
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) {
      if (mobile.matches && e.target.closest('a')) setMenu(false);
    });
    if (mobile.addEventListener) mobile.addEventListener('change', function () {
      var needsFocus = mobile.matches && menu.contains(document.activeElement);
      setMenu(false, needsFocus);
    });
  }

  ctls.forEach(function (ctl) {
    var btn = ctl.querySelector('.ctl-btn');
    var panel = ctl.querySelector('.dropdown');
    panel.id = ctl.id + '-options';
    btn.setAttribute('aria-controls', panel.id);
    function openControl() {
      closeAll(ctl);
      ctl.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    btn.addEventListener('click', function () {
      if (ctl.classList.contains('open')) closeAll(null);
      else openControl();
    });
    ctl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeAll(null);
        btn.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openControl();
        var options = Array.from(panel.querySelectorAll('button'));
        var index = options.indexOf(document.activeElement);
        index = index < 0 ? (e.key === 'ArrowDown' ? 0 : options.length - 1) :
          (index + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[index].focus();
      }
    });
    ctl.addEventListener('focusout', function (e) {
      if (!ctl.contains(e.relatedTarget)) {
        ctl.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('pointerdown', function (e) {
    closeAll(e.target.closest('.drop-ctl'));
    if (head && !head.contains(e.target)) setMenu(false);
  });
  document.addEventListener('focusin', function (e) {
    if (head && !head.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false, true);
  });

  /* Auswahl in einem Umschalter-Dropdown markieren + Label setzen */
  function select(ctl, value, attr, labelText) {
    if (!ctl) return;
    var hadFocus = ctl.querySelector('.dropdown').contains(document.activeElement);
    ctl.querySelectorAll('[' + attr + ']').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute(attr) === value ? 'true' : 'false');
    });
    ctl.querySelector('.ctl-label').textContent = labelText;
    ctl.classList.remove('open');
    ctl.querySelector('.ctl-btn').setAttribute('aria-expanded', 'false');
    if (hadFocus) ctl.querySelector('.ctl-btn').focus();
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
  if (themeCtl) themeCtl.querySelectorAll('[data-set-theme]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.themePref.set(btn.getAttribute('data-set-theme'));
      syncTheme();
    });
  });
  /* Label aktuell halten, wenn das System-Theme live wechselt */
  window.addEventListener('themechange', function () {
    if (!themeCtl) return;
    themeCtl.querySelector('.ctl-label').textContent = THEME_LABELS[currentTheme()];
    themeCtl.querySelectorAll('[data-set-theme]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-theme') === currentTheme() ? 'true' : 'false');
    });
  });

  /* ---------- Sprache (DE / EN) ---------- */
  var langCtl = document.getElementById('langCtl');
  var LANG_LABELS = { de: 'DE', en: 'EN' };
  function syncLang() {
    var lang = window.langPref.get();
    var en = lang === 'en';
    select(langCtl, lang, 'data-lang', LANG_LABELS[lang]);
    // Keep optional bilingual image descriptions in step with the page language.
    document.querySelectorAll('img[data-alt-de][data-alt-en]').forEach(function (img) {
      img.alt = img.getAttribute('data-alt-' + lang);
    });
    if (menu) menu.setAttribute('aria-label', en ? 'Main navigation' : 'Hauptnavigation');
    var footerNav = document.querySelector('.site-foot nav');
    if (footerNav) footerNav.setAttribute('aria-label', en ? 'Pages' : 'Seiten');
    if (langCtl) langCtl.querySelector('.dropdown').setAttribute('aria-label', en ? 'Choose language' : 'Sprache wählen');
    if (themeCtl) themeCtl.querySelector('.dropdown').setAttribute('aria-label', en ? 'Choose appearance' : 'Darstellung wählen');
    if (burger) {
      var open = menu && menu.classList.contains('open');
      burger.setAttribute('aria-label', en ? (open ? 'Close menu' : 'Open menu') : (open ? 'Menü schließen' : 'Menü öffnen'));
    }
    // Carry explicit language choices across pages even when storage is blocked.
    document.querySelectorAll('a[href]').forEach(function (link) {
      if (link.getAttribute('href').startsWith('#')) return;
      var url = new URL(link.href, location.href);
      if (url.origin === location.origin && url.pathname.startsWith(siteRoot.pathname) && /\.html$/.test(url.pathname)) {
        url.searchParams.set('lang', lang);
        link.href = url.href;
      }
    });
  }
  syncLang();
  if (langCtl) langCtl.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.langPref.set(btn.getAttribute('data-lang'));
      syncLang();
    });
  });
  window.addEventListener('langchange', syncLang);

  document.querySelectorAll('[data-print-page]').forEach(function (button) {
    button.addEventListener('click', function () { window.print(); });
  });

  /* Native modal: focus containment, Escape and inert background. */
  var shots = Array.from(document.querySelectorAll('.case-shot img'));
  if (shots.length) {
    var lb = document.createElement('dialog');
    lb.className = 'lightbox';
    lb.innerHTML = '<img alt=""><button class="lb-close" type="button">' +
      '<span class="icon icon-close" aria-hidden="true"></span></button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbClose = lb.querySelector('button');
    var opener;
    var previousOverflow;

    function openLb(img) {
      if (lb.open) return;
      opener = img;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      var en = document.documentElement.lang === 'en';
      lb.setAttribute('aria-label', en ? 'Enlarged project photo' : 'Vergrößertes Projektfoto');
      lbClose.setAttribute('aria-label', en ? 'Close image' : 'Bild schließen');
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lb.showModal();
      lbClose.focus();
    }
    function closeLb() { if (lb.open) lb.close(); }
    lb.addEventListener('close', function () {
      document.body.style.overflow = previousOverflow;
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      lbImg.removeAttribute('src');
    });
    shots.forEach(function (img) {
      // Images that already link elsewhere retain their existing behavior.
      if (img.closest('a')) return;
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-haspopup', 'dialog');
      img.addEventListener('click', function () { openLb(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLb(img);
        }
      });
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
    });
    lb.addEventListener('click', closeLb);
  }
})();
