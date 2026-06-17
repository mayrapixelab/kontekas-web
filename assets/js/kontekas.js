/* ===========================================
   KONTEKAS · MAIN JS V2
   Pixelab · Junio 2026
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── TOPBAR + NAVBAR SCROLL ──────────────────────────────────────────────
  const topbar = document.querySelector('.topbar');
  const navbar = document.querySelector('.navbar');
  const TOPBAR_H = topbar ? topbar.offsetHeight : 0;

  const onScroll = () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 60);
    if (topbar) topbar.classList.toggle('hidden', y > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE MENU ─────────────────────────────────────────────────────────
  const hamburger  = document.querySelector('.navbar-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');

  const openMobile = () => {
    mobileMenu?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileClose?.focus();
  };
  const closeMobile = () => {
    mobileMenu?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger?.focus();
  };
  hamburger?.addEventListener('click', openMobile);
  mobileClose?.addEventListener('click', closeMobile);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
  // Escape key closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMobile();
  });

  // ── HERO PARALLAX ───────────────────────────────────────────────────────
  const heroBg = document.querySelector('.hero-video') || document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        heroBg.style.transform = `translateY(${y * 0.28}px)`;
      }
    }, { passive: true });
  }

  // ── REVEAL ON SCROLL ────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ───────────────────────────────────────────────────
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = target / (1400 / 16);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target + suffix; clearInterval(timer); }
        else el.textContent = Math.floor(current) + suffix;
      }, 16);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── HOMEPAGE FILTER PILLS ────────────────────────────────────────────────
  const pills = document.querySelectorAll('.filter-pills .pill');
  const productCards = document.querySelectorAll('.products-grid .product-card[data-material]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter || 'all';
      let shown = 0;
      productCards.forEach(card => {
        const show = filter === 'all' || card.dataset.material === filter;
        card.style.display = show ? '' : 'none';
        if (show) shown++;
      });
    });
  });

  // ── CATALOG FILTERS ──────────────────────────────────────────────────────
  const catalogCards   = document.querySelectorAll('.catalog-grid .product-card');
  const countDisplay   = document.querySelector('.count-num');
  const filterClear    = document.querySelector('.filter-clear');
  const filterToggleBtn = document.querySelector('.filter-toggle-btn');
  const filterSidebar  = document.querySelector('.filter-sidebar');

  const applyFilters = () => {
    const active = { categoria: [], material: [] };
    document.querySelectorAll('.filter-check input:checked').forEach(cb => {
      const g = cb.dataset.group;
      if (active[g]) active[g].push(cb.value);
    });
    let visible = 0;
    catalogCards.forEach(card => {
      const ok =
        (!active.categoria.length || active.categoria.includes(card.dataset.categoria || '')) &&
        (!active.material.length  || active.material.includes(card.dataset.material   || ''));
      card.style.display = ok ? '' : 'none';
      if (ok) visible++;
    });
    if (countDisplay) countDisplay.textContent = visible;
  };

  document.querySelectorAll('.filter-check input').forEach(cb =>
    cb.addEventListener('change', applyFilters)
  );
  filterClear?.addEventListener('click', () => {
    document.querySelectorAll('.filter-check input:checked').forEach(cb => { cb.checked = false; });
    applyFilters();
  });

  // Pre-aplicar filtro desde URL (?categoria=sombrillas, ?material=teca, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  ['categoria', 'material'].forEach(group => {
    const val = urlParams.get(group);
    if (!val) return;
    const cb = document.querySelector(`.filter-check input[data-group="${group}"][value="${val}"]`);
    if (cb) { cb.checked = true; applyFilters(); }
  });

  // Mobile filter sidebar toggle + backdrop
  let backdrop = document.querySelector('.filter-sidebar-backdrop');
  if (!backdrop && filterSidebar) {
    backdrop = document.createElement('div');
    backdrop.className = 'filter-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }
  const openSidebar = () => {
    filterSidebar?.classList.add('open');
    backdrop?.classList.add('open');
    filterToggleBtn?.setAttribute('aria-expanded', 'true');
  };
  const closeSidebar = () => {
    filterSidebar?.classList.remove('open');
    backdrop?.classList.remove('open');
    filterToggleBtn?.setAttribute('aria-expanded', 'false');
  };
  filterToggleBtn?.addEventListener('click', () => {
    filterSidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  backdrop?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && filterSidebar?.classList.contains('open')) closeSidebar();
  });

  // ── PRODUCT THUMBNAILS ───────────────────────────────────────────────────
  const thumbs = document.querySelectorAll('.product-thumb');
  const mainImg = document.querySelector('.product-main-img img');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.style.opacity = '0';
        mainImg.src = thumb.querySelector('img').src;
        setTimeout(() => { mainImg.style.opacity = '1'; }, 50);
      }
    });
  });
  if (mainImg) mainImg.style.transition = 'opacity .25s ease';

  // ── COLOR SWATCHES ───────────────────────────────────────────────────────
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      sw.closest('.swatches-row')?.querySelectorAll('.swatch')
        .forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });

  // ── QUOTE FORM ───────────────────────────────────────────────────────────
  const form = document.querySelector('#cotizacion-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Enviando cotización...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '¡Cotización enviada! Te contactamos pronto.';
      btn.style.background = '#25D366';
      form.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    }, 1800);
  });

  // ── ACTIVE NAV LINK ──────────────────────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href && page.startsWith(href.replace('.html', ''))) a.classList.add('active');
  });

  // ── TIDIO READY HOOK ─────────────────────────────────────────────────────
  // Tidio se carga vía script externo. Al estar listo podemos personalizarlo:
  document.addEventListener('tidioChat-ready', () => {
    if (window.tidioChatApi) {
      window.tidioChatApi.on('close', () => {});
    }
  });

});
