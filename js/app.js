/**
 * RizzUp AI — app.js
 * Full Supabase Auth: Signup + Login (Password/OTP) + Google
 */

// ============ SUPABASE CONFIG ============
const SUPABASE_URL = 'https://xzdjxvitqktsfeuzshik.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zCeAZp1ZBclQ_tsgDbBVyQ_jHyTCIoW';
let supabase = null;

async function initSupabase() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) await loadUserFromSupabase(session.user);

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await loadUserFromSupabase(session.user);
    } else if (event === 'SIGNED_OUT') {
      handleSignedOut();
    }
  });
}

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
  loading: false,
  authMode: 'signup',
  otpEmail: ''
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

function showToast(message, type = 'default') {
  const existing = $('.toast');
  if (existing) { existing.textContent = message; existing.className = `toast ${type} show`; return; }
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ============ AUTH MODAL ============
function openAuthModal(mode = 'signup') {
  state.authMode = mode;
  renderAuthModal();
  $('#authModal').classList.add('open');
}

function closeAuthModal() {
  $('#authModal').classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (e.target?.id === 'authModal') closeAuthModal();
});

function renderAuthModal() {
  const box = $('#authModalBox');
  if (!box) return;

  // ---- SIGNUP ----
  if (state.authMode === 'signup') {
    box.innerHTML = `
      <button onclick="closeAuthModal()" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:var(--muted);line-height:1">✕</button>
      <div style="text-align:center;font-size:38px;margin-bottom:8px">💘</div>
      <h3 class="modal-title">Join RizzUp AI</h3>
      <p class="modal-sub">Free forever. No credit card. 30 seconds.</p>

      <div class="form-group">
        <label class="form-label">Your Name</label>
        <input id="authName" class="form-input" type="text" placeholder="Rahul Kumar">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input id="authEmail" class="form-input" type="email" placeholder="rahul@gmail.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <div style="position:relative">
          <input id="authPassword" class="form-input" type="password" placeholder="Min 6 characters" style="padding-right:44px">
          <button type="button" onclick="togglePass('authPassword',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:var(--muted)">👁️</button>
        </div>
      </div>

      <button id="signupBtn" class="btn-primary" style="width:100%;margin-bottom:12px" onclick="doSignup()">Create Free Account 🚀</button>

      <div class="modal-divider"><span>or</span></div>
      <button class="btn-google-modal" onclick="doGoogleLogin()">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted)">
        Already have account? <a href="#" style="color:var(--pink);font-weight:700" onclick="openAuthModal('login');return false">Login here →</a>
      </p>`;

  // ---- LOGIN ----
  } else if (state.authMode === 'login') {
    box.innerHTML = `
      <button onclick="closeAuthModal()" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:var(--muted);line-height:1">✕</button>
      <div style="text-align:center;font-size:38px;margin-bottom:8px">👋</div>
      <h3 class="modal-title">Welcome Back!</h3>
      <p class="modal-sub">Login to continue your journey.</p>

      <div class="form-group">
        <label class="form-label">Email</label>
        <input id="authEmail" class="form-input" type="email" placeholder="rahul@gmail.com">
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button id="methPassBtn" onclick="setLoginMethod('password')" style="flex:1;padding:9px 8px;border-radius:10px;border:1.5px solid var(--pink);background:#fff0f3;color:var(--pink);font-weight:700;cursor:pointer;font-size:13px;font-family:inherit">🔑 Password</button>
        <button id="methOtpBtn" onclick="setLoginMethod('otp')" style="flex:1;padding:9px 8px;border-radius:10px;border:1.5px solid var(--border);background:none;color:var(--muted);font-weight:700;cursor:pointer;font-size:13px;font-family:inherit">📧 Magic Link</button>
      </div>

      <div id="passSection">
        <div class="form-group">
          <label class="form-label">Password</label>
          <div style="position:relative">
            <input id="authPassword" class="form-input" type="password" placeholder="Your password" style="padding-right:44px">
            <button type="button" onclick="togglePass('authPassword',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:var(--muted)">👁️</button>
          </div>
        </div>
        <div style="text-align:right;margin:-4px 0 14px">
          <a href="#" style="font-size:13px;color:var(--pink);font-weight:600" onclick="setLoginMethod('otp');return false">Forgot password? Use magic link →</a>
        </div>
        <button id="loginBtn" class="btn-primary" style="width:100%;margin-bottom:12px" onclick="doLogin()">Login →</button>
      </div>

      <div id="otpSection" style="display:none">
        <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.5">Email pe magic link bhejenge — no password needed! Click the link to login instantly.</p>
        <button id="otpBtn" class="btn-primary" style="width:100%;margin-bottom:12px" onclick="doOTPLogin()">Send Magic Link 📧</button>
      </div>

      <div class="modal-divider"><span>or</span></div>
      <button class="btn-google-modal" onclick="doGoogleLogin()">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted)">
        New here? <a href="#" style="color:var(--pink);font-weight:700" onclick="openAuthModal('signup');return false">Create free account →</a>
      </p>`;

  // ---- OTP SENT ----
  } else if (state.authMode === 'otp_sent') {
    box.innerHTML = `
      <div style="text-align:center;padding:1rem 0">
        <div style="font-size:56px;margin-bottom:14px">📬</div>
        <h3 class="modal-title">Email Check Karo!</h3>
        <p class="modal-sub">Magic link bhej diya <strong>${state.otpEmail}</strong> pe.<br>Link click karo — seedha login ho jaega!</p>
        <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:14px;margin:20px 0;font-size:14px;color:#059669;font-weight:700">
          ✅ Inbox check karo aur link pe click karo
        </div>
        <button onclick="openAuthModal('login')" style="width:100%;padding:11px;border-radius:10px;background:none;border:1.5px solid var(--border);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--muted)">← Back to Login</button>
      </div>`;
  }
}

