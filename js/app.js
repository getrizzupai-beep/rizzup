/**
 * RizzUp AI — app.js
 * Full Supabase Auth: Email/Password + Google OAuth
 */

// ============ SUPABASE INIT ============
const SUPABASE_URL = 'https://xzdjxvitqktsfeuzshik.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zCeAZp1ZBclQ_tsgDbBVyQ_jHyTCIoW';

// Load Supabase from CDN (added in index.html <head>)
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ CONFIG ============
const CONFIG = {
  GROQ_API_KEY: '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',
  GROQ_URL: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_MODEL: 'llama-3.1-8b-instant',
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

// ============ AUTH MODAL ============
let authMode = 'signup'; // 'signup' | 'login' | 'otp'

function openAuthModal(mode = 'signup') {
  authMode = mode;
  renderAuthModal();
  $('#authModal').classList.add('open');
}

function closeAuthModal() {
  $('#authModal').classList.remove('open');
}

$('#authModal').addEventListener('click', (e) => {
  if (e.target === $('#authModal')) closeAuthModal();
});

function renderAuthModal() {
  const box = $('#authModalBox');
  if (!box) return;

  if (authMode === 'signup') {
    box.innerHTML = `
      <div style="text-align:center;font-size:36px;margin-bottom:8px">💘</div>
      <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:800;text-align:center;margin-bottom:4px">Create Account</h3>
      <p style="text-align:center;color:var(--muted);font-size:13px;margin-bottom:20px">Join 5,000+ Indians mastering dating — free!</p>

      <button class="btn-google-modal" onclick="signInWithGoogle()">
        <svg width="18" height="18" viewBox="0 0 18 18" style="margin-right:8px;flex-shrink:0"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </button>

      <div class="modal-divider"><span>or sign up with email</span></div>

      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input id="mName" class="form-input" placeholder="Rahul Kumar" type="text">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input id="mEmail" class="form-input" placeholder="rahul@gmail.com" type="email">
      </div>
      <div class="form-group" style="position:relative">
        <label class="form-label">Password</label>
        <input id="mPass" class="form-input" placeholder="Min 6 characters" type="password" style="padding-right:44px">
        <span onclick="togglePass('mPass',this)" style="position:absolute;right:14px;top:38px;cursor:pointer;color:var(--muted);font-size:16px">👁</span>
      </div>

      <button class="btn-primary" style="width:100%;margin-bottom:12px" onclick="doSignup()">Create Account →</button>
      <p style="text-align:center;font-size:13px;color:var(--muted)">Already have an account? <a href="#" onclick="openAuthModal('login')" style="color:var(--pink);font-weight:700;text-decoration:none">Sign In</a></p>
    `;
  } else if (authMode === 'login') {
    box.innerHTML = `
      <div style="text-align:center;font-size:36px;margin-bottom:8px">👋</div>
      <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:800;text-align:center;margin-bottom:4px">Welcome Back!</h3>
      <p style="text-align:center;color:var(--muted);font-size:13px;margin-bottom:20px">Sign in to continue your practice</p>

      <button class="btn-google-modal" onclick="signInWithGoogle()">
        <svg width="18" height="18" viewBox="0 0 18 18" style="margin-right:8px;flex-shrink:0"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </button>

      <div class="modal-divider"><span>or sign in with email</span></div>

      <div class="form-group">
        <label class="form-label">Email</label>
        <input id="mEmail" class="form-input" placeholder="rahul@gmail.com" type="email">
      </div>
      <div class="form-group" style="position:relative">
        <label class="form-label">Password</label>
        <input id="mPass" class="form-input" placeholder="Your password" type="password" style="padding-right:44px">
        <span onclick="togglePass('mPass',this)" style="position:absolute;right:14px;top:38px;cursor:pointer;color:var(--muted);font-size:16px">👁</span>
      </div>

      <button class="btn-primary" style="width:100%;margin-bottom:12px" onclick="doLogin()">Sign In →</button>
      <p style="text-align:center;font-size:13px;color:var(--muted)">Don't have an account? <a href="#" onclick="openAuthModal('signup')" style="color:var(--pink);font-weight:700;text-decoration:none">Sign Up Free</a></p>
    `;
  }
}

function togglePass(id, icon) {
  const inp = $(`#${id}`);
  if (inp.type === 'password') { inp.type = 'text'; icon.textContent = '🙈'; }
  else { inp.type = 'password'; icon.textContent = '👁'; }
}

function setAuthLoading(btn, loading, text) {
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? '...' : text;
}

// ============ SUPABASE AUTH FUNCTIONS ============

async function signInWithGoogle() {
  try {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) { showToast('Google sign-in failed: ' + error.message, 'error'); }
  } catch(e) {
    showToast('Google sign-in error. Try again!', 'error');
  }
}

