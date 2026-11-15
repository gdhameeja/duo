/* =========================================================
   STOA — app
   Vanilla JS, no build step. State lives in localStorage.
   ========================================================= */
(() => {
'use strict';

/* ---------------- utils ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dstr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const dayDiff = (a, b) => Math.round((parseD(b) - parseD(a)) / 864e5);
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return dstr(d); };
const today = () => dstr();
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmtDate = s => parseD(s).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
const norm = s => s.toLowerCase().replace(/[^a-z0-9' ]/g, '').replace(/\s+/g, ' ').trim();

const ALL_LESSONS = UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unit: u })));
const LESSON_BY_ID = Object.fromEntries(ALL_LESSONS.map(l => [l.id, l]));

const VIRTUES = {
  Wisdom: { icon: '🦉', color: '#3f6b8a', hint: 'See clearly. Judge what is truly good.' },
  Courage: { icon: '🦁', color: '#b5653a', hint: 'Do the hard, right thing.' },
  Justice: { icon: '⚖️', color: '#5f7a4a', hint: 'Be fair and kind to others.' },
  Temperance: { icon: '🌊', color: '#6a4a7a', hint: 'The right amount. Self-mastery.' }
};

const JOURNAL_PROMPTS = [
  'What am I avoiding right now, and why?',
  'What would I do today if I weren\'t afraid of others\' opinions?',
  'What is something I\'m treating as "good" that is really indifferent?',
  'Who taught me something valuable? What was it? (Marcus, Book 1)',
  'What did I get upset about this week? Was it up to me?',
  'If today were my last day, what would I regret not saying?',
  'Which of my habits am I strengthening every day, for better or worse?',
  'What would the wisest person I know do in my current situation?',
  'What do I have that I once only wished for?',
  'Where am I living "according to opinion" instead of "according to nature"?',
  'What is the obstacle in front of me, and what virtue does it let me practise?',
  'How did I treat the people in my "outer circles" today?',
  'What story am I telling myself that might not be true?',
  'What would "enough" look like for me?',
  'What is one thing I can let go of today?'
];

const MOTIVES = {
  anxiety: { label: 'Anxiety & worry', icon: '🌫️', tip: 'Start with the Worry Sorter in the Citadel, and read "On Fear" (Unit 6).', lesson: 'u6l3' },
  anger: { label: 'Anger & irritation', icon: '🌋', tip: 'Seneca\'s "On Anger" lesson (Unit 6) and the "Ten Breaths" challenge are for you.', lesson: 'u6l2' },
  discipline: { label: 'Discipline & habits', icon: '⚒️', tip: 'The Morning Preparation and Evening Review build discipline. Do both daily.', lesson: 'u11l2' },
  grief: { label: 'Loss & grief', icon: '🕯️', tip: 'Try "On Loan" (Unit 4) and "Gratitude Through Loss" (Unit 7). Be gentle with yourself.', lesson: 'u4l2' },
  purpose: { label: 'Meaning & purpose', icon: '🧭', tip: 'Memento Mori (Citadel) and Unit 8 help clarify what matters.', lesson: 'u8l2' },
  curious: { label: 'Just curious', icon: '📜', tip: 'Start at the beginning. The path will guide you.', lesson: 'u1l1' }
};

/* ---------------- state ---------------- */
const KEY = 'stoa.v1';
const defaults = () => ({
  v: 1,
  onboarded: false,
  name: '',
  motive: null,
  xp: 0,
  obols: 0,
  streak: { count: 0, last: null, best: 0, shields: 0 },
  completed: {},       // lessonId -> { times, best, last }
  mistakes: {},        // key -> { n, last }
  journal: [],         // { id, date, ts, type, title, parts:[{q,a}] }
  days: {},            // date -> { xp, lessons, morning, evening, challenge, chSwap, citadel, intention, virtue, rating }
  counts: { morning: 0, evening: 0, challenge: 0, citadel: 0, vfa: 0, review: 0, perfect: 0 },
  achievements: {},
  favs: [],
  worries: [],
  mori: { birth: null, life: 80 },
  settings: { sound: true, goal: 30, theme: 'auto', unlockAll: false }
});
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw) return defaults();
    const d = defaults();
    return { ...d, ...raw, streak: { ...d.streak, ...raw.streak }, counts: { ...d.counts, ...raw.counts }, settings: { ...d.settings, ...raw.settings }, mori: { ...d.mori, ...raw.mori } };
  } catch { return defaults(); }
}
let S = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn(e); } };
const day = (t = today()) => (S.days[t] ||= { xp: 0, lessons: 0 });

/* ---------------- theme ---------------- */
function applyTheme() {
  const t = S.settings.theme === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : S.settings.theme;
  document.documentElement.dataset.theme = t;
  $('meta[name=theme-color]').content = t === 'dark' ? '#1b1916' : '#f6f1e7';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

/* ---------------- sound ---------------- */
let actx;
function tone(freqs, dur = .12, type = 'sine', gap = .09, vol = .14) {
  if (!S.settings.sound) return;
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime;
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      const s = t0 + i * gap;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(vol, s + .01);
      g.gain.exponentialRampToValueAtTime(.0001, s + dur);
      o.connect(g).connect(actx.destination);
      o.start(s); o.stop(s + dur + .02);
    });
  } catch { /* ignore */ }
}
const sfx = {
  ok: () => tone([659, 880], .18, 'sine', .08),
  bad: () => tone([220, 185], .22, 'triangle', .1, .12),
  tap: () => tone([520], .05, 'sine', 0, .05),
  done: () => tone([523, 659, 784, 1047], .35, 'sine', .11, .13),
  match: () => tone([784], .1, 'sine', 0, .09),
  ach: () => tone([784, 988, 1175], .3, 'triangle', .1, .1)
};

/* ---------------- streak & xp ---------------- */
function checkStreak() {
  const st = S.streak;
  if (!st.last) return;
  const gap = dayDiff(st.last, today());
  if (gap <= 1) return;
  const missed = gap - 1;
  if (st.count > 0 && st.shields >= missed) {
    st.shields -= missed;
    st.last = addDays(today(), -1);
    for (let i = 1; i <= missed; i++) day(addDays(today(), -i)).shield = true;
    setTimeout(() => toast('🛡️', 'Streak shield used', `Your ${st.count}-day streak survived ${missed} missed day${missed > 1 ? 's' : ''}. Amor fati.`), 600);
  } else if (st.count > 0) {
    const lost = st.count;
    st.count = 0;
    setTimeout(() => toast('🍂', 'Streak reset', `Your ${lost}-day streak ended. "Every day, begin again." Start a new one today.`), 600);
  }
  save();
}
function gain(xp, obols = 0) {
  checkStreak();
  const t = today(), d = day(t);
  d.xp += xp; S.xp += xp; S.obols += obols;
  const st = S.streak;
  if (st.last !== t) {
    st.count = (st.last && dayDiff(st.last, t) === 1) ? st.count + 1 : 1;
    st.last = t;
    st.best = Math.max(st.best, st.count);
    if (st.count > 1) setTimeout(() => toast('🔥', `${st.count}-day streak!`, 'Discipline is built one day at a time.'), 400);
  }
  save();
  checkAchievements();
  renderTop();
}
const rankFor = xp => { let r = RANKS[0], next = null; for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].xp) { r = RANKS[i]; next = RANKS[i + 1] || null; } } return { r, next }; };

/* ---------------- achievements ---------------- */
const lessonsDone = () => Object.keys(S.completed).filter(k => LESSON_BY_ID[k]).length;
const unitsDone = () => UNITS.filter(u => u.lessons.every(l => S.completed[l.id])).length;
const ACH = [
  { id: 'first', icon: '👣', name: 'First Step', desc: 'Complete a lesson', test: () => lessonsDone() >= 1 },
  { id: 'l10', icon: '📚', name: 'Diligent', desc: 'Complete 10 lessons', test: () => lessonsDone() >= 10 },
  { id: 'u3', icon: '🏛️', name: 'Porch Regular', desc: 'Finish 3 units', test: () => unitsDone() >= 3 },
  { id: 'grad', icon: '🎓', name: 'Graduate of the Stoa', desc: 'Finish every unit', test: () => unitsDone() === UNITS.length },
  { id: 'perfect', icon: '💎', name: 'Flawless', desc: 'A perfect lesson', test: () => S.counts.perfect >= 1 },
  { id: 's3', icon: '🔥', name: 'Kindling', desc: '3-day streak', test: () => S.streak.best >= 3 },
  { id: 's7', icon: '🗓️', name: 'A Week of Discipline', desc: '7-day streak', test: () => S.streak.best >= 7 },
  { id: 's30', icon: '⛰️', name: 'Iron Will', desc: '30-day streak', test: () => S.streak.best >= 30 },
  { id: 's100', icon: '☀️', name: 'Unshakeable', desc: '100-day streak', test: () => S.streak.best >= 100 },
  { id: 'm1', icon: '🌅', name: 'Dawn Rising', desc: 'First morning preparation', test: () => S.counts.morning >= 1 },
  { id: 'm10', icon: '🐓', name: 'Up With The Sun', desc: '10 morning preparations', test: () => S.counts.morning >= 10 },
  { id: 'e1', icon: '🕯️', name: 'Lamp Out', desc: 'First evening review', test: () => S.counts.evening >= 1 },
  { id: 'e10', icon: '🌙', name: 'Seneca\'s Habit', desc: '10 evening reviews', test: () => S.counts.evening >= 10 },
  { id: 'c1', icon: '🏟️', name: 'Into The Arena', desc: 'First daily challenge', test: () => S.counts.challenge >= 1 },
  { id: 'c10', icon: '🧊', name: 'Ascetic', desc: '10 daily challenges', test: () => S.counts.challenge >= 10 },
  { id: 'cit', icon: '🏰', name: 'Inner Citadel', desc: 'Retreat to the Citadel', test: () => S.counts.citadel >= 1 },
  { id: 'vfa', icon: '🛰️', name: 'View From Above', desc: 'Complete the cosmic view', test: () => S.counts.vfa >= 1 },
  { id: 'mori', icon: '💀', name: 'Memento Mori', desc: 'Face your weeks', test: () => !!S.mori.birth },
  { id: 'j25', icon: '🖋️', name: 'Scribe', desc: '25 journal entries', test: () => S.journal.length >= 25 },
  { id: 'rev', icon: '🔁', name: 'Return To The Fray', desc: 'Complete a review session', test: () => S.counts.review >= 1 },
  { id: 'full', icon: '🌗', name: 'A Complete Day', desc: 'Morning, lesson, challenge & evening in one day', test: () => Object.values(S.days).some(d => d.morning && d.evening && d.challenge && d.lessons > 0) },
  { id: 'xp1k', icon: '⭐', name: 'Prokoptōn', desc: 'Earn 1,000 XP', test: () => S.xp >= 1000 }
];
function checkAchievements() {
  let changed = false;
  ACH.forEach((a, i) => {
    if (!S.achievements[a.id] && a.test()) {
      S.achievements[a.id] = today(); changed = true;
      setTimeout(() => { toast(a.icon, `Achievement: ${a.name}`, a.desc); sfx.ach(); }, 900 + i * 50);
    }
  });
  if (changed) save();
}

