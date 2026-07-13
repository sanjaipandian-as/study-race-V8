// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// StudyRace API helper (frontend) — v6 multi-page
// ════════════════════════════════════════════════
window.SR = {
  async call(method, path, body) {
    const opts = {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(path, opts);
    let data = {};
    try { data = await r.json(); } catch (e) {}
    return { ok: r.ok, status: r.status, data };
  },
  get(path)        { return this.call('GET',  path); },
  post(path, body) { return this.call('POST', path, body); },

  login(email, password) { return this.post('/api/auth/login', { email, password }); },
  logout() { return this.post('/api/auth/logout'); },
  registerSchool(data) { return this.post('/api/auth/register-school', data); },
  redeemInvite(invite_code, full_name, password, grade_level) {
    return this.post('/api/auth/redeem-invite', { invite_code, full_name, password, grade_level });
  },
  acceptInvite(token, password) { return this.post('/api/auth/accept-invite', { token, password }); },
  me() { return this.get('/api/auth/me'); },

  showError(msg) {
    const el = document.getElementById('form-error');
    if (el) { el.textContent = msg; el.style.display = 'block';
      setTimeout(() => { el.style.display = 'none'; }, 8000); }
    else { alert(msg); }
  },
  go(url) { window.location.href = url; },

  async requireAnyRole() {
    const r = await this.me();
    if (!r.ok || !r.data.user) { this.go('/login'); return null; }
    return r.data.user;
  },
  async requireRole(role) {
    const r = await this.me();
    if (!r.ok || !r.data.user) { this.go('/login'); return null; }
    if (r.data.user.role !== role) { this.go('/dashboard'); return null; }
    return r.data.user;
  },
};

// ════════════════════════════════════════════════
// Back-forward cache (bfcache) guard.
// If a dashboard page is restored from the browser's Back/Forward
// cache, re-verify the session. If the user logged out in the
// meantime, send them to login instead of showing a stale page.
// ════════════════════════════════════════════════
window.addEventListener('pageshow', async function (event) {
  if (event.persisted && location.pathname.startsWith('/app/')) {
    try {
      const r = await window.SR.me();
      if (!r.ok || !r.data || !r.data.user) {
        window.location.href = '/login';
      }
    } catch (e) {
      window.location.href = '/login';
    }
  }
});

// ════════════════════════════════════════════════
// Modal + form helper (v7)
// ════════════════════════════════════════════════
window.SR.modal = function(opts) {
  // opts: { title, fields: [{name, label, type, placeholder, required, options}], submitLabel, onSubmit }
  // onSubmit(formData) returns Promise<{ok, error?, successHtml?}>
  const existing = document.getElementById('sr-modal-overlay');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.id = 'sr-modal-overlay';
  wrap.style.cssText = 'position:fixed;inset:0;background:rgba(28,31,26,0.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  const inner = document.createElement('div');
  inner.style.cssText = 'background:#FFFFFF;border-radius:16px;padding:28px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px -20px rgba(0,0,0,0.3);';

  const title = document.createElement('h2');
  title.textContent = opts.title || 'Aktion';
  title.style.cssText = "font-family:'Fraunces',serif;font-size:22px;font-weight:500;letter-spacing:-0.02em;margin-bottom:18px;color:#1C1F1A;";
  inner.appendChild(title);

  const form = document.createElement('form');
  form.style.cssText = 'display:flex;flex-direction:column;gap:14px;';

  (opts.fields || []).forEach(f => {
    const wrapField = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = f.label + (f.required ? ' *' : '');
    label.style.cssText = "display:block;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:#7A8077;margin-bottom:6px;font-weight:500;";
    wrapField.appendChild(label);

    let input;
    if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 4;
    } else if (f.type === 'select') {
      input = document.createElement('select');
      (f.options || []).forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value; o.textContent = opt.label;
        input.appendChild(o);
      });
    } else {
      input = document.createElement('input');
      input.type = f.type || 'text';
    }
    input.name = f.name;
    if (f.placeholder) input.placeholder = f.placeholder;
    if (f.required) input.required = true;
    if (f.value) input.value = f.value;
    input.style.cssText = "width:100%;padding:10px 12px;border:1px solid #D6CAB0;border-radius:8px;font-family:inherit;font-size:14px;background:#FBF8F2;color:#1C1F1A;";
    wrapField.appendChild(input);
    form.appendChild(wrapField);
  });

  const errBox = document.createElement('div');
  errBox.style.cssText = 'color:#B85537;font-size:13px;display:none;padding:8px 0;';
  form.appendChild(errBox);

  const successBox = document.createElement('div');
  successBox.style.cssText = "padding:14px;background:#DCEEE3;color:#155235;border-radius:8px;font-size:13.5px;display:none;line-height:1.5;";
  form.appendChild(successBox);

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;margin-top:10px;';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Abbrechen';
  cancelBtn.style.cssText = "padding:10px 18px;border-radius:100px;border:1.5px solid #D6CAB0;background:transparent;color:#1C1F1A;font-family:inherit;font-size:13.5px;cursor:pointer;font-weight:500;";
  cancelBtn.onclick = () => wrap.remove();

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = opts.submitLabel || 'Speichern';
  submitBtn.style.cssText = "padding:10px 20px;border-radius:100px;border:none;background:#1B6B45;color:white;font-family:inherit;font-size:13.5px;cursor:pointer;font-weight:500;";

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(submitBtn);
  form.appendChild(btnRow);

  form.onsubmit = async (e) => {
    e.preventDefault();
    errBox.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bitte warten...';

    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { data[k] = v; });

    try {
      const result = await opts.onSubmit(data);
      if (result && result.ok === false) {
        errBox.textContent = result.error || 'Fehler.';
        errBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = opts.submitLabel || 'Speichern';
      } else if (result && result.successHtml) {
        // Hide form fields, show success
        form.querySelectorAll('label, input, textarea, select').forEach(el => el.parentElement && (el.parentElement.style.display = 'none'));
        successBox.innerHTML = result.successHtml;
        successBox.style.display = 'block';
        submitBtn.textContent = 'Schließen';
        submitBtn.disabled = false;
        submitBtn.onclick = (ev) => { ev.preventDefault(); wrap.remove(); if (opts.onClose) opts.onClose(); };
        cancelBtn.style.display = 'none';
      } else {
        wrap.remove();
        if (opts.onClose) opts.onClose();
      }
    } catch (err) {
      errBox.textContent = err.message || 'Verbindungsfehler.';
      errBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = opts.submitLabel || 'Speichern';
    }
  };

  inner.appendChild(form);
  wrap.appendChild(inner);
  document.body.appendChild(wrap);

  // Close on overlay click
  wrap.onclick = (e) => { if (e.target === wrap) wrap.remove(); };
  // Focus first input
  setTimeout(() => { const f = form.querySelector('input,textarea,select'); if (f) f.focus(); }, 50);
};

// Toast helper
window.SR.toast = function(msg, type = 'success') {
  let t = document.getElementById('sr-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'sr-toast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#FFFFFF;border:1px solid #1B6B45;border-radius:12px;padding:14px 18px;box-shadow:0 14px 36px -10px rgba(0,0,0,0.15);font-size:13.5px;color:#1C1F1A;z-index:10000;transform:translateY(80px);opacity:0;transition:all 0.3s;font-family:Inter,sans-serif;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.borderColor = type === 'error' ? '#B85537' : '#1B6B45';
  t.style.transform = 'translateY(0)';
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.transform = 'translateY(80px)'; t.style.opacity = '0'; }, 3200);
};
