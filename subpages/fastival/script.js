(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const scrollFast = document.querySelector('[data-scroll-fast]');
  const scrollFastFill = document.querySelector('[data-scroll-fast-fill]');
  const scrollFastTime = document.querySelector('[data-scroll-fast-time]');
  const journey = document.querySelector('[data-journey]');
  const stages = [...document.querySelectorAll('[data-stage]')];
  const person = document.querySelector('.journey-person');
  const journeyLabel = document.querySelector('[data-journey-label]');
  const stageLooks = [
    ['9rem', '.15', '1px', '0rem', '1.4rem', '10deg', '10rem', '4rem'],
    ['10.7rem', '.24', '2px', '1.4rem', '1.05rem', '5deg', '9.6rem', '3.5rem'],
    ['12.4rem', '.33', '3px', '2.8rem', '.7rem', '0deg', '9.2rem', '3rem'],
    ['14.1rem', '.42', '4px', '4.2rem', '.35rem', '-5deg', '8.8rem', '2.5rem'],
    ['15.8rem', '.51', '5px', '5.6rem', '0rem', '-10deg', '8.4rem', '2rem']
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
    const look = stageLooks[stage];
    if (person && look) {
      ['--aura-size', '--aura-alpha', '--aura-border', '--aura-blur', '--head-y', '--mouth-turn', '--body-width', '--body-radius']
        .forEach((property, index) => person.style.setProperty(property, look[index]));
    }
    if (journeyLabel) journeyLabel.textContent = `Tag ${stage}`;
  }, { rootMargin: '-28% 0px -42% 0px', threshold: [0, .2, .6] });

  stages.forEach(stage => stageObserver.observe(stage));
  stages[0]?.classList.add('active');
  window.addEventListener('scroll', updatePageProgress, { passive: true });
  window.addEventListener('resize', updatePageProgress, { passive: true });
  updatePageProgress();
})();