/* ---------------- toasts & confetti ---------------- */
function toast(icon, title, sub = '') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="ti">${icon}</div><div>${esc(title)}${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  const box = $('#toasts');
  box.appendChild(el);
  while (box.children.length > 2) box.firstChild.remove();
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3600);
}
function confetti() {
  const c = $('#confetti'), ctx = c.getContext('2d');
  const dpr = devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
  const colors = ['#c9a14a', '#5f7a4a', '#b5653a', '#3f6b8a', '#e8d9a8', '#8fae6d'];
  const P = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35,
    vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4,
    r: Math.random() * 6 + 4, c: pick(colors), a: Math.random() * 6, va: (Math.random() - .5) * .3, leaf: Math.random() < .45
  }));
  let f = 0;
  (function step() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => {
      p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
      if (p.leaf) { ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.4, p.r * .55, 0, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6);
      ctx.restore();
    });
    if (++f < 170) requestAnimationFrame(step); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })();
}

/* ---------------- shell ---------------- */
const LOGO = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9 16 3l12 6"/><path d="M5 9h22"/><path d="M8 12v12M13 12v12M19 12v12M24 12v12"/><path d="M5 27h22M4 30h24"/></svg>`;
const TABS = [
  ['learn', '🏛️', 'Learn'], ['today', '🌅', 'Today'], ['citadel', '🏰', 'Citadel'], ['journal', '🖋️', 'Journal'], ['profile', '👤', 'You']
];
let tab = (location.hash.slice(1) in { learn: 1, today: 1, citadel: 1, journal: 1, profile: 1 }) ? location.hash.slice(1) : 'learn';

function renderTop() {
  const st = S.streak, active = st.last === today();
  $('#topbar').innerHTML = `
    <div class="logo">${LOGO}STOA</div>
    <div class="stats">
      ${st.shields ? `<div class="stat shield" title="Streak shields">🛡️ ${st.shields}</div>` : ''}
      <div class="stat fire ${active ? '' : 'cold'}" title="${active ? 'Streak extended today' : 'Practise today to extend your streak'}">🔥 ${st.count}</div>
      <div class="stat coin" title="Obols (spend in the shop)">🪙 ${S.obols}</div>
    </div>`;
}
function renderNav() {
  $('#nav').innerHTML = `<div class="inner">${TABS.map(([id, ic, label]) =>
    `<button data-act="tab" data-tab="${id}" class="${tab === id ? 'on' : ''}"><span class="ic">${ic}</span>${label}</button>`).join('')}</div>`;
}
function render() {
  renderTop(); renderNav();
  const m = $('#main');
  m.innerHTML = VIEWS[tab]();
  AFTER[tab]?.();
}
function go(t) { tab = t; history.replaceState(null, '', '#' + t); render(); scrollTo(0, 0); }

/* ---------------- overlay helpers ---------------- */
const ov = $('#overlay');
function openOv(html) { ov.innerHTML = html; ov.hidden = false; document.body.style.overflow = 'hidden'; ov.scrollTop = 0; }
function closeOv() { ov.hidden = true; ov.innerHTML = ''; document.body.style.overflow = ''; L = null; FLOW = null; render(); }
function confirmBox(msg, yes = 'Yes', no = 'Cancel') {
  return new Promise(res => {
    const el = document.createElement('div');
    el.className = 'pop-backdrop';
    el.innerHTML = `<div class="pop"><h3 style="margin-bottom:10px">${esc(msg)}</h3><div class="row" style="margin-top:20px"><button class="btn ghost block" data-r="0">${esc(no)}</button><button class="btn red block" data-r="1">${esc(yes)}</button></div></div>`;
    el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b || e.target === el) { el.remove(); res(b?.dataset.r === '1'); } });
    document.body.appendChild(el);
  });
}

/* =========================================================
   VIEW: LEARN (path)
   ========================================================= */
function lessonState(idx) {
  const l = ALL_LESSONS[idx];
  if (S.completed[l.id]) return 'done';
  if (S.settings.unlockAll || idx === 0 || S.completed[ALL_LESSONS[idx - 1].id]) return 'open';
  return 'locked';
}
function currentLessonIdx() { const i = ALL_LESSONS.findIndex((l, i) => lessonState(i) === 'open'); return i; }

function reviewPool() {
  const keys = Object.keys(S.mistakes);
  const mist = keys.map(k => getItem(k)).filter(Boolean);
  return mist;
}
function getItem(key) {
  const [lid, i] = key.split(':');
  const l = LESSON_BY_ID[lid];
  const it = l?.items[+i];
  return it ? { ...it, key, lessonId: lid } : null;
}

const VIEWS = {};
const AFTER = {};

VIEWS.learn = () => {
  const cur = currentLessonIdx();
  const mistakes = Object.keys(S.mistakes).length;
  const doneCount = lessonsDone();
  const offsets = [0, 54, 80, 54, 0, -54, -80, -54];
  let gi = 0;
  const motive = S.motive && MOTIVES[S.motive];
  let html = '';
  if (doneCount > 0) {
    html += `<div class="card practice-card">
      <div class="ic">🔁</div>
      <div class="spacer"><h3 style="font-size:20px;margin:0">Practice</h3>
      <div class="muted small">${mistakes ? `${mistakes} item${mistakes > 1 ? 's' : ''} to strengthen, plus a mixed review` : 'A mixed review of what you\'ve learned'}</div></div>
      <button class="btn olive sm" data-act="review">Go</button></div>`;
  } else if (motive) {
    html += `<div class="card"><div class="tiny">Because you came for ${esc(motive.label.toLowerCase())}</div><div style="margin-top:6px">${esc(motive.tip)}</div></div>`;
  }
  UNITS.forEach((u, ui) => {
    const done = u.lessons.filter(l => S.completed[l.id]).length;
    html += `<section class="unit">
      <div class="unit-banner" style="background:${u.color}">
        <div class="big-ic">${u.icon}</div>
        <div class="tiny">Unit ${ui + 1}</div>
        <h2>${esc(u.title)}</h2>
        <div class="sub">${esc(u.sub)}</div>
        <div class="prog"><div style="width:${done / u.lessons.length * 100}%"></div></div>
      </div>
      <div class="path">`;
    u.lessons.forEach(l => {
      const st = lessonState(gi);
      const isCur = gi === cur;
      const off = offsets[gi % offsets.length];
      html += `<div class="node-wrap" style="transform:translateX(${off}px)">
        ${isCur ? `<div class="start-bubble" style="--c:${u.color}">${doneCount === 0 ? 'START' : 'NEXT'}</div>` : ''}
        <button class="node ${st === 'locked' ? 'locked' : st} ${isCur ? 'current' : ''}" style="--c:${u.color}" data-act="node" data-id="${l.id}"><span>${l.icon}</span></button>
        <div class="node-label">${esc(l.title)}</div>
      </div>`;
      gi++;
    });
    html += `</div></section>`;
  });
  html += `<div class="path-end"><div class="big">☀️</div><h3>The path continues in life.</h3><p class="muted">"Waste no more time arguing about what a good man should be. Be one."</p></div>`;
  return html;
};
AFTER.learn = () => {
  const c = $('.node.current');
  if (c && !AFTER.learn.scrolled) { AFTER.learn.scrolled = true; setTimeout(() => c.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120); }
};

function nodePopover(id) {
  const idx = ALL_LESSONS.findIndex(l => l.id === id);
  const l = ALL_LESSONS[idx], st = lessonState(idx), c = S.completed[id];
  const n = l.items.filter(i => i.t !== 'learn').length;
  const el = document.createElement('div');
  el.className = 'pop-backdrop';
  el.innerHTML = `<div class="pop">
    <div class="tiny" style="color:${l.unit.color}">${esc(l.unit.title)}</div>
    <h3>${l.icon} ${esc(l.title)}</h3>
    <p class="muted" style="margin:6px 0 18px">${st === 'locked' ? '🔒 Complete the previous lesson to unlock this one.' :
      c ? `Completed ${c.times}× · best accuracy ${c.best}%` : `${n} exercises · about ${Math.ceil(l.items.length * .6)} min`}</p>
    ${st === 'locked' ? `<button class="btn ghost block" data-close>OK</button>` :
      `<button class="btn block" style="background:${l.unit.color};box-shadow:0 4px 0 color-mix(in srgb,${l.unit.color} 60%,#000)" data-start>${c ? 'Practise again · +XP' : 'Start lesson'}</button>`}
  </div>`;
  el.addEventListener('click', e => {
    if (e.target.closest('[data-start]')) { el.remove(); startLesson(id); }
    else if (e.target === el || e.target.closest('[data-close]')) el.remove();
  });
  document.body.appendChild(el);
}

/* =========================================================
   LESSON ENGINE
   ========================================================= */
let L = null;

function startLesson(id) {
  const l = LESSON_BY_ID[id];
  L = {
    mode: 'lesson', lesson: l, title: l.title, color: l.unit.color,
    queue: l.items.map((it, i) => ({ ...it, key: `${id}:${i}` })),
    idx: 0, graded: 0, firstRight: 0, retried: new Set(), wrongKeys: new Set(), reflections: 0, start: Date.now()
  };
  L.total = L.queue.length;
  openOv('<div class="ov" id="lesson"></div>');
  renderStep();
}
function startReview() {
  const mist = shuffle(reviewPool()).slice(0, 6);
  const doneIds = Object.keys(S.completed).filter(k => LESSON_BY_ID[k]);
  const pool = shuffle(doneIds.flatMap(id => LESSON_BY_ID[id].items.map((it, i) => ({ ...it, key: `${id}:${i}`, lessonId: id })))
    .filter(it => !['learn', 'reflect'].includes(it.t) && !S.mistakes[it.key]));
  const queue = [...mist, ...pool.slice(0, Math.max(3, 8 - mist.length))];
  if (!queue.length) { toast('📜', 'Nothing to review yet', 'Complete a lesson first.'); return; }
  L = {
    mode: 'review', title: 'Practice', color: '#5f7a4a',
    queue: shuffle(queue), idx: 0, graded: 0, firstRight: 0, retried: new Set(), wrongKeys: new Set(), reflections: 0, start: Date.now()
  };
  L.total = L.queue.length;
  openOv('<div class="ov" id="lesson"></div>');
  renderStep();
}

function stepShell(inner, foot) {
  const pct = Math.min(100, L.idx / L.total * 100);
  return `<div class="ov-top"><button class="x" data-act="quitLesson" aria-label="Quit">✕</button><div class="pbar"><div style="width:${pct}%"></div></div></div>
    <div class="ov-body">${inner}</div>
    <div class="ov-foot" id="foot"><div class="inner">${foot}</div></div>`;
}
const checkBtn = (label = 'Check') => `<button class="btn olive block" id="checkBtn" data-act="check" disabled>${label}</button>`;
const kicker = (ic, t) => `<div class="q-kicker">${ic} ${t}</div>`;

