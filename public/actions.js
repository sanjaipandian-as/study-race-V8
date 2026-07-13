// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// StudyRace Dashboard Actions (v7)
// Wires buttons in all 4 dashboards to real backend endpoints.
// Usage in dashboard HTML:  <script src="/actions.js"></script>
// Then use:  onclick="SRActions.createClass()" etc.
// ════════════════════════════════════════════════
window.SRActions = {

  // ─── Teacher: Create class ───
  createClass() {
    SR.modal({
      title: 'Neue Klasse anlegen',
      fields: [
        { name: 'name',        label: 'Klassen-Name',  placeholder: 'z.B. 8B', required: true },
        { name: 'subject',     label: 'Fach',          type: 'select', required: true, options: [
          { value: 'Mathematik', label: 'Mathematik' },
          { value: 'Physik',     label: 'Physik' },
          { value: 'Chemie',     label: 'Chemie' },
          { value: 'Biologie',   label: 'Biologie' },
        ]},
        { name: 'grade_level', label: 'Klassenstufe',  placeholder: 'z.B. 8', type: 'number' },
      ],
      submitLabel: 'Klasse anlegen',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/teacher/create-class', data);
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler beim Anlegen.' };
        const code = r.data.class.invite_code;
        return {
          successHtml: `
            <div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:10px;color:#155235;">Klasse "${r.data.class.name}" wurde angelegt</div>
            <div style="margin-bottom:8px;">Gib diesen Einladungscode an deine Schüler:innen weiter:</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;background:white;padding:14px;border-radius:8px;text-align:center;letter-spacing:0.08em;color:#1C1F1A;border:1px dashed #1B6B45;">${code}</div>
          `,
        };
      },
      onClose: () => location.reload(),
    });
  },

  // ─── Teacher: Create assignment ───
  createAssignment(classes) {
    if (!classes || classes.length === 0) {
      SR.toast('Du musst erst eine Klasse anlegen.', 'error');
      return;
    }
    SR.modal({
      title: 'Neue Aufgabe verteilen',
      fields: [
        { name: 'class_id',    label: 'Klasse',         type: 'select', required: true, options: classes.map(c => ({ value: c.id, label: c.name + ' · ' + c.subject })) },
        { name: 'title',       label: 'Titel',          placeholder: 'z.B. Quadratische Gleichungen', required: true },
        { name: 'description', label: 'Beschreibung',   type: 'textarea', placeholder: 'Optional...' },
        { name: 'subject',     label: 'Fach',           type: 'select', options: [
          { value: 'Mathematik', label: 'Mathematik' },
          { value: 'Physik',     label: 'Physik' },
          { value: 'Chemie',     label: 'Chemie' },
          { value: 'Biologie',   label: 'Biologie' },
        ]},
        { name: 'due_at',      label: 'Fällig am',      type: 'date' },
      ],
      submitLabel: 'Aufgabe verteilen',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/teacher/create-assignment', data);
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        SR.toast('Aufgabe wurde verteilt.');
        return {};
      },
      onClose: () => location.reload(),
    });
  },

  // ─── Teacher/School: Announcement ───
  createAnnouncement(classes, isSchool) {
    const fields = [
      { name: 'title', label: 'Titel', placeholder: 'z.B. Klausur am Freitag', required: true },
      { name: 'body',  label: 'Inhalt', type: 'textarea', placeholder: 'Was möchtest du mitteilen?', required: true },
    ];
    if (!isSchool && classes && classes.length > 0) {
      fields.unshift({ name: 'class_id', label: 'An welche Klasse?', type: 'select', options: [
        { value: '', label: '— Alle meine Klassen —' },
        ...classes.map(c => ({ value: c.id, label: c.name }))
      ]});
    }
    const endpoint = isSchool ? '/api/data/school/create-announcement' : '/api/data/teacher/create-announcement';
    SR.modal({
      title: 'Ankündigung schreiben',
      fields,
      submitLabel: 'Ankündigung senden',
      onSubmit: async (data) => {
        const r = await SR.post(endpoint, data);
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        SR.toast('Ankündigung wurde gesendet.');
        return {};
      },
      onClose: () => location.reload(),
    });
  },

  // ─── Teacher/Student: Send message ───
  sendMessage(role) {
    SR.modal({
      title: 'Nachricht senden',
      fields: [
        { name: 'recipient_email', label: 'Empfänger:in (E-Mail)', type: 'email', required: true,
          placeholder: role === 'student' ? 'lehrer@studyrace.de' : 'name@studyrace.de' },
        { name: 'subject', label: 'Betreff', placeholder: 'Optional' },
        { name: 'body',    label: 'Nachricht', type: 'textarea', required: true, placeholder: 'Was möchtest du schreiben?' },
      ],
      submitLabel: 'Senden',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/messages/send', {
          recipient_email: data.recipient_email,
          subject: data.subject || '',
          body: data.body,
        });
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        SR.toast('Nachricht wurde gesendet.');
        return {};
      },
      onClose: () => { if (typeof dataCache !== 'undefined') delete dataCache.inbox; },
    });
  },

  // ─── Teacher: Add material ───
  addMaterial(classes) {
    SR.modal({
      title: 'Material hinzufügen',
      fields: [
        { name: 'class_id',    label: 'Klasse (optional)', type: 'select', options: [
          { value: '', label: '— Allgemein —' },
          ...(classes || []).map(c => ({ value: c.id, label: c.name }))
        ]},
        { name: 'title',       label: 'Titel', placeholder: 'z.B. Übungsblatt Algebra', required: true },
        { name: 'description', label: 'Beschreibung', type: 'textarea', placeholder: 'Optional' },
        { name: 'url',         label: 'Link / URL', placeholder: 'https://...' },
        { name: 'material_type', label: 'Typ', type: 'select', options: [
          { value: 'link',  label: 'Link' },
          { value: 'pdf',   label: 'PDF' },
          { value: 'video', label: 'Video' },
        ]},
      ],
      submitLabel: 'Speichern',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/teacher/add-material', data);
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        SR.toast('Material wurde hinzugefügt.');
        return {};
      },
      onClose: () => location.reload(),
    });
  },

  // ─── Student: Join class via code ───
  joinClass() {
    SR.modal({
      title: 'Klasse beitreten',
      fields: [
        { name: 'invite_code', label: 'Einladungscode', placeholder: 'z.B. C-AB1234', required: true },
      ],
      submitLabel: 'Beitreten',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/student/join-class', { invite_code: data.invite_code });
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        SR.toast('Klasse "' + r.data.class.name + '" beigetreten.');
        return {};
      },
      onClose: () => location.reload(),
    });
  },

  // ─── Student: Submit task ───
  async submitTask(taskId, taskTitle) {
    SR.modal({
      title: 'Aufgabe abgeben: ' + (taskTitle || 'Aufgabe'),
      fields: [
        { name: 'score_pct', label: 'Mein Ergebnis (%)', type: 'number', placeholder: '0–100', required: true },
      ],
      submitLabel: 'Abgeben',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/student/submit-task', { task_id: taskId, score_pct: data.score_pct });
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        SR.toast('+' + r.data.xp_earned + ' XP — abgegeben mit ' + r.data.score_pct + '%.');
        return {};
      },
      onClose: () => location.reload(),
    });
  },

  // ─── School Admin: Invite teacher ───
  inviteTeacher() {
    SR.modal({
      title: 'Lehrkraft einladen',
      fields: [
        { name: 'email',     label: 'E-Mail',  type: 'email', placeholder: 'lehrer@meineschule.de', required: true },
        { name: 'full_name', label: 'Name',    placeholder: 'Vor- und Nachname' },
        { name: 'subject',   label: 'Fach',    placeholder: 'z.B. Mathematik' },
      ],
      submitLabel: 'Einladen',
      onSubmit: async (data) => {
        const r = await SR.post('/api/data/school/invite-teacher-with-email', data);
        if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
        return {
          successHtml: `
            <div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:10px;color:#155235;">Lehrkraft wurde angelegt</div>
            <div style="margin-bottom:8px;">E-Mail: <strong>${r.data.email}</strong></div>
            <div style="margin-bottom:8px;">Temporäres Passwort (auch per E-Mail gesendet):</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;background:white;padding:12px;border-radius:8px;text-align:center;letter-spacing:0.05em;color:#1C1F1A;border:1px dashed #1B6B45;">${r.data.temp_password}</div>
            <div style="font-size:12px;color:#7A8077;margin-top:10px;">${r.data.email_mode === 'smtp' ? '✓ E-Mail wurde gesendet.' : 'ℹ E-Mail wird nur geloggt (SMTP nicht konfiguriert) — gib das Passwort direkt weiter.'}</div>
          `,
        };
      },
      onClose: () => location.reload(),
    });
  },

  // ─── Super Admin: Approve / reject school (already exist as backend) ───
  async approveSchool(id) {
    if (!confirm('Diese Schule freigeben?')) return;
    const r = await SR.post('/api/auth/approve-school/' + id);
    if (!r.ok) { SR.toast(r.data.error || 'Fehler.', 'error'); return; }
    SR.toast('Schule freigegeben.');
    setTimeout(() => location.reload(), 800);
  },
  async rejectSchool(id) {
    const reason = prompt('Grund (optional):') || '';
    const r = await SR.post('/api/auth/reject-school/' + id, { reason });
    if (!r.ok) { SR.toast(r.data.error || 'Fehler.', 'error'); return; }
    SR.toast('Schule abgelehnt.');
    setTimeout(() => location.reload(), 800);
  },
};

