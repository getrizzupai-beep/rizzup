/**
 * RizzUp AI — app.js
 * Works with Supabase auth defined in index.html
 */

// ============ CONFIG ============
const CONFIG = {
  API_URL: 'https://api.anthropic.com/v1/messages',
  MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 600,
  MAX_CHARS: 500,
  AUTO_SAVE_INTERVAL: 30000,
};

// ============ DATA ============
const SCENARIOS = {
  first_date: {
    name: 'Priya', av: '👩', emoji: '☕', label: 'First Date',
    desc: 'Coffee meetup, break the ice', free: true,
    system: `You are Priya, a 25-year-old Mumbai girl on a first coffee date with someone you matched with on a dating app. You're friendly but slightly guarded — you've been on enough bad dates to be cautious. Keep ALL responses to 1-3 short sentences max. React naturally, occasionally use Hinglish (mix of Hindi + English). Show genuine interest if they say something interesting. Never break character. Don't be too easy or too hard to talk to.`,
    suggestions: ["Heyy! Tu actually apni photo jaisa hai 😄", "Okay first question — chai ya coffee?", "Honestly mujhe bhi first dates awkward lagte hain", "Sach bol — nervous hai kya tu? 😄"]
  },
  texting: {
    name: 'Ananya', av: '💬', emoji: '💬', label: 'Texting',
    desc: 'Dating app convo', free: true,
    system: `You are Ananya, a girl the user just matched with on Hinge/Bumble. Casual 1-2 line texting style. Sometimes dry humor. Realistic reactions — if something is boring, say so subtly. Keep it very short like real texts.`,
    suggestions: ["heyyy finally texted 😄", "okay one question — pizza ya biryani?", "tell me something surprising about you", "coffee date ya dinner? pick one"]
  },
  rejection: {
    name: 'Simran', av: '💪', emoji: '💪', label: 'Rejection',
    desc: 'Handle it gracefully', free: true,
    system: `You are Simran letting someone down gently after 2 dates — you don't feel a romantic connection. React based on how gracefully or awkwardly they handle the rejection. Short realistic replies. If they handle it well, appreciate it. If they get weird, be firmer.`,
    suggestions: ["Haha no worries, you're still cool! 😄", "Fair enough — I respect the honesty", "Can we still be friends?", "Thanks for being real about it!"]
  },
  flirting: {
    name: 'Rhea', av: '😏', emoji: '😏', label: 'Flirting',
    desc: 'Playful banter', free: false,
    system: `You are Rhea, confident and playful. Make them earn your interest with wit and originality. Clever lines get appreciation and flirting back. Generic pickup lines get gentle teasing. Keep replies short, punchy.`,
    suggestions: ["Okay I've been trying to think of a good line 😅", "You have a very distracting smile", "Who's funnier — you or me?"]
  },
  arranged: {
    name: 'Pooja', av: '🌸', emoji: '💐', label: 'Arranged Meet',
    desc: 'Family intro', free: false,
    system: `You are Pooja at a first arranged meeting setup by families. Polite and well-mannered but quietly assessing for real compatibility beyond the awkward formality. Use realistic Indian arranged-marriage meeting context. Short replies.`,
    suggestions: ["Yeh situation thoda awkward hai na? 😅", "Honestly what are you looking for?", "Tumne kya socha tha mere baare mein?"]
  },
  second_date: {
    name: 'Megha', av: '🌙', emoji: '🌙', label: '2nd Date',
    desc: 'Deepen connection', free: false,
    system: `You are Megha on a second date. First date went okay but you're not sold yet — you want depth and real personality, not surface-level chat. Push back gently on boring topics. Reward genuine vulnerability and humor.`,
    suggestions: ["Tell me something you didn't last time", "What's your most random skill?", "Okay honest question — nervous nahi tu?"]
  }
};

