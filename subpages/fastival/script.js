(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const fastingJourney = document.querySelector('[data-journey]');
  const fastingProgress = document.querySelector('[data-fasting-progress]');
  const fastingFill = document.querySelector('[data-fasting-fill]');
  const fastingRunner = document.querySelector('[data-fasting-runner]');
  const fastingStages = [...document.querySelectorAll('[data-fasting-stage]')];
  const fastingFaces = ['🥱', '😵‍💫', '🔥', '⚡', '🧠', '✨'];

  /* ---------- Sprachen ---------- */
  const dict = { de: {}, en: window.FASTIVAL_I18N_EN || {} };
  const uiText = {
    de: { menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', videoTitle: 'Bauchfett wegfasten? – BR Gesundheit' },
    en: { menuOpen: 'Open menu', menuClose: 'Close menu', videoTitle: 'Fasting away belly fat? – BR Gesundheit' }
  };
  const i18nNodes = {
    i18n: [...document.querySelectorAll('[data-i18n]')],
    alt: [...document.querySelectorAll('[data-i18n-alt]')],
    aria: [...document.querySelectorAll('[data-i18n-aria]')],
    content: [...document.querySelectorAll('[data-i18n-content]')]
  };

  // Deutsch steht im Markup und wird als Wörterbuch eingesammelt.
  i18nNodes.i18n.forEach(el => { dict.de[el.dataset.i18n] = el.innerHTML; });
  i18nNodes.alt.forEach(el => { dict.de[el.dataset.i18nAlt] = el.getAttribute('alt'); });
  i18nNodes.aria.forEach(el => { dict.de[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
  i18nNodes.content.forEach(el => { dict.de[el.dataset.i18nContent] = el.getAttribute('content'); });

  const normalize = value => String(value || 'de').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  const store = (() => { try { return window.localStorage; } catch (e) { return null; } })();
  const readStore = () => { try { return store && store.getItem('fastival-lang'); } catch (e) { return null; } };
  const writeStore = value => { try { store && store.setItem('fastival-lang', value); } catch (e) {} };

  let lang = 'de';

  const applyLang = next => {
    const table = dict[next] || dict.de;
    i18nNodes.i18n.forEach(el => { const v = table[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    i18nNodes.alt.forEach(el => { const v = table[el.dataset.i18nAlt]; if (v != null) el.setAttribute('alt', v); });
    i18nNodes.aria.forEach(el => { const v = table[el.dataset.i18nAria]; if (v != null) el.setAttribute('aria-label', v); });
    i18nNodes.content.forEach(el => { const v = table[el.dataset.i18nContent]; if (v != null) el.setAttribute('content', v); });

    document.documentElement.lang = next;
    document.querySelectorAll('[data-lang-switch]').forEach(button => {
      const isCurrent = button.dataset.langSwitch === next;
      button.classList.toggle('is-active', isCurrent);
      if (isCurrent) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });

    lang = next;
    menuButton?.setAttribute('aria-label', nav?.classList.contains('open') ? uiText[lang].menuClose : uiText[lang].menuOpen);
  };

  /* ---------- Menü ---------- */
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', uiText[lang].menuOpen);
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? uiText[lang].menuClose : uiText[lang].menuOpen);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  /* ---------- Sprachumschalter ---------- */
  document.querySelectorAll('[data-lang-switch]').forEach(button => {
    button.addEventListener('click', () => {
      const next = normalize(button.dataset.langSwitch);
      applyLang(next);
      writeStore(next);
      try {
        const url = new URL(location.href);
        url.searchParams.set('lang', next);
        history.replaceState(null, '', url);
      } catch (e) {}
      closeMenu();
    });
  });

  // Startsprache: ?lang gewinnt, dann die gemerkte Wahl, sonst die Browsersprache.
  const param = new URLSearchParams(location.search).get('lang');
  applyLang(normalize(param || readStore() || (navigator.languages && navigator.languages[0]) || navigator.language));
  if (param) writeStore(normalize(param));

  /* ---------- Video ---------- */
  document.querySelectorAll('[data-video-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const frame = trigger.closest('[data-video-frame]');
      const videoId = trigger.dataset.videoId;
      if (!frame || !videoId) return;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = uiText[lang].videoTitle;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
    });
  });

  /* ---------- Scroll ---------- */
  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 48);
  };

  const updateFastingProgress = () => {
    if (!fastingJourney || !fastingProgress || !fastingFill || !fastingRunner) return;

    const rect = fastingJourney.getBoundingClientRect();
    const start = window.innerHeight * .75;
    const distance = rect.height + window.innerHeight * .5;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
    const percent = Math.round(progress * 100);
    const activeStage = Math.min(5, Math.floor(progress * 6));

    fastingFill.style.height = `${percent}%`;
    fastingRunner.style.top = `${percent}%`;
    fastingProgress.setAttribute('aria-valuenow', String(percent));
    fastingStages.forEach(stage => {
      stage.classList.toggle('is-active', Number(stage.dataset.fastingStage) <= activeStage);
    });

    if (fastingRunner.dataset.stage !== String(activeStage)) {
      fastingRunner.dataset.stage = String(activeStage);
      fastingRunner.textContent = fastingFaces[activeStage];
    }
  };

  const updatePage = () => {
    updateHeader();
    updateFastingProgress();
  };

  window.addEventListener('scroll', updatePage, { passive: true });
  window.addEventListener('resize', updatePage, { passive: true });
  updatePage();
})();
