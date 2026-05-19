// js/main.js

document.addEventListener('DOMContentLoaded', async () => {
  Auth.init();

  Auth.onAuthChange(async (event, user) => {
    if (event === 'SIGNED_IN' && user) {
      const profile = await Auth.getUserProfile(user.id);
      if (profile) {
        Dashboard.setProfile(profile);
        _updateNavUI(profile);
        Dashboard.renderStats();
        Dashboard.renderScenarios(_handleScenarioSelect);
        Dashboard.renderCourse();
      }
    } else if (event === 'SIGNED_OUT') {
      if (window.location.pathname.includes('app.html')) {
        window.location.href = 'index.html';
      }
    }
  });

  const isAppPage = window.location.pathname.includes('app.html');
  if (isAppPage) {
    await _initAppPage();
  } else {
    _initLandingPage();
  }
});

async function _initAppPage() {
  const session = await Auth.getSession();
  if (!session) { window.location.href = 'index.html'; return; }

  const user = Auth.getCurrentUser();
  const profile = await Auth.getUserProfile(user.id);

  if (profile) {
    Dashboard.setProfile(profile);
    _updateNavUI(profile);
    Dashboard.renderStats();
    Dashboard.renderScenarios(_handleScenarioSelect);
    Dashboard.renderCourse();
  }

  _setupTabs();
  _setupChatInput();

  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await Auth.signOut();
    window.location.href = 'index.html';
  });

  document.getElementById('btn-coach-feedback')?.addEventListener('click', _handleCoachFeedback);

  document.getElementById('upgrade-modal-close')?.addEventListener('click', () => {
    document.getElementById('upgrade-modal').style.display = 'none';
  });
}

function _initLandingPage() {
  document.querySelectorAll('[data-action="open-signup"]').forEach(btn => btn.addEventListener('click', () => openAuthModal('signup')));
  document.querySelectorAll('[data-action="open-login"]').forEach(btn => btn.addEventListener('click', () => openAuthModal('login')));
  document.getElementById('auth-modal-close')?.addEventListener('click', () => {
    document.getElementById('auth-modal').style.display = 'none';
  });
  _setupAuthTabs();
  _setupAuthForms();
  _setupFAQ();
  Auth.getSession().then(session => {
    if (session) {
      const authBtns = document.querySelector('.nav-auth-btns');
      if (authBtns) authBtns.innerHTML = `<a href="app.html" class="btn-primary">Go to App →</a>`;
    }
  });
}

// ─── SCENARIO SELECT ──────────────────────────────────────────────
function _handleScenarioSelect(scenarioId) {
  if (Dashboard.hasReachedLimit()) { Dashboard.showUpgradePrompt(); return; }

  // 1. Chat tab switch karo
  _switchTab('chat');

  // 2. Scenario start karo
  const scenario = Chat.startScenario(scenarioId);
  if (!scenario) return;

  // 3. ✅ KEY FIX: no-scenario-state HIDE, chat-messages + input SHOW
  const noState = document.getElementById('no-scenario-state');
  const chatMsgs = document.getElementById('chat-messages');
  const inputArea = document.getElementById('chat-input-area');

  if (noState) noState.style.display = 'none';
  if (chatMsgs) { chatMsgs.style.display = 'flex'; chatMsgs.style.flexDirection = 'column'; }
  if (inputArea) inputArea.style.display = 'flex';

  // 4. Header update
  const nameEl = document.getElementById('chat-persona-name');
  const statusEl = document.getElementById('chat-status');
  if (nameEl) nameEl.textContent = scenario.persona;
  if (statusEl) statusEl.textContent = `● Online now · ${scenario.name}`;

  // 5. Greeting dikhao
  Dashboard.clearChat(scenario.greeting);

  // 6. Timer
  Dashboard.startSessionTimer(async () => {
    const profile = Dashboard.getProfile();
    if (!profile) return;
    profile.mins_used = (profile.mins_used || 0) + 1;
    Dashboard.renderStats();
    await Auth.updateUserStats(profile.id, { mins_used: profile.mins_used });
    if (Dashboard.hasReachedLimit()) { Dashboard.stopSessionTimer(); Dashboard.showUpgradePrompt(); }
  });
}

// ─── CHAT INPUT ───────────────────────────────────────────────────
function _setupChatInput() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('btn-send');
  if (!input || !btn) return;
  btn.addEventListener('click', _sendChatMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _sendChatMessage(); }
  });
}

async function _sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  if (!Chat.getCurrentScenario()) { _showToast('Pehle koi scenario select karo! 👆', 'warning'); return; }
  if (Chat.isTyping()) return;

  Dashboard.appendMessage('user', message);
  input.value = '';
  input.style.height = 'auto';

  const profile = Dashboard.getProfile();
  if (profile) {
    profile.total_msgs = (profile.total_msgs || 0) + 1;
    Dashboard.renderStats();
    Auth.updateUserStats(profile.id, { total_msgs: profile.total_msgs });
  }

  Dashboard.showTypingIndicator(true);
  try {
    const reply = await Chat.sendMessage(message);
    Dashboard.showTypingIndicator(false);
    Dashboard.appendMessage('assistant', reply);
  } catch (err) {
    Dashboard.showTypingIndicator(false);
    _showToast('Message send nahi hua. Try again! 🙏', 'error');
  }
}