const OPENING_MESSAGES = {
  first_date: "Hiii! *nervously sips coffee* Sorry thoda late — Mumbai traffic 😅 Tum actually apni photo jaise ho, refreshing! So... tell me something interesting.",
  texting: "heyyy so you actually texted 👀 what made you swipe?",
  rejection: "Hey, I wanted to be upfront... I think you're sweet but I don't see this going romantically. Hope that's okay?",
  flirting: "Oh so you said hi 😏 Bold move. Prove karo ki it was worth my time.",
  arranged: "Hii! *awkward laugh* Yeh situation thoda weird hai for both of us? Haha. So... basically kya karte ho?",
  second_date: "Hey! Glad you came 😄 Last time was nice but I feel like I don't actually know you. Tell me something real."
};

const COURSE_DAYS = [
  { day: 1,  title: "Why You're Getting Ignored",  subtitle: "#1 mistake guys make",        free: true,  done: true },
  { day: 2,  title: "The Confidence Framework",    subtitle: "Real inner confidence",       free: true,  cur: true  },
  { day: 3,  title: "First Message Formula",       subtitle: "Openers that work",           free: true  },
  { day: 4,  title: "Profile Optimization",        subtitle: "Bio + photos",                free: true  },
  { day: 5,  title: "The Curiosity Loop",          subtitle: "Make them want more",         free: true  },
  { day: 6,  title: "Texting Cadence",             subtitle: "When to text, when to wait",  free: true  },
  { day: 7,  title: "Week 1 AI Practice",          subtitle: "Full simulation",             free: true  },
  { day: 8,  title: "Conversation Depth",          subtitle: "Beyond haha and lol",         free: false },
  { day: 9,  title: "Humor Timing",                subtitle: "When jokes land",             free: false },
  { day: 10, title: "The Push-Pull",               subtitle: "Create real tension",         free: false },
  { day: 12, title: "The Date Ask",                subtitle: "Without sounding desperate",  free: false },
  { day: 16, title: "First Date Script",           subtitle: "What to actually say",        free: false },
  { day: 20, title: "Art of Flirting",             subtitle: "Playful not cringe",          free: false },
  { day: 25, title: "Handle Rejection",            subtitle: "Stay cool always",            free: false },
  { day: 30, title: "Graduation Day 🎓",           subtitle: "You've leveled up!",          free: false }
];

// ============ STATE ============
let state = {
  user: null,
  plan: 'free',
  minsUsed: 0,
  totalMsgs: 0,
  sessions: 0,
  currentScenario: 'first_date',
  history: [],
  loading: false
};

// ============ UTILITIES ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatText(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// ============ TOAST ============
// showToast is already defined in index.html (Supabase script).
// We expose a safe wrapper so app.js code can always call window.showToast().
if (typeof window.showToast !== 'function') {
  window.showToast = function(message, type = 'default') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3500);
  };
}

// ============ AUTH MODAL ============
// openAuthModal() and closeAuthModal() are defined in index.html.
// DO NOT redefine them here — that was causing the conflict!
// We only add the Escape key shortcut.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && typeof closeAuthModal === 'function') closeAuthModal();
});

// ============ LANDING PAGE HELPERS ============
function switchFeature(el, idx) {
  $$('.feat-tab').forEach(t => t.classList.remove('active'));
  $$('.preview-card').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const prev = document.getElementById(`prev-${idx}`);
  if (prev) prev.classList.add('active');
}

function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}

// ============ CALLED BY index.html AFTER SUPABASE LOGIN ============
function initUserFromAuth(name, email, uid) {
  state.user = { id: uid || btoa(email).replace(/=/g, ''), name, email };
  loadUserData();

  const today = new Date().toDateString();
  if (localStorage.getItem(`rz_d_${state.user.id}`) !== today) {
    state.minsUsed = 0;
    localStorage.setItem(`rz_d_${state.user.id}`, today);
  }

  document.getElementById('landingView').style.display = 'none';
  document.getElementById('appView').style.display = 'block';
  buildApp();
  window.showToast(`Welcome, ${name.split(' ')[0]}! 🚀 Let's gooo`, 'success');
}

