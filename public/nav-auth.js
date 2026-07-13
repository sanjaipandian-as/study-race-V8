// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════════════════
// nav-auth.js — keeps the public-page nav in sync with login state.
// Fixes the "logged out when changing pages" bug: the JWT cookie
// always persisted, but public pages never *checked* it. Now they do.
// ════════════════════════════════════════════════════════════
(async function () {
  const cta = document.getElementById('nav-cta');
  if (!cta || !window.SR) return;

  try {
    const r = await SR.me();
    if (r.ok && r.data && r.data.user) {
      const user = r.data.user;
      const first = (user.full_name || 'Mein Bereich').split(' ')[0];
      // Logged in: show "Mein Bereich" + logout
      cta.innerHTML =
        '<a href="/dashboard" class="btn btn-emerald">Mein Bereich (' + first + ') <span class="arrow">→</span></a>' +
        '<a href="#" id="nav-logout" class="btn btn-ghost">Abmelden</a>';
      const logoutBtn = document.getElementById('nav-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          await SR.logout();
          window.location.href = '/';
        });
      }
    }
    // Not logged in: leave the default "Anmelden / Kostenlos starten" buttons as they are.
  } catch (e) {
    // On any error, leave default nav — never block the page.
  }
})();