// ════════════════════════════════════════════════
// v7.2 actions
// ════════════════════════════════════════════════

// ─── Change password ───
SRActions.changePassword = function() {
  SR.modal({
    title: 'Passwort ändern',
    fields: [
      { name: 'current_password', label: 'Aktuelles Passwort', type: 'password', required: true },
      { name: 'new_password',     label: 'Neues Passwort (min. 8 Zeichen, mit Buchstabe & Zahl)', type: 'password', required: true },
    ],
    submitLabel: 'Ändern',
    onSubmit: async (data) => {
      const r = await SR.post('/api/auth/change-password', data);
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      SR.toast('Passwort geändert.');
      return {};
    },
  });
};

// ─── Teacher: rename class ───
SRActions.renameClass = function(classId, currentName) {
  SR.modal({
    title: 'Klasse umbenennen',
    fields: [{ name: 'name', label: 'Neuer Name', required: true, value: currentName || '' }],
    submitLabel: 'Speichern',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/teacher/rename-class/' + classId, data);
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      SR.toast('Umbenannt.');
      return {};
    },
    onClose: () => location.reload(),
  });
};

// ─── Teacher: delete class ───
SRActions.deleteClass = async function(classId, className) {
  if (!confirm('Klasse "' + (className || '') + '" wirklich löschen? Alle Mitglieder verlieren den Zugriff.')) return;
  const r = await SR.post('/api/data/teacher/delete-class/' + classId, {});
  if (!r.ok) { SR.toast(r.data.error || 'Fehler.', 'error'); return; }
  SR.toast('Klasse gelöscht.');
  setTimeout(() => location.reload(), 800);
};

