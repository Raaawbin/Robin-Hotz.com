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

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Menü öffnen');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.querySelectorAll('[data-video-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const frame = trigger.closest('[data-video-frame]');
      const videoId = trigger.dataset.videoId;
      if (!frame || !videoId) return;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = 'Bauchfett wegfasten? – BR Gesundheit';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
    });
  });

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
