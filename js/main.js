// js/main.js — Glue code
// Yeh file sirf sab modules ko connect karti hai

document.addEventListener('DOMContentLoaded', async () => {

  // ─── PAGE DETECT ────────────────────────────────────────────────
  const isAppPage = window.location.pathname.includes('app.html');

  if (isAppPage) {
    // App page pe hi Auth init karo
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
        window.location.href = 'index.html';
      }
    });

    await _initAppPage();

  } else {
    // Landing page pe Auth init karo
    Auth.init();
    _initLandingPage();
  }
});

// ─── APP PAGE INIT ────────────────────────────────────────────────
async function _initAppPage() {
  const session = await Auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

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

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await Auth.signOut();
      window.location.href = 'index.html';
    });
  }

  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) {
    coachBtn.addEventListener('click', _handleCoachFeedback);
  }

  const upgradeClose = document.getElementById('upgrade-modal-close');
  if (upgradeClose) {
    upgradeClose.addEventListener('click', () => {
      document.getElementById('upgrade-modal').style.display = 'none';
    });
  }
}

// ─── LANDING PAGE INIT ────────────────────────────────────────────
function _initLandingPage() {
  // Session check — already logged in toh nav update karo
  Auth.getSession().then(session => {
    if (session) {
      const navArea = document.getElementById('nav-auth-area');
      if (navArea) {
        navArea.innerHTML = `<a href="app.html" class="nav-cta" style="text-decoration:none">Go to App →</a>`;
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

// ─── TABS ─────────────────────────────────────────────────────────
function _setupTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
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

// ─── NAV UI ───────────────────────────────────────────────────────
function _updateNavUI(profile) {
  const planBadge = document.getElementById('nav-plan-badge');
  const userName = document.getElementById('nav-user-name');
  if (planBadge) planBadge.textContent = (profile.plan || 'FREE').toUpperCase();
  if (userName) userName.textContent = profile.name?.split(' ')[0] || 'User';
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
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── PAYMENT ──────────────────────────────────────────────────────
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
    prefill: { email: profile.email, name: profile.name },
    theme: { color: '#e84393' }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