// ─── Teacher: create task with questions from bank ───
SRActions.createTaskFromBank = function(classes) {
  if (!classes || classes.length === 0) {
    SR.toast('Du musst erst eine Klasse anlegen.', 'error');
    return;
  }
  SR.modal({
    title: 'Aufgabe mit Übungsfragen verteilen',
    fields: [
      { name: 'class_id', label: 'Klasse', type: 'select', required: true, options: classes.map(c => ({ value: c.id, label: c.name + ' · ' + c.subject })) },
      { name: 'title', label: 'Aufgaben-Titel', required: true, placeholder: 'z.B. Übung Quadratische Gleichungen' },
      { name: 'subject', label: 'Fach', type: 'select', required: true, options: [
        { value: 'Mathematik', label: 'Mathematik' },
        { value: 'Physik',     label: 'Physik' },
        { value: 'Chemie',     label: 'Chemie' },
        { value: 'Biologie',   label: 'Biologie' },
      ]},
      { name: 'topic', label: 'Thema (optional, z.B. "Pythagoras")', placeholder: 'leer = alle Themen des Fachs' },
      { name: 'question_count', label: 'Anzahl Fragen', type: 'number', value: '5', required: true },
      { name: 'due_at', label: 'Fällig am', type: 'date' },
    ],
    submitLabel: 'Aufgabe erstellen',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/teacher/create-task-with-questions', data);
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      return {
        successHtml: `<div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:8px;color:#155235;">Aufgabe erstellt</div>
        <div>${r.data.question_count} Fragen wurden aus der Lern-Datenbank ausgewählt. Schüler:innen sehen die Aufgabe in ihrem Dashboard.</div>`,
      };
    },
    onClose: () => location.reload(),
  });
};

