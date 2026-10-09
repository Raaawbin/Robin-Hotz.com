/* =====================================================================
   robin-hotz.com | Rebrand | site.js
   Gemeinsamer Seitenrahmen für alle Rebrand-Seiten:
   Header und Footer, Navigation, Sprach- und Theme-Umschalter,
   Bildvergrößerung, Logo-Band und Lichteffekt auf Karten.
   Voraussetzung: theme.js im <head> (window.themePref, window.langPref).
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var scriptUrl = document.currentScript ? document.currentScript.src : location.href;
  var siteRoot = new URL('../../', scriptUrl);
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function siteUrl(path) { return new URL(path, siteRoot).href; }
  function pageUrl(file) { return siteUrl('subpages/Rebrand/' + file); }
  function isEn() { return root.getAttribute('lang') === 'en'; }
  function t(de, en) { return '<span class="lang-de">' + de + '</span><span class="lang-en">' + en + '</span>'; }

  var activePage = document.body.getAttribute('data-nav-page') || '';
  function current(page) { return activePage === page ? ' aria-current="page"' : ''; }

  function brand(extraClass) {
    return '<a class="brand' + (extraClass || '') + '" href="' + pageUrl('index.html') + '"' +
        ' aria-label="Robin Hotz, Startseite" data-label-de="Robin Hotz, Startseite" data-label-en="Robin Hotz, home">' +
        '<img class="brand-logo brand-logo-dark" src="' + pageUrl('Bilder/robin-hotz-logo-04-glow-transparent-web.webp') + '" alt="" width="1080" height="275" decoding="async">' +
        '<img class="brand-logo brand-logo-light" src="' + pageUrl('Bilder/robin-hotz-logo-04-light-transparent-web.webp') + '" alt="" width="1080" height="275" decoding="async">' +
      '</a>';
  }

  /* ---------- Header ---------- */
  var headerMount = document.querySelector('[data-site-header]');
  if (headerMount) {
    headerMount.outerHTML =
      '<a class="skip" href="#main">' + t('Zum Inhalt springen', 'Skip to content') + '</a>' +
      '<header class="site-head" id="siteHead">' +
        '<div class="nav">' +
          brand('') +
          '<nav class="menu" id="menu" aria-label="Hauptnavigation" data-label-de="Hauptnavigation" data-label-en="Main navigation">' +
            '<a href="' + pageUrl('index.html') + '"' + current('home') + '>' + t('Start', 'Home') + '</a>' +
            '<span class="navitem">' +
              '<a class="navlink" href="' + pageUrl('solutions.html') + '"' + current('solutions') + '>' +
                t('Lösungen', 'Solutions') + '<span class="caret" aria-hidden="true"></span></a>' +
              '<span class="dropdown">' +
                '<a href="' + pageUrl('solutions.html#moderation') + '">' + t('Moderation', 'Facilitation') + '</a>' +
                '<a href="' + pageUrl('solutions.html#coaching') + '">Coaching</a>' +
                '<a href="' + pageUrl('solutions.html#visualisierung') + '">' + t('Visualisierung', 'Visualisation') + '</a>' +
              '</span>' +
            '</span>' +
            '<a href="' + pageUrl('index.html#referenzen') + '">' + t('Referenzen', 'References') + '</a>' +
            '<a href="' + pageUrl('about.html') + '"' + current('about') + '>' + t('Über mich', 'About') + '</a>' +
            '<span class="menu-sep" aria-hidden="true"></span>' +
            '<span class="navitem drop-ctl" id="langCtl">' +
              '<button class="ctl-btn" type="button" aria-expanded="false" aria-label="Sprache: Deutsch">' +
                '<span class="icon icon-globe sm" aria-hidden="true"></span><span class="ctl-label" aria-hidden="true">DE</span><span class="caret" aria-hidden="true"></span>' +
              '</button>' +
              '<span class="dropdown" role="group" aria-label="Sprache wählen">' +
                '<button type="button" data-lang="de" aria-pressed="true" lang="de">Deutsch</button>' +
                '<button type="button" data-lang="en" aria-pressed="false" lang="en">English</button>' +
              '</span>' +
            '</span>' +
            '<span class="navitem drop-ctl" id="themeCtl">' +
              '<button class="ctl-btn" type="button" aria-expanded="false" aria-label="Darstellung: Dark">' +
                '<span class="theme-dot" aria-hidden="true"></span><span class="ctl-label" aria-hidden="true">Dark</span><span class="caret" aria-hidden="true"></span>' +
              '</button>' +
              '<span class="dropdown" role="group" aria-label="Darstellung wählen">' +
                '<button type="button" data-set-theme="light" aria-pressed="false">Light</button>' +
                '<button type="button" data-set-theme="dark" aria-pressed="false">Dark</button>' +
              '</span>' +
            '</span>' +
            '<a class="btn nav-cta" href="' + pageUrl('contact.html') + '"' + current('contact') + '>' + t('Kontakt', 'Contact') + '</a>' +
          '</nav>' +
          '<button type="button" class="burger" id="burger" aria-expanded="false" aria-controls="menu" aria-label="Menü öffnen">' +
            '<span class="burger-lines" aria-hidden="true"><i></i><i></i></span>' +
          '</button>' +
        '</div>' +
      '</header>';
  }

  /* ---------- Footer ---------- */
  var footerMount = document.querySelector('[data-site-footer]');
  if (footerMount) {
    footerMount.outerHTML =
      '<footer class="site-foot">' +
        '<div class="wrap">' +
          '<div class="foot-grid">' +
            '<div class="foot-brand">' +
              brand(' brand-footer') +
              '<p class="brand-tagline">' + t('Moderation für Veränderung', 'Facilitation for Change') + '</p>' +
            '</div>' +
            '<nav class="foot-col" aria-labelledby="footPagesTitle">' +
              '<h2 class="foot-title" id="footPagesTitle">' + t('Seiten', 'Pages') + '</h2>' +
              '<a href="' + pageUrl('index.html') + '">' + t('Start', 'Home') + '</a>' +
              '<a href="' + pageUrl('solutions.html') + '">' + t('Lösungen', 'Solutions') + '</a>' +
              '<a href="' + pageUrl('index.html#referenzen') + '">' + t('Referenzen', 'References') + '</a>' +
              '<a href="' + pageUrl('about.html') + '">' + t('Über mich', 'About') + '</a>' +
              '<a href="' + pageUrl('contact.html') + '">' + t('Kontakt', 'Contact') + '</a>' +
            '</nav>' +
            '<div class="foot-col">' +
              '<h2 class="foot-title">' + t('Kontakt', 'Contact') + '</h2>' +
              '<a href="mailto:robin@robin-hotz.com"><span class="icon icon-mail sm" aria-hidden="true"></span>robin@robin-hotz.com</a>' +
              '<a href="https://www.linkedin.com/in/robin-hotz-2688491a3/" target="_blank" rel="noopener"><span class="icon icon-linkedin sm" aria-hidden="true"></span>LinkedIn</a>' +
              '<a href="https://www.instagram.com/robin.visual.coach/" target="_blank" rel="noopener"><span class="icon icon-instagram sm" aria-hidden="true"></span>Instagram</a>' +
              '<a href="https://share.google/VscmN0hO51CdECujJ" target="_blank" rel="noopener"><span class="icon icon-pin sm" aria-hidden="true"></span>Berlin</a>' +
            '</div>' +
          '</div>' +
          '<div class="foot-bottom">' +
            '<span>© ' + new Date().getFullYear() + ' Robin Hotz</span>' +
            '<span class="foot-legal">' +
              '<a href="' + siteUrl('imprint.html') + '">' + t('Impressum', 'Imprint') + '</a>' +
              '<a href="' + siteUrl('privacy.html') + '">' + t('Datenschutz', 'Privacy') + '</a>' +
              '<a href="' + siteUrl('subpages/documents/terms.html') + '">' + t('AGB', 'Terms') + '</a>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- Navigation ---------- */
  var head = document.getElementById('siteHead');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var mobileNav = window.matchMedia('(max-width: 980px)');
  var controls = Array.from(document.querySelectorAll('.drop-ctl'));

  function onScroll() {
    if (head) head.classList.toggle('scrolled', window.scrollY > 40 || !!(menu && menu.classList.contains('open')));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeControls(except) {
    controls.forEach(function (ctl) {
      if (ctl === except) return;
      ctl.classList.remove('open');
      ctl.querySelector('.ctl-btn').setAttribute('aria-expanded', 'false');
    });
  }

  function burgerLabel(open) {
    return isEn() ? (open ? 'Close menu' : 'Open menu') : (open ? 'Menü schließen' : 'Menü öffnen');
  }

  function setMenu(open, restoreFocus) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    head.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', burgerLabel(open));
    if (!open) closeControls(null);
    if (restoreFocus) burger.focus();
    onScroll();
  }

  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) {
      if (mobileNav.matches && e.target.closest('a')) setMenu(false);
    });
    if (mobileNav.addEventListener) {
      mobileNav.addEventListener('change', function () {
        setMenu(false, mobileNav.matches && menu.contains(document.activeElement));
      });
    }
  }

  controls.forEach(function (ctl) {
    var btn = ctl.querySelector('.ctl-btn');
    var panel = ctl.querySelector('.dropdown');
    panel.id = ctl.id + 'Options';
    btn.setAttribute('aria-controls', panel.id);

    function openControl() {
      closeControls(ctl);
      ctl.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function () {
      if (ctl.classList.contains('open')) closeControls(null);
      else openControl();
    });
    ctl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ctl.classList.contains('open')) {
        e.stopPropagation();
        closeControls(null);
        btn.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openControl();
        var options = Array.from(panel.querySelectorAll('button'));
        var index = options.indexOf(document.activeElement);
        index = index < 0 ? (e.key === 'ArrowDown' ? 0 : options.length - 1)
          : (index + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
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
    closeControls(e.target.closest('.drop-ctl'));
    if (head && !head.contains(e.target)) setMenu(false);
  });
  document.addEventListener('focusin', function (e) {
    if (head && !head.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false, true);
  });

  /* Markiert die aktive Option eines Umschalters und schließt ihn. */
  function selectOption(ctl, value, attr, label, buttonLabel) {
    if (!ctl) return;
    var btn = ctl.querySelector('.ctl-btn');
    var hadFocus = ctl.querySelector('.dropdown').contains(document.activeElement);
    ctl.querySelectorAll('[' + attr + ']').forEach(function (option) {
      option.setAttribute('aria-pressed', option.getAttribute(attr) === value ? 'true' : 'false');
    });
    ctl.querySelector('.ctl-label').textContent = label;
    btn.setAttribute('aria-label', buttonLabel);
    ctl.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    if (hadFocus) btn.focus();
  }

  /* ---------- Theme ---------- */
  var themeCtl = document.getElementById('themeCtl');
  var THEME_LABELS = { light: 'Light', dark: 'Dark' };

  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function syncTheme() {
    var theme = currentTheme();
    selectOption(themeCtl, theme, 'data-set-theme', THEME_LABELS[theme],
      (isEn() ? 'Appearance: ' : 'Darstellung: ') + THEME_LABELS[theme]);
  }

  if (themeCtl) {
    themeCtl.querySelectorAll('[data-set-theme]').forEach(function (option) {
      option.addEventListener('click', function (e) {
        e.stopPropagation();
        window.themePref.set(option.getAttribute('data-set-theme'));
      });
    });
  }
  window.addEventListener('themechange', syncTheme);
  syncTheme();

  /* ---------- Sprache ---------- */
  var langCtl = document.getElementById('langCtl');

  function syncLang() {
    var lang = window.langPref.get();
    var en = lang === 'en';
    selectOption(langCtl, lang, 'data-lang', en ? 'EN' : 'DE', en ? 'Language: English' : 'Sprache: Deutsch');
    syncTheme();

    document.querySelectorAll('img[data-alt-de][data-alt-en]').forEach(function (img) {
      img.alt = img.getAttribute('data-alt-' + lang);
    });
    document.querySelectorAll('[data-label-de][data-label-en]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-label-' + lang));
    });
    if (langCtl) langCtl.querySelector('.dropdown').setAttribute('aria-label', en ? 'Choose language' : 'Sprache wählen');
    if (themeCtl) themeCtl.querySelector('.dropdown').setAttribute('aria-label', en ? 'Choose appearance' : 'Darstellung wählen');
    if (burger) burger.setAttribute('aria-label', burgerLabel(menu && menu.classList.contains('open')));

    /* Die Sprachwahl über Seitenwechsel mitnehmen, auch wenn der Speicher gesperrt ist. */
    document.querySelectorAll('a[href]').forEach(function (link) {
      if (link.getAttribute('href').charAt(0) === '#') return;
      var url = new URL(link.href, location.href);
      if (url.origin === location.origin && url.pathname.indexOf(siteRoot.pathname) === 0 && /\.html$/.test(url.pathname)) {
        url.searchParams.set('lang', lang);
        link.href = url.href;
      }
    });
  }

  if (langCtl) {
    langCtl.querySelectorAll('[data-lang]').forEach(function (option) {
      option.addEventListener('click', function (e) {
        e.stopPropagation();
        window.langPref.set(option.getAttribute('data-lang'));
      });
    });
  }
  window.addEventListener('langchange', syncLang);
  syncLang();

  /* ---------- Bildvergrößerung (Galerien auf der Lösungen-Seite) ---------- */
  var zoomImages = Array.from(document.querySelectorAll('.case-shot img'));
  if (zoomImages.length && window.HTMLDialogElement) {
    var lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<img alt=""><button class="lb-close" type="button">' +
      '<span class="icon icon-close" aria-hidden="true"></span></button>';
    document.body.appendChild(lightbox);
    var lightboxImg = lightbox.querySelector('img');
    var lightboxClose = lightbox.querySelector('button');
    var opener = null;

    var openLightbox = function (img) {
      if (lightbox.open) return;
      opener = img;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.setAttribute('aria-label', isEn() ? 'Enlarged photo' : 'Vergrößertes Foto');
      lightboxClose.setAttribute('aria-label', isEn() ? 'Close image' : 'Bild schließen');
      root.classList.add('has-modal');
      lightbox.showModal();
      lightboxClose.focus();
    };

    lightbox.addEventListener('close', function () {
      root.classList.remove('has-modal');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      lightboxImg.removeAttribute('src');
    });
    lightbox.addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); lightboxClose.focus(); }
    });

    zoomImages.forEach(function (img) {
      if (img.closest('a')) return;
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-haspopup', 'dialog');
      img.addEventListener('click', function () { openLightbox(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img);
        }
      });
    });
  }

  /* ---------- Logo-Band: zwei gegenläufige Reihen, Kopien für Screenreader unsichtbar ---------- */
  var wall = document.querySelector('.client-logo-wall');
  if (wall) {
    var logos = Array.from(wall.querySelectorAll('.client-logo-item'));
    var half = Math.ceil(logos.length / 2);
    var viewport = document.createElement('div');
    viewport.className = 'marquee-viewport';

    [logos.slice(0, half), logos.slice(half)].forEach(function (group, rowIndex) {
      var row = document.createElement('div');
      row.className = 'marquee-row' + (rowIndex ? ' is-reverse' : '');
      var track = document.createElement('ul');
      track.className = 'marquee-track';
      group.forEach(function (logo) { track.appendChild(logo); });
      var copy = track.cloneNode(true);
      copy.classList.add('is-copy');
      copy.setAttribute('aria-hidden', 'true');
      copy.setAttribute('inert', '');
      copy.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
      row.appendChild(track);
      row.appendChild(copy);
      viewport.appendChild(row);
    });

    wall.replaceChildren(viewport);
    wall.classList.add('marquee', 'is-ready', 'is-offscreen');

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'marquee-toggle';
    var syncToggle = function () {
      var paused = wall.classList.contains('is-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.innerHTML = paused ? t('Bewegung fortsetzen', 'Resume motion') : t('Bewegung anhalten', 'Pause motion');
    };
    toggle.addEventListener('click', function () {
      wall.classList.toggle('is-paused');
      syncToggle();
    });
    wall.appendChild(toggle);
    syncToggle();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        wall.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(wall);
    } else {
      wall.classList.remove('is-offscreen');
    }
  }

  /* ---------- Lichteffekt: folgt dem Mauszeiger, nicht bei Touch oder reduzierter Bewegung ---------- */
  document.querySelectorAll('.panel, .q-card').forEach(function (card) {
    var frame = 0;
    var x = 0;
    var y = 0;
    card.addEventListener('pointermove', function (e) {
      if (reduceMotion.matches || !finePointer.matches) return;
      var box = card.getBoundingClientRect();
      x = e.clientX - box.left;
      y = e.clientY - box.top;
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        frame = 0;
      });
    }, { passive: true });
    card.addEventListener('pointerleave', function () {
      window.cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();