function loadUserData() {
  const saved = localStorage.getItem(`rz_${state.user.id}`);
  if (saved) {
    try {
      const d = JSON.parse(saved);
      state.plan      = d.plan      || 'free';
      state.minsUsed  = d.minsUsed  || 0;
      state.totalMsgs = d.totalMsgs || 0;
      state.sessions  = d.sessions  || 0;
    } catch(e) {}
  }
  const sc = localStorage.getItem(`rz_sc_${state.user.id}`);
  if (sc && SCENARIOS[sc]) state.currentScenario = sc;
}

function saveUserData() {
  if (!state.user) return;
  localStorage.setItem(`rz_${state.user.id}`, JSON.stringify({
    plan: state.plan, minsUsed: state.minsUsed,
    totalMsgs: state.totalMsgs, sessions: state.sessions
  }));
  localStorage.setItem(`rz_sc_${state.user.id}`, state.currentScenario);
}

setInterval(saveUserData, CONFIG.AUTO_SAVE_INTERVAL);

function doLogout() {
  saveUserData();
  state = { ...state, user: null, history: [] };
  if (window.supabase) {
    window.supabase.auth.signOut();
  } else {
    document.getElementById('appView').style.display = 'none';
    document.getElementById('landingView').style.display = 'block';
  }
}

// ============ APP BUILD ============
function buildApp() {
  const name = state.user.name.split(' ')[0];

  const greet = document.getElementById('dashGreet');
  if (greet) greet.textContent = `Hey ${name}! 👋`;

  const badge = document.getElementById('appPlanBadge');
  if (badge) badge.textContent = { free: 'Free Plan', starter: 'Starter Plan', pro: 'Pro Plan' }[state.plan];

  const userNameEl = document.getElementById('appUserName');
  if (userNameEl) userNameEl.textContent = name;

  buildDashboardScenarios();
  buildChatSidebar();
  buildCourse();
  buildAppPlans();
  updateDashboard();
  resetChat();
  initChat();
}

function switchPanel(btn, id) {
  $$('.app-nav-btn').forEach(b => b.classList.remove('active'));
  $$('.app-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(`panel-${id}`);
  if (panel) panel.classList.add('active');
}

function updateDashboard() {
  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  const pct = Math.min((state.minsUsed / max) * 100, 100);

  const fill = document.getElementById('dashFill');
  if (fill) fill.style.width = `${pct}%`;

  const minsEl = document.getElementById('dashMins');
  if (minsEl) minsEl.textContent = Math.floor(state.minsUsed);

  const msgsEl = document.getElementById('dashMsgs');
  if (msgsEl) msgsEl.textContent = state.totalMsgs;

  const streakEl = document.getElementById('dashStreak');
  if (streakEl) streakEl.textContent = state.sessions || 0;

  const usageTxt = document.getElementById('dashUsageText');
  if (usageTxt) usageTxt.textContent = state.plan === 'pro' ? 'Unlimited 🚀' : `${Math.floor(state.minsUsed)}/${max} min`;

  const notice = document.getElementById('limitNotice');
  if (notice) notice.style.display = (state.minsUsed >= max && state.plan === 'free') ? 'block' : 'none';
}

// ============ SCENARIOS ============
function buildDashboardScenarios() {
  const c = document.getElementById('dashScens');
  if (!c) return;
  c.innerHTML = '';
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `app-scen-card ${locked ? 'locked' : ''}`;
    el.onclick = locked
      ? () => switchPanel($$('.app-nav-btn')[4], 'pricing')
      : () => startScenario(key);
    el.innerHTML = `
      <div class="asc-emoji">${sc.emoji}</div>
      <div class="asc-name">${sc.label}</div>
      <div class="asc-desc">${sc.desc}</div>
      <span class="asc-badge ${sc.free ? 'asc-free' : 'asc-pro'}">${sc.free ? 'Free' : locked ? '🔒 Starter+' : '✓ Unlocked'}</span>`;
    c.appendChild(el);
  });
}

