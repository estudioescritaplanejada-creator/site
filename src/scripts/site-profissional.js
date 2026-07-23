(() => {
  'use strict';

  /* ---------------- Menu mobile ---------------- */
  const menuButton = document.querySelector('.menu-button');
  const header = document.querySelector('.header-inner');
  const nav = document.querySelector('.nav');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !header.classList.contains('open');
    header.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  }

  menuButton?.addEventListener('click', () => toggleMenu());
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (header.classList.contains('open')) toggleMenu(false);
  }));

  /* ---------------- Ano dinâmico ---------------- */
  document.getElementById('ano').textContent = new Date().getFullYear();

  /* ---------------- Header scroll + barra de progresso ---------------- */
  const siteHeader = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      siteHeader.classList.toggle('scrolled', y > 8);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progress.style.width = pct + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Reveal on scroll ---------------- */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const pageRegions = document.querySelectorAll('header, main, footer, .mobile-cta');
  let lastFocused = null;

  function openLightbox(image) {
    lastFocused = document.activeElement;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('open');
    pageRegions.forEach(region => { region.inert = true; });
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    pageRegions.forEach(region => { region.inert = false; });
    document.body.style.overflow = '';
    lightboxImage.alt = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.gallery-item').forEach(button => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (image) openLightbox(image);
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------------- Diálogos ---------------- */
  const privacyDialog = document.getElementById('privacidade');
  const termsDialog = document.getElementById('termos');

  document.querySelectorAll('[data-open-dialog="privacidade"]').forEach(btn => {
    btn.addEventListener('click', () => {
      privacyDialog.showModal();
      privacyDialog.querySelector('.dialog-close').focus();
    });
  });
  document.querySelectorAll('[data-open-dialog="termos"]').forEach(btn => {
    btn.addEventListener('click', () => {
      termsDialog.showModal();
      termsDialog.querySelector('.dialog-close').focus();
    });
  });

  [privacyDialog, termsDialog].forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        dialog.close();
      }
    });
  });

  /* ---------------- Teclado global ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('open')) closeLightbox();
      if (header.classList.contains('open')) toggleMenu(false);
      const openDialog = document.querySelector('dialog[open]');
      if (openDialog) openDialog.close();
    }
  });
})();