function renderStep() {
  const it = L.queue[L.idx];
  L.cur = { it, sel: null, done: false };
  const root = $('#lesson');
  let inner = '', foot = checkBtn();
  switch (it.t) {
    case 'learn':
      inner = `<div class="learn"><div class="scroll-ic">📜</div><h2>${esc(it.title)}</h2><div class="body">${it.body}</div>
        ${it.quote ? `<div class="qbox"><div class="quote">${esc(it.quote)}</div><div class="by">${esc(it.by)}</div></div>` : ''}</div>`;
      foot = `<button class="btn block" data-act="next">Continue</button>`;
      break;
    case 'mc': {
      L.cur.order = it.noShuffle ? it.options.map((_, i) => i) : shuffle(it.options.map((_, i) => i));
      inner = `${kicker('🦉', 'Choose the answer')}<div class="q-title">${esc(it.q)}</div>
        <div class="opts">${L.cur.order.map((oi, k) => `<button class="opt" data-act="opt" data-i="${oi}"><span class="k">${k + 1}</span>${esc(it.options[oi])}</button>`).join('')}</div>`;
      break;
    }
    case 'fill': {
      L.cur.order = shuffle(it.options.map((_, i) => i));
      inner = `${kicker('🖋️', 'Complete the quote')}
        <div class="fill-text">${esc(it.text).replace('___', '<span class="blank" id="blank">&nbsp;</span>')}
        <div class="by" style="font-style:normal">— ${esc(it.by)}</div></div>
        <div class="word-bank">${L.cur.order.map(oi => `<button class="word" data-act="fillw" data-i="${oi}">${esc(it.options[oi])}</button>`).join('')}</div>`;
      break;
    }
    case 'scenario': {
      L.cur.order = shuffle(it.options.map((_, i) => i));
      inner = `${kicker('🎭', 'What would a Stoic do?')}
        <div class="scenario-box"><span class="ic">💭</span><span>${esc(it.situation)}</span></div>
        <div class="opts">${L.cur.order.map((oi, k) => `<button class="opt" data-act="opt" data-i="${oi}"><span class="k">${k + 1}</span>${esc(it.options[oi][0])}</button>`).join('')}</div>`;
      break;
    }
    case 'order': {
      const toks = [...it.answer.split(' '), ...it.extra];
      L.cur.tokens = shuffle(toks.map((w, i) => ({ w, i })));
      L.cur.picked = [];
      inner = `${kicker('🧩', 'Assemble the quote')}<div class="q-title" style="font-size:20px">Tap the words in order. <span class="muted">(${esc(it.by)})</span></div>
        <div class="answer-line" id="aline"></div>
        <div class="word-bank" id="bank">${L.cur.tokens.map((t, k) => `<button class="word" data-act="ordw" data-k="${k}">${esc(t.w)}</button>`).join('')}</div>`;
      break;
    }
    case 'match': {
      L.cur.left = shuffle(it.pairs.map((_, i) => i));
      L.cur.right = shuffle(it.pairs.map((_, i) => i));
      L.cur.ms = { l: null, r: null, matched: new Set(), errs: 0 };
      inner = `${kicker('🔗', 'Match the pairs')}<div class="q-title">${esc(it.q)}</div>
        <div class="match-grid"><div class="col">${L.cur.left.map(i => `<button class="mitem" data-act="mt" data-side="l" data-i="${i}">${esc(it.pairs[i][0])}</button>`).join('')}</div>
        <div class="col">${L.cur.right.map(i => `<button class="mitem" data-act="mt" data-side="r" data-i="${i}">${esc(it.pairs[i][1])}</button>`).join('')}</div></div>`;
      foot = `<button class="btn olive block" disabled>Match all pairs</button>`;
      break;
    }
    case 'sort': {
      L.cur.items = shuffle(it.items);
      L.cur.si = 0; L.cur.serr = 0; L.cur.busy = false;
      inner = `${kicker('⚖️', 'Sort quickly')}<div class="q-title">${esc(it.q)}</div>
        <div class="sort-stage"><div class="sort-count" id="scount"></div><div class="sort-card" id="scard"></div><div class="sort-tip" id="stip"></div>
        <div class="sort-btns"><button class="btn olive" data-act="sortb" data-v="0">← ${esc(it.labels[0])}</button><button class="btn ghost" data-act="sortb" data-v="1">${esc(it.labels[1])} →</button></div></div>`;
      foot = `<div class="center muted small">Use ← / → keys or tap the buttons</div>`;
      break;
    }
    case 'reflect':
      inner = `${kicker('🪶', 'Reflect, no wrong answers')}<div class="q-title">${esc(it.prompt)}</div>
        <textarea id="refl" placeholder="Write honestly, it's just for you…"></textarea>
        <p class="muted small">💡 ${esc(it.hint || '')} <br>Saved privately to your journal on this device.</p>`;
      foot = `<div class="row"><button class="btn ghost" data-act="skipRefl">Skip</button><button class="btn olive block" id="checkBtn" data-act="check" disabled>Save to journal</button></div>`;
      break;
  }
  root.innerHTML = stepShell(inner, foot);
  if (it.t === 'sort') renderSortCard();
  if (it.t === 'reflect') {
    const ta = $('#refl');
    ta.addEventListener('input', () => { $('#checkBtn').disabled = ta.value.trim().length < 8; });
    setTimeout(() => ta.focus(), 250);
  }
  ov.scrollTop = 0;
}

function enableCheck(on = true) { const b = $('#checkBtn'); if (b) b.disabled = !on; }

function selectOpt(i) {
  if (L.cur.done) return;
  sfx.tap();
  L.cur.sel = +i;
  $$('.opt').forEach(b => b.classList.toggle('sel', +b.dataset.i === +i));
  enableCheck();
}
function selectFill(i) {
  if (L.cur.done) return;
  sfx.tap();
  L.cur.sel = +i;
  const b = $('#blank'); b.textContent = L.cur.it.options[i]; b.classList.add('filled');
  $$('.word').forEach(w => w.classList.toggle('sel', +w.dataset.i === +i));
  enableCheck();
}
function orderTap(k) {
  if (L.cur.done) return;
  sfx.tap();
  k = +k;
  const p = L.cur.picked;
  const at = p.indexOf(k);
  if (at >= 0) p.splice(at, 1); else p.push(k);
  $('#aline').innerHTML = p.map(kk => `<button class="word" data-act="ordw" data-k="${kk}">${esc(L.cur.tokens[kk].w)}</button>`).join('');
  $$('#bank .word').forEach(w => w.classList.toggle('used', p.includes(+w.dataset.k)));
  enableCheck(p.length > 0);
}
function matchTap(el) {
  const ms = L.cur.ms, side = el.dataset.side, i = +el.dataset.i;
  if (ms.matched.has(i) && el.classList.contains('done')) return;
  sfx.tap();
  $$(`.mitem[data-side="${side}"]`).forEach(b => b.classList.remove('sel'));
  ms[side] = i; el.classList.add('sel');
  if (ms.l !== null && ms.r !== null) {
    const lEl = $(`.mitem[data-side="l"][data-i="${ms.l}"]`), rEl = $(`.mitem[data-side="r"][data-i="${ms.r}"]`);
    if (ms.l === ms.r) {
      sfx.match();
      ms.matched.add(ms.l);
      [lEl, rEl].forEach(b => { b.classList.remove('sel'); b.classList.add('done'); });
      if (ms.matched.size === L.cur.it.pairs.length) {
        const ok = ms.errs <= 1;
        setTimeout(() => showFeedback(ok, ok ? (ms.errs ? 'One slip, but well matched.' : 'Every pair matched first time.') : `${ms.errs} mismatches. These will come back in practice.`), 250);
      }
    } else {
      sfx.bad(); ms.errs++;
      [lEl, rEl].forEach(b => { b.classList.remove('sel'); b.classList.add('err'); setTimeout(() => b.classList.remove('err'), 450); });
    }
    ms.l = ms.r = null;
  }
}
function renderSortCard() {
  const c = L.cur;
  if (c.si >= c.items.length) {
    const ok = c.serr === 0;
    showFeedback(ok || c.serr === 1, ok ? 'All sorted correctly.' : `${c.serr} misplaced. Look at what is fully in your own mind and choices.`);
    return;
  }
  $('#scount').textContent = `${c.si + 1} / ${c.items.length}`;
  const card = $('#scard');
  card.className = 'sort-card'; void card.offsetWidth; card.className = 'sort-card';
  card.textContent = c.items[c.si][0];
  $('#stip').textContent = '';
}
function sortPick(v) {
  const c = L.cur;
  if (c.busy || c.si >= c.items.length) return;
  c.busy = true;
  const [, ans] = c.items[c.si];
  const card = $('#scard');
  if (+v === ans) {
    sfx.ok();
    card.classList.add('ok');
    setTimeout(() => { card.classList.add(+v === 0 ? 'fly-l' : 'fly-r'); }, 160);
    setTimeout(() => { c.si++; c.busy = false; renderSortCard(); }, 480);
  } else {
    sfx.bad(); c.serr++;
    card.classList.add('no');
    $('#stip').textContent = `→ ${c.it.labels[ans]}`;
    setTimeout(() => { c.si++; c.busy = false; renderSortCard(); }, 1300);
  }
}

function doCheck() {
  const c = L.cur, it = c.it;
  if (c.done) return;
  let ok = false, msg = '';
  if (it.t === 'mc') {
    ok = c.sel === it.a;
    msg = (ok ? '' : `Answer: <b>${esc(it.options[it.a])}</b>. `) + esc(it.why || '');
    markOpts(it.a);
  } else if (it.t === 'fill') {
    ok = c.sel === it.a;
    msg = (ok ? '' : `Answer: <b>${esc(it.options[it.a])}</b>. `) + esc(it.why || '');
    $$('.word').forEach(w => { if (+w.dataset.i === it.a) w.style.borderColor = 'var(--olive)'; });
  } else if (it.t === 'scenario') {
    const o = it.options[c.sel];
    ok = o[1];
    msg = esc(o[2]);
    if (!ok) { const best = it.options.find(x => x[1]); msg += `<br><br>Better: <b>${esc(best[0])}</b>`; }
    markOpts(it.options.findIndex(x => x[1]));
  } else if (it.t === 'order') {
    const got = c.picked.map(k => c.tokens[k].w).join(' ');
    ok = norm(got) === norm(it.answer);
    msg = `<i>"${esc(it.answer)}"</i> (${esc(it.by)})`;
  } else if (it.t === 'reflect') {
    const text = $('#refl').value.trim();
    addJournal('lesson', L.title, [{ q: it.prompt, a: text }]);
    L.reflections++;
    ok = true; msg = 'Saved to your journal. +3 bonus XP for honest reflection.';
    showFeedback(true, msg, '✍️ Well written');
    return;
  }
  showFeedback(ok, msg);
}
function markOpts(rightIdx) {
  const c = L.cur;
  $('.opts')?.classList.add('locked');
  $$('.opt').forEach(b => {
    b.disabled = true;
    const i = +b.dataset.i;
    if (i === rightIdx) b.classList.add('right');
    else if (i === c.sel) b.classList.add('wrong');
  });
}
const PRAISE = ['Well reasoned!', 'Excellent!', 'Wise!', 'Correct!', 'Marcus would approve.', 'Sound judgment!', 'Exactly!'];
const COMFORT = ['Not quite.', 'Not quite: a chance to learn.', 'Close. Try to see it clearly.'];
function showFeedback(ok, msg, title) {
  const c = L.cur, it = c.it;
  c.done = true;
  const graded = it.t !== 'reflect';
  if (graded) {
    if (!L.retried.has(it.key)) { L.graded++; if (ok) L.firstRight++; }
    if (ok) {
      if (L.mode === 'review' && S.mistakes[it.key]) delete S.mistakes[it.key];
    } else {
      S.mistakes[it.key] = { n: (S.mistakes[it.key]?.n || 0) + 1, last: today() };
      L.wrongKeys.add(it.key);
      // re-queue the same item once (not for match/sort)
      if (!L.retried.has(it.key) && !['match', 'sort'].includes(it.t)) {
        L.retried.add(it.key);
        L.queue.push({ ...it });
        L.total++;
      }
    }
    save();
  }
  ok ? sfx.ok() : sfx.bad();
  const foot = $('#foot');
  foot.className = 'ov-foot ' + (ok ? 'ok' : 'bad');
  foot.innerHTML = `<div class="inner"><div class="fb-title">${ok ? '✅' : '🌱'} ${esc(title || (ok ? pick(PRAISE) : pick(COMFORT)))}</div>
    ${msg ? `<div class="fb-text">${msg}</div>` : ''}
    <button class="btn ${ok ? 'olive' : 'red'} block" data-act="next" id="nextBtn">Continue</button></div>`;
  const pb = $('.pbar > div'); if (pb) pb.style.width = Math.min(100, (L.idx + 1) / L.total * 100) + '%';
  setTimeout(() => $('#nextBtn')?.focus({ preventScroll: true }), 50);
}
function nextStep() {
  L.idx++;
  if (L.idx >= L.queue.length) return finishLesson();
  renderStep();
}
function finishLesson() {
  const acc = L.graded ? Math.round(L.firstRight / L.graded * 100) : 100;
  const perfect = L.graded > 0 && L.firstRight === L.graded;
  const secs = Math.round((Date.now() - L.start) / 1000);
  let xp, ob;
  if (L.mode === 'lesson') {
    xp = 10 + L.firstRight + (perfect ? 5 : 0) + L.reflections * 3;
    ob = 5 + (perfect ? 5 : 0);
    const id = L.lesson.id;
    const prev = S.completed[id];
    const first = !prev;
    if (!first) xp = Math.round(xp * .6);
    S.completed[id] = { times: (prev?.times || 0) + 1, best: Math.max(prev?.best || 0, acc), last: today() };
    day().lessons = (day().lessons || 0) + 1;
    if (perfect) S.counts.perfect++;
  } else {
    xp = 5 + L.firstRight; ob = 3;
    S.counts.review++;
    day().lessons = (day().lessons || 0) + 1;
  }
  gain(xp, ob);
  const [qt, qb] = pick(QUOTES);
  const unitDone = L.mode === 'lesson' && L.lesson.unit.lessons.every(l => S.completed[l.id]);
  $('#lesson').innerHTML = `<div class="ov-body complete">
      <div class="laurel">${unitDone ? '🏆' : perfect ? '💎' : '🌿'}</div>
      <h1>${unitDone ? 'Unit complete!' : perfect ? 'Flawless!' : L.mode === 'review' ? 'Practice complete!' : 'Lesson complete!'}</h1>
      ${unitDone ? `<p class="muted">You finished <b>${esc(L.lesson.unit.title)}</b>.</p>` : ''}
      <div class="tiles">
        <div class="tile" style="--tc:var(--gold)"><div class="tl">XP</div><div class="tv">+${xp}</div></div>
        <div class="tile" style="--tc:var(--olive)"><div class="tl">Accuracy</div><div class="tv">${acc}%</div></div>
        <div class="tile" style="--tc:var(--sky)"><div class="tl">Time</div><div class="tv">${Math.floor(secs / 60)}:${pad(secs % 60)}</div></div>
      </div>
      <p class="muted small">🪙 +${ob} obols${L.wrongKeys.size ? ` · ${L.wrongKeys.size} item${L.wrongKeys.size > 1 ? 's' : ''} saved for Practice` : ''}</p>
      <div class="card" style="text-align:left;margin-top:20px"><div class="quote" style="font-size:20px">${esc(qt)}</div><div class="by">${esc(qb)}</div></div>
    </div>
    <div class="ov-foot"><div class="inner"><button class="btn block" data-act="closeOv">Continue</button></div></div>`;
  sfx.done(); confetti();
}