function buildChatSidebar() {
  const c = document.getElementById('chatSidebar');
  if (!c) return;
  c.innerHTML = '<div class="cs-label">Scenarios</div>';
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `cs-scen ${key === state.currentScenario ? 'active' : ''} ${locked ? 'locked-s' : ''}`;
    el.onclick = locked
      ? () => switchPanel($$('.app-nav-btn')[4], 'pricing')
      : () => switchScenario(key);
    el.textContent = `${sc.emoji} ${sc.label}`;
    c.appendChild(el);
  });
}

function startScenario(key) {
  state.currentScenario = key;
  switchPanel($$('.app-nav-btn')[1], 'practice');
  buildChatSidebar();
  resetChat();
  initChat();
}

function switchScenario(key) {
  state.currentScenario = key;
  buildChatSidebar();
  resetChat();
  initChat();
}

// ============ CHAT ============
function initChat() {
  updateChatHeader();
  const opening = OPENING_MESSAGES[state.currentScenario];
  state.history = [{ role: 'assistant', content: opening }];
  addBubble('ai', opening);

  const sugs = SCENARIOS[state.currentScenario].suggestions || [];
  const strip = document.getElementById('sugStrip');
  if (strip) strip.innerHTML = sugs.map(s =>
    `<button class="sug-chip" onclick="useSuggestion(this)">${s}</button>`
  ).join('');
}

function resetChat() {
  state.history = [];
  const area = document.getElementById('msgsArea');
  if (area) area.innerHTML = '';
}

function updateChatHeader() {
  const sc = SCENARIOS[state.currentScenario];
  const av = document.getElementById('cpAv');
  const nm = document.getElementById('cpName');
  if (av) av.textContent = sc.av;
  if (nm) nm.textContent = sc.name;
}

function addBubble(type, text) {
  const area = document.getElementById('msgsArea');
  if (!area) return;
  const sc = SCENARIOS[state.currentScenario];
  const row = document.createElement('div');
  row.className = `msg-row ${type === 'user' ? 'user' : ''}`;
  row.innerHTML = `
    <div class="m-av ${type}">${type === 'ai' ? sc.av : '🧑'}</div>
    <div class="bubble ${type}">${formatText(text)}</div>`;
  area.appendChild(row);
  requestAnimationFrame(() => { area.scrollTop = area.scrollHeight; });
}