// ─── School signup (from /kontakt) ───
SRActions.signupSchool = async function(data) {
  return await SR.post('/api/auth/signup-school', data);
};

// ════════════════════════════════════════════════
// v7.2 — Top 10 features wiring
// ════════════════════════════════════════════════

// ─── 1. Change password (all roles) ───
SRActions.changePassword = function() {
  SR.modal({
    title: 'Passwort ändern',
    fields: [
      { name: 'current_password', label: 'Aktuelles Passwort', type: 'password', required: true },
      { name: 'new_password',     label: 'Neues Passwort (min. 8 Zeichen, mit Buchstabe & Zahl)', type: 'password', required: true },
      { name: 'confirm_password', label: 'Neues Passwort wiederholen',       type: 'password', required: true },
    ],
    submitLabel: 'Passwort ändern',
    onSubmit: async (data) => {
      if (data.new_password !== data.confirm_password) {
        return { ok: false, error: 'Die neuen Passwörter stimmen nicht überein.' };
      }
      const r = await SR.post('/api/data/me/change-password', {
        current_password: data.current_password,
        new_password: data.new_password
      });
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      SR.toast('Passwort wurde geändert.');
      return {};
    },
  });
};

// ─── 3. Attach questions to a task ───
SRActions.attachQuestions = function(taskId, taskTitle) {
  SR.modal({
    title: 'Fragen zur Aufgabe hinzufügen: ' + (taskTitle || ''),
    fields: [
      { name: 'subject', label: 'Fach', type: 'select', required: true, options: [
        { value: 'Mathematik', label: 'Mathematik' },
        { value: 'Physik',     label: 'Physik' },
        { value: 'Chemie',     label: 'Chemie' },
        { value: 'Biologie',   label: 'Biologie' },
      ]},
      { name: 'count', label: 'Wie viele Fragen? (1-20)', type: 'number', value: '5', required: true },
    ],
    submitLabel: 'Fragen zuweisen',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/teacher/attach-questions', {
        task_id: taskId, subject: data.subject, count: parseInt(data.count) || 5
      });
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      SR.toast(r.data.attached + ' Fragen zugewiesen.');
      return {};
    },
  });
};

// ─── 7. Rename class ───
SRActions.renameClass = function(classId, currentName) {
  SR.modal({
    title: 'Klasse umbenennen',
    fields: [
      { name: 'name', label: 'Neuer Name', value: currentName || '', required: true },
    ],
    submitLabel: 'Speichern',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/teacher/rename-class', { class_id: classId, name: data.name });
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      SR.toast('Klasse umbenannt.');
      return {};
    },
    onClose: () => location.reload(),
  });
};