// ---- Toggle password/otp method ----
function setLoginMethod(method) {
  const passBtn = document.getElementById('methPassBtn');
  const otpBtn = document.getElementById('methOtpBtn');
  const passSection = document.getElementById('passSection');
  const otpSection = document.getElementById('otpSection');
  if (!passBtn) return;

  const activeStyle = 'flex:1;padding:9px 8px;border-radius:10px;border:1.5px solid var(--pink);background:#fff0f3;color:var(--pink);font-weight:700;cursor:pointer;font-size:13px;font-family:inherit';
  const inactiveStyle = 'flex:1;padding:9px 8px;border-radius:10px;border:1.5px solid var(--border);background:none;color:var(--muted);font-weight:700;cursor:pointer;font-size:13px;font-family:inherit';

  if (method === 'password') {
    passBtn.style.cssText = activeStyle;
    otpBtn.style.cssText = inactiveStyle;
    passSection.style.display = '';
    otpSection.style.display = 'none';
  } else {
    otpBtn.style.cssText = activeStyle;
    passBtn.style.cssText = inactiveStyle;
    passSection.style.display = 'none';
    otpSection.style.display = '';
  }
}

// ---- Toggle password visibility ----
function togglePass(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁️' : '🙈';
}

// ============ AUTH FUNCTIONS ============
async function doSignup() {
  const name = document.getElementById('authName')?.value.trim();
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;

  if (!name || name.length < 2) { showToast('Apna naam daalo! 😊', 'error'); return; }
  if (!email || !email.includes('@')) { showToast('Valid email daalo!', 'error'); return; }
  if (!password || password.length < 6) { showToast('Password 6+ characters ka hona chahiye!', 'error'); return; }

  const btn = document.getElementById('signupBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating... ⏳'; }

  try {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, name: name } }
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id, email, name, plan: 'free',
        mins_used: 0, total_msgs: 0, sessions: 0,
        created_at: new Date().toISOString()
      });

      if (data.session) {
        showToast(`Welcome ${name.split(' ')[0]}! 🎉`, 'success');
        closeAuthModal();
        await loadUserFromSupabase(data.user);
      } else {
        showToast(`Account bana! 🎉 Check email to verify, then login.`, 'success');
        if (btn) { btn.disabled = false; btn.textContent = 'Create Free Account 🚀'; }
        setTimeout(() => openAuthModal('login'), 2000);
      }
    }
  } catch (err) {
    if (err.message?.includes('already registered')) {
      showToast('Email already registered! Login karo 😊', 'error');
      openAuthModal('login');
    } else {
      showToast(err.message || 'Signup failed. Try again!', 'error');
      if (btn) { btn.disabled = false; btn.textContent = 'Create Free Account 🚀'; }
    }
  }
}