function addCoachCard(html) {
  const area = document.getElementById('msgsArea');
  if (!area) return;
  const card = document.createElement('div');
  card.className = 'coach-card';
  card.innerHTML = `<div class="cc-hdr">🎯 Dating Coach</div>${html}`;
  area.appendChild(card);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = document.getElementById('msgsArea');
  if (!area) return;
  const sc = SCENARIOS[state.currentScenario];
  const row = document.createElement('div');
  row.className = 'msg-row';
  row.id = 'typingRow';
  row.innerHTML = `<div class="m-av ai">${sc.av}</div><div class="typing-bub"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>`;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function hideTyping() {
  const r = document.getElementById('typingRow');
  if (r) r.remove();
}

// ============ CLAUDE API ============
async function callClaude(messages, systemPrompt) {
  const response = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system: systemPrompt,
      messages: messages
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  if (!input || state.loading) return;

  const raw = input.value.trim();
  if (!raw) { window.showToast('Kuch toh likho! 🤔', 'error'); return; }

  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  if (state.minsUsed >= max && state.plan === 'free') {
    switchPanel($$('.app-nav-btn')[4], 'pricing');
    window.showToast('Limit ho gayi! Upgrade karo 🚀', 'error');
    return;
  }

  const text = raw.slice(0, CONFIG.MAX_CHARS);
  input.value = '';
  input.style.height = 'auto';
  state.loading = true;
  if (sendBtn) sendBtn.disabled = true;

  addBubble('user', text);
  state.history.push({ role: 'user', content: text });
  state.minsUsed += 0.5;
  state.totalMsgs++;
  if (state.totalMsgs % 5 === 1) state.sessions++;
  updateDashboard();
  showTyping();

  try {
    const reply = await callClaude(state.history, SCENARIOS[state.currentScenario].system);
    hideTyping();
    state.history.push({ role: 'assistant', content: reply });
    addBubble('ai', reply);
  } catch(e) {
    hideTyping();
    const msg = e.message.includes('429')
      ? 'Thoda ruko, bahut fast messages! ⏳'
      : 'Connection issue. Try again! 🔄';
    addBubble('ai', msg);
    window.showToast(msg, 'error');
  }

  saveUserData();
  state.loading = false;
  if (sendBtn) sendBtn.disabled = false;
  input.focus();
}

async function getCoach() {
  if (state.loading) return;
  if (state.history.length < 3) {
    addCoachCard('Thoda aur chat karo pehle — phir feedback dunga! 😄');
    return;
  }
  state.loading = true;
  showTyping();

  const sc = SCENARIOS[state.currentScenario];
  const convo = state.history
    .map(m => `${m.role === 'user' ? 'User' : sc.name}: ${m.content}`)
    .join('\n');

  const coachPrompt = `You are an expert Indian dating coach. Analyze this ${sc.label} conversation and give sharp, warm Hinglish feedback.

Conversation:
${convo}

Reply EXACTLY in this format (max 90 words total):
**Vibe Score:** X/10 — [one punchy line]
**Kya kaam kiya:** [what worked — 1 line]
**Improve karo:** [1-2 specific actionable tips]
**Next bolna chahiye:** "[exact Hinglish line they should say next]"

Be direct, fun, warm. Hinglish only. No generic advice.`;

  try {
    const reply = await callClaude(
      [{ role: 'user', content: coachPrompt }],
      'You are a sharp, warm Indian dating coach. Give advice in Hinglish. Always use the exact format asked.'
    );
    hideTyping();
    addCoachCard(reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
  } catch(e) {
    hideTyping();
    addCoachCard('Coach unavailable right now. Try again! 🔄');
  }

  state.loading = false;
}

// ============ WINGMAN MODE ============
async function getWingmanReplies() {
  const input = document.getElementById('wingmanInput');
  const results = document.getElementById('wingmanResults');
  if (!input || !results) return;

  const convo = input.value.trim();
  if (!convo) { window.showToast('Pehle conversation paste karo! 😄', 'error'); return; }

  results.innerHTML = '<div style="text-align:center;padding:20px;color:#9ca3af">🤔 Soch raha hoon...</div>';

  const prompt = `You are an expert Indian dating coach. Analyze this conversation and give 3 reply options ranked by vibe score.

Conversation:
${convo}

Reply EXACTLY in this JSON format (no extra text, no markdown):
{"replies":[{"score":9.2,"emoji":"🔥","text":"reply here"},{"score":7.8,"emoji":"😊","text":"reply here"},{"score":6.5,"emoji":"👍","text":"reply here"}],"tip":"one line Hinglish tip"}`;

  try {
    const raw = await callClaude(
      [{ role: 'user', content: prompt }],
      'You are a sharp Indian dating coach. Always reply in exact JSON format. Hinglish replies only. No markdown, no extra text.'
    );
    const clean = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    results.innerHTML = `
      <div style="margin-bottom:16px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px">Top Replies</div>
      ${data.replies.map(r => `
        <div style="background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px 16px;margin-bottom:10px;cursor:pointer"
             onclick="navigator.clipboard.writeText(this.dataset.text);window.showToast('Copied! 📋','success')"
             data-text="${r.text.replace(/"/g, '&quot;')}">
          <div style="font-weight:800;color:#e8392a;margin-bottom:4px">${r.emoji} ${r.score}/10</div>
          <div style="font-size:14px;font-weight:600">${r.text}</div>
          <div style="font-size:11px;color:#9ca3af;margin-top:4px">Tap to copy</div>
        </div>`).join('')}
      <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:12px 14px;font-size:13px;margin-top:4px">
        💡 <strong>Tip:</strong> ${data.tip}
      </div>`;
  } catch(e) {
    results.innerHTML = '<div style="color:red;padding:12px">Error aaya! Try again 🔄</div>';
  }
}