async function doSignup() {
  const name = $('#mName')?.value.trim();
  const email = $('#mEmail')?.value.trim();
  const pass = $('#mPass')?.value;

  if (!name) { showToast('Naam toh bolo! 😄', 'error'); return; }
  if (!email || !email.includes('@')) { showToast('Valid email chahiye!', 'error'); return; }
  if (!pass || pass.length < 6) { showToast('Password kam se kam 6 characters ka ho!', 'error'); return; }

  const btn = document.querySelector('#authModalBox .btn-primary');
  setAuthLoading(btn, true, 'Creating Account →');

  try {
    const { data, error } = await sb.auth.signUp({
      email,
      password: pass,
      options: { data: { name } }
    });

    if (error) {
      showToast(error.message, 'error');
      setAuthLoading(btn, false, 'Create Account →');
      return;
    }

    if (data.user && !data.session) {
      // Email confirmation required
      $('#authModalBox').innerHTML = `
        <div style="text-align:center;padding:20px 0">
          <div style="font-size:48px;margin-bottom:16px">📧</div>
          <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px">Check Your Email!</h3>
          <p style="color:var(--muted);font-size:14px;line-height:1.6">Confirmation link bhej diya <strong>${email}</strong> pe.<br>Link click karo aur login karo!</p>
          <button class="btn-primary" style="width:100%;margin-top:20px" onclick="openAuthModal('login')">Go to Sign In</button>
        </div>`;
    } else if (data.session) {
      // Auto-confirmed
      await onUserLoggedIn(data.user, name);
    }
  } catch(e) {
    showToast('Signup error. Try again!', 'error');
    setAuthLoading(btn, false, 'Create Account →');
  }
}

async function doLogin() {
  const email = $('#mEmail')?.value.trim();
  const pass = $('#mPass')?.value;

  if (!email) { showToast('Email daalo!', 'error'); return; }
  if (!pass) { showToast('Password daalo!', 'error'); return; }

  const btn = document.querySelector('#authModalBox .btn-primary');
  setAuthLoading(btn, true, 'Signing In →');

  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });

    if (error) {
      const msg = error.message.includes('Invalid') ? 'Wrong email ya password!' : error.message;
      showToast(msg, 'error');
      setAuthLoading(btn, false, 'Sign In →');
      return;
    }

    await onUserLoggedIn(data.user);
  } catch(e) {
    showToast('Login error. Try again!', 'error');
    setAuthLoading(btn, false, 'Sign In →');
  }
}

async function onUserLoggedIn(authUser, fallbackName = null) {
  const name = authUser.user_metadata?.name ||
               authUser.user_metadata?.full_name ||
               fallbackName ||
               authUser.email?.split('@')[0] ||
               'User';

  state.user = {
    id: authUser.id,
    name,
    email: authUser.email
  };

  // Upsert user in DB
  await sb.from('users').upsert({
    id: authUser.id,
    email: authUser.email,
    name,
    plan: 'free',
    updated_at: new Date().toISOString()
  }, { onConflict: 'id', ignoreDuplicates: true });

  // Load saved data
  await loadUserDataFromDB();

  closeAuthModal();
  $('#landingView').style.display = 'none';
  $('#appView').style.display = 'block';
  buildApp();
  showToast(`Welcome, ${name.split(' ')[0]}! 🚀 Let's gooo`, 'success');
}