/* =========================================================
   VIEW: TODAY
   ========================================================= */
function qotd() { const i = hash('q' + today()) % QUOTES.length; return QUOTES[i]; }
function challengeToday() {
  const d = day(); const i = (hash('c' + today()) + (d.chSwap || 0)) % CHALLENGES.length;
  return CHALLENGES[i];
}
function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Still up' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
function ring(pct, size = 74, stroke = 9, color = 'var(--terra)') {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(--bg2)" stroke-width="${stroke}" fill="none"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="${stroke}" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, pct))}" style="transition:stroke-dashoffset .6s"/></svg>`;
}
VIEWS.today = () => {
  const d = day(), goal = S.settings.goal, [qt, qb, qs] = qotd();
  const ch = challengeToday();
  const fav = S.favs.includes(qt);
  const h = new Date().getHours();
  const week = Array.from({ length: 7 }, (_, i) => addDays(today(), i - 6));
  const rituals = [
    { id: 'morning', icon: '🌅', title: 'Morning Preparation', sub: d.morning ? `Intention: "${d.intention || 'set'}"` : 'Premeditatio: anticipate the day, choose a virtue', xp: 15 },
    { id: 'evening', icon: '🌙', title: 'Evening Review', sub: d.evening ? 'Reviewed. Rest well.' : 'Seneca\'s three questions before sleep', xp: 15 }
  ];
  if (h >= 17) rituals.reverse();
  return `
  <div class="hello" style="margin:4px 4px 18px"><div class="tiny">${fmtDate(today())}</div><h1>${greeting()}${S.name ? ', ' + esc(S.name) : ''}.</h1></div>

  <div class="card qotd"><button class="fav" data-act="fav" data-q="${esc(qt)}" title="Save quote">${fav ? '❤️' : '🤍'}</button>
    <div class="tiny" style="color:inherit;opacity:.6">Today's meditation</div>
    <div class="quote" style="margin-top:8px;padding-right:20px">${esc(qt)}</div><div class="by">${esc(qb)}${qs ? ' · ' + esc(qs) : ''}</div></div>

  <div class="card goal"><div class="ring">${ring(d.xp / goal)}<div class="rv">${Math.min(d.xp, 999)}/${goal}</div></div>
    <div><h3 style="font-size:20px">${d.xp >= goal ? 'Daily goal reached 🌿' : 'Daily goal'}</h3>
    <div class="muted small">${d.xp >= goal ? 'Anything more is extra. Remember temperance.' : `Earn ${goal - d.xp} more XP: a lesson, a ritual, or today's challenge.`}</div></div></div>

  <div class="section-title">Daily rituals</div>
  ${rituals.map(r => `<div class="card ritual ${d[r.id] ? 'done' : ''}" data-act="${r.id}">
    <div class="ic">${r.icon}</div><div class="spacer"><h3>${r.title}</h3><div class="muted small">${esc(r.sub)}</div></div>
    ${d[r.id] ? '<div class="done-badge">✅</div>' : `<div class="virtue-tag">+${r.xp} XP</div>`}</div>`).join('')}

  <div class="section-title">Today's challenge</div>
  <div class="card challenge-card">
    <div class="row" style="align-items:flex-start"><div class="big-ic">${ch.icon}</div>
    <div class="spacer"><span class="virtue-tag">${VIRTUES[ch.virtue].icon} ${ch.virtue}</span><h3 style="margin-top:6px">${esc(ch.title)}</h3></div></div>
    <p style="font-size:16.5px;margin:10px 0">${esc(ch.desc)}</p>
    <p class="muted small" style="margin:0 0 14px">📜 ${esc(ch.src)}</p>
    ${d.challenge ? `<div class="row"><b style="color:var(--olive)">✅ Completed. Well done.</b></div>` :
      `<div class="row"><button class="btn block" data-act="chDone">I did it · +20 XP</button>${(d.chSwap || 0) < 2 ? `<button class="btn ghost" data-act="chSwap" title="Swap challenge">🔀</button>` : ''}</div>`}
  </div>

  <div class="section-title">This week</div>
  <div class="card"><div class="week">${week.map(w => {
    const dd = S.days[w], on = dd && dd.xp > 0;
    return `<div class="d">${parseD(w).toLocaleDateString(undefined, { weekday: 'narrow' })}<div class="dot ${on ? 'on' : ''} ${w === today() ? 'today' : ''}">${on ? '🔥' : dd?.shield ? '🛡️' : ''}</div></div>`;
  }).join('')}</div></div>

  <div class="card row" data-act="tab" data-tab="citadel" style="cursor:pointer"><div style="font-size:34px">🏰</div><div class="spacer"><b>Feeling disturbed?</b><div class="muted small">Retreat to the Citadel for a 3-minute reset.</div></div><div>→</div></div>
  `;
};

/* ---------------- multi-step flows ---------------- */
let FLOW = null;
function runFlow(f) {
  FLOW = { ...f, i: 0, data: {} };
  openOv('<div class="ov" id="flow"></div>');
  renderFlow();
}
function renderFlow() {
  const f = FLOW, s = f.steps[f.i];
  const pct = f.i / f.steps.length * 100;
  const html = typeof s.html === 'function' ? s.html(f.data) : s.html;
  $('#flow').innerHTML = `<div class="ov-top"><button class="x" data-act="quitFlow">✕</button><div class="pbar"><div style="width:${pct}%;background:${f.color || 'var(--olive)'}"></div></div></div>
    <div class="ov-body flow">${html}</div>
    <div class="ov-foot"><div class="inner"><div class="row">
      ${f.i > 0 && !s.noBack ? '<button class="btn ghost" data-act="flowBack">←</button>' : ''}
      <button class="btn block ${f.btnClass || ''}" id="flowNext" data-act="flowNext">${s.btn || (f.i === f.steps.length - 1 ? 'Finish' : 'Continue')}</button></div></div></div>`;
  // restore values
  $$('#flow [data-k]').forEach(el => {
    const k = el.dataset.k;
    if (f.data[k] != null && 'value' in el) el.value = f.data[k];
    el.addEventListener('input', () => { f.data[k] = el.value; validateFlow(); });
  });
  s.mount?.(f.data);
  validateFlow();
  ov.scrollTop = 0;
  const first = $('#flow textarea, #flow input[type=text]');
  if (first && matchMedia('(pointer:fine)').matches) setTimeout(() => first.focus(), 200);
}
function validateFlow() {
  const s = FLOW.steps[FLOW.i];
  const b = $('#flowNext');
  if (b) b.disabled = s.valid ? !s.valid(FLOW.data) : false;
}
function flowNext() {
  const f = FLOW, s = f.steps[f.i];
  if (s.valid && !s.valid(f.data)) return;
  sfx.tap();
  if (f.i < f.steps.length - 1) { f.i++; renderFlow(); }
  else { f.finish(f.data); }
}
const ta = (k, ph, rows = 5) => `<textarea data-k="${k}" rows="${rows}" placeholder="${esc(ph)}"></textarea>`;
const filled = (...ks) => d => ks.every(k => (d[k] || '').trim().length > 1);

function finishScreen(icon, title, sub, xp) {
  sfx.done(); confetti();
  $('#flow').innerHTML = `<div class="ov-body complete"><div class="laurel">${icon}</div><h1>${esc(title)}</h1>
    <p class="muted" style="font-size:17px">${sub}</p>
    ${xp ? `<div class="tiles" style="grid-template-columns:1fr;max-width:160px;margin:20px auto"><div class="tile"><div class="tl">XP</div><div class="tv">+${xp}</div></div></div>` : ''}</div>
    <div class="ov-foot"><div class="inner"><button class="btn block" data-act="closeOv">Done</button></div></div>`;
}

function morningFlow() {
  const d = day();
  if (d.morning) { toast('🌅', 'Already prepared today', `Intention: "${d.intention}"`); return; }
  runFlow({
    color: 'var(--gold)',
    steps: [
      { html: `<div class="scroll-ic">🌅</div><h2>Morning Preparation</h2><p class="lead">Before the day starts, Marcus Aurelius reminded himself what was coming. Read slowly.</p>
          <div class="card"><div class="quote" style="font-size:20px">Begin the morning by saying to yourself: I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil… I can neither be harmed by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him. For we are made for cooperation.</div><div class="by">Meditations 2.1</div></div>`, btn: 'Begin' },
      { html: `<h2>What lies ahead?</h2><p class="lead">What's on today? Meetings, people, tasks, temptations.</p>${ta('ahead', 'e.g. Team meeting at 10, gym, dinner with my sister…')}`, valid: filled('ahead') },
      { html: `<h2>Premeditatio malorum</h2><p class="lead">What might go wrong or test you today? How will your best self respond?</p>${ta('malorum', 'e.g. My manager might criticise the report. I\'ll listen calmly, take what\'s useful, and not take it personally.')}`, valid: filled('malorum') },
      {
        html: d2 => `<h2>Choose your virtue</h2><p class="lead">Which virtue will you practise most today?</p>
          <div class="virtues">${Object.entries(VIRTUES).map(([v, o]) => `<button class="vcard ${d2.virtue === v ? 'sel' : ''}" data-act="pickVirtue" data-v="${v}"><div class="vi">${o.icon}</div><b>${v}</b><span>${o.hint}</span></button>`).join('')}</div>`,
        valid: d2 => !!d2.virtue
      },
      { html: d2 => `<h2>Set your intention</h2><p class="lead">One concrete action for <b>${d2.virtue}</b> today.</p>
          <div class="card" style="font-size:18px">Today I will…<br><input type="text" data-k="intention" placeholder="e.g. listen fully before responding" style="margin:10px 0"><span class="muted">…fate permitting.</span></div>`, valid: filled('intention'), btn: 'Seal the intention' }
    ],
    finish: dt => {
      const dd = day();
      dd.morning = true; dd.intention = dt.intention.trim(); dd.virtue = dt.virtue;
      S.counts.morning++;
      addJournal('morning', 'Morning Preparation', [
        { q: 'What lies ahead?', a: dt.ahead }, { q: 'What might go wrong & how I\'ll respond', a: dt.malorum },
        { q: 'Virtue of the day', a: dt.virtue }, { q: 'Intention', a: `Today I will ${dt.intention}, fate permitting.` }
      ]);
      gain(15, 3);
      finishScreen('🌅', 'You are prepared.', `${VIRTUES[dt.virtue].icon} <b>${dt.virtue}</b>: "${esc(dt.intention)}"<br><br>Come back tonight for your Evening Review.`, 15);
    }
  });
}

