/**
 * RizzUp AI — app.js (FIXED)
 */

const CONFIG = {
  API_URL: 'https://api.anthropic.com/v1/messages',
  MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 600,
  MAX_CHARS: 500,
};

const SCENARIOS = {
  first_date: {
    name: 'Priya', av: '👩', emoji: '☕', label: 'First Date',
    desc: 'Coffee meetup, break the ice', free: true,
    system: `You are Priya, a 25-year-old Mumbai girl on a first coffee date. Keep responses 1-3 short sentences. Use Hinglish.`,
    suggestions: ["Heyy! Tu actually apni photo jaisa hai 😄", "Okay first question — chai ya coffee?", "Honestly mujhe bhi first dates awkward lagte hain"]
  },
  texting: {
    name: 'Ananya', av: '💬', emoji: '💬', label: 'Texting',
    desc: 'Dating app convo', free: true,
    system: `You are Ananya, casual texting style. Keep it very short like real texts.`,
    suggestions: ["heyyy finally texted 😄", "okay one question — pizza ya biryani?"]
  },
  rejection: {
    name: 'Simran', av: '💪', emoji: '💪', label: 'Rejection',
    desc: 'Handle it gracefully', free: true,
    system: `You are Simran letting someone down gently. Short realistic replies.`,
    suggestions: ["Haha no worries, you're still cool! 😄", "Fair enough — I respect the honesty"]
  },
  flirting: {
    name: 'Rhea', av: '😏', emoji: '😏', label: 'Flirting',
    desc: 'Playful banter', free: false,
    system: `You are Rhea, confident and playful. Keep replies short, punchy.`,
    suggestions: ["Okay I've been trying to think of a good line 😅", "You have a very distracting smile"]
  },
  arranged: {
    name: 'Pooja', av: '🌸', emoji: '💐', label: 'Arranged Meet',
    desc: 'Family intro', free: false,
    system: `You are Pooja at a first arranged meeting. Polite but assessing compatibility.`,
    suggestions: ["Yeh situation thoda awkward hai na? 😅", "Honestly what are you looking for?"]
  },
  second_date: {
    name: 'Megha', av: '🌙', emoji: '🌙', label: '2nd Date',
    desc: 'Deepen connection', free: false,
    system: `You are Megha on a second date. First date went okay but you want depth.`,
    suggestions: ["Tell me something you didn't last time", "What's your most random skill?"]
  }
};

const OPENING_MESSAGES = {
  first_date: "Hiii! *nervously sips coffee* Sorry thoda late — Mumbai traffic 😅",
  texting: "heyyy so you actually texted 👀 what made you swipe?",
  rejection: "Hey, I wanted to be upfront... I think you're sweet but I don't see this going romantically.",
  flirting: "Oh so you said hi 😏 Bold move. Prove karo ki it was worth my time.",
  arranged: "Hii! *awkward laugh* Yeh situation thoda weird hai for both of us?",
  second_date: "Hey! Glad you came 😄 Last time was nice but I feel like I don't actually know you."
};

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

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== AUTH MODAL (FIXED) =====
let currentAuthMode = 'signup';

function openAuthModal(mode) {
  currentAuthMode = mode;
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('open');
    modal.style.display = 'flex';
  }
  renderAuthForm();
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
}

const GOOGLE_SVG = `<svg width="20" height="20" viewBox="0 0 20 20"><path fill="#4285F4" d="M10.001 3.333c-1.836 0-3.392.6-4.666 1.805l2.22 2.22c.717-.693 1.584-1.025 2.446-1.025 1.025 0 1.82.342 2.404.917l2.404-2.404C13.333 3.542 11.833 3.333 10.001 3.333z"/><path fill="#34A853" d="M18.979 10.205c0-.678-.063-1.323-.177-1.946H10v3.684h5.058c-.22 1.177-.884 2.177-1.884 2.846v2.334h3.008c1.763-1.625 2.792-4.021 2.792-6.918z"/><path fill="#FBBC05" d="M4.979 12.136A6.667 6.667 0 014.667 10c0-.763.113-1.496.312-2.136V5.53H1.979A9.996 9.996 0 0010 18.333c2.771 0 5.092-.917 6.804-2.48l-3.008-2.333c-.917.613-2.125.98-3.796.98-2.583 0-4.771-1.75-5.542-4.104z"/><path fill="#EA4335" d="M10 1.667c1.521 0 2.896.521 3.979 1.542l2.404-2.404C14.542.313 12.417 0 10 0 6.271 0 3.042 2.146 1.979 5.53l3.008 2.333C5.771 5.417 7.958 1.667 10 1.667z"/></svg>`;