// ============ SUGGESTION CHIPS ============
function useSuggestion(btn) {
  const text = btn.textContent;
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; sendMessage(); }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ============ COURSE ============
function buildCourse() {
  const c = document.getElementById('courseList');
  if (!c) return;
  c.innerHTML = '';

  const week1 = COURSE_DAYS.filter(d => d.free);
  c.innerHTML += `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#e8392a;margin-bottom:12px">WEEK 1-4 — FREE</div>`;
  week1.forEach(day => {
    const cls = day.done ? 'cd-done' : day.cur ? 'cd-cur' : 'cd-default';
    const icon = day.done ? '✓' : day.day;
    c.innerHTML += `<div class="cd-row" style="margin-bottom:8px;cursor:pointer"
      onclick="window.showToast('Day ${day.day}: ${day.title} — Coming soon! 📚')">
      <div class="cd-num ${cls}">${icon}</div>
      <div class="cd-info"><div class="cd-t">${day.title}</div><div class="cd-s">${day.subtitle} · Free</div></div>
    </div>`;
  });

  const week2 = COURSE_DAYS.filter(d => !d.free);
  c.innerHTML += `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin:20px 0 12px">WEEK 5-12 — STARTER+</div>`;
  week2.forEach(day => {
    const locked = state.plan === 'free';
    c.innerHTML += `<div class="cd-row" style="margin-bottom:8px;cursor:${locked ? 'not-allowed' : 'pointer'};opacity:${locked ? '0.5' : '1'}"
      onclick="${locked ? `switchPanel(document.querySelectorAll('.app-nav-btn')[4],'pricing')` : `window.showToast('Day ${day.day}: ${day.title} — Coming soon!')`}">
      <div class="cd-num cd-lock">${locked ? '🔒' : day.day}</div>
      <div class="cd-info"><div class="cd-t">${day.title}</div><div class="cd-s">${day.subtitle} · ${locked ? 'Unlock Starter' : 'Unlocked'}</div></div>
    </div>`;
  });
}

// ============ PRICING (IN-APP) ============
function buildAppPlans() {
  const c = document.getElementById('appPlans');
  if (!c) return;
  c.innerHTML = `
    <div class="pricing-grid">
      <div class="pricing-card">
        <div class="plan-name">Free</div>
        <div class="plan-price">₹0<span>/forever</span></div>
        <ul class="plan-features">
          <li>✓ 20 min AI chat/day</li>
          <li>✓ 3 free scenarios</li>
          <li>✓ Week 1-4 course</li>
        </ul>
        <button class="plan-btn" disabled style="opacity:0.5;cursor:not-allowed">Current Plan</button>
      </div>
      <div class="pricing-card popular">
        <div class="popular-badge">🔥 Most Popular</div>
        <div class="plan-name">Starter</div>
        <div class="plan-price">₹199<span>/month</span></div>
        <ul class="plan-features">
          <li>✓ 60 min AI chat/day</li>
          <li>✓ All 6+ scenarios</li>
          <li>✓ Full 90-day course</li>
          <li>✓ Wingman Mode (10/mo)</li>
        </ul>
        <button class="plan-btn btn-pink" onclick="unlockDemo('starter')">Get Starter ⚡</button>
      </div>
      <div class="pricing-card">
        <div class="plan-name">Pro</div>
        <div class="plan-price">₹499<span>/month</span></div>
        <ul class="plan-features">
          <li>✓ Unlimited AI chat + voice</li>
          <li>✓ Complete 90-day course</li>
          <li>✓ Unlimited Wingman Mode</li>
          <li>✓ Human coach Q&A (2x/mo)</li>
        </ul>
        <button class="plan-btn" onclick="unlockDemo('pro')">Get Pro 👑</button>
      </div>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px">Demo mode: Click any plan to unlock instantly</p>`;
}

function unlockDemo(plan) {
  state.plan = plan;
  saveUserData();
  buildApp();
  window.showToast(`🎉 ${plan === 'pro' ? 'Pro' : 'Starter'} unlocked! Sab scenarios open hai!`, 'success');
  switchPanel($$('.app-nav-btn')[0], 'dashboard');
}
