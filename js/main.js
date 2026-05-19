// js/main.js — Glue code

document.addEventListener('DOMContentLoaded', async () => {

  // ─── 1. AUTH INIT ─────────────────────────────────────────────
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

  // ─── 2. PAGE DETECT ───────────────────────────────────────────
  const isAppPage = window.location.pathname.includes('app.html');
  if (isAppPage) {
    await _initAppPage();
  } else {
    _initLandingPage();
  }
});

// ─── APP PAGE INIT ────────────────────────────────────────────────
async function _initAppPage() {
  const session = await Auth.getSession();
  if (!session) { window.location.href = 'index.html'; return; }

  const user = session.user;
  if (!user) { window.location.href = 'index.html'; return; }

  let profile = await Auth.getUserProfile(user.id);
  if (!profile) {
    await Auth.ensureUserProfile(user);
    profile = await Auth.getUserProfile(user.id);
  }

  if (profile) {
    Dashboard.setProfile(profile);
    _updateNavUI(profile);
    Dashboard.renderStats();
    Dashboard.renderScenarios(_handleScenarioSelect);
    Dashboard.renderCourse();
  }

  _setupTabs();
  _setupChatInput();

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await Auth.signOut();
      window.location.href = 'index.html';
    });
  }

  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) coachBtn.addEventListener('click', _handleCoachFeedback);

  const upgradeClose = document.getElementById('upgrade-modal-close');
  if (upgradeClose) {
    upgradeClose.addEventListener('click', () => {
      document.getElementById('upgrade-modal').style.display = 'none';
    });
  }
}

// ─── LANDING PAGE INIT ────────────────────────────────────────────
function _initLandingPage() {
  document.querySelectorAll('[data-action="open-signup"]').forEach(btn =>
    btn.addEventListener('click', () => openAuthModal('signup')));
  document.querySelectorAll('[data-action="open-login"]').forEach(btn =>
    btn.addEventListener('click', () => openAuthModal('login')));

  const modalClose = document.getElementById('auth-modal-close');
  if (modalClose) modalClose.addEventListener('click', () => {
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
  _switchTab('chat');

  const scenario = Chat.startScenario(scenarioId);
  if (!scenario) return;

  const chatPersona = document.getElementById('chat-persona-name');
  const chatStatus = document.getElementById('chat-status');
  if (chatPersona) chatPersona.textContent = scenario.persona;
  if (chatStatus) chatStatus.textContent = `● Online now · ${scenario.name}`;

  Dashboard.clearChat(scenario.greeting);

  Dashboard.startSessionTimer(async (minsElapsed) => {
    const profile = Dashboard.getProfile();
    if (!profile) return;
    await Auth.updateUserStats(profile.id, { mins_used: minsElapsed });
  });

  const profile = Dashboard.getProfile();
  if (profile) {
    profile.sessions = (profile.sessions || 0) + 1;
    Dashboard.renderStats();
    Auth.updateUserStats(profile.id, { sessions: profile.sessions });
  }
}

// ─── CHAT INPUT ───────────────────────────────────────────────────
function _setupChatInput() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-send');
  if (!chatInput || !sendBtn) return;

  sendBtn.addEventListener('click', _sendChatMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _sendChatMessage();
    }
  });

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });
}

async function _sendChatMessage() {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  const message = chatInput.value.trim();
  if (!message) return;

  if (!Chat.getCurrentScenario()) {
    _showToast('Pehle koi scenario select karo! 👆', 'warning');
    return;
  }

  if (Chat.isTyping()) return;

  // ─── MESSAGE LIMIT CHECK ──────────────────────────────────────
  if (Dashboard.hasReachedLimit()) {
    Dashboard.startCooldown();
    return;
  }

  Dashboard.appendMessage('user', message);
  chatInput.value = '';
  chatInput.style.height = 'auto';

  // Increment message count
  Dashboard.incrementSessionMsg();

  // DB update
  const profile = Dashboard.getProfile();
  if (profile) {
    profile.total_msgs = (profile.total_msgs || 0) + 1;
    Auth.updateUserStats(profile.id, { total_msgs: profile.total_msgs });
  }

  Dashboard.showTypingIndicator(true);

  try {
    const reply = await Chat.sendMessage(message);
    Dashboard.showTypingIndicator(false);
    Dashboard.appendMessage('assistant', reply);

    // Check limit after reply received
    if (Dashboard.hasReachedLimit()) {
      setTimeout(() => Dashboard.startCooldown(), 800);
    }
  } catch (error) {
    Dashboard.showTypingIndicator(false);
    console.error('Chat error:', error);
    _showToast('Message send nahi hua. Try again! 🙏', 'error');
  }
}

