// js/main.js — Glue code
// Yeh file sirf sab modules ko connect karti hai
// Auth events → Dashboard update
// Chat events → UI update
// Koi business logic yahan nahi hai

document.addEventListener('DOMContentLoaded', async () => {

  // ─── 1. AUTH INIT ───────────────────────────────────────────────
  Auth.init();

  // Auth change pe react karo
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
      // App page pe hain toh landing pe bhejo
      if (window.location.pathname.includes('app.html')) {
        window.location.href = 'index.html';
      }
    }
  });

  // ─── 2. PAGE DETECT: landing ya app? ────────────────────────────
  const isAppPage = window.location.pathname.includes('app.html');
  
  if (isAppPage) {
    await _initAppPage();
  } else {
    _initLandingPage();
  }
});

// ─── APP PAGE INIT ────────────────────────────────────────────────
async function _initAppPage() {
  // Session check — login nahi hai toh landing pe bhejo
  const session = await Auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  // FIX: session se directly user lo — getCurrentUser() pe depend mat karo
  const user = session.user;
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const profile = await Auth.getUserProfile(user.id);
  
  if (profile) {
    Dashboard.setProfile(profile);
    _updateNavUI(profile);
    Dashboard.renderStats();
    Dashboard.renderScenarios(_handleScenarioSelect);
    Dashboard.renderCourse();
  } else {
    // Profile nahi mili — naya user, create karo
    await Auth.ensureUserProfile(user);
    const newProfile = await Auth.getUserProfile(user.id);
    if (newProfile) {
      Dashboard.setProfile(newProfile);
      _updateNavUI(newProfile);
      Dashboard.renderStats();
      Dashboard.renderScenarios(_handleScenarioSelect);
      Dashboard.renderCourse();
    }
  }

  // Tab switching
  _setupTabs();

  // Chat input
  _setupChatInput();

  // Logout button
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await Auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // Coach feedback button
  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) {
    coachBtn.addEventListener('click', _handleCoachFeedback);
  }

  // Upgrade modal close
  const upgradeClose = document.getElementById('upgrade-modal-close');
  if (upgradeClose) {
    upgradeClose.addEventListener('click', () => {
      document.getElementById('upgrade-modal').style.display = 'none';
    });
  }
}

// ─── LANDING PAGE INIT ────────────────────────────────────────────
function _initLandingPage() {
  // Auth modal buttons
  const signupBtns = document.querySelectorAll('[data-action="open-signup"]');
  const loginBtns = document.querySelectorAll('[data-action="open-login"]');
  
  signupBtns.forEach(btn => btn.addEventListener('click', () => openAuthModal('signup')));
  loginBtns.forEach(btn => btn.addEventListener('click', () => openAuthModal('login')));

  // Modal close
  const modalClose = document.getElementById('auth-modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('auth-modal').style.display = 'none';
    });
  }

  // Auth form tabs
  _setupAuthTabs();

  // Auth forms submit
  _setupAuthForms();

  // FAQ accordion
  _setupFAQ();

  // Session check — already logged in toh app pe bhejo
  Auth.getSession().then(session => {
    if (session) {
      // Already logged in — sirf auth buttons hide karo, redirect nahi
      const authBtns = document.querySelector('.nav-auth-btns');
      if (authBtns) {
        authBtns.innerHTML = `<a href="app.html" class="btn-primary">Go to App →</a>`;
      }
    }
  });
}

