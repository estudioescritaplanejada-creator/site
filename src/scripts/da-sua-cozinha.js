(() => {
  'use strict';

  const page = document.querySelector('.cozinha-page');
  if (!page) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  /* Header com profundidade depois do início da rolagem */
  const header = document.querySelector('.cozinha-header');
  let ticking = false;

  function updateHeader() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      header?.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    });
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* Entrada progressiva das seções e dos principais elementos */
  const sectionTargets = document.querySelectorAll(
    '.cozinha-section, .cozinha-offer, .cozinha-final',
  );

  const itemTargets = document.querySelectorAll(
    [
      '.cozinha-module',
      '.cozinha-complement',
      '.cozinha-preview-card',
      '.cozinha-audience-card',
      '.cozinha-steps__grid article',
      '.cozinha-v2-state',
      '.cozinha-v2-step',
      '.cozinha-v2-photo',
    ].join(','),
  );

  sectionTargets.forEach((item) => item.classList.add('cozinha-reveal'));
  itemTargets.forEach((item) => item.classList.add('cozinha-reveal-item'));

  page.classList.add('cozinha-motion-ready');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    sectionTargets.forEach((item) => item.classList.add('is-visible'));
    itemTargets.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -32px',
    },
  );

  sectionTargets.forEach((item) => observer.observe(item));
  itemTargets.forEach((item) => observer.observe(item));
})();