async function loadUserDataFromDB() {
  if (!state.user) return;
  try {
    const { data } = await sb.from('users').select('*').eq('id', state.user.id).single();
    if (data) {
      state.plan = data.plan || 'free';
      state.minsUsed = data.mins_used || 0;
      state.totalMsgs = data.total_msgs || 0;
      state.sessions = data.sessions || 0;
    }
  } catch(e) {
    // Fallback to localStorage
    const saved = localStorage.getItem(`rz_${state.user.id}`);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        state.plan = d.plan || 'free';
        state.minsUsed = d.minsUsed || 0;
        state.totalMsgs = d.totalMsgs || 0;
        state.sessions = d.sessions || 0;
      } catch(e2) {}
    }
  }

  const sc = localStorage.getItem(`rz_sc_${state.user.id}`);
  if (sc && SCENARIOS[sc]) state.currentScenario = sc;
}

async function saveUserData() {
  if (!state.user) return;
  // Save to localStorage always
  localStorage.setItem(`rz_${state.user.id}`, JSON.stringify({
    plan: state.plan, minsUsed: state.minsUsed,
    totalMsgs: state.totalMsgs, sessions: state.sessions
  }));
  localStorage.setItem(`rz_sc_${state.user.id}`, state.currentScenario);
  // Also try DB
  try {
    await sb.from('users').update({
      plan: state.plan,
      mins_used: Math.floor(state.minsUsed),
      total_msgs: state.totalMsgs,
      sessions: state.sessions,
      updated_at: new Date().toISOString()
    }).eq('id', state.user.id);
  } catch(e) {}
}

async function doLogout() {
  await saveUserData();
  await sb.auth.signOut();
  state = { ...state, user: null, history: [], plan: 'free', minsUsed: 0, totalMsgs: 0, sessions: 0 };
  $('#appView').style.display = 'none';
  $('#landingView').style.display = 'block';
  showToast('Logged out! Phir milenge 👋');
}

setInterval(saveUserData, CONFIG.AUTO_SAVE_INTERVAL);

// ============ SESSION RESTORE on page load ============
(async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    await onUserLoggedIn(session.user);
  }

  // Listen for auth changes (Google OAuth callback lands here)
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user && !state.user) {
      await onUserLoggedIn(session.user);
    }
    if (event === 'SIGNED_OUT') {
      state.user = null;
    }
  });
})();

// ============ LANDING PAGE ============
function switchFeature(el, idx) {
  $$('.feat-tab').forEach(t => t.classList.remove('active'));
  $$('.preview-card').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(`prev-${idx}`).classList.add('active');
}

function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
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
  state.history = [{ role: 'model', content: opening }];
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

// ============ CLAUDE API ============
async function callGroq(history, systemPrompt) {
  const messages = history.map(m => ({
    role: (m.role === 'model' || m.role === 'assistant') ? 'assistant' : 'user',
    content: m.content
  }));
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system: systemPrompt })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
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
    const reply = await callGroq(state.history, SCENARIOS[state.currentScenario].system);
    hideTyping();
    state.history.push({ role: 'model', content: reply });
    addBubble('ai', reply);
  } catch(e) {
    hideTyping();
    const msg = e.message.includes('429') ? 'Thoda ruko, bahut fast messages! ⏳' : 'Connection issue. Try again! 🔄';
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
  const convo = state.history.map(m => `${m.role === 'user' ? 'User' : sc.name}: ${m.content}`).join('\n');

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
    const reply = await callGroq(
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
  showToast(`🎉 ${plan === 'pro' ? 'Pro' : 'Starter'} unlocked!`, 'success');
  switchPanel($$('.app-nav-btn')[0], 'dashboard');
}

// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});