// ─── SCENARIO SELECT ──────────────────────────────────────────────
function _handleScenarioSelect(scenarioId) {
  // Limit check
  if (Dashboard.hasReachedLimit()) {
    Dashboard.showUpgradePrompt();
    return;
  }

  // Chat tab pe switch karo
  _switchTab('chat');

  // Scenario start karo
  const scenario = Chat.startScenario(scenarioId);
  if (!scenario) return;

  // Chat header update karo
  const chatPersona = document.getElementById('chat-persona-name');
  const chatStatus = document.getElementById('chat-status');
  if (chatPersona) chatPersona.textContent = scenario.persona;
  if (chatStatus) chatStatus.textContent = `● Online now · ${scenario.name}`;

  // Chat clear karke greeting dikhao
  Dashboard.clearChat(scenario.greeting);

  // Session timer start karo
  Dashboard.startSessionTimer(async (minsElapsed) => {
    const profile = Dashboard.getProfile();
    if (!profile) return;
    
    const newMinsUsed = (profile.mins_used || 0) + 1;
    profile.mins_used = newMinsUsed;
    Dashboard.renderStats();
    
    // DB mein save karo
    await Auth.updateUserStats(profile.id, { mins_used: newMinsUsed });
    
    // Limit check
    if (Dashboard.hasReachedLimit()) {
      Dashboard.stopSessionTimer();
      Dashboard.showUpgradePrompt();
    }
  });
}

// ─── CHAT INPUT SETUP ─────────────────────────────────────────────
function _setupChatInput() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-send');

  if (!chatInput || !sendBtn) return;

  // Send on button click
  sendBtn.addEventListener('click', _sendChatMessage);

  // Send on Enter (Shift+Enter = new line)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _sendChatMessage();
    }
  });
}

async function _sendChatMessage() {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  const message = chatInput.value.trim();
  if (!message) return;

  // Chat nahi shuru hua toh
  if (!Chat.getCurrentScenario()) {
    _showToast('Pehle koi scenario select karo! 👆', 'warning');
    return;
  }

  if (Chat.isTyping()) return;

  // UI update — user message dikhao + input clear karo
  Dashboard.appendMessage('user', message);
  chatInput.value = '';
  chatInput.style.height = 'auto';

  // Stats update
  const profile = Dashboard.getProfile();
  if (profile) {
    profile.total_msgs = (profile.total_msgs || 0) + 1;
    Dashboard.renderStats();
    Auth.updateUserStats(profile.id, { total_msgs: profile.total_msgs });
  }

  // Typing indicator
  Dashboard.showTypingIndicator(true);

  try {
    const reply = await Chat.sendMessage(message);
    Dashboard.showTypingIndicator(false);
    Dashboard.appendMessage('assistant', reply);
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
    
    // Feedback special styling ke saath dikhao
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'coach-feedback-bubble';
      feedbackDiv.innerHTML = `
        <div class="coach-header">🎯 Coach Feedback</div>
        <div class="coach-content">${feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
      `;
      chatMessages.appendChild(feedbackDiv);
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
  if (modal) {
    modal.style.display = 'flex';
    _switchAuthTab(tab);
  }
}

function _setupAuthTabs() {
  const tabs = document.querySelectorAll('[data-auth-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => _switchAuthTab(tab.dataset.authTab));
  });
}

function _switchAuthTab(tab) {
  // Tab buttons
  document.querySelectorAll('[data-auth-tab]').forEach(t => {
    t.classList.toggle('active', t.dataset.authTab === tab);
  });
  // Tab panels
  document.querySelectorAll('[data-auth-panel]').forEach(p => {
    p.style.display = p.dataset.authPanel === tab ? 'block' : 'none';
  });
}

function _setupAuthForms() {
  // Signup form
  const signupForm = document.getElementById('form-signup');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      
      const btn = signupForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Creating account...';

      try {
        await Auth.signUp(name, email, password);
        _showToast('Account ban gaya! 🎉 Email verify karo.', 'success');
        document.getElementById('auth-modal').style.display = 'none';
      } catch (error) {
        _showToast(error.message || 'Signup failed. Try again!', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account →';
      }
    });
  }

  // Login form
  const loginForm = document.getElementById('form-login');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Logging in...';

      try {
        await Auth.signIn(email, password);
        window.location.href = 'app.html';
      } catch (error) {
        _showToast(error.message || 'Login failed. Check email/password!', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Login →';
      }
    });
  }

  // OTP form
  const otpForm = document.getElementById('form-otp');
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('otp-email').value.trim();
      
      const btn = otpForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        await Auth.signInWithOtp(email);
        _showToast('Magic link bhej diya! 📧 Email check karo.', 'success');
      } catch (error) {
        _showToast(error.message || 'OTP send failed!', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Magic Link →';
      }
    });
  }

  // Google OAuth buttons
  document.querySelectorAll('[data-action="google-signin"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await Auth.signInWithGoogle();
      } catch (error) {
        _showToast('Google login failed. Try again!', 'error');
      }
    });
  });
}