// ─── COACH FEEDBACK ───────────────────────────────────────────────
async function _handleCoachFeedback() {
  const btn = document.getElementById('btn-coach-feedback');
  if (btn) btn.disabled = true;
  Dashboard.showTypingIndicator(true);
  try {
    const feedback = await Chat.getCoachFeedback();
    Dashboard.showTypingIndicator(false);
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      const div = document.createElement('div');
      div.className = 'coach-feedback-bubble';
      div.innerHTML = `<div class="coach-header">🎯 Coach Feedback</div><div class="coach-content">${feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>`;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch {
    Dashboard.showTypingIndicator(false);
    _showToast('Coach feedback abhi available nahi. Try again!', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────
function openAuthModal(tab = 'signup') {
  const modal = document.getElementById('auth-modal');
  if (modal) { modal.style.display = 'flex'; _switchAuthTab(tab); }
}

function _setupAuthTabs() {
  document.querySelectorAll('[data-auth-tab]').forEach(t => t.addEventListener('click', () => _switchAuthTab(t.dataset.authTab)));
}

function _switchAuthTab(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.toggle('active', t.dataset.authTab === tab));
  document.querySelectorAll('[data-auth-panel]').forEach(p => { p.style.display = p.dataset.authPanel === tab ? 'block' : 'none'; });
}

function _setupAuthForms() {
  const signupForm = document.getElementById('form-signup');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const btn = signupForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Creating account...';
      try {
        await Auth.signUp(name, email, password);
        _showToast('Account ban gaya! 🎉 Email verify karo.', 'success');
        document.getElementById('auth-modal').style.display = 'none';
      } catch (err) { _showToast(err.message || 'Signup failed!', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Create Account →'; }
    });
  }

  const loginForm = document.getElementById('form-login');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Logging in...';
      try { await Auth.signIn(email, password); window.location.href = 'app.html'; }
      catch (err) { _showToast(err.message || 'Login failed!', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Login →'; }
    });
  }

  const otpForm = document.getElementById('form-otp');
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('otp-email').value.trim();
      const btn = otpForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending...';
      try { await Auth.signInWithOtp(email); _showToast('Magic link bhej diya! 📧', 'success'); }
      catch (err) { _showToast(err.message || 'OTP send failed!', 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Send Magic Link →'; }
    });
  }

  document.querySelectorAll('[data-action="google-signin"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try { await Auth.signInWithGoogle(); }
      catch { _showToast('Google login failed!', 'error'); }
    });
  });
}

// ─── TABS ─────────────────────────────────────────────────────────
function _setupTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => _switchTab(btn.dataset.tab)));
}

function _switchTab(tabName) {
  document.querySelectorAll('[data-tab]').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    // ✅ FIX: 'block' ki jagah proper display value use karo
    if (panel.dataset.tabPanel === tabName) {
      panel.style.display = panel.dataset.tabPanel === 'chat' ? 'flex' : 'block';
      panel.style.flexDirection = panel.dataset.tabPanel === 'chat' ? 'column' : '';
    } else {
      panel.style.display = 'none';
    }
  });
}

// ─── NAV ──────────────────────────────────────────────────────────
function _updateNavUI(profile) {
  const badge = document.getElementById('nav-plan-badge');
  const name = document.getElementById('nav-user-name');
  if (badge) badge.textContent = (profile.plan || 'FREE').toUpperCase();
  if (name) name.textContent = profile.name?.split(' ')[0] || 'User';
}

// ─── FAQ ──────────────────────────────────────────────────────────
function _setupFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => item.classList.toggle('open'));
  });
}

// ─── TOAST ────────────────────────────────────────────────────────
function _showToast(message, type = 'info') {
  document.getElementById('toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ─── PAYMENT ──────────────────────────────────────────────────────
function initiatePayment(planKey) {
  const plan = CONFIG.PLANS[planKey];
  if (!plan) return;
  const profile = Dashboard.getProfile();
  if (!profile) { openAuthModal('signup'); return; }
  if (CONFIG.RAZORPAY_KEY === 'rzp_test_placeholder') { _showToast('Payments coming soon! 🚀', 'info'); return; }
  const rzp = new Razorpay({
    key: CONFIG.RAZORPAY_KEY,
    amount: plan.price * 100,
    currency: 'INR',
    name: 'RizzUp AI',
    description: `${plan.name} Plan - Monthly`,
    handler: async (response) => {
      await Auth.updateUserStats(profile.id, { plan: planKey });
      profile.plan = planKey;
      Dashboard.setProfile(profile);
      Dashboard.renderStats();
      Dashboard.renderScenarios(_handleScenarioSelect);
      _showToast(`${plan.name} plan active ho gaya! 🎉`, 'success');
      document.getElementById('upgrade-modal').style.display = 'none';
    },
    prefill: { email: profile.email, name: profile.name },
    theme: { color: '#e84393' }
  });
  rzp.open();
}