function eveningFlow() {
  const d = day();
  if (d.evening) { toast('🌙', 'Already reviewed today', 'Rest well. "Let us say: I have lived."'); return; }
  const steps = [
    { html: `<div class="scroll-ic">🕯️</div><h2>Evening Review</h2><p class="lead">Each night, once the lamp was out, Seneca examined his whole day. He was honest about it and he did not beat himself up.</p>
        <div class="card"><div class="quote" style="font-size:20px">When the light has been removed and my wife has fallen silent, aware of this habit of mine, I examine my entire day and go back over what I've done and said, hiding nothing from myself, passing nothing by.</div><div class="by">Seneca, On Anger 3.36</div></div>`, btn: 'Begin' }
  ];
  if (d.intention) steps.push({
    html: d2 => `<h2>Your intention</h2><p class="lead">This morning you chose <b>${VIRTUES[d.virtue]?.icon || ''} ${esc(d.virtue || '')}</b>:</p>
      <div class="card quote" style="font-size:21px">Today I will ${esc(d.intention)}.</div><p class="lead">How did it go?</p>
      <div class="opts">${[['lived', '🌿 I lived it'], ['partly', '🌗 Partly'], ['missed', '🍂 I missed it']].map(([k, l]) => `<button class="opt ${d2.kept === k ? 'sel' : ''}" data-act="pickKept" data-v="${k}">${l}</button>`).join('')}</div>`,
    valid: d2 => !!d2.kept
  });
  steps.push(
    { html: `<h2>What did I do well?</h2><p class="lead">Name the moments you acted with virtue, however small.</p>${ta('well', 'e.g. I stayed patient when the train was late…')}`, valid: filled('well') },
    { html: `<h2>Where did I fall short?</h2><p class="lead">"What bad habit did I resist? Where did I fail?" Be honest and kind, like a good coach.</p>${ta('short', 'e.g. I snapped at my brother over something trivial…')}`, valid: filled('short') },
    { html: `<h2>What will I do better?</h2><p class="lead">Seneca: "See that you never do that again." What's the lesson?</p>${ta('better', 'e.g. Next time I feel irritated, I\'ll take ten breaths first.')}`, valid: filled('better') },
    {
      html: d2 => `<h2>Tranquility</h2><p class="lead">How calm and steady was your mind today?</p>
        <div class="rating">${['😣', '😕', '😐', '🙂', '😌'].map((e, i) => `<button class="${d2.rating === i + 1 ? 'sel' : ''}" data-act="pickRating" data-v="${i + 1}">${e}</button>`).join('')}</div>
        <p class="muted small center" style="margin-top:12px">Tracked over time on your profile.</p>`,
      valid: d2 => !!d2.rating, btn: 'Close the day'
    }
  );
  runFlow({
    color: 'var(--sky)', steps,
    finish: dt => {
      const dd = day();
      dd.evening = true; dd.rating = dt.rating; dd.kept = dt.kept;
      S.counts.evening++;
      const parts = [];
      if (dt.kept) parts.push({ q: `Intention: "${d.intention}"`, a: { lived: 'Lived it', partly: 'Partly', missed: 'Missed it' }[dt.kept] });
      parts.push({ q: 'What I did well', a: dt.well }, { q: 'Where I fell short', a: dt.short }, { q: 'What I\'ll do better', a: dt.better }, { q: 'Tranquility', a: '●'.repeat(dt.rating) + '○'.repeat(5 - dt.rating) });
      addJournal('evening', 'Evening Review', parts);
      gain(15, 3);
      finishScreen('🌙', 'The day is closed.', '"Let us go to our sleep with joy and gladness; let us say: I have lived." (Seneca, Letter 12)', 15);
    }
  });
}

function challengeDone() {
  const ch = challengeToday();
  runFlow({
    color: 'var(--terra)',
    steps: [{
      html: `<div class="scroll-ic">${ch.icon}</div><h2>${esc(ch.title)}</h2><p class="lead">How did it go? What did you notice? (optional)</p>${ta('note', 'e.g. The cold was awful for 10 seconds, then fine. Felt clear-headed all morning.')}`,
      btn: 'Complete challenge'
    }],
    finish: dt => {
      const dd = day(); dd.challenge = true;
      S.counts.challenge++;
      addJournal('challenge', `Challenge: ${ch.title}`, [{ q: ch.desc, a: (dt.note || '').trim() || '(done)' }]);
      gain(20, 5);
      finishScreen('🏟️', 'Into the arena.', `You practised <b>${ch.virtue.toLowerCase()}</b> in real life. That's what philosophy is for.`, 20);
    }
  });
}

/* =========================================================
   VIEW: CITADEL (tools)
   ========================================================= */
VIEWS.citadel = () => `
  <div class="card citadel-hero">
    <div class="tower">🏰</div>
    <h2>Retreat to the Inner Citadel</h2>
    <p>Angry, anxious, hurt or overwhelmed? Take three minutes to get your judgment back.</p>
    <button class="btn gold" data-act="citadelFlow">I'm disturbed right now</button>
  </div>
  <div class="section-title">Stoic tools</div>
  <div class="tools">
    <button class="tool" data-act="worries"><div class="ti">⚖️</div><b>Worry Sorter</b><span>Split your worries into what's up to you and what isn't.</span></button>
    <button class="tool" data-act="vfa"><div class="ti">🛰️</div><b>View From Above</b><span>A guided cosmic zoom-out, as Marcus practised it.</span></button>
    <button class="tool" data-act="mori"><div class="ti">💀</div><b>Memento Mori</b><span>Your life in weeks. A wake-up call, not a prediction.</span></button>
    <button class="tool" data-act="quotes"><div class="ti">📜</div><b>Quote Library</b><span>${QUOTES.length} lines from the masters. Save favourites.</span></button>
  </div>
  <div class="section-title">Pocket reminders</div>
  <div class="card">
    <p style="margin-top:0"><b>When insulted:</b> "It is not he who reviles you who insults you, but your opinion." (Ench. 20)</p>
    <p><b>When anxious:</b> "We suffer more often in imagination than in reality." (Seneca)</p>
    <p><b>When blocked:</b> "What stands in the way becomes the way." (Marcus)</p>
    <p style="margin-bottom:0"><b>When craving:</b> "Freedom is secured not by the fulfilling of desires, but by their removal." (Epictetus)</p>
  </div>`;

function citadelFlow() {
  runFlow({
    color: 'var(--sky)',
    steps: [
      {
        html: `<h2>First, breathe.</h2><p class="lead">Nothing needs to be decided in the next 30 seconds. Seneca: "The greatest remedy for anger is delay."</p>
          <div class="breath"><div class="breath-circle" id="bc">Breathe in</div><div class="muted" id="bcount">3 breaths</div></div>`,
        btn: 'I feel a little steadier',
        mount: () => {
          let n = 0; const bc = $('#bc'), cnt = $('#bcount');
          const cycle = () => {
            if (!bc.isConnected) return;
            bc.classList.add('in'); bc.textContent = 'Breathe in';
            setTimeout(() => { if (!bc.isConnected) return; bc.classList.remove('in'); bc.textContent = 'Breathe out'; }, 4000);
            setTimeout(() => { if (!bc.isConnected) return; n++; cnt.textContent = n >= 3 ? 'Well done. Continue when ready.' : `${3 - n} more`; if (n < 3) cycle(); }, 8000);
          };
          setTimeout(cycle, 300);
        }
      },
      { html: `<h2>What happened?</h2><p class="lead">Only the facts, as a camera would record them. No adjectives, no interpretations.</p>${ta('fact', 'e.g. My friend read my message and didn\'t reply for 6 hours.')}`, valid: filled('fact') },
      { html: `<h2>What's the story?</h2><p class="lead">What judgment are you adding? What are you telling yourself this <i>means</i>?</p>${ta('story', 'e.g. She\'s ignoring me. She doesn\'t care. I\'m always the one who tries.')}`, valid: filled('story') },
      {
        html: d => `<h2>Separate it</h2><p class="lead">"You are an impression, and not at all what you appear to be." Now divide:</p>
          <p class="tiny" style="color:var(--olive)">✋ Up to me (my judgments, my actions)</p>${ta('mine', 'e.g. How I interpret it. Whether I ask her kindly. How I spend my evening.', 3)}
          <p class="tiny" style="margin-top:14px">🌪️ Not up to me</p>${ta('notmine', 'e.g. When she replies. Her mood. Her schedule.', 3)}`,
        valid: filled('mine')
      },
      {
        html: d => `<h2>What would virtue do?</h2><p class="lead">Which virtue does this moment ask for?</p>
          <div class="virtues">${Object.entries(VIRTUES).map(([v, o]) => `<button class="vcard ${d.virtue === v ? 'sel' : ''}" data-act="pickVirtue" data-v="${v}"><div class="vi">${o.icon}</div><b>${v}</b><span>${o.hint}</span></button>`).join('')}</div>
          <p class="lead" style="margin-top:18px">One small next action:</p><input type="text" data-k="action" placeholder="e.g. Assume she's busy. Go for a walk. Check in tomorrow.">`,
        valid: d => !!d.virtue && filled('action')(d)
      }
    ],
    finish: dt => {
      S.counts.citadel++;
      day().citadel = (day().citadel || 0) + 1;
      addJournal('citadel', 'Retreat to the Citadel', [
        { q: 'What happened (facts)', a: dt.fact }, { q: 'The story I was adding', a: dt.story },
        { q: 'Up to me', a: dt.mine }, { q: 'Not up to me', a: dt.notmine || '—' }, { q: `Virtue: ${dt.virtue}. Next action`, a: dt.action }
      ]);
      gain(10, 2);
      const [q, b] = pick(CITADEL_QUOTES);
      sfx.done();
      $('#flow').innerHTML = `<div class="ov-body complete"><div class="laurel">🏰</div><h1>The citadel holds.</h1>
        <div class="card" style="text-align:left"><div class="quote" style="font-size:21px">${esc(q)}</div><div class="by">${esc(b)}</div></div>
        <div class="card" style="text-align:left"><div class="tiny">Your next action</div><div style="font-size:18px;font-weight:700;margin-top:4px">${VIRTUES[dt.virtue].icon} ${esc(dt.action)}</div></div></div>
        <div class="ov-foot"><div class="inner"><button class="btn block" data-act="closeOv">Return to the day</button></div></div>`;
    }
  });
}