function renderAuthForm() {
  const box = document.getElementById('authModalBox');
  if (!box) return;
  
  if (currentAuthMode === 'signup') {
    box.innerHTML = `
      <button class="modal-close" onclick="closeAuthModal()">✕</button>
      <h2 class="modal-title">Join RizzUp AI 💘</h2>
      <p class="modal-subtitle">Free forever. No credit card. 30 seconds.</p>
      <div class="auth-form">
        <input type="text" id="authName" placeholder="Your Name">
        <input type="email" id="authEmail" placeholder="Email">
        <input type="password" id="authPassword" placeholder="Password (6+ chars)">
        <button class="btn btn-primary" onclick="doSignup()">Create Free Account 🚀</button>
        <button class="btn btn-google" onclick="doGoogleLogin()">${GOOGLE_SVG} Continue with Google</button>
      </div>
      <p class="auth-switch">Already have account? <a onclick="openAuthModal('login')">Login here</a></p>
    `;
  } else {
    box.innerHTML = `
      <button class="modal-close" onclick="closeAuthModal()">✕</button>
      <h2 class="modal-title">Welcome Back! 👋</h2>
      <p class="modal-subtitle">Login to continue your journey.</p>
      <div class="auth-form">
        <input type="email" id="loginEmail" placeholder="Email">
        <input type="password" id="loginPassword" placeholder="Password">
        <button class="btn btn-primary" onclick="doLogin()">Login →</button>
        <button class="btn btn-google" onclick="doGoogleLogin()">${GOOGLE_SVG} Continue with Google</button>
      </div>
      <p class="auth-switch">Don't have account? <a onclick="openAuthModal('signup')">Sign Up Free</a></p>
    `;
  }
}

// ===== SUPABASE AUTH =====
async function doSignup() {
  const name = document.getElementById('authName')?.value.trim();
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;
  
  if (!name || !email || !password) {
    showToast('Please fill all fields', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be 6+ characters', 'error');
    return;
  }
  
  const { error } = await window.supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });
  
  if (error) {
    showToast(error.message, 'error');
  } else {
    showToast('🎉 Account created! Check email to verify', 'success');
    closeAuthModal();
    setTimeout(() => openAuthModal('login'), 2000);
  }
}

async function doLogin() {
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  
  if (!email || !password) {
    showToast('Please fill all fields', 'error');
    return;
  }
  
  const { error } = await window.supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    showToast('Invalid email or password', 'error');
  }
}

async function doGoogleLogin() {
  const { error } = await window.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) showToast(error.message, 'error');
}

async function doLogout() {
  await window.supabase.auth.signOut();
  showToast('Logged out! See you soon 👋', 'default');
}

// ===== AUTH STATE LISTENER =====
if (window.supabase) {
  window.supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const name = session.user.user_metadata?.full_name || 
                   session.user.user_metadata?.name || 
                   session.user.email.split('@')[0];
      initUserFromAuth(name, session.user.email, session.user.id);
      closeAuthModal();
    }
    if (event === 'SIGNED_OUT') {
      state.user = null;
      document.getElementById('appView').style.display = 'none';
      document.getElementById('landingView').style.display = 'block';
    }
  });

  // Check existing session on load
  window.supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      const name = data.session.user.user_metadata?.full_name || 
                   data.session.user.user_metadata?.name || 
                   data.session.user.email.split('@')[0];
      setTimeout(() => initUserFromAuth(name, data.session.user.email, data.session.user.id), 500);
    }
  });
}

// ===== APP INITIALIZATION =====
function initUserFromAuth(name, email, uid) {
  state.user = { id: uid, name, email };
  loadUserData();

  const today = new Date().toDateString();
  if (localStorage.getItem(`rz_d_${state.user.id}`) !== today) {
    state.minsUsed = 0;
    localStorage.setItem(`rz_d_${state.user.id}`, today);
  }

  document.getElementById('landingView').style.display = 'none';
  document.getElementById('appView').style.display = 'block';
  
  buildApp();
  showToast(`Welcome, ${name.split(' ')[0]}! 🚀`, 'success');
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
    plan: state.plan,
    minsUsed: state.minsUsed,
    totalMsgs: state.totalMsgs,
    sessions: state.sessions
  }));
  localStorage.setItem(`rz_sc_${state.user.id}`, state.currentScenario);
}

// ===== BUILD APP =====
function buildApp() {
  const name = state.user.name.split(' ')[0];
  
  const greet = document.getElementById('dashGreet');
  if (greet) greet.textContent = `Hey ${name}! 👋`;

  const badge = document.getElementById('appPlanBadge');
  if (badge) badge.textContent = { free: 'Free Plan', starter: 'Starter Plan', pro: 'Pro Plan' }[state.plan];

  const userNameEl = document.getElementById('appUserName');
  if (userNameEl) userNameEl.textContent = name;

  buildDashboardScenarios();
  updateDashboard();
  initChat();
}

