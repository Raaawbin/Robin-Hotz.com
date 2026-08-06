(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const scrollFast = document.querySelector('[data-scroll-fast]');
  const scrollFastFill = document.querySelector('[data-scroll-fast-fill]');
  const scrollFastTime = document.querySelector('[data-scroll-fast-time]');
  const benefitTitle = document.querySelector('[data-benefit-title]');
  const benefitCopy = document.querySelector('[data-benefit-copy]');
  const benefitFigure = document.querySelector('[data-benefit-figure]');
  const stages = [...document.querySelectorAll('[data-stage]')];
  const journeyLabel = document.querySelector('[data-journey-label]');
  const journeyPhoto = document.querySelector('[data-journey-photo]');
  const stagePositions = ['0%', '25%', '50%', '75%', '100%'];
  let currentJourneyStage = 0;
  let journeyPhotoTimer;
  const fastingPhases = [
    { until: 12, title: 'Fasten startet', copy: 'Die letzte Mahlzeit wird verarbeitet. Glukose ist noch der Haupttreibstoff.' },
    { until: 24, title: 'Speicher werden leerer', copy: 'Insulin sinkt, Leberglykogen wird genutzt und die Fettverbrennung nimmt zu.' },
    { until: 48, title: 'Fuel Switch', copy: 'Fettsäuren und Ketone liefern zunehmend Energie. Der Wechsel ist individuell.' },
    { until: 72, title: 'Ketone steigen', copy: 'Ketone werden wichtiger; der Körper spart dabei zunehmend Glukose.' },
    { until: 97, title: 'Tiefe Anpassung', copy: 'Die Ketogenese ist stark aktiv. Mehrtägiges Fasten gehört gut begleitet.' }
  ];

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

  const updatePageProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    const hours = Math.round(progress * 96);
    const matchingPhase = fastingPhases.findIndex(phase => hours < phase.until);
    const phaseIndex = matchingPhase === -1 ? fastingPhases.length - 1 : matchingPhase;
    const phase = fastingPhases[phaseIndex];
    header?.classList.toggle('scrolled', window.scrollY > 48);
    if (scrollFastFill) scrollFastFill.style.height = `${progress * 100}%`;
    if (scrollFastTime) scrollFastTime.textContent = `${hours}h`;
    if (benefitTitle) benefitTitle.textContent = phase.title;
    if (benefitCopy) benefitCopy.textContent = phase.copy;
    if (benefitFigure) benefitFigure.style.backgroundPosition = `${stagePositions[phaseIndex]} 35%`;
    if (scrollFast) scrollFast.hidden = window.innerWidth < 360;
  };

  const stageObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const stage = Number(visible.target.dataset.stage || 0);
    stages.forEach(item => item.classList.toggle('active', item === visible.target));
    if (journeyPhoto && stage !== currentJourneyStage) {
      window.clearTimeout(journeyPhotoTimer);
      journeyPhoto.classList.add('is-changing');
      journeyPhotoTimer = window.setTimeout(() => {
        journeyPhoto.style.backgroundPosition = `${stagePositions[stage]} 35%`;
        journeyPhoto.classList.remove('is-changing');
        currentJourneyStage = stage;
      }, 180);
    }
    if (journeyLabel) journeyLabel.textContent = `Tag ${stage}`;
  }, { rootMargin: '-28% 0px -42% 0px', threshold: [0, .2, .6] });

  stages.forEach(stage => stageObserver.observe(stage));
  stages[0]?.classList.add('active');
  window.addEventListener('scroll', updatePageProgress, { passive: true });
  window.addEventListener('resize', updatePageProgress, { passive: true });
  updatePageProgress();
})();