// ─── TABS (app page) ──────────────────────────────────────────────
function _setupTabs() {
  const tabBtns = document.querySelectorAll('[data-tab]');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => _switchTab(btn.dataset.tab));
  });
}

function _switchTab(tabName) {
  // Tab nav buttons
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  // Tab panels
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    panel.style.display = panel.dataset.tabPanel === tabName ? 'block' : 'none';
  });

  // Chat tab pe: scenario select hua hai toh no-scenario state hide karo
  if (tabName === 'chat') {
    const noScenario = document.getElementById('no-scenario-state');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chat-input-area');

    if (Chat.getCurrentScenario()) {
      // Scenario selected — chat dikhao, no-scenario hide karo
      if (noScenario) noScenario.style.display = 'none';
      if (chatMessages) chatMessages.style.display = 'flex';
      if (chatInput) chatInput.style.display = 'flex';
    } else {
      // No scenario — message dikhao
      if (noScenario) noScenario.style.display = 'block';
      if (chatMessages) chatMessages.style.display = 'none';
      if (chatInput) chatInput.style.display = 'none';
    }
  }
}

// ─── NAV UI UPDATE ────────────────────────────────────────────────
function _updateNavUI(profile) {
  const planBadge = document.getElementById('nav-plan-badge');
  const userName = document.getElementById('nav-user-name');
  const userNameDashboard = document.getElementById('nav-user-name-dashboard');
  
  if (planBadge) planBadge.textContent = (profile.plan || 'FREE').toUpperCase();
  if (userName) userName.textContent = profile.name?.split(' ')[0] || 'User';
  if (userNameDashboard) userNameDashboard.textContent = profile.name?.split(' ')[0] || 'there';
}

// ─── FAQ ACCORDION ────────────────────────────────────────────────
function _setupFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });
}

// ─── TOAST NOTIFICATIONS ──────────────────────────────────────────
function _showToast(message, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto hide
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── PAYMENT (Razorpay) ───────────────────────────────────────────
function initiatePayment(planKey) {
  const plan = CONFIG.PLANS[planKey];
  if (!plan) return;

  const profile = Dashboard.getProfile();
  if (!profile) {
    openAuthModal('signup');
    return;
  }

  // Razorpay key placeholder — real key add karo
  if (CONFIG.RAZORPAY_KEY === 'rzp_test_placeholder') {
    _showToast('Payments coming soon! 🚀', 'info');
    return;
  }

  const options = {
    key: CONFIG.RAZORPAY_KEY,
    amount: plan.price * 100, // paise mein
    currency: 'INR',
    name: 'RizzUp AI',
    description: `${plan.name} Plan - Monthly`,
    handler: async (response) => {
      // Payment success — plan update karo
      await Auth.updateUserStats(profile.id, { plan: planKey });
      profile.plan = planKey;
      Dashboard.setProfile(profile);
      Dashboard.renderStats();
      Dashboard.renderScenarios(_handleScenarioSelect);
      _showToast(`${plan.name} plan active ho gaya! 🎉`, 'success');
      
      const upgradeModal = document.getElementById('upgrade-modal');
      if (upgradeModal) upgradeModal.style.display = 'none';
    },
    prefill: {
      email: profile.email,
      name: profile.name,
    },
    theme: { color: '#e84393' }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
