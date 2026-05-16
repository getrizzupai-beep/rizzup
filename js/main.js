// js/main.js — Single Page App Glue Code
// No redirects — sab ek hi page pe

document.addEventListener('DOMContentLoaded', async () => {

  // ─── 1. AUTH INIT ────────────────────────────────────────────────
  Auth.init();

  // ─── 2. EXISTING SESSION CHECK ───────────────────────────────────
  const session = await Auth.getSession();
  if (session) {
    let profile = await Auth.getUserProfile(session.user.id);
    if (!profile) {
      profile = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || 'User',
        plan: 'free',
        mins_used: 0,
        total_msgs: 0,
        sessions: 0,
        gender: null,
      };
    }
    _showApp(profile);
  } else {
    _showLanding();
  }

  // ─── 3. AUTH STATE CHANGE ────────────────────────────────────────
  Auth.onAuthChange(async (event, user) => {
    if (event === 'SIGNED_IN' && user) {
      let profile = await Auth.getUserProfile(user.id);
      if (!profile) {
        profile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'User',
          plan: 'free',
          mins_used: 0,
          total_msgs: 0,
          sessions: 0,
          gender: null,
        };
      }
      closeAuthModal();
      _showApp(profile);
    } else if (event === 'SIGNED_OUT') {
      _showLanding();
    }
  });

  // ─── 4. CHAT INPUT SETUP ─────────────────────────────────────────
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });
  }

});

// ─── SHOW APP ────────────────────────────────────────────────────
function _showApp(profile) {
  document.getElementById('landingView').style.display = 'none';
  document.getElementById('appView').style.display = 'block';

  Dashboard.setProfile(profile);

  // Nav update
  const firstName = profile.name?.split(' ')[0] || 'there';
  const planBadge = document.getElementById('nav-plan-badge');
  const userName = document.getElementById('nav-user-name');
  const greetName = document.getElementById('greet-name');

  if (planBadge) planBadge.textContent = (profile.plan || 'free').toUpperCase();
  if (userName) userName.textContent = firstName;
  if (greetName) greetName.textContent = firstName;

  Dashboard.renderStats();
  Dashboard.renderScenarios(_handleScenarioSelect);
  Dashboard.renderCourse();
}

// ─── SHOW LANDING ────────────────────────────────────────────────
function _showLanding() {
  document.getElementById('appView').style.display = 'none';
  document.getElementById('landingView').style.display = 'block';
  window.scrollTo(0, 0);
}

// ─── AUTH MODAL ──────────────────────────────────────────────────
function openAuthModal(tab = 'signup') {
  document.getElementById('authModal').style.display = 'flex';
  switchAuthTab(tab);
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('authModal')) closeAuthModal();
}

function switchAuthTab(tab) {
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-signup').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('panel-login').style.display = tab === 'login' ? 'block' : 'none';
}

// ─── AUTH ACTIONS ────────────────────────────────────────────────
async function doSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !password) { showToast('Sab fields fill karo! 🙏', 'error'); return; }
  if (password.length < 6) { showToast('Password kam se kam 6 characters ka hona chahiye!', 'error'); return; }

  const btn = document.getElementById('signup-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    await Auth.signUp(name, email, password);
    showToast('Account ban gaya! 🎉 Email verify karke login karo.', 'success');
  } catch (error) {
    showToast(error.message || 'Signup failed. Try again!', 'error');
    btn.disabled = false;
    btn.textContent = 'Start Practicing Free →';
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) { showToast('Email aur password dono chahiye!', 'error'); return; }

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try {
    await Auth.signIn(email, password);
    // onAuthChange handle karega
  } catch (error) {
    showToast(error.message || 'Login failed. Check email/password!', 'error');
    btn.disabled = false;
    btn.textContent = 'Login →';
  }
}

async function doGoogleLogin() {
  try {
    await Auth.signInWithGoogle();
  } catch (error) {
    showToast('Google login failed. Try again!', 'error');
  }
}

async function doLogout() {
  try {
    await Auth.signOut();
    Chat.resetConversation();
  } catch (error) {
    showToast('Logout failed!', 'error');
  }
}

// ─── APP TAB SWITCHING ───────────────────────────────────────────
function switchAppTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.app-panel').forEach(panel => {
    panel.style.display = panel.id === `tab-panel-${tabName}` ? 'block' : 'none';
  });
}