// ─── 7. Delete class ───
SRActions.deleteClass = async function(classId, className) {
  if (!confirm('Klasse "' + (className || classId) + '" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
  const r = await SR.post('/api/data/teacher/delete-class', { class_id: classId });
  if (!r.ok) { SR.toast(r.data.error || 'Fehler.', 'error'); return; }
  SR.toast('Klasse gelöscht.');
  setTimeout(() => location.reload(), 700);
};

// ─── 8. Open inbox (returns HTML for embedding) ───
SRActions.openInbox = async function() {
  try {
    const r = await SR.get('/api/data/messages/inbox');
    if (!r.ok) { SR.toast('Inbox-Fehler.', 'error'); return null; }
    return r.data;
  } catch (e) { SR.toast(e.message, 'error'); return null; }
};

SRActions.markRead = async function(messageId) {
  try { await SR.post('/api/data/messages/' + messageId + '/read', {}); } catch {}
};

// Generic reply
SRActions.replyMessage = function(originalMessage) {
  SR.modal({
    title: 'Antworten an ' + (originalMessage.sender_name || 'Absender'),
    fields: [
      { name: 'subject', label: 'Betreff', value: 'Re: ' + (originalMessage.subject || '') },
      { name: 'body',    label: 'Nachricht', type: 'textarea', required: true },
    ],
    submitLabel: 'Senden',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/messages/send', {
        recipient_email: originalMessage.sender_email,
        subject: data.subject,
        body: data.body,
        reply_to_id: originalMessage.id,
      });
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      SR.toast('Antwort gesendet.');
      return {};
    },
  });
};

// ────────────────────────────────────────────────
// v7.3: Real exercise UI for assignment tasks
// (Loads questions attached to a task, walks through them)
// ────────────────────────────────────────────────
SRActions.startTaskExercise = async function(taskId, taskTitle) {
  try {
    const r = await SR.get('/api/data/student/task/' + taskId + '/questions');
    const qs = (r.data && r.data.questions) || [];
    if (qs.length === 0) {
      // Fall back to manual score input
      return SRActions.submitTask(taskId, taskTitle);
    }
    // Open modal that walks through questions
    _runTaskExercise(taskId, taskTitle, qs);
  } catch (e) {
    SR.toast(e.message || 'Aufgabe konnte nicht geladen werden.', 'error');
  }
};