async function doLogin() {
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;

  if (!email || !email.includes('@')) { showToast('Valid email daalo!', 'error'); return; }
  if (!password) { showToast('Password daalo!', 'error'); return; }

  const btn = document.getElementById('loginBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Logging in... ⏳'; }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showToast('Welcome back! 🔥', 'success');
    closeAuthModal();
    await loadUserFromSupabase(data.user);
  } catch (err) {
    const msg = err.message?.includes('Invalid') ? 'Email ya password galat hai!' : err.message || 'Login failed!';
    showToast(msg, 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Login →'; }
  }
}

async function doOTPLogin() {
  const email = document.getElementById('authEmail')?.value.trim();
  if (!email || !email.includes('@')) { showToast('Valid email daalo!', 'error'); return; }

  const btn = document.getElementById('otpBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending... ⏳'; }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
    state.otpEmail = email;
    state.authMode = 'otp_sent';
    renderAuthModal();
    showToast('Magic link bhej diya! Email check karo 📧', 'success');
  } catch (err) {
    showToast(err.message || 'Error sending link!', 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Send Magic Link 📧'; }
  }
}

async function doGoogleLogin() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
  } catch (err) {
    showToast('Google login mein problem! Try email se.', 'error');
  }
}

async function doLogout() {
  await saveUserToSupabase();
  await supabase.auth.signOut();
}

function handleSignedOut() {
  state = { ...state, user: null, plan: 'free', minsUsed: 0, totalMsgs: 0, sessions: 0, history: [] };
  document.getElementById('appView').style.display = 'none';
  document.getElementById('landingView').style.display = 'block';
  showToast('Logged out! See you soon 👋');
}

// ============ USER DATA ============
async function loadUserFromSupabase(authUser) {
  const { data: userData } = await supabase.from('users').select('*').eq('id', authUser.id).single();
  const name = userData?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User';

  state.user = { id: authUser.id, name, email: authUser.email };

  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(`rz_date_${authUser.id}`);
  if (lastDate !== today) {
    state.minsUsed = 0;
    localStorage.setItem(`rz_date_${authUser.id}`, today);
    await supabase.from('users').update({ mins_used: 0 }).eq('id', authUser.id);
  } else {
    state.minsUsed = userData?.mins_used || 0;
  }

  state.plan = userData?.plan || 'free';
  state.totalMsgs = userData?.total_msgs || 0;
  state.sessions = userData?.sessions || 0;

  if (!userData) {
    await supabase.from('users').upsert({
      id: authUser.id, email: authUser.email, name, plan: 'free',
      mins_used: 0, total_msgs: 0, sessions: 0,
      created_at: new Date().toISOString()
    });
  }

  closeAuthModal();
  document.getElementById('landingView').style.display = 'none';
  document.getElementById('appView').style.display = 'block';
  buildApp();
}

async function saveUserToSupabase() {
  if (!state.user || !supabase) return;
  await supabase.from('users').update({
    plan: state.plan,
    mins_used: state.minsUsed,
    total_msgs: state.totalMsgs,
    sessions: state.sessions,
    updated_at: new Date().toISOString()
  }).eq('id', state.user.id);
}

setInterval(saveUserToSupabase, CONFIG.AUTO_SAVE_INTERVAL);

// ============ APP BUILD ============
function buildApp() {
  const name = state.user.name.split(' ')[0];
  const greet = document.getElementById('dashGreet');
  if (greet) greet.textContent = `Hey ${name}! 👋`;
  const badge = document.getElementById('appPlanBadge');
  if (badge) badge.textContent = { free: 'Free Plan', starter: 'Starter Plan', pro: 'Pro Plan' }[state.plan];
  const logoutEl = document.getElementById('appLogout');
  if (logoutEl) { logoutEl.textContent = `Logout (${name})`; logoutEl.onclick = doLogout; }
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
  document.getElementById(`panel-${id}`)?.classList.add('active');
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
  if (strip) strip.innerHTML = sugs.map(s => `<button class="sug-chip" onclick="useSuggestion(this)">${s}</button>`).join('');
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
  if (!raw) return;

  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  if (state.minsUsed >= max && state.plan === 'free') {
    switchPanel($$('.app-nav-btn')[3], 'upgrade');
    showToast('Daily limit ho gayi! Upgrade karo 🚀', 'error');
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
    saveUserToSupabase();
  } catch (e) {
    hideTyping();
    const msg = e.message.includes('429') ? 'Thoda ruko, bahut fast messages! ⏳' : 'Connection issue. Try again! 🔄';
    addBubble('ai', msg);
  }

  state.loading = false;
  if (sendBtn) sendBtn.disabled = false;
  input.focus();
}

