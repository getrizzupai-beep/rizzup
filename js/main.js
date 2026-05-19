// js/main.js — Glue code
// Yeh file sirf sab modules ko connect karti hai
// Auth events → Dashboard update
// Chat events → UI update
// Koi business logic yahan nahi hai

document.addEventListener('DOMContentLoaded', async () => {

  // ─── 1. AUTH INIT ───────────────────────────────────────────────
  Auth.init();

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
    console.log('[Main] No session — redirecting to index');
    window.location.href = 'index.html';
    return;
  }

  console.log('[Main] Session found, loading profile...');
  const user = Auth.getCurrentUser();

  // Profile load karo + dashboard render karo
  await _loadAndRenderDashboard(user.id);

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

  // Auth change bhi sun (session expire ho jaaye toh)
  Auth.onAuthChange(async (event, user) => {
    if (event === 'SIGNED_OUT') {
      window.location.href = 'index.html';
    }
  });
}

// ─── PROFILE LOAD + DASHBOARD RENDER ──────────────────────────────
async function _loadAndRenderDashboard(userId) {
  try {
    const profile = await Auth.getUserProfile(userId);

    if (!profile) {
      console.error('[Main] Profile not found in DB!');
      // Profile missing hai toh create karo aur try karo
      _showToast('Profile load ho rahi hai... ek second!', 'info');
      setTimeout(async () => {
        const retryProfile = await Auth.getUserProfile(userId);
        if (retryProfile) {
          _renderDashboard(retryProfile);
        } else {
          _showToast('Profile load nahi hui. Refresh karo!', 'error');
        }
      }, 2000);
      return;
    }

    _renderDashboard(profile);
  } catch (err) {
    console.error('[Main] Dashboard load error:', err);
    _showToast('Kuch error hua. Page refresh karo!', 'error');
  }
}

function _renderDashboard(profile) {
  console.log('[Main] Rendering dashboard for:', profile.name);
  Dashboard.setProfile(profile);
  _updateNavUI(profile);
  Dashboard.renderStats();
  Dashboard.renderScenarios(_handleScenarioSelect);
  Dashboard.renderCourse();
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

  // Click outside modal to close
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Auth form tabs
  _setupAuthTabs();

  // Auth forms submit
  _setupAuthForms();

  // FAQ accordion
  _setupFAQ();

  // Session check — already logged in toh nav update karo
  Auth.getSession().then(session => {
    if (session) {
      const authBtns = document.querySelector('.nav-auth-btns');
      if (authBtns) {
        authBtns.innerHTML = `<a href="app.html" class="btn-primary">Go to App →</a>`;
      }
    }
  });
}

// ─── SCENARIO SELECT ──────────────────────────────────────────────
function _handleScenarioSelect(scenarioId) {
  if (Dashboard.hasReachedLimit()) {
    Dashboard.showUpgradePrompt();
    return;
  }

  _switchTab('chat');

  const scenario = Chat.startScenario(scenarioId);
  if (!scenario) return;

  // No-scenario state hide karo
  const noScenarioState = document.getElementById('no-scenario-state');
  if (noScenarioState) noScenarioState.style.display = 'none';

  const chatPersona = document.getElementById('chat-persona-name');
  const chatStatus = document.getElementById('chat-status');
  if (chatPersona) chatPersona.textContent = scenario.persona;
  if (chatStatus) chatStatus.textContent = `● Online now · ${scenario.name}`;

  Dashboard.clearChat(scenario.greeting);

  Dashboard.startSessionTimer(async (minsElapsed) => {
    const profile = Dashboard.getProfile();
    if (!profile) return;

    const newMinsUsed = (profile.mins_used || 0) + 1;
    profile.mins_used = newMinsUsed;
    Dashboard.renderStats();

    await Auth.updateUserStats(profile.id, { mins_used: newMinsUsed });

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

  sendBtn.addEventListener('click', _sendChatMessage);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _sendChatMessage();
    }
  });

  // Auto-resize textarea
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

  Dashboard.appendMessage('user', message);
  chatInput.value = '';
  chatInput.style.height = 'auto';

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
  document.querySelectorAll('[data-auth-tab]').forEach(t => {
    t.classList.toggle('active', t.dataset.authTab === tab);
  });
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
        // FIX: seedha redirect karo, onAuthStateChange pe depend mat karo
        window.location.href = 'app.html';
      } catch (error) {
        _showToast(error.message || 'Login failed. Email/password check karo!', 'error');
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
        // Supabase redirect karega automatically auth_callback.html pe
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
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    panel.style.display = panel.dataset.tabPanel === tabName ? 'block' : 'none';
  });
}

// ─── NAV UI UPDATE ────────────────────────────────────────────────
function _updateNavUI(profile) {
  const planBadge = document.getElementById('nav-plan-badge');
  const userName = document.getElementById('nav-user-name');
  const userNameDash = document.getElementById('nav-user-name-dashboard');

  if (planBadge) planBadge.textContent = (profile.plan || 'FREE').toUpperCase();
  if (userName) userName.textContent = profile.name?.split(' ')[0] || 'User';
  if (userNameDash) userNameDash.textContent = profile.name?.split(' ')[0] || 'there';
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

  setTimeout(() => toast.classList.add('show'), 10);

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

  if (CONFIG.RAZORPAY_KEY === 'rzp_test_placeholder') {
    _showToast('Payments coming soon! 🚀', 'info');
    return;
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
