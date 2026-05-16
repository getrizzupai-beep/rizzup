
# Check what's wrong - the issue is likely that renderScenarios is called before CONFIG is loaded
# or the callback isn't being passed correctly

# Let me rewrite main.js with better initialization order and error handling

main_js = r'''// js/main.js — Glue code: sab modules connect karta hai

document.addEventListener('DOMContentLoaded', async () => {

  // ─── 0. WAIT FOR CONFIG ───────────────────────────────────────
  // Config should be loaded by now (script tag above), but let's be safe
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG not loaded! Check script order in HTML.');
    _showToast('App failed to load. Please refresh.', 'error');
    return;
  }

  // ─── 1. AUTH INIT ─────────────────────────────────────────────
  Auth.init();

  // ─── 2. AUTH STATE LISTENER ───────────────────────────────────
  Auth.onAuthChange(async (event, user) => {
    if (event === 'SIGNED_IN' && user) {
      const profile = await Auth.getUserProfile(user.id);
      if (profile) {
        Dashboard.setProfile(profile);
        _updateNavUI(profile);
        Dashboard.renderStats();
        Dashboard.renderGenderSelector();
        Dashboard.renderScenarios(_handleScenarioSelect);
        Dashboard.renderCourse();
      }
    } else if (event === 'SIGNED_OUT') {
      if (window.location.pathname.includes('app.html')) {
        window.location.href = 'index.html';
      }
    }
  });

  // ─── 3. APP PAGE INIT ─────────────────────────────────────────
  const session = await Auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  const user = Auth.getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const profile = await Auth.getUserProfile(user.id);
  if (profile) {
    Dashboard.setProfile(profile);
    _updateNavUI(profile);
    Dashboard.renderStats();
    Dashboard.renderGenderSelector();
    Dashboard.renderScenarios(_handleScenarioSelect);
    Dashboard.renderCourse();
  }

  // ─── 4. SETUP UI ──────────────────────────────────────────────
  _setupTabs();
  _setupChatInput();

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await Auth.signOut();
    window.location.href = 'index.html';
  });

  // Coach feedback
  document.getElementById('btn-coach-feedback')?.addEventListener('click', _handleCoachFeedback);

  // Upgrade modal close
  document.getElementById('upgrade-modal-close')?.addEventListener('click', () => {
    document.getElementById('upgrade-modal').style.display = 'none';
  });
  
  // Lesson modal close
  document.getElementById('lesson-modal-close')?.addEventListener('click', () => {
    const modal = document.getElementById('lesson-modal');
    if (modal && modal._timerInterval) clearInterval(modal._timerInterval);
    modal.style.display = 'none';
  });
});

// ─── TAB SWITCHING ────────────────────────────────────────────────
function _setupTabs() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => _switchTab(btn.dataset.tab));
  });
}

function _switchTab(tabName) {
  // Buttons
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  // Panels
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    panel.style.display = panel.dataset.tabPanel === tabName ? 'block' : 'none';
  });
}

// ─── SCENARIO SELECT ──────────────────────────────────────────────
function _handleScenarioSelect(scenarioId) {
  // Switch to chat tab
  _switchTab('practice');

  // Start scenario with gender preference
  const scenario = Chat.startScenario(scenarioId, Dashboard.getGender());
  if (!scenario) {
    console.error('Failed to start scenario:', scenarioId);
    _showToast('Failed to load scenario. Try again!', 'error');
    return;
  }

  // Update chat header
  const avatarEl = document.getElementById('chat-persona-avatar');
  const nameEl = document.getElementById('chat-persona-name');
  const statusEl = document.getElementById('chat-status');

  if (avatarEl) avatarEl.textContent = scenario.personaEmoji || '👩';
  if (nameEl) nameEl.textContent = scenario.persona;
  if (statusEl) statusEl.textContent = `Online now · ${scenario.name}`;

  // Show chat UI, hide no-scenario state
  const noScenarioState = document.getElementById('no-scenario-state');
  const chatMessages = document.getElementById('chat-messages');
  const chatInputArea = document.getElementById('chat-input-area');
  
  if (noScenarioState) noScenarioState.style.display = 'none';
  if (chatMessages) {
    chatMessages.style.display = 'flex';
    chatMessages.innerHTML = '';
  }
  if (chatInputArea) chatInputArea.style.display = 'flex';

  // Show greeting
  _appendMessage('assistant', scenario.greeting);

  // Enable coach feedback button
  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) coachBtn.disabled = false;

  // Update sessions count
  const profile = Dashboard.getProfile();
  if (profile) {
    profile.sessions = (profile.sessions || 0) + 1;
    Dashboard.renderStats();
    Auth.updateUserStats(profile.id, { sessions: profile.sessions });
  }

  // Reset message counter for cooldown
  _msgCount = 0;
  _cooldownActive = false;
  const cooldownBanner = document.getElementById('cooldown-banner');
  if (cooldownBanner) cooldownBanner.style.display = 'none';
}

// ─── CHAT INPUT ───────────────────────────────────────────────────
let _msgCount = 0;
let _cooldownActive = false;
let _cooldownTimer = null;

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
  if (_cooldownActive) return;

  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  const message = chatInput.value.trim();
  if (!message) return;

  if (!Chat.getCurrentScenario()) {
    _showToast('Please select a scenario first! 👆', 'warning');
    return;
  }

  if (Chat.isTyping()) return;

  // Show user message
  _appendMessage('user', message);
  chatInput.value = '';
  chatInput.style.height = 'auto';

  // Update stats
  const profile = Dashboard.getProfile();
  if (profile) {
    profile.total_msgs = (profile.total_msgs || 0) + 1;
    Dashboard.renderStats();
    Auth.updateUserStats(profile.id, { total_msgs: profile.total_msgs });
  }

  // Check cooldown (free plan)
  _msgCount++;
  const userPlan = profile?.plan || 'free';
  const planConfig = CONFIG.PLANS[userPlan] || CONFIG.PLANS.free;

  if (_msgCount >= planConfig.msgBeforeCooldown && planConfig.cooldownMinutes > 0) {
    _startCooldown(planConfig.cooldownMinutes);
  }

  // Show typing indicator
  _showTyping(true);

  try {
    const reply = await Chat.sendMessage(message);
    _showTyping(false);
    _appendMessage('assistant', reply);
  } catch (error) {
    _showTyping(false);
    console.error('Chat error:', error);
    _showToast('Message failed to send. Try again! 🙏', 'error');
  }
}

// ─── COOLDOWN SYSTEM ──────────────────────────────────────────────
function _startCooldown(minutes) {
  _cooldownActive = true;
  _msgCount = 0;

  const banner = document.getElementById('cooldown-banner');
  const timerEl = document.getElementById('cooldown-timer');
  const sendBtn = document.getElementById('btn-send');
  const chatInput = document.getElementById('chat-input');

  if (banner) banner.style.display = 'flex';
  if (sendBtn) sendBtn.disabled = true;
  if (chatInput) {
    chatInput.disabled = true;
    chatInput.placeholder = 'Cooldown active...';
  }

  let secondsLeft = minutes * 60;

  const updateTimer = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    if (timerEl) timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  };

  updateTimer();

  _cooldownTimer = setInterval(() => {
    secondsLeft--;
    updateTimer();

    if (secondsLeft <= 0) {
      clearInterval(_cooldownTimer);
      _cooldownActive = false;
      if (banner) banner.style.display = 'none';
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) {
        chatInput.disabled = false;
        chatInput.placeholder = 'Type your message...';
      }
      _showToast("You're back! Keep practicing 💪", 'success');
    }
  }, 1000);
}

// ─── CHAT UI HELPERS ──────────────────────────────────────────────
function _appendMessage(role, content) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;

  // Format bold text
  const formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  msgDiv.innerHTML = `<div class="message-bubble">${formatted}</div>`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function _showTyping(show) {
  const existing = document.getElementById('typing-indicator');
  const chatMessages = document.getElementById('chat-messages');

  if (show && !existing && chatMessages) {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = `<div class="message-bubble typing-bubble"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } else if (!show && existing) {
    existing.remove();
  }
}

// ─── COACH FEEDBACK ───────────────────────────────────────────────
async function _handleCoachFeedback() {
  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) coachBtn.disabled = true;

  _showTyping(true);

  try {
    const feedback = await Chat.getCoachFeedback();
    _showTyping(false);

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'coach-feedback-bubble';
      feedbackDiv.innerHTML = `
        <div class="coach-header">🎯 Coach Feedback</div>
        <div class="coach-content">${feedback
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>')
        }</div>
      `;
      chatMessages.appendChild(feedbackDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (err) {
    _showTyping(false);
    _showToast('Coach feedback not available right now. Try again!', 'error');
  } finally {
    if (coachBtn) coachBtn.disabled = false;
  }
}

// ─── NAV UI ───────────────────────────────────────────────────────
function _updateNavUI(profile) {
  const planBadge = document.getElementById('nav-plan-badge');
  const userName = document.getElementById('nav-user-name');

  const firstName = profile?.name?.split(' ')[0] || 'User';
  const plan = (profile?.plan || 'free').toUpperCase();

  if (planBadge) planBadge.textContent = plan;
  if (userName) userName.textContent = firstName;
}

// ─── TOAST ────────────────────────────────────────────────────────
function _showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3500);
}

// ─── PAYMENT (Razorpay) ───────────────────────────────────────────
function initiatePayment(planKey) {
  const isYearly = planKey === 'starter_yearly';
  const basePlanKey = isYearly ? 'starter' : planKey;
  const plan = CONFIG.PLANS[basePlanKey];

  if (!plan) return;

  const profile = Dashboard.getProfile();
  if (!profile) {
    window.location.href = 'index.html';
    return;
  }

  if (CONFIG.RAZORPAY_KEY === 'rzp_test_placeholder') {
    _showToast('Payments coming very soon! 🚀', 'info');
    return;
  }

  const amount = isYearly ? plan.yearlyPrice : plan.price;

  const options = {
    key: CONFIG.RAZORPAY_KEY,
    amount: amount * 100,
    currency: 'INR',
    name: 'RizzUp AI',
    description: isYearly ? 'Starter Plan - Yearly' : 'Starter Plan - Monthly',
    handler: async (response) => {
      await Auth.updateUserStats(profile.id, { plan: basePlanKey });
      profile.plan = basePlanKey;
      Dashboard.setProfile(profile);
      _updateNavUI(profile);
      Dashboard.renderStats();
      Dashboard.renderScenarios(_handleScenarioSelect);
      _showToast(`${plan.name} plan activated! 🎉`, 'success');
      document.getElementById('upgrade-modal').style.display = 'none';
    },
    prefill: {
      email: profile.email,
      name: profile.name,
    },
    theme: { color: '#e84393' },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
'''

with open('/mnt/agents/output/main.js', 'w') as f:
    f.write(main_js)

print("main.js updated with fixes!")
