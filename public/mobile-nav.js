// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════════════════
// mobile-nav.js — Adds a hamburger menu on small screens.
// Finds the existing <nav class="top">, injects a burger button,
// and clones the nav links into a slide-down panel.
// No-op on desktop (CSS hides the burger above 900px).
// ════════════════════════════════════════════════════════════
(function () {
  function init() {
    const nav = document.querySelector('nav.top');
    if (!nav || nav.dataset.mobileReady) return;
    nav.dataset.mobileReady = '1';

    const inner = nav.querySelector('.nav-inner');
    const links = nav.querySelector('.nav-links');
    const cta   = nav.querySelector('.nav-cta');
    if (!inner) return;

    // Burger button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-burger';
    btn.setAttribute('aria-label', 'Menü öffnen');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';

    // Mobile dropdown panel
    const panel = document.createElement('div');
    panel.className = 'nav-mobile';
    let html = '<div class="nav-mobile-inner">';
    if (links) {
      links.querySelectorAll('a').forEach(a => {
        const cls = a.classList.contains('current') ? ' class="current"' : '';
        html += `<a href="${a.getAttribute('href')}"${cls}>${a.textContent}</a>`;
      });
    }
    if (cta) {
      cta.querySelectorAll('a, button').forEach(el => {
        if (el.tagName === 'A') {
          const isEmerald = el.classList.contains('btn-emerald') ||
                            el.classList.contains('btn-primary');
          const cls = isEmerald ? ' class="mob-btn mob-btn-emerald"' : ' class="mob-btn"';
          html += `<a href="${el.getAttribute('href')}"${cls}>${el.textContent.trim()}</a>`;
        }
      });
    }
    html += '</div>';
    panel.innerHTML = html;

    // Insert burger right before the CTA (or at end of inner)
    if (cta) inner.insertBefore(btn, cta);
    else inner.appendChild(btn);
    nav.appendChild(panel);

    // Toggle
    function setOpen(open) {
      nav.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      document.body.classList.toggle('nav-locked', open);
    }
    btn.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
    // Close when a link is clicked (link navigates, but be defensive)
    panel.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    // Close if user resizes back to desktop
    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        if (window.innerWidth > 900 && nav.classList.contains('nav-open')) setOpen(false);
      }, 80);
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