function _runTaskExercise(taskId, taskTitle, questions) {
  let idx = 0;
  let correct = 0;
  let xp = 0;
  const answers = [];

  function showQuestion() {
    if (idx >= questions.length) return showResult();
    const q = questions[idx];
    const options = q.options
      ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options))
      : null;

    const wrap = _ensureExerciseOverlay();
    wrap.querySelector('.ex-inner').innerHTML = `
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#1B6B45;margin-bottom:14px;">
        Aufgabe: ${taskTitle} · Frage ${idx + 1} / ${questions.length}
      </div>
      <h2 style="font-family:'Fraunces',serif;font-size:22px;font-weight:500;line-height:1.4;margin-bottom:22px;color:#1C1F1A;">
        ${q.question_text}
      </h2>
      <div id="ex-answer-area">
        ${q.question_type === 'multiple_choice' && options ? `
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${options.map((opt, i) => `
              <button class="ex-mc" data-answer="${String(opt).replace(/"/g, '&quot;')}"
                      style="text-align:left;padding:13px 16px;border-radius:10px;border:1.5px solid #D6CAB0;background:#FBF8F2;font-family:inherit;font-size:14.5px;cursor:pointer;">
                <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#7A8077;margin-right:10px;">${String.fromCharCode(65 + i)}</span>${opt}
              </button>
            `).join('')}
          </div>
        ` : `
          <input id="ex-text-input" type="text" placeholder="Deine Antwort..."
                 style="width:100%;padding:13px 16px;border-radius:10px;border:1.5px solid #D6CAB0;background:#FBF8F2;font-family:inherit;font-size:15px;outline:none;" autocomplete="off"/>
          <button class="ex-submit" style="margin-top:12px;padding:11px 20px;border-radius:100px;border:none;background:#1B6B45;color:white;font-family:inherit;font-size:13.5px;font-weight:500;cursor:pointer;">Prüfen →</button>
        `}
      </div>
      ${q.hint ? `<details style="margin-top:18px;"><summary style="cursor:pointer;color:#7A8077;font-size:12.5px;">💡 Tipp</summary><div style="padding:10px 14px;background:#F5EFE2;border-radius:8px;font-size:13px;margin-top:6px;">${q.hint}</div></details>` : ''}
      <div style="margin-top:24px;display:flex;justify-content:space-between;font-size:12px;color:#7A8077;">
        <span>Richtig: ${correct} / ${idx}</span>
        <button onclick="_cancelExercise()" style="background:none;border:none;color:#7A8077;font-family:inherit;cursor:pointer;text-decoration:underline;">Abbrechen</button>
      </div>
    `;
    wrap.querySelectorAll('.ex-mc').forEach(b => {
      b.onclick = () => checkAnswer(b.dataset.answer);
    });
    const submitBtn = wrap.querySelector('.ex-submit');
    const textInput = wrap.querySelector('#ex-text-input');
    if (submitBtn && textInput) {
      submitBtn.onclick = () => checkAnswer(textInput.value);
      textInput.onkeydown = (e) => { if (e.key === 'Enter') checkAnswer(textInput.value); };
      textInput.focus();
    }
  }

  function normalize(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

  async function checkAnswer(answer) {
    const q = questions[idx];
    answers.push({ question_id: q.id, answer });
    // submit live to /practice/answer for tracking
    try {
      const r = await SR.post('/api/data/student/practice/answer', { question_id: q.id, answer });
      if (r.ok) {
        if (r.data.correct) { correct++; xp += r.data.xp_earned || 0; }
        _showQuestionFeedback(r.data);
      }
    } catch (e) { /* keep going even if API fails */ }
  }

  function _showQuestionFeedback(result) {
    const area = document.getElementById('ex-answer-area');
    if (!area) return;
    area.innerHTML = `
      <div style="padding:18px;border-radius:10px;background:${result.correct ? '#DCEEE3' : '#F0DACE'};border:2px solid ${result.correct ? '#1B6B45' : '#B85537'};">
        <div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;color:${result.correct ? '#155235' : '#B85537'};margin-bottom:6px;">
          ${result.correct ? '✓ Richtig!' : '✗ Falsch'}
          ${result.correct && result.xp_earned ? ` (+${result.xp_earned} XP)` : ''}
        </div>
        ${!result.correct ? `<div style="font-size:13px;color:#1C1F1A;margin-bottom:6px;">Richtige Antwort: <strong>${result.correct_answer}</strong></div>` : ''}
        ${result.explanation ? `<div style="font-size:13px;color:#4A5147;margin-top:10px;line-height:1.55;">${result.explanation}</div>` : ''}
      </div>
      <button style="margin-top:14px;width:100%;padding:13px;border-radius:100px;border:none;background:#1B6B45;color:white;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;" onclick="_nextExerciseQuestion()">${idx < questions.length - 1 ? 'Nächste Frage →' : 'Ergebnis anzeigen →'}</button>
    `;
  }

  function showResult() {
    const wrap = _ensureExerciseOverlay();
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    wrap.querySelector('.ex-inner').innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;margin-bottom:14px;">${pct >= 80 ? '🏆' : pct >= 50 ? '👏' : '💪'}</div>
        <h2 style="font-family:'Fraunces',serif;font-size:28px;font-weight:500;letter-spacing:-0.02em;margin-bottom:8px;">
          ${pct >= 80 ? 'Stark!' : pct >= 50 ? 'Gut gemacht.' : 'Weiter üben!'}
        </h2>
        <div style="font-size:16px;color:#4A5147;margin-bottom:24px;">
          ${correct} von ${total} richtig · +${xp} XP
        </div>
        <button onclick="_finishExercise(${taskId}, ${pct})" style="padding:13px 28px;border-radius:100px;border:none;background:#1B6B45;color:white;font-family:inherit;font-size:14.5px;font-weight:500;cursor:pointer;">Aufgabe abschließen →</button>
      </div>
    `;
  }

  // Expose helpers
  window._nextExerciseQuestion = () => { idx++; showQuestion(); };
  window._cancelExercise = () => { const o = document.getElementById('sr-exercise-overlay'); if (o) o.remove(); };
  window._finishExercise = async (tid, pct) => {
    try {
      // submit final task with overall score (also triggers progress update)
      await SR.post('/api/data/student/submit-task', { task_id: tid, score_pct: pct });
    } catch {}
    document.getElementById('sr-exercise-overlay')?.remove();
    SR.toast('Aufgabe erledigt: ' + pct + '% richtig.');
    setTimeout(() => location.reload(), 800);
  };

  showQuestion();
}

function _ensureExerciseOverlay() {
  let wrap = document.getElementById('sr-exercise-overlay');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'sr-exercise-overlay';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(28,31,26,0.55);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    const inner = document.createElement('div');
    inner.className = 'ex-inner';
    inner.style.cssText = 'background:#FFFFFF;border-radius:16px;padding:30px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px -20px rgba(0,0,0,0.3);';
    wrap.appendChild(inner);
    document.body.appendChild(wrap);
  }
  return wrap;
}

// ════════════════════════════════════════════════
// v7.4 — Teacher creates student, bulk invite, search
// ════════════════════════════════════════════════

// Single student account creation
SRActions.createStudent = function(classes) {
  SR.modal({
    title: 'Schüler:in-Account anlegen',
    fields: [
      { name: 'email',     label: 'E-Mail', type: 'email', placeholder: 'name@schule.de', required: true },
      { name: 'full_name', label: 'Name',   placeholder: 'Vor- und Nachname' },
      { name: 'class_id',  label: 'Klasse (optional)', type: 'select', options: [
        { value: '', label: '— ohne Klasse —' },
        ...(classes || []).map(c => ({ value: c.id, label: c.name + ' · ' + c.subject }))
      ]},
    ],
    submitLabel: 'Anlegen',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/teacher/create-student', data);
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      return {
        successHtml: `
          <div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:10px;color:#155235;">Account angelegt</div>
          <div style="margin-bottom:8px;">E-Mail: <strong>${r.data.email}</strong></div>
          <div style="margin-bottom:8px;">Temporäres Passwort (an Schüler:in weitergeben):</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;background:white;padding:12px;border-radius:8px;text-align:center;color:#1C1F1A;border:1px dashed #1B6B45;">${r.data.temp_password}</div>
          <div style="font-size:12px;color:#7A8077;margin-top:10px;">Eine E-Mail wurde gesendet (oder geloggt, falls kein SMTP konfiguriert).</div>
        `,
      };
    },
    onClose: () => location.reload(),
  });
};

// Bulk invite
SRActions.bulkInviteStudents = function(classes) {
  SR.modal({
    title: 'Mehrere Schüler:innen einladen',
    fields: [
      { name: 'class_id', label: 'Klasse (optional)', type: 'select', options: [
        { value: '', label: '— ohne Klasse —' },
        ...(classes || []).map(c => ({ value: c.id, label: c.name }))
      ]},
      { name: 'emails', label: 'E-Mail-Liste (kommagetrennt oder eine pro Zeile)', type: 'textarea',
        placeholder: 'lena@schule.de\nmax@schule.de\nemma@schule.de', required: true },
    ],
    submitLabel: 'Alle einladen',
    onSubmit: async (data) => {
      const r = await SR.post('/api/data/teacher/bulk-invite', data);
      if (!r.ok) return { ok: false, error: r.data.error || 'Fehler.' };
      const lines = r.data.results.map(res => {
        const color = res.status === 'invited' ? '#155235' : '#B85537';
        const status = res.status === 'invited' ? '✓ angelegt' : '⚠ existiert bereits';
        const pw = res.temp_password ? ' · PW: <code>' + res.temp_password + '</code>' : '';
        return '<div style="font-size:12px;color:' + color + ';padding:4px 0;">' + res.email + ' — ' + status + pw + '</div>';
      }).join('');
      return {
        successHtml: `
          <div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;margin-bottom:10px;color:#155235;">${r.data.invited} von ${r.data.total} eingeladen</div>
          <div style="max-height:280px;overflow-y:auto;padding:10px;background:white;border-radius:8px;">${lines}</div>
          <div style="font-size:12px;color:#7A8077;margin-top:10px;">Bitte gib die temporären Passwörter sicher an die Schüler:innen weiter.</div>
        `,
      };
    },
    onClose: () => location.reload(),
  });
};

// Simple client-side search filter for any list
SRActions.attachSearch = function(searchInputId, rowsSelector) {
  const inp = document.getElementById(searchInputId);
  if (!inp) return;
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase().trim();
    document.querySelectorAll(rowsSelector).forEach(row => {
      const text = (row.textContent || '').toLowerCase();
      row.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });
};

// ════════════════════════════════════════════════
// v7.5 — Notification bell panel
// ════════════════════════════════════════════════
SRActions.showNotifications = async function() {
  // Build a panel showing unread messages + recent announcements
  let inbox = { messages: [], unread: 0 };
  try {
    const r = await SR.get('/api/data/messages/inbox');
    if (r.ok) inbox = r.data;
  } catch (e) { /* non-fatal */ }

  const recent = (inbox.messages || []).slice(0, 8);
  const body = recent.length === 0
    ? '<div style="padding:24px;text-align:center;color:#7A8077;font-size:14px;">Keine neuen Benachrichtigungen.</div>'
    : recent.map(m => {
        const unread = !m.read_at;
        const when = m.created_at ? new Date(m.created_at).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}) : '';
        return `
          <div style="padding:12px 14px;border-bottom:1px solid #E8DFCE;display:flex;gap:10px;align-items:flex-start;${unread?'background:#EEF5EE;':''}">
            <div style="width:8px;height:8px;border-radius:50%;background:${unread?'#1B6B45':'#D6CAB0'};margin-top:5px;flex-shrink:0;"></div>
            <div style="flex:1;">
              <div style="font-size:13.5px;font-weight:500;color:#1C1F1A;">${m.sender_name || m.sender_email || 'Nachricht'}</div>
              <div style="font-size:12.5px;color:#4A5147;line-height:1.45;">${m.subject ? '<strong>'+m.subject+'</strong> · ' : ''}${(m.body||'').substring(0,80)}${(m.body||'').length>80?'…':''}</div>
              <div style="font-size:10.5px;color:#9AA096;font-family:'JetBrains Mono',monospace;margin-top:3px;">${when}</div>
            </div>
          </div>
        `;
      }).join('');

  // Reuse the modal shell
  const existing = document.getElementById('sr-modal-overlay');
  if (existing) existing.remove();
  const wrap = document.createElement('div');
  wrap.id = 'sr-modal-overlay';
  wrap.style.cssText = 'position:fixed;inset:0;background:rgba(28,31,26,0.5);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:70px 20px;';
  wrap.innerHTML = `
    <div style="background:#FFFFFF;border-radius:16px;width:100%;max-width:420px;max-height:70vh;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,0.3);display:flex;flex-direction:column;">
      <div style="padding:18px 20px;border-bottom:1px solid #E8DFCE;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-family:'Fraunces',serif;font-size:18px;font-weight:500;">Benachrichtigungen ${inbox.unread ? '<span style="background:#1B6B45;color:white;font-size:11px;padding:2px 7px;border-radius:100px;font-family:Inter,sans-serif;">'+inbox.unread+'</span>' : ''}</div>
        <button id="sr-notif-close" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:#7A8077;">&times;</button>
      </div>
      <div style="overflow-y:auto;">${body}</div>
      <div style="padding:12px 20px;border-top:1px solid #E8DFCE;text-align:center;">
        <a href="#" id="sr-notif-inbox" style="color:#1B6B45;font-size:13px;font-weight:500;text-decoration:none;">Alle Nachrichten ansehen →</a>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  wrap.onclick = (e) => { if (e.target === wrap) wrap.remove(); };
  document.getElementById('sr-notif-close').onclick = () => wrap.remove();
  document.getElementById('sr-notif-inbox').onclick = (e) => {
    e.preventDefault();
    wrap.remove();
    if (typeof switchSection === 'function') switchSection('messages');
    else SR.toast('Nachrichten findest du in der Seitenleiste.');
  };
};