/* ---- View from above ---- */
const VFA_STEPS = [
  'Get comfortable. Read each line, then close your eyes for a moment and picture it.',
  'See yourself, exactly where you are right now. Your posture. Your breath. The worry you\'re carrying.',
  'Rise slowly. See the room from the ceiling, with your body small within it.',
  'Higher. Your building, your street. People walking below, each with worries as real as yours.',
  'Your city spreads out. Thousands of lives at once: births, arguments, meals, farewells, first kisses, funerals.',
  'The whole land, then the curve of the Earth. Oceans. Weather. No borders are visible from here.',
  'The Earth shrinks to a pale blue dot. Every empire, every quarrel, every person who has ever lived: all of it, there.',
  'Now look across time. Marcus Aurelius did this exercise 1,850 years ago. Everyone he knew, everyone who worried in his day, is gone.',
  'Look back down at your worry. How large is it, from here?'
];
function vfaFlow() {
  let i = 0, raf;
  const wrap = document.createElement('div');
  wrap.className = 'vfa';
  wrap.innerHTML = `<canvas></canvas><button class="x" aria-label="Close">✕</button><div class="vprog">${VFA_STEPS.map(() => '<i></i>').join('')}<i></i></div><div class="vtext"></div><div class="vhint">Tap to continue</div>`;
  document.body.appendChild(wrap);
  const cv = $('canvas', wrap), ctx = cv.getContext('2d'), txt = $('.vtext', wrap);
  const resize = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  resize(); addEventListener('resize', resize);
  const stars = Array.from({ length: 400 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
  let zoom = 0, target = 0;
  const draw = () => {
    zoom += (target - zoom) * .02;
    const w = cv.width, h = cv.height;
    ctx.fillStyle = '#05070d'; ctx.fillRect(0, 0, w, h);
    const sv = Math.min(1, zoom / 5);
    stars.forEach(s => {
      s.z -= .0006 * (1 + zoom); if (s.z <= .02) s.z = 1;
      const px = w / 2 + s.x / s.z * w * .3, py = h / 2 + s.y / s.z * h * .3;
      ctx.fillStyle = `rgba(255,255,255,${(1 - s.z) * sv})`;
      ctx.fillRect(px, py, 2 * devicePixelRatio * (1 - s.z), 2 * devicePixelRatio * (1 - s.z));
    });
    // the "world" shrinking
    const r = Math.max(3, Math.min(w, h) * 2.2 / Math.pow(1.7, zoom));
    const g = ctx.createRadialGradient(w / 2, h / 2, r * .2, w / 2, h / 2, r);
    const tone = zoom < 4 ? ['#7a6a55', '#3c342b'] : ['#5e9bd6', '#1b3a63'];
    g.addColorStop(0, tone[0]); g.addColorStop(1, tone[1]);
    ctx.globalAlpha = Math.min(1, .25 + zoom * .12);
    ctx.beginPath(); ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  };
  draw();
  const show = () => {
    $$('.vprog i', wrap).forEach((el, k) => el.classList.toggle('on', k <= i));
    txt.style.opacity = 0;
    setTimeout(() => {
      if (i < VFA_STEPS.length) { txt.textContent = VFA_STEPS[i]; }
      else {
        txt.innerHTML = `<div style="font-style:italic">"Look down from above on the countless herds of men… and consider how many know not even your name, how many will soon forget it."</div><div style="font-size:14px;font-family:var(--sans);margin-top:14px;opacity:.7;letter-spacing:1px;text-transform:uppercase">Marcus Aurelius · Meditations 9.30</div>`;
        $('.vhint', wrap).textContent = 'Tap to return';
      }
      txt.style.opacity = 1;
    }, i === 0 ? 0 : 700);
    target = i * 1.1;
  };
  const end = (completed) => {
    cancelAnimationFrame(raf); removeEventListener('resize', resize); wrap.remove();
    if (completed) { S.counts.vfa++; gain(5, 1); toast('🛰️', 'View From Above complete', '+5 XP. Carry this perspective with you.'); render(); }
  };
  wrap.addEventListener('click', e => {
    if (e.target.closest('.x')) return end(false);
    sfx.tap();
    i++;
    if (i > VFA_STEPS.length) return end(true);
    show();
  });
  show();
}

/* ---- Memento mori ---- */
function moriFlow() {
  const draw = () => {
    const m = S.mori;
    let body;
    if (!m.birth) {
      body = `<div class="scroll-ic">💀</div><h2>Memento Mori</h2><p class="lead">See your life laid out in weeks. Each box is one week. It is a sobering exercise, and it makes the weeks you have left feel valuable.</p>
        <div class="card"><label class="tiny">Your birth date</label><input type="date" id="mb" max="${today()}" style="margin:8px 0 16px">
        <label class="tiny">Years to plan for</label><input type="number" id="ml" value="${m.life}" min="40" max="110" style="margin-top:8px"></div>
        <p class="muted small">Stored only on this device. This is not a prediction. "You could leave life right now." (Marcus)</p>`;
    } else {
      const b = parseD(m.birth), now = new Date();
      const weeksLived = Math.floor((now - b) / (7 * 864e5));
      const total = m.life * 52;
      const left = Math.max(0, total - weeksLived);
      body = `<h2>Your life in weeks</h2><p class="lead">${m.life} years × 52 weeks. Each row is a year. The red square is <b>this week</b>.</p>
        <div class="mori-stats"><div><div class="n">${weeksLived.toLocaleString()}</div><div class="l">weeks lived</div></div>
        <div><div class="n">${left.toLocaleString()}</div><div class="l">weeks ahead*</div></div>
        <div><div class="n">${Math.min(100, Math.round(weeksLived / total * 100))}%</div><div class="l">of ${m.life} yrs</div></div></div>
        <div class="card" style="padding:12px"><canvas class="mori-canvas" id="mc"></canvas></div>
        <div class="card"><p style="margin:0">That's roughly <b>${Math.floor(left / 52)} more summers</b>, <b>${left.toLocaleString()} more weekends</b>, and maybe <b>${Math.round(left / 52 * 12)} more full moons</b>.</p>
        <p class="muted" style="margin-bottom:0">What will you do with <b>this</b> week?</p></div>
        <div class="card"><div class="quote" style="font-size:20px">It is not that we have a short time to live, but that we waste a lot of it.</div><div class="by">Seneca</div></div>
        <p class="muted small">*If you live to ${m.life}. Nobody is promised that. <a href="#" data-act="moriReset">Change dates</a></p>`;
    }
    openOv(`<div class="ov"><div class="ov-top"><button class="x" data-act="closeOv">✕</button><div class="spacer"></div></div><div class="ov-body flow">${body}</div>
      ${!m.birth ? `<div class="ov-foot"><div class="inner"><button class="btn block" id="moriSave">Show my weeks</button></div></div>` : ''}</div>`);
    if (!m.birth) {
      $('#moriSave').onclick = () => {
        const v = $('#mb').value, l = +$('#ml').value || 80;
        if (!v) { toast('📅', 'Pick your birth date first'); return; }
        S.mori = { birth: v, life: Math.min(110, Math.max(40, l)) }; save(); checkAchievements(); draw();
      };
    } else {
      const cv = $('#mc'), years = m.life;
      const cell = 6, gap = 2, W = 52 * (cell + gap), H = years * (cell + gap);
      const dpr = devicePixelRatio || 1;
      cv.width = W * dpr; cv.height = H * dpr;
      const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
      const lived = Math.floor((new Date() - parseD(m.birth)) / (7 * 864e5));
      const css = getComputedStyle(document.documentElement);
      const ink = css.getPropertyValue('--ink').trim(), line = css.getPropertyValue('--line').trim();
      for (let y = 0; y < years; y++) for (let x = 0; x < 52; x++) {
        const k = y * 52 + x;
        ctx.fillStyle = k < lived ? ink : k === lived ? '#c0473a' : line;
        ctx.fillRect(x * (cell + gap), y * (cell + gap), cell, cell);
      }
    }
  };
  draw();
}

/* ---- Worry sorter ---- */
function worriesView() {
  const w = S.worries;
  const mine = w.filter(x => x.mine === true), not = w.filter(x => x.mine === false), uns = w.filter(x => x.mine == null);
  const item = x => `<div class="worry ${x.mine === true ? 'mine' : x.mine === false ? 'notmine' : ''}">
    <div class="wt">${esc(x.text)}${x.mine === true ? `<div class="act">${x.action ? '→ ' + esc(x.action) : ''}</div>` : ''}</div>
    ${x.mine == null ? `<button class="btn olive sm" data-act="wSet" data-id="${x.id}" data-v="1">Mine</button><button class="btn ghost sm" data-act="wSet" data-id="${x.id}" data-v="0">Not</button>` :
      `<button class="btn ghost sm" data-act="wSet" data-id="${x.id}" data-v="">↺</button>`}
    <button class="x" style="font-size:16px;width:28px" data-act="wDel" data-id="${x.id}">✕</button></div>`;
  return `<div class="ov"><div class="ov-top"><button class="x" data-act="closeOv">✕</button><div class="spacer"></div></div>
    <div class="ov-body flow">
      <h2>Worry Sorter</h2><p class="lead">Write down what's weighing on you. Sort each one. Then put your energy only into the inner circle.</p>
      <div class="row" style="margin-bottom:16px"><input type="text" id="wIn" placeholder="Something on your mind…"><button class="btn sm" data-act="wAdd" style="padding:14px 18px">Add</button></div>
      ${uns.length ? `<div class="tiny" style="margin:8px 0">To sort</div>${uns.map(item).join('')}` : ''}
      <div class="circles"><div class="outer">Not up to me</div><div class="inner">Up to me</div>
        <div class="cn" style="top:50%;left:50%;transform:translate(-50%,-30%);color:var(--olive)">${mine.length}</div>
        <div class="cn" style="bottom:4%;left:50%;transform:translateX(-50%);color:var(--ink3)">${not.length}</div></div>
      ${mine.length ? `<div class="tiny" style="margin:8px 0;color:var(--olive)">✋ Up to me: act on these</div>${mine.map(item).join('')}` : ''}
      ${not.length ? `<div class="tiny" style="margin:18px 0 8px">🌪️ Not up to me: practise letting go</div>${not.map(item).join('')}
        <p class="muted small">"Do not seek for things to happen as you wish, but wish for things to happen as they do happen." (Ench. 8)</p>` : ''}
      ${!w.length ? `<div class="empty"><div class="big">🍃</div><p>Nothing here yet. A clear mind, or an unexamined one?</p></div>` : ''}
    </div></div>`;
}
function openWorries() {
  openOv(worriesView());
  const inp = $('#wIn');
  inp?.addEventListener('keydown', e => { if (e.key === 'Enter') addWorry(); });
}
function addWorry() {
  const v = $('#wIn').value.trim(); if (!v) return;
  S.worries.unshift({ id: uid(), text: v, mine: null }); save(); sfx.tap(); openWorries(); $('#wIn').focus();
}
async function setWorry(id, v) {
  const w = S.worries.find(x => x.id === id); if (!w) return;
  w.mine = v === '' ? null : v === '1';
  if (w.mine === true && !w.action) {
    const a = prompt('It\'s up to you. What\'s one concrete next action? (optional)');
    if (a) w.action = a.trim();
  }
  save(); sfx.tap(); openWorries();
}

/* ---- Quote library ---- */
let qFilter = 'All';
function quotesView() {
  const authors = ['All', '❤️', ...new Set(QUOTES.map(q => q[1].split(' (')[0]))];
  const list = QUOTES.filter(q => qFilter === 'All' || (qFilter === '❤️' ? S.favs.includes(q[0]) : q[1].startsWith(qFilter)));
  return `<div class="ov"><div class="ov-top"><button class="x" data-act="closeOv">✕</button><div class="spacer"></div></div>
    <div class="ov-body flow"><h2>Quote Library</h2>
    <div class="chips">${authors.map(a => `<button class="chip ${qFilter === a ? 'on' : ''}" data-act="qf" data-v="${esc(a)}">${esc(a)}</button>`).join('')}</div>
    <div class="card qlib">${list.length ? list.map(q => `<div class="q"><div class="spacer"><div class="t">${esc(q[0])}</div><div class="b">${esc(q[1])}${q[2] ? ' · ' + esc(q[2]) : ''}</div></div>
      <button class="heart ${S.favs.includes(q[0]) ? 'on' : ''}" data-act="fav" data-q="${esc(q[0])}">❤️</button></div>`).join('') : '<p class="muted">No favourites yet. Tap ❤️ on a quote to save it.</p>'}</div></div></div>`;
}

/* =========================================================
   VIEW: JOURNAL
   ========================================================= */
const JTYPES = { all: ['📖', 'All'], morning: ['🌅', 'Morning'], evening: ['🌙', 'Evening'], lesson: ['🏛️', 'Lessons'], challenge: ['🏟️', 'Challenges'], citadel: ['🏰', 'Citadel'], free: ['🖋️', 'Free'] };
let jFilter = 'all', jSearch = '';
function addJournal(type, title, parts) {
  S.journal.unshift({ id: uid(), date: today(), ts: Date.now(), type, title, parts });
  save();
}
VIEWS.journal = () => {
  const q = jSearch.toLowerCase();
  const list = S.journal.filter(e => (jFilter === 'all' || e.type === jFilter) &&
    (!q || e.title.toLowerCase().includes(q) || e.parts.some(p => (p.q + ' ' + p.a).toLowerCase().includes(q))));
  let html = `<div class="row" style="margin:4px 4px 16px"><h1 style="font-size:34px" class="spacer">Journal</h1><button class="btn sm" data-act="freeWrite">+ Write</button></div>
    <input type="text" id="jsearch" placeholder="🔍 Search your reflections…" value="${esc(jSearch)}" style="margin-bottom:12px">
    <div class="chips">${Object.entries(JTYPES).map(([k, [ic, l]]) => `<button class="chip ${jFilter === k ? 'on' : ''}" data-act="jf" data-v="${k}">${ic} ${l}</button>`).join('')}</div>`;
  if (!list.length) {
    html += `<div class="empty"><div class="big">🖋️</div><h3>${S.journal.length ? 'Nothing matches.' : 'Your journal is empty.'}</h3>
      <p>Marcus Aurelius's journal became one of the most read books in history. Yours is just for you.<br>Entries come from lessons, rituals and the Citadel, or you can write freely.</p></div>`;
  } else {
    let last = '';
    list.slice(0, 200).forEach(e => {
      if (e.date !== last) { html += `<div class="day-label">${fmtDate(e.date)}</div>`; last = e.date; }
      const [ic] = JTYPES[e.type] || ['🖋️'];
      html += `<div class="card entry"><button class="del" data-act="jdel" data-id="${e.id}" title="Delete">🗑️</button>
        <div class="eh"><span style="font-size:20px">${ic}</span><b>${esc(e.title)}</b><span class="tag">${new Date(e.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
        ${e.parts.map(p => `${p.q ? `<div class="ep">${esc(p.q)}</div>` : ''}<div class="et">${esc(p.a)}</div>`).join('')}</div>`;
    });
  }
  return html;
};
AFTER.journal = () => {
  const s = $('#jsearch');
  s?.addEventListener('input', () => { jSearch = s.value; const pos = s.selectionStart; render(); const n = $('#jsearch'); n.focus(); n.setSelectionRange(pos, pos); });
};
function freeWrite() {
  let prompt = pick(JOURNAL_PROMPTS);
  runFlow({
    color: 'var(--terra)',
    steps: [{
      html: () => `<h2>Write freely</h2><p class="lead" id="jp">💭 ${esc(prompt)}</p><button class="chip" data-act="newPrompt" style="margin-bottom:14px">🔀 Another prompt</button>${ta('text', 'Write anything…', 10)}`,
      valid: filled('text'), btn: 'Save entry'
    }],
    finish: dt => {
      addJournal('free', 'Free writing', [{ q: $('#jp')?.textContent.replace('💭 ', '') || '', a: dt.text.trim() }]);
      gain(5);
      closeOv(); toast('🖋️', 'Entry saved', '+5 XP');
    }
  });
  FLOW.newPrompt = () => { prompt = pick(JOURNAL_PROMPTS.filter(p => p !== prompt)); $('#jp').textContent = '💭 ' + prompt; };
}

/* =========================================================
   VIEW: PROFILE
   ========================================================= */
VIEWS.profile = () => {
  const { r, next } = rankFor(S.xp);
  const pct = next ? (S.xp - r.xp) / (next.xp - r.xp) * 100 : 100;
  const st = S.streak;
  // heatmap: last 18 weeks aligned to weekday
  const weeks = 18, end = today();
  const startOffset = (parseD(end).getDay() + 6) % 7; // Monday start
  const days = weeks * 7 - (6 - startOffset);
  const cells = [];
  const first = addDays(end, -(days - 1));
  const firstDow = (parseD(first).getDay() + 6) % 7;
  for (let k = 0; k < firstDow; k++) cells.push('<i style="visibility:hidden"></i>');
  for (let k = 0; k < days; k++) {
    const dd = addDays(first, k), x = S.days[dd]?.xp || 0;
    const lv = x === 0 ? '' : x < 20 ? 'l1' : x < 50 ? 'l2' : 'l3';
    cells.push(`<i class="${lv} ${dd === end ? 't' : ''}" title="${dd}: ${x} XP"></i>`);
  }
  // tranquility chart
  const ratings = Object.entries(S.days).filter(([, d]) => d.rating).sort(([a], [b]) => a < b ? -1 : 1).slice(-30);
  let chart = '<p class="muted small" style="margin:0">Complete Evening Reviews to track your tranquility over time.</p>';
  if (ratings.length >= 2) {
    const W = 300, H = 90, n = ratings.length;
    const pts = ratings.map(([, d], i) => [10 + i * (W - 20) / (n - 1), H - 10 - (d.rating - 1) / 4 * (H - 20)]);
    const avg = (ratings.reduce((a, [, d]) => a + d.rating, 0) / n).toFixed(1);
    chart = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">
      ${[1, 3, 5].map(v => `<line x1="0" x2="${W}" y1="${H - 10 - (v - 1) / 4 * (H - 20)}" y2="${H - 10 - (v - 1) / 4 * (H - 20)}" stroke="var(--line)" stroke-dasharray="3 4"/>`).join('')}
      <polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="var(--sky)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="var(--sky)"/>`).join('')}</svg>
      <div class="muted small">Average: <b>${avg}</b> / 5 over the last ${n} reviews</div>`;
  } else if (ratings.length === 1) chart = '<p class="muted small" style="margin:0">One review logged. Keep going to see a trend.</p>';
  // virtues
  const vc = { Wisdom: 0, Courage: 0, Justice: 0, Temperance: 0 };
  Object.values(S.days).forEach(d => { if (d.virtue) vc[d.virtue]++; });
  const vmax = Math.max(1, ...Object.values(vc));
  const totalEntries = S.journal.length;
  return `
  <div class="card prof-head">
    <div class="avatar">${r.icon}</div>
    <div class="spacer">
      <h2>${esc(S.name || 'Stoic')}</h2>
      <div class="muted"><b>${r.name}</b> · <i>${esc(r.greek)}</i></div>
      <div class="xpbar"><div style="width:${pct}%"></div></div>
      <div class="small muted">${S.xp.toLocaleString()} XP${next ? ` · ${(next.xp - S.xp).toLocaleString()} to ${next.name}` : ' · the summit (but the sage is an ideal)'}</div>
    </div>
  </div>

  <div class="stat-grid">
    <div class="sg"><div class="si">🔥</div><div><div class="sv">${st.count}</div><div class="sl">Day streak</div></div></div>
    <div class="sg"><div class="si">🏔️</div><div><div class="sv">${st.best}</div><div class="sl">Best streak</div></div></div>
    <div class="sg"><div class="si">🏛️</div><div><div class="sv">${lessonsDone()}/${ALL_LESSONS.length}</div><div class="sl">Lessons</div></div></div>
    <div class="sg"><div class="si">🖋️</div><div><div class="sv">${totalEntries}</div><div class="sl">Journal entries</div></div></div>
    <div class="sg"><div class="si">🌅</div><div><div class="sv">${S.counts.morning}/${S.counts.evening}</div><div class="sl">Mornings / Evenings</div></div></div>
    <div class="sg"><div class="si">🏟️</div><div><div class="sv">${S.counts.challenge}</div><div class="sl">Challenges done</div></div></div>
  </div>

  <div class="section-title">Activity</div>
  <div class="card"><div class="heat">${cells.join('')}</div><div class="muted small" style="margin-top:8px">Last ${weeks} weeks · darker = more XP</div></div>

  <div class="section-title">Tranquility</div>
  <div class="card">${chart}</div>

  <div class="section-title">Virtues practised</div>
  <div class="card bars">${Object.entries(vc).map(([v, n]) => `<div class="b"><div class="bl">${VIRTUES[v].icon} ${v}</div><div class="bt"><div style="width:${n / vmax * 100}%;background:${VIRTUES[v].color}"></div></div><div style="width:24px;text-align:right">${n}</div></div>`).join('')}
    <p class="muted small" style="margin-bottom:0">Chosen in your Morning Preparations. Are you neglecting one?</p></div>

  <div class="section-title">Agora (shop)</div>
  <div class="card shop-item"><div class="si">🛡️</div><div class="spacer"><b>Amor Fati Shield</b><div class="muted small">Protects your streak for one missed day. You own ${st.shields}/3.</div></div>
    <button class="btn gold sm" data-act="buyShield" ${S.obols < 50 || st.shields >= 3 ? 'disabled' : ''}>🪙 50</button></div>

  <div class="section-title">Achievements · ${Object.keys(S.achievements).length}/${ACH.length}</div>
  <div class="ach-grid">${ACH.map(a => `<div class="ach ${S.achievements[a.id] ? 'got' : 'locked'}"><div class="ai">${a.icon}</div><b>${a.name}</b><span>${a.desc}</span></div>`).join('')}</div>

  <div class="section-title">Settings</div>
  <div class="card">
    <div class="setting"><div><b>Name</b></div><input type="text" id="setName" value="${esc(S.name)}" placeholder="Your name" style="max-width:180px;padding:8px 12px"></div>
    <div class="setting"><div><b>Daily goal</b></div><select id="setGoal">${[[10, 'Casual · 10'], [20, 'Regular · 20'], [30, 'Serious · 30'], [50, 'Intense · 50']].map(([v, l]) => `<option value="${v}" ${S.settings.goal === v ? 'selected' : ''}>${l} XP</option>`).join('')}</select></div>
    <div class="setting"><div><b>Theme</b></div><select id="setTheme">${['auto', 'light', 'dark'].map(t => `<option ${S.settings.theme === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <div class="setting"><div><b>Sound effects</b></div><button class="toggle ${S.settings.sound ? 'on' : ''}" data-act="tog" data-k="sound"></button></div>
    <div class="setting"><div><b>Unlock all lessons</b><div class="muted small">Skip ahead if you already know the basics</div></div><button class="toggle ${S.settings.unlockAll ? 'on' : ''}" data-act="tog" data-k="unlockAll"></button></div>
    <div class="setting"><div><b>Backup</b><div class="muted small">Your data lives only in this browser</div></div><div class="row"><button class="btn ghost sm" data-act="export">Export</button><button class="btn ghost sm" data-act="import">Import</button></div></div>
    <div class="setting"><div><b>Reset everything</b></div><button class="btn red sm" data-act="reset">Reset</button></div>
  </div>
  <p class="center muted small" style="margin:24px 0 8px">Stoa · made for daily practice · <a href="https://www.gutenberg.org/ebooks/2680" target="_blank" rel="noopener">Read the Meditations free</a></p>`;
};
AFTER.profile = () => {
  $('#setName').addEventListener('change', e => { S.name = e.target.value.trim().slice(0, 30); save(); render(); });
  $('#setGoal').addEventListener('change', e => { S.settings.goal = +e.target.value; save(); });
  $('#setTheme').addEventListener('change', e => { S.settings.theme = e.target.value; save(); applyTheme(); });
};

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `stoa-backup-${today()}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importData() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
  inp.onchange = async () => {
    try {
      const data = JSON.parse(await inp.files[0].text());
      if (typeof data !== 'object' || data.v !== 1) throw new Error('Not a Stoa backup');
      if (!await confirmBox('Replace all current data with this backup?', 'Replace')) return;
      localStorage.setItem(KEY, JSON.stringify(data)); S = load(); applyTheme(); render(); toast('📦', 'Backup restored');
    } catch (e) { toast('⚠️', 'Import failed', e.message); }
  };
  inp.click();
}

/* =========================================================
   ONBOARDING
   ========================================================= */
function onboarding() {
  runFlow({
    color: 'var(--terra)',
    steps: [
      {
        html: `<div class="onb"><div class="hero">🏛️</div><h1>Welcome to the Stoa</h1>
          <p>2,300 years ago, people met under a painted porch in Athens to learn how to live well.</p>
          <p>This is that porch, a few minutes a day. You'll get <b>lessons</b> to understand Stoicism, <b>daily rituals</b> to practise it, <b>challenges</b> to test it, and <b>tools</b> for when life gets hard.</p></div>`,
        btn: 'Enter', noBack: true
      },
      { html: `<h2>What should we call you?</h2><p class="lead">Marcus wrote to himself. You can too.</p><input type="text" data-k="name" placeholder="Your name" maxlength="30">`, valid: filled('name') },
      {
        html: d => `<h2>What brings you here?</h2><p class="lead">We'll point you to the right tools.</p>
          <div class="why-grid">${Object.entries(MOTIVES).map(([k, m]) => `<button class="vcard ${d.motive === k ? 'sel' : ''}" data-act="pickMotive" data-v="${k}"><div class="vi">${m.icon}</div><b style="font-size:15px">${m.label}</b></button>`).join('')}</div>`,
        valid: d => !!d.motive
      },
      {
        html: d => `<h2>Daily goal</h2><p class="lead">"No great thing is created suddenly." (Epictetus) Consistency beats intensity.</p>
          <div class="opts goal-opts">${[[10, 'Casual', '~5 min'], [20, 'Regular', '~10 min'], [30, 'Serious', '~15 min'], [50, 'Intense', '~25 min']].map(([v, l, t]) =>
          `<button class="opt ${+d.goal === v ? 'sel' : ''}" data-act="pickGoal" data-v="${v}"><span>${l}</span><span class="muted">${t} / day</span></button>`).join('')}</div>`,
        valid: d => !!d.goal
      },
      {
        html: d => `<div class="onb"><div class="hero">📜</div><h1>One promise</h1>
          <p style="font-size:20px;font-family:var(--serif);font-style:italic">"First say to yourself what you would be; and then do what you have to do."</p>
          <p class="muted">Epictetus</p><p>Practise a little <b>every day</b>. The app will help you keep at it.</p>
          <div class="card" style="text-align:left;margin-top:20px"><div class="tiny">Suggested start for you</div><div style="margin-top:6px">${esc(MOTIVES[d.motive]?.tip || '')}</div></div></div>`,
        btn: 'I commit'
      }
    ],
    finish: d => {
      S.name = d.name.trim(); S.motive = d.motive; S.settings.goal = +d.goal; S.onboarded = true; save();
      closeOv(); confetti(); sfx.done();
      setTimeout(() => toast('🏛️', `Welcome, ${S.name}.`, 'Tap the first lesson to begin.'), 300);
    }
  });
  FLOW.noQuit = true;
}

