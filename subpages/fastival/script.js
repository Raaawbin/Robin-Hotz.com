(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');

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

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
