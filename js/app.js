/**
 * RizzUp AI — app.js
 * No API key needed from user — works out of the box!
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
  { day: 1, title: "Why You're Getting Ignored", subtitle: "#1 mistake guys make", free: true, done: true },
  { day: 2, title: "The Confidence Framework", subtitle: "Real inner confidence", free: true, cur: true },
  { day: 3, title: "First Message Formula", subtitle: "Openers that work", free: true },
  { day: 4, title: "Profile Optimization", subtitle: "Bio + photos", free: true },
  { day: 5, title: "The Curiosity Loop", subtitle: "Make them want more", free: true },
  { day: 6, title: "Texting Cadence", subtitle: "When to text, when to wait", free: true },
  { day: 7, title: "Week 1 AI Practice", subtitle: "Full simulation", free: true },
  { day: 8, title: "Conversation Depth", subtitle: "Beyond haha and lol", free: false },
  { day: 9, title: "Humor Timing", subtitle: "When jokes land", free: false },
  { day: 10, title: "The Push-Pull", subtitle: "Create real tension", free: false },
  { day: 12, title: "The Date Ask", subtitle: "Without sounding desperate", free: false },
  { day: 16, title: "First Date Script", subtitle: "What to actually say", free: false },
  { day: 20, title: "Art of Flirting", subtitle: "Playful not cringe", free: false },
  { day: 25, title: "Handle Rejection", subtitle: "Stay cool always", free: false },
  { day: 30, title: "Graduation Day 🎓", subtitle: "You've leveled up!", free: false }
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

function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str.trim().slice(0, CONFIG.MAX_CHARS);
  return div.innerHTML;
}

function formatText(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\n/g,'<br>')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
}

function showToast(message, type = 'default') {
  const existing = $('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ============ LANDING PAGE ============

// ✅ FIX: openAuthModal now uses both classList AND inline display style
function openAuthModal() {
  const modal = $('#authModal');
  modal.classList.add('open');
  modal.style.display = 'flex';
}

// ✅ FIX: closeAuthModal now removes display style too
function closeAuthModal() {
  const modal = $('#authModal');
  modal.classList.remove('open');
  modal.style.display = 'none';
}

// ✅ FIX: Wrapped in DOMContentLoaded so the element exists when this runs
document.addEventListener('DOMContentLoaded', function () {
  const authModal = $('#authModal');
  if (authModal) {
    // Close modal when clicking the dark overlay background
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });

    // Make sure modal starts hidden
    authModal.style.display = 'none';
  }
});

function switchFeature(el, idx) {
  $$('.feat-tab').forEach(t => t.classList.remove('active'));
  $$('.preview-card').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(`prev-${idx}`).classList.add('active');
}

function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}

// ============ AUTH — NO API KEY NEEDED ============
function doSignup() {
  const name = $('#mName').value.trim() || 'User';
  const email = $('#mEmail').value.trim() || 'user@rizzup.in';
  initUser(name, email);
}

function quickSignup() {
  initUser('Rahul', 'rahul@rizzup.in');
}

function initUser(name, email) {
  state.user = { id: btoa(email).replace(/=/g,''), name, email };
  loadUserData();

  const today = new Date().toDateString();
  if (localStorage.getItem(`rz_d_${state.user.id}`) !== today) {
    state.minsUsed = 0;
    localStorage.setItem(`rz_d_${state.user.id}`, today);
  }

  closeAuthModal();
  $('#landingView').style.display = 'none';
  $('#appView').style.display = 'block';
  buildApp();
  showToast(`Welcome, ${name.split(' ')[0]}! 🚀 Let's gooo`, 'success');
}

function loadUserData() {
  const saved = localStorage.getItem(`rz_${state.user.id}`);
  if (saved) {
    try {
      const d = JSON.parse(saved);
      state.plan = d.plan || 'free';
      state.minsUsed = d.minsUsed || 0;
      state.totalMsgs = d.totalMsgs || 0;
      state.sessions = d.sessions || 0;
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
  $('#appView').style.display = 'none';
  $('#landingView').style.display = 'block';
}

// ============ APP BUILD ============
function buildApp() {
  const name = state.user.name.split(' ')[0];
  $('#dashGreet').textContent = `Hey ${name}! 👋`;
  $('#appPlanBadge').textContent = { free: 'Free Plan', starter: 'Starter Plan', pro: 'Pro Plan' }[state.plan];
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
  document.getElementById(`panel-${id}`).classList.add('active');
}

function updateDashboard() {
  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  const pct = Math.min((state.minsUsed / max) * 100, 100);
  const fill = $('#dashFill'); if (fill) fill.style.width = `${pct}%`;
  const minsEl = $('#dashMins'); if (minsEl) minsEl.textContent = Math.floor(state.minsUsed);
  const msgsEl = $('#dashMsgs'); if (msgsEl) msgsEl.textContent = state.totalMsgs;
  const usageTxt = $('#dashUsageText');
  if (usageTxt) usageTxt.textContent = state.plan === 'pro' ? 'Unlimited 🚀' : `${Math.floor(state.minsUsed)}/${max} min`;
  const notice = $('#limitNotice');
  if (notice) notice.classList.toggle('show', state.minsUsed >= max && state.plan === 'free');
}

// ============ SCENARIOS ============
function buildDashboardScenarios() {
  const c = $('#dashScens'); if (!c) return;
  c.innerHTML = '';
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `app-scen-card ${locked ? 'locked' : ''}`;
    el.onclick = locked
      ? () => switchPanel($$('.app-nav-btn')[3], 'upgrade')
      : () => startScenario(key);
    el.innerHTML = `
      <div class="asc-emoji">${sc.emoji}</div>
      <div class="asc-name">${sc.label}</div>
      <div class="asc-desc">${sc.desc}</div>
      <span class="asc-badge ${sc.free ? 'asc-free' : 'asc-pro'}">${sc.free ? 'Free' : locked ? '🔒 Pro' : '✓ Unlocked'}</span>`;
    c.appendChild(el);
  });
}

function buildChatSidebar() {
  const c = $('#chatSidebar'); if (!c) return;
  c.innerHTML = '<div class="cs-label">Scenarios</div>';
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `cs-scen ${key === state.currentScenario ? 'active' : ''} ${locked ? 'locked-s' : ''}`;
    el.onclick = locked
      ? () => switchPanel($$('.app-nav-btn')[3], 'upgrade')
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
  const strip = $('#sugStrip');
  if (strip) strip.innerHTML = sugs.map(s =>
    `<button class="sug-chip" onclick="useSuggestion(this)">${s}</button>`
  ).join('');
}

function resetChat() {
  state.history = [];
  const area = $('#msgsArea'); if (area) area.innerHTML = '';
}

function updateChatHeader() {
  const sc = SCENARIOS[state.currentScenario];
  const av = $('#cpAv'); const nm = $('#cpName');
  if (av) av.textContent = sc.av;
  if (nm) nm.textContent = sc.name;
}

function addBubble(type, text) {
  const area = $('#msgsArea'); if (!area) return;
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
  const area = $('#msgsArea'); if (!area) return;
  const card = document.createElement('div');
  card.className = 'coach-card';
  card.innerHTML = `<div class="cc-hdr">🎯 Dating Coach</div>${html}`;
  area.appendChild(card);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = $('#msgsArea'); if (!area) return;
  const sc = SCENARIOS[state.currentScenario];
  const row = document.createElement('div');
  row.className = 'msg-row'; row.id = 'typingRow';
  row.innerHTML = `<div class="m-av ai">${sc.av}</div><div class="typing-bub"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>`;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function hideTyping() {
  const r = $('#typingRow'); if (r) r.remove();
}

// ============ CLAUDE API CALL ============
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
  const input = $('#chatInput');
  const sendBtn = $('#sendBtn');
  if (!input || state.loading) return;

  const raw = input.value.trim();
  if (!raw) { showToast('Kuch toh likho! 🤔', 'error'); return; }

  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  if (state.minsUsed >= max && state.plan === 'free') {
    switchPanel($$('.app-nav-btn')[3], 'upgrade');
    showToast('Limit ho gayi! Upgrade karo 🚀', 'error');
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
    const reply = await callClaude(
      state.history,
      SCENARIOS[state.currentScenario].system
    );
    hideTyping();
    state.history.push({ role: 'assistant', content: reply });
    addBubble('ai', reply);
  } catch(e) {
    hideTyping();
    const msg = e.message.includes('429') ? 'Thoda ruko, bahut fast messages! ⏳' :
                'Connection issue. Try again! 🔄';
    addBubble('ai', msg);
    showToast(msg, 'error');
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

function useSuggestion(btn) {
  const text = btn.textContent;
  const input = $('#chatInput');
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
  const c = $('#courseList'); if (!c) return;
  c.innerHTML = '';

  const week1 = COURSE_DAYS.filter(d => d.free);
  c.innerHTML += `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--pink);margin-bottom:12px;display:flex;align-items:center;gap:10px">WEEK 1 — FREE <span style="flex:1;height:1px;background:var(--pink-pale2);display:block"></span></div>`;
  week1.forEach(day => {
    const cls = day.done ? 'cd-done' : day.cur ? 'cd-cur' : 'cd-default';
    const icon = day.done ? '✓' : day.day;
    c.innerHTML += `<div class="cd-row" style="margin-bottom:8px;cursor:pointer" onclick="showToast('Day ${day.day}: ${day.title} — Coming soon! 📚')"><div class="cd-num ${cls}">${icon}</div><div class="cd-info"><div class="cd-t">${day.title}</div><div class="cd-s">${day.subtitle} · Free</div></div></div>`;
  });

  const week2 = COURSE_DAYS.filter(d => !d.free);
  c.innerHTML += `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin:20px 0 12px;display:flex;align-items:center;gap:10px">WEEK 2–4 — STARTER+ <span style="flex:1;height:1px;background:var(--border);display:block"></span></div>`;
  week2.forEach(day => {
    const locked = state.plan === 'free';
    c.innerHTML += `<div class="cd-row" style="margin-bottom:8px;cursor:${locked?'not-allowed':'pointer'};opacity:${locked?'0.5':'1'}" onclick="${locked?`switchPanel($$('.app-nav-btn')[3],'upgrade')`:`showToast('Day ${day.day}: ${day.title} — Coming soon!')`}"><div class="cd-num cd-lock">${locked?'🔒':day.day}</div><div class="cd-info"><div class="cd-t">${day.title}</div><div class="cd-s">${day.subtitle} · ${locked?'Unlock Starter':'Unlocked'}</div></div></div>`;
  });
}

// ============ PRICING ============
function buildAppPlans() {
  const c = $('#appPlans'); if (!c) return;
  c.innerHTML = `
    <div class="pricing-grid upgrade-plans">
      <div class="price-card">
        <div class="pc-name">Free</div>
        <div class="pc-price">₹0</div>
        <div class="pc-tagline">Forever free</div>
        <div class="pc-feats">
          <div class="pf">20 min AI practice/day</div>
          <div class="pf">3 free scenarios</div>
          <div class="pf">Week 1 course</div>
          <div class="pf off">All 6 scenarios</div>
          <div class="pf off">Wingman Mode</div>
        </div>
        <button class="pc-btn pc-btn-out" disabled>Current Plan</button>
      </div>
      <div class="price-card hot">
        <div class="hot-badge">🔥 Popular</div>
        <div class="pc-name">Starter</div>
        <div class="pc-price"><sup>₹</sup>199<sub>/mo</sub></div>
        <div class="pc-tagline">Cancel anytime</div>
        <div class="pc-feats">
          <div class="pf">60 min AI practice/day</div>
          <div class="pf">All 6 scenarios</div>
          <div class="pf">Full 30-day course</div>
          <div class="pf">Wingman Mode</div>
          <div class="pf off">Voice calls</div>
        </div>
        <button class="pc-btn pc-btn-main" onclick="unlockDemo('starter')">Get Starter ⚡</button>
      </div>
      <div class="price-card">
        <div class="pc-name">Pro</div>
        <div class="pc-price"><sup>₹</sup>499<sub>/mo</sub></div>
        <div class="pc-tagline">Full access</div>
        <div class="pc-feats">
          <div class="pf">Unlimited chat + voice</div>
          <div class="pf">90-day course</div>
          <div class="pf">Unlimited Wingman</div>
          <div class="pf">Human coach Q&A</div>
          <div class="pf">Profile review</div>
        </div>
        <button class="pc-btn pc-btn-main" onclick="unlockDemo('pro')">Get Pro 👑</button>
      </div>
    </div>`;
}

function unlockDemo(plan) {
  state.plan = plan;
  saveUserData();
  buildApp();
  showToast(`🎉 ${plan === 'pro' ? 'Pro' : 'Starter'} unlocked! Sab scenarios open hai!`, 'success');
  switchPanel($$('.app-nav-btn')[0], 'dashboard');
}

// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});