/* =========================================================
   EVENTS
   ========================================================= */
const ACTIONS = {
  tab: el => { sfx.tap(); go(el.dataset.tab); },
  node: el => { sfx.tap(); nodePopover(el.dataset.id); },
  review: () => startReview(),
  quitLesson: async () => { if (await confirmBox('Quit this lesson? Progress in it will be lost.', 'Quit', 'Keep going')) closeOv(); },
  quitFlow: async () => {
    if (FLOW?.noQuit) return;
    const hasText = Object.values(FLOW?.data || {}).some(v => typeof v === 'string' && v.trim());
    if (!hasText || await confirmBox('Leave? What you wrote will be lost.', 'Leave', 'Stay')) closeOv();
  },
  closeOv: () => closeOv(),
  opt: el => selectOpt(el.dataset.i),
  fillw: el => selectFill(el.dataset.i),
  ordw: el => orderTap(el.dataset.k),
  mt: el => matchTap(el),
  sortb: el => sortPick(el.dataset.v),
  check: () => doCheck(),
  next: () => nextStep(),
  skipRefl: () => { L.cur.done = true; nextStep(); },
  morning: () => morningFlow(),
  evening: () => eveningFlow(),
  chDone: () => challengeDone(),
  chSwap: () => { const d = day(); d.chSwap = (d.chSwap || 0) + 1; save(); sfx.tap(); render(); },
  fav: el => {
    const q = el.dataset.q, i = S.favs.indexOf(q);
    i >= 0 ? S.favs.splice(i, 1) : (S.favs.push(q), sfx.match());
    save();
    if (!ov.hidden && $('.qlib')) { openOv(quotesView()); } else render();
  },
  flowNext: () => flowNext(),
  flowBack: () => { if (FLOW.i > 0) { FLOW.i--; renderFlow(); } },
  pickVirtue: el => { FLOW.data.virtue = el.dataset.v; sfx.tap(); $$('[data-act=pickVirtue]').forEach(b => b.classList.toggle('sel', b === el)); validateFlow(); },
  pickKept: el => { FLOW.data.kept = el.dataset.v; sfx.tap(); $$('[data-act=pickKept]').forEach(b => b.classList.toggle('sel', b === el)); validateFlow(); },
  pickRating: el => { FLOW.data.rating = +el.dataset.v; sfx.tap(); $$('[data-act=pickRating]').forEach(b => b.classList.toggle('sel', b === el)); validateFlow(); },
  pickMotive: el => { FLOW.data.motive = el.dataset.v; sfx.tap(); $$('[data-act=pickMotive]').forEach(b => b.classList.toggle('sel', b === el)); validateFlow(); },
  pickGoal: el => { FLOW.data.goal = el.dataset.v; sfx.tap(); $$('[data-act=pickGoal]').forEach(b => b.classList.toggle('sel', b === el)); validateFlow(); },
  newPrompt: () => FLOW.newPrompt?.(),
  citadelFlow: () => citadelFlow(),
  vfa: () => vfaFlow(),
  mori: () => moriFlow(),
  moriReset: (el, e) => { e.preventDefault(); S.mori.birth = null; save(); moriFlow(); },
  worries: () => openWorries(),
  wAdd: () => addWorry(),
  wSet: el => setWorry(el.dataset.id, el.dataset.v),
  wDel: el => { S.worries = S.worries.filter(x => x.id !== el.dataset.id); save(); openWorries(); },
  quotes: () => openOv(quotesView()),
  qf: el => { qFilter = el.dataset.v; openOv(quotesView()); },
  jf: el => { jFilter = el.dataset.v; render(); },
  jdel: async el => { if (await confirmBox('Delete this journal entry?', 'Delete')) { S.journal = S.journal.filter(e => e.id !== el.dataset.id); save(); render(); } },
  freeWrite: () => freeWrite(),
  buyShield: () => {
    if (S.obols < 50 || S.streak.shields >= 3) return;
    S.obols -= 50; S.streak.shields++; save(); sfx.ach(); toast('🛡️', 'Amor Fati Shield acquired', 'Your streak is protected for one missed day.'); render();
  },
  tog: el => { const k = el.dataset.k; S.settings[k] = !S.settings[k]; save(); render(); },
  export: () => exportData(),
  import: () => importData(),
  reset: async () => {
    if (await confirmBox('Erase ALL progress, journal entries and settings? This cannot be undone.', 'Erase everything')) {
      localStorage.removeItem(KEY); S = defaults(); applyTheme(); render(); onboarding();
    }
  }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) fn(el, e);
});

