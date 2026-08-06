(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const scrollFast = document.querySelector('[data-scroll-fast]');
  const scrollFastFill = document.querySelector('[data-scroll-fast-fill]');
  const scrollFastTime = document.querySelector('[data-scroll-fast-time]');
  const journey = document.querySelector('[data-journey]');
  const stages = [...document.querySelectorAll('[data-stage]')];
  const journeyLabel = document.querySelector('[data-journey-label]');
  const journeyPhoto = document.querySelector('[data-journey-photo]');
  const stagePositions = ['0%', '25%', '50%', '75%', '100%'];

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
    header?.classList.toggle('scrolled', window.scrollY > 48);
    if (scrollFastFill) scrollFastFill.style.height = `${progress * 100}%`;
    if (scrollFastTime) scrollFastTime.textContent = `${hours}h`;
    if (scrollFast) scrollFast.hidden = window.innerWidth < 360;
  };

  const stageObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const stage = Number(visible.target.dataset.stage || 0);
    stages.forEach(item => item.classList.toggle('active', item === visible.target));
    if (journeyPhoto) journeyPhoto.style.backgroundPosition = `${stagePositions[stage]} 50%`;
    if (journeyLabel) journeyLabel.textContent = `Tag ${stage}`;
  }, { rootMargin: '-28% 0px -42% 0px', threshold: [0, .2, .6] });

  stages.forEach(stage => stageObserver.observe(stage));
  stages[0]?.classList.add('active');
  window.addEventListener('scroll', updatePageProgress, { passive: true });
  window.addEventListener('resize', updatePageProgress, { passive: true });
  updatePageProgress();
})();
