// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════════════════
// footer.js — renders a consistent footer with all links working.
// Pages that include this just need <footer id="footer"></footer>.
// ════════════════════════════════════════════════════════════
(function () {
  const el = document.getElementById('footer');
  if (!el) return;
  el.className = 'footer';
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="logo"><span class="logo-flag"></span> StudyRace</a>
          <p>Die adaptive Lernplattform, gebaut für deutsche Klassenzimmer. In Deutschland gehostet.</p>
        </div>
        <div class="footer-col">
          <h6>Plattform</h6>
          <a href="/funktionen">Funktionen</a>
          <a href="/preise" class="footer-pricing-link">Preise</a>
          <a href="/faq">Häufige Fragen</a>
          <a href="/login">Anmelden</a>
        </div>
        <div class="footer-col">
          <h6>Unternehmen</h6>
          <a href="/ueber-uns">Über uns</a>
          <a href="/sicherheit">Sicherheit</a>
          <a href="/kontakt">Kontakt</a>
        </div>
        <div class="footer-col">
          <h6>Rechtliches</h6>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/agb">AGB</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 StudyRace · In Deutschland gemacht 🇩🇪</div>
        <div>studyrace.de</div>
      </div>
    </div>
  `;
})();