// ─── SCENARIO SELECT ─────────────────────────────────────────────
function _handleScenarioSelect(scenarioId) {
  if (Dashboard.hasReachedLimit()) {
    Dashboard.showUpgradePrompt();
    return;
  }

  switchAppTab('chat');

  // Dono scenario sets mein dhundo
  const allScenarios = {
    ...CONFIG.SCENARIOS_FEMALE,
    ...CONFIG.SCENARIOS_MALE,
  };
  const scenarioData = allScenarios[scenarioId];
  if (!scenarioData) return;

  // Chat module mein start karo
  const scenario = Chat.startScenario(scenarioId);
  if (!scenario) return;

  // Chat header update
  const avatarEl = document.getElementById('chat-persona-avatar');
  const nameEl = document.getElementById('chat-persona-name');
  const statusEl = document.getElementById('chat-persona-status');
  if (avatarEl) avatarEl.textContent = scenarioData.emoji || '👩';
  if (nameEl) nameEl.textContent = scenarioData.persona;
  if (statusEl) statusEl.textContent = `● Online now · ${scenarioData.name}`;

  // Show chat UI
  document.getElementById('no-scenario-state').style.display = 'none';
  document.getElementById('chat-messages').style.display = 'flex';
  document.getElementById('chat-input-area').style.display = 'flex';

  // Clear + greeting
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  _appendMessage('assistant', scenarioData.greeting);

  // Session timer
  Dashboard.startSessionTimer(async (minsElapsed) => {
    const profile = Dashboard.getProfile();
    if (!profile) return;
    const newMins = (profile.mins_used || 0) + 1;
    profile.mins_used = newMins;
    Dashboard.renderStats();
    await Auth.updateUserStats(profile.id, { mins_used: newMins });
    if (Dashboard.hasReachedLimit()) {
      Dashboard.stopSessionTimer();
      Dashboard.showUpgradePrompt();
    }
  });
}

// ─── SEND CHAT MESSAGE ───────────────────────────────────────────
async function sendChatMessage() {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  const message = chatInput.value.trim();
  if (!message) return;
  if (!Chat.getCurrentScenario()) {
    showToast('Pehle koi scenario select karo! 👆', 'warning');
    return;
  }
  if (Chat.isTyping()) return;

  _appendMessage('user', message);
  chatInput.value = '';
  chatInput.style.height = 'auto';

  const profile = Dashboard.getProfile();
  if (profile) {
    profile.total_msgs = (profile.total_msgs || 0) + 1;
    Dashboard.renderStats();
    Auth.updateUserStats(profile.id, { total_msgs: profile.total_msgs });
  }

  _showTypingIndicator(true);

  try {
    const reply = await Chat.sendMessage(message);
    _showTypingIndicator(false);
    _appendMessage('assistant', reply);
  } catch (error) {
    _showTypingIndicator(false);
    console.error('Chat error:', error);
    showToast('Message send nahi hua. Try again! 🙏', 'error');
  }
}

// ─── COACH FEEDBACK ──────────────────────────────────────────────
async function getCoachFeedback() {
  const coachBtn = document.getElementById('btn-coach-feedback');
  if (coachBtn) coachBtn.disabled = true;
  _showTypingIndicator(true);

  try {
    const feedback = await Chat.getCoachFeedback();
    _showTypingIndicator(false);

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
    _showTypingIndicator(false);
    showToast('Coach feedback abhi available nahi. Try again!', 'error');
  } finally {
    if (coachBtn) coachBtn.disabled = false;
  }
}

// ─── PAYMENT ─────────────────────────────────────────────────────
function initiatePayment(planKey) {
  const plan = CONFIG.PLANS[planKey];
  if (!plan) return;

  const profile = Dashboard.getProfile();
  if (!profile) { openAuthModal('signup'); return; }

  if (CONFIG.RAZORPAY_KEY === 'rzp_test_placeholder') {
    showToast('Payments coming soon! 🚀', 'info');
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
      showToast(`${plan.name} plan active ho gaya! 🎉`, 'success');
      document.getElementById('upgrade-modal').style.display = 'none';
    },
    prefill: { email: profile.email, name: profile.name },
    theme: { color: '#e84393' }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// ─── CHAT MODULE SCENARIO LOOKUP FIX ────────────────────────────
// chat.js ko dono sets se scenario milna chahiye
// Iske liye Chat.startScenario override karte hain
const _originalStartScenario = Chat.startScenario.bind(Chat);

// ─── HELPERS ─────────────────────────────────────────────────────
function _appendMessage(role, content) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
  const formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  msgDiv.innerHTML = `<div class="message-bubble">${formatted}</div>`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function _showTypingIndicator(show) {
  const existing = document.getElementById('typing-indicator');
  if (show && !existing) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'message ai-message';
    div.innerHTML = `<div class="message-bubble typing-bubble"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } else if (!show && existing) {
    existing.remove();
  }
}

// ─── LANDING HELPERS ─────────────────────────────────────────────
function switchFeature(el, idx) {
  document.querySelectorAll('.feat-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.preview-card').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const prev = document.getElementById('prev-' + idx);
  if (prev) prev.classList.add('active');
}

function toggleFaq(el) {
  const item = el.closest('.faq-item');
  item.classList.toggle('open');
  const arr = el.querySelector('.arr');
  if (arr) arr.textContent = item.classList.contains('open') ? '−' : '+';
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toastEl');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}