document.addEventListener('keydown', e => {
  if (ov.hidden) return;
  const tag = document.activeElement?.tagName;
  const typing = tag === 'TEXTAREA' || tag === 'INPUT';
  if (L && L.cur && $('#lesson')) {
    const it = L.cur.it;
    if (e.key === 'Enter' && !(typing && tag === 'TEXTAREA' && !e.ctrlKey && !e.metaKey)) {
      const nb = $('#nextBtn') || $('[data-act=next]');
      if (nb) { e.preventDefault(); nb.click(); return; }
      const cb = $('#checkBtn');
      if (cb && !cb.disabled) { e.preventDefault(); cb.click(); return; }
      const cl = $('#lesson .btn[data-act=closeOv]');
      if (cl) { e.preventDefault(); cl.click(); }
      return;
    }
    if (typing || L.cur.done) return;
    if (it.t === 'sort' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { sortPick(e.key === 'ArrowLeft' ? 0 : 1); return; }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) {
      if (it.t === 'mc' || it.t === 'scenario') { const b = $$('.opt')[n - 1]; b && selectOpt(b.dataset.i); }
      else if (it.t === 'fill') { const b = $$('.word')[n - 1]; b && selectFill(b.dataset.i); }
    }
  } else if (FLOW && e.key === 'Enter' && (!typing || tag === 'INPUT' || e.ctrlKey || e.metaKey)) {
    const b = $('#flowNext'); if (b && !b.disabled) { e.preventDefault(); b.click(); }
  }
});

/* =========================================================
   BOOT
   ========================================================= */
applyTheme();
checkStreak();
render();
if (!S.onboarded) onboarding();
document.addEventListener('visibilitychange', () => { if (!document.hidden && ov.hidden) { checkStreak(); render(); } });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
})();