function updateDashboard() {
  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  const pct = Math.min((state.minsUsed / max) * 100, 100);

  const minsEl = document.getElementById('dashMins');
  if (minsEl) minsEl.textContent = Math.floor(state.minsUsed);

  const msgsEl = document.getElementById('dashMsgs');
  if (msgsEl) msgsEl.textContent = state.totalMsgs;

  const streakEl = document.getElementById('dashStreak');
  if (streakEl) streakEl.textContent = state.sessions || 0;
}

function buildDashboardScenarios() {
  const c = document.getElementById('dashScens');
  if (!c) return;
  c.innerHTML = '';
  
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `app-scen-card ${locked ? 'locked' : ''}`;
    el.onclick = locked 
      ? () => showToast('Upgrade to unlock! 🚀', 'error')
      : () => startScenario(key);
    el.innerHTML = `
      <div style="font-size:32px">${sc.emoji}</div>
      <h3>${sc.label}</h3>
      <p>${sc.desc}</p>
      <span class="badge ${locked ? 'badge-locked' : 'badge-free'}">${sc.free ? 'Free' : '🔒 Starter+'}</span>
    `;
    c.appendChild(el);
  });
}

function startScenario(key) {
  state.currentScenario = key;
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-practice').classList.add('active');
  initChat();
}

// ===== CHAT =====
function initChat() {
  updateChatHeader();
  resetChat();
  
  const opening = OPENING_MESSAGES[state.currentScenario];
  state.history = [{ role: 'assistant', content: opening }];
  addBubble('ai', opening);

  const sugs = SCENARIOS[state.currentScenario].suggestions || [];
  const strip = document.getElementById('sugStrip');
  if (strip) {
    strip.innerHTML = sugs.map(s => 
      `<button class="btn btn-outline" style="font-size:12px;padding:8px 12px" onclick="useSuggestion('${s.replace(/'/g, "\\'")}')">${s}</button>`
    ).join('');
  }
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
    <div style="font-size:24px">${type === 'ai' ? sc.av : '🧑'}</div>
    <div class="msg-bubble">${text}</div>
  `;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function useSuggestion(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  if (!input || state.loading) return;

  const raw = input.value.trim();
  if (!raw) { showToast('Kuch toh likho! 🤔', 'error'); return; }

  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  if (state.minsUsed >= max && state.plan === 'free') {
    showToast('Daily limit reached! Upgrade 🚀', 'error');
    return;
  }

  const text = raw.slice(0, CONFIG.MAX_CHARS);
  input.value = '';
  state.loading = true;
  if (sendBtn) sendBtn.disabled = true;

  addBubble('user', text);
  state.history.push({ role: 'user', content: text });
  state.minsUsed += 0.5;
  state.totalMsgs++;
  updateDashboard();

  // Show typing indicator
  const area = document.getElementById('msgsArea');
  const typing = document.createElement('div');
  typing.className = 'msg-row';
  typing.id = 'typingRow';
  typing.innerHTML = `<div style="font-size:24px">${SCENARIOS[state.currentScenario].av}</div><div class="msg-bubble">...</div>`;
  area.appendChild(typing);

  try {
    const reply = await callClaude(state.history, SCENARIOS[state.currentScenario].system);
    typing.remove();
    state.history.push({ role: 'assistant', content: reply });
    addBubble('ai', reply);
  } catch(e) {
    typing.remove();
    addBubble('ai', 'Connection issue. Try again! 🔄');
    showToast('Connection issue. Try again! 🔄', 'error');
  }

  saveUserData();
  state.loading = false;
  if (sendBtn) sendBtn.disabled = false;
  input.focus();
}

async function callClaude(messages, systemPrompt) {
  const response = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'x-api-key': 'YOUR_ANTHROPIC_API_KEY' // ⚠️ ADD YOUR API KEY HERE
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

// ===== NAVIGATION =====
function switchPanel(panelId) {
  document.querySelectorAll('.app-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('active'));
  
  const btn = document.querySelector(`[data-panel="${panelId}"]`);
  if (btn) btn.classList.add('active');
  
  const panel = document.getElementById(`panel-${panelId}`);
  if (panel) panel.classList.add('active');
}

// Make functions global
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.doSignup = doSignup;
window.doLogin = doLogin;
window.doGoogleLogin = doGoogleLogin;
window.doLogout = doLogout;
window.showToast = showToast;
window.sendMessage = sendMessage;
window.useSuggestion = useSuggestion;
window.switchPanel = switchPanel;