async function getCoach() {
  if (state.loading) return;
  if (state.history.length < 3) { addCoachCard('Thoda aur chat karo pehle — phir feedback dunga! 😄'); return; }
  state.loading = true;
  showTyping();

  const sc = SCENARIOS[state.currentScenario];
  const convo = state.history.map(m => `${m.role === 'user' ? 'User' : sc.name}: ${m.content}`).join('\n');
  const coachPrompt = `You are an expert Indian dating coach. Analyze this ${sc.label} conversation and give sharp, warm Hinglish feedback.\n\nConversation:\n${convo}\n\nReply EXACTLY in this format (max 90 words total):\n**Vibe Score:** X/10 — [one punchy line]\n**Kya kaam kiya:** [what worked — 1 line]\n**Improve karo:** [1-2 specific actionable tips]\n**Next bolna chahiye:** "[exact Hinglish line they should say next]"\n\nBe direct, fun, warm. Hinglish only. No generic advice.`;

  try {
    const reply = await callClaude([{ role: 'user', content: coachPrompt }], 'You are a sharp, warm Indian dating coach. Give advice in Hinglish. Always use the exact format asked.');
    hideTyping();
    addCoachCard(reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
  } catch (e) {
    hideTyping();
    addCoachCard('Coach unavailable right now. Try again! 🔄');
  }
  state.loading = false;
}

function useSuggestion(btn) {
  const input = $('#chatInput');
  if (input) { input.value = btn.textContent; sendMessage(); }
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
  c.innerHTML += `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--pink);margin-bottom:12px;display:flex;align-items:center;gap:10px">WEEK 1 — FREE <span style="flex:1;height:1px;background:var(--pink-pale2);display:block"></span></div>`;
  COURSE_DAYS.filter(d => d.free).forEach(day => {
    const cls = day.done ? 'cd-done' : day.cur ? 'cd-cur' : 'cd-default';
    c.innerHTML += `<div class="cd-row" style="margin-bottom:8px;cursor:pointer" onclick="showToast('Day ${day.day}: ${day.title} — Coming soon! 📚')"><div class="cd-num ${cls}">${day.done ? '✓' : day.day}</div><div class="cd-info"><div class="cd-t">${day.title}</div><div class="cd-s">${day.subtitle} · Free</div></div></div>`;
  });
  c.innerHTML += `<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin:20px 0 12px;display:flex;align-items:center;gap:10px">WEEK 2–4 — STARTER+ <span style="flex:1;height:1px;background:var(--border);display:block"></span></div>`;
  COURSE_DAYS.filter(d => !d.free).forEach(day => {
    const locked = state.plan === 'free';
    c.innerHTML += `<div class="cd-row" style="margin-bottom:8px;cursor:${locked ? 'not-allowed' : 'pointer'};opacity:${locked ? '0.5' : '1'}" onclick="${locked ? `switchPanel($$('.app-nav-btn')[3],'upgrade')` : `showToast('Day ${day.day}: ${day.title} — Coming soon!')`}"><div class="cd-num cd-lock">${locked ? '🔒' : day.day}</div><div class="cd-info"><div class="cd-t">${day.title}</div><div class="cd-s">${day.subtitle} · ${locked ? 'Unlock Starter' : 'Unlocked'}</div></div></div>`;
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
  saveUserToSupabase();
  buildApp();
  showToast(`🎉 ${plan === 'pro' ? 'Pro' : 'Starter'} unlocked! Sab scenarios open!`, 'success');
  switchPanel($$('.app-nav-btn')[0], 'dashboard');
}

// ============ LANDING ============
function switchFeature(el, idx) {
  $$('.feat-tab').forEach(t => t.classList.remove('active'));
  $$('.preview-card').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(`prev-${idx}`)?.classList.add('active');
}

function toggleFaq(el) {
  el.parentElement.classList.toggle('open');
}

// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});

// ============ INIT ============
initSupabase();