// ─── COACH FEEDBACK ───────────────────────────────────────────────
async function _handleCoachFeedback() {
  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) coachBtn.disabled = true;
  Dashboard.showTypingIndicator(true);

  try {
    const feedback = await Chat.getCoachFeedback();
    Dashboard.showTypingIndicator(false);

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      const div = document.createElement('div');
      div.className = 'coach-feedback-bubble';
      div.innerHTML = `
        <div class="coach-header">🎯 Coach Feedback</div>
        <div class="coach-content">${feedback
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>')}</div>
      `;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (error) {
    Dashboard.showTypingIndicator(false);
    _showToast('Coach feedback abhi available nahi. Try again!', 'error');
  } finally {
    if (coachBtn) coachBtn.disabled = false;
  }
}

// ─── AUTH MODAL ───────────────────────────────────────────────────
function openAuthModal(tab = 'signup') {
  const modal = document.getElementById('auth-modal');
  if (modal) { modal.style.display = 'flex'; _switchAuthTab(tab); }
}

function _setupAuthTabs() {
  document.querySelectorAll('[data-auth-tab]').forEach(tab =>
    tab.addEventListener('click', () => _switchAuthTab(tab.dataset.authTab)));
}

function _switchAuthTab(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach(t =>
    t.classList.toggle('active', t.dataset.authTab === tab));
  document.querySelectorAll('[data-auth-panel]').forEach(p =>
    p.style.display = p.dataset.authPanel === tab ? 'block' : 'none');
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
      } catch (err) {
        _showToast(err.message || 'Signup failed!', 'error');
      } finally { btn.disabled = false; btn.textContent = 'Create Account →'; }
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
      try {
        await Auth.signIn(email, password);
        window.location.href = 'app.html';
      } catch (err) {
        _showToast(err.message || 'Login failed!', 'error');
      } finally { btn.disabled = false; btn.textContent = 'Login →'; }
    });
  }

  const otpForm = document.getElementById('form-otp');
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('otp-email').value.trim();
      const btn = otpForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending...';
      try {
        await Auth.signInWithOtp(email);
        _showToast('Magic link bhej diya! 📧 Email check karo.', 'success');
      } catch (err) {
        _showToast(err.message || 'OTP send failed!', 'error');
      } finally { btn.disabled = false; btn.textContent = 'Send Magic Link →'; }
    });
  }

  document.querySelectorAll('[data-action="google-signin"]').forEach(btn =>
    btn.addEventListener('click', async () => {
      try { await Auth.signInWithGoogle(); }
      catch { _showToast('Google login failed. Try again!', 'error'); }
    }));
}

// ─── TABS ─────────────────────────────────────────────────────────
function _setupTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn =>
    btn.addEventListener('click', () => _switchTab(btn.dataset.tab)));
}

function _switchTab(tabName) {
  document.querySelectorAll('[data-tab]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === tabName));
  document.querySelectorAll('[data-tab-panel]').forEach(panel =>
    panel.style.display = panel.dataset.tabPanel === tabName ? 'block' : 'none');

  if (tabName === 'chat') {
    const noScenario = document.getElementById('no-scenario-state');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chat-input-area');

    if (Chat.getCurrentScenario()) {
      if (noScenario) noScenario.style.display = 'none';
      if (chatMessages) chatMessages.style.display = 'flex';
      if (chatInput) chatInput.style.display = 'flex';
    } else {
      if (noScenario) noScenario.style.display = 'block';
      if (chatMessages) chatMessages.style.display = 'none';
      if (chatInput) chatInput.style.display = 'none';
    }
  }
}

// ─── NAV UPDATE ───────────────────────────────────────────────────
function _updateNavUI(profile) {
  const planBadge = document.getElementById('nav-plan-badge');
  const userName = document.getElementById('nav-user-name');
  const userNameDashboard = document.getElementById('nav-user-name-dashboard');
  if (planBadge) planBadge.textContent = (profile.plan || 'FREE').toUpperCase();
  if (userName) userName.textContent = profile.name?.split(' ')[0] || 'User';
  if (userNameDashboard) userNameDashboard.textContent = profile.name?.split(' ')[0] || 'there';
}

// ─── FAQ ──────────────────────────────────────────────────────────
function _setupFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) q.addEventListener('click', () => item.classList.toggle('open'));
  });
}

// ─── TOAST ────────────────────────────────────────────────────────
function _showToast(message, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
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
  if (CONFIG.RAZORPAY_KEY === 'rzp_test_placeholder') {
    _showToast('Payments coming soon! 🚀', 'info'); return;
  }
  const options = {
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
      const modal = document.getElementById('upgrade-modal');
      if (modal) modal.style.display = 'none';
    },
    prefill: { email: profile.email, name: profile.name },
    theme: { color: '#e84393' }
  };
  new Razorpay(options).open();
}
