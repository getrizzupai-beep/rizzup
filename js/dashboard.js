// js/dashboard.js — Dashboard UI + stats + limits

const Dashboard = (() => {
  let _userProfile = null;
  let _sessionMsgs = 0;          // messages in current session
  let _sessionStartTime = null;
  let _sessionMinsTimer = null;
  let _cooldownTimer = null;
  let _scenarioClickHandler = null;

  function setProfile(profile) { _userProfile = profile; }
  function getProfile() { return _userProfile; }

  // ─── STATS RENDER ─────────────────────────────────────────────
  function renderStats() {
    if (!_userProfile) return;

    const plan = _userProfile.plan || 'free';
    const limit = CONFIG.LIMITS[plan] || CONFIG.LIMITS.free;
    const msgsUsed = _sessionMsgs;
    const msgsLimit = limit.msgsPerSession;
    const percentage = Math.min(100, (msgsUsed / msgsLimit) * 100);

    _setText('stat-mins-used', msgsUsed);
    _setText('stat-mins-limit', msgsLimit === 999 ? '∞' : msgsLimit);
    _setText('stat-total-msgs', _userProfile.total_msgs || 0);
    _setText('stat-sessions', _userProfile.sessions || 0);
    _setText('stat-plan', plan.toUpperCase());

    const progressBar = document.getElementById('mins-progress-bar');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
      progressBar.style.background = percentage > 80
        ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)'
        : 'linear-gradient(90deg, #fd79a8, #e84393)';
    }
  }

  // ─── SCENARIOS RENDER ─────────────────────────────────────────
  function renderScenarios(onScenarioClick) {
    const container = document.getElementById('scenarios-grid');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const allowedScenarios = CONFIG.PLANS[userPlan]?.scenarios || CONFIG.PLANS.free.scenarios;

    container.innerHTML = Object.values(CONFIG.SCENARIOS).map(scenario => {
      const isLocked = !allowedScenarios.includes(scenario.id);
      return `
        <div class="scenario-card ${isLocked ? 'locked' : ''}"
             data-scenario="${scenario.id}"
             onclick="${!isLocked ? `Dashboard.handleScenarioClick('${scenario.id}')` : 'Dashboard.showUpgradePrompt()'}">
          <div class="scenario-emoji">${scenario.emoji}</div>
          ${isLocked ? '<div class="lock-badge">🔒</div>' : ''}
          <div class="scenario-info">
            <div class="scenario-persona">${scenario.persona}</div>
            <div class="scenario-name">${scenario.name}</div>
            <div class="scenario-desc">${scenario.description}</div>
          </div>
          <div class="scenario-tag ${isLocked ? 'tag-paid' : 'tag-free'}">
            ${isLocked ? 'Starter+' : 'Free'}
          </div>
        </div>
      `;
    }).join('');

    _scenarioClickHandler = onScenarioClick;
  }

  function handleScenarioClick(scenarioId) {
    if (_scenarioClickHandler) _scenarioClickHandler(scenarioId);
  }

  function showUpgradePrompt() {
    const modal = document.getElementById('upgrade-modal');
    if (modal) modal.style.display = 'flex';
  }

  // ─── MESSAGE LIMIT (Claude-style) ─────────────────────────────
  function hasReachedLimit() {
    if (!_userProfile) return false;
    const plan = _userProfile.plan || 'free';
    const limit = CONFIG.LIMITS[plan] || CONFIG.LIMITS.free;
    if (limit.msgsPerSession === 999) return false;
    return _sessionMsgs >= limit.msgsPerSession;
  }

  function incrementSessionMsg() {
    _sessionMsgs++;
    renderStats();
  }

  function resetSessionMsgs() {
    _sessionMsgs = 0;
    renderStats();
  }

  // ─── COOLDOWN SYSTEM ──────────────────────────────────────────
  function startCooldown() {
    if (!_userProfile) return;
    const plan = _userProfile.plan || 'free';
    const limit = CONFIG.LIMITS[plan] || CONFIG.LIMITS.free;
    const cooldownMs = limit.cooldownMinutes * 60 * 1000;

    if (cooldownMs === 0) return; // Pro = no cooldown

    const endTime = Date.now() + cooldownMs;

    // Show cooldown UI
    _showCooldownUI(endTime);

    _cooldownTimer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(_cooldownTimer);
        _cooldownTimer = null;
        _sessionMsgs = 0;
        _hideCooldownUI();
        renderStats();
      } else {
        _updateCooldownTimer(remaining);
      }
    }, 1000);
  }

  function _showCooldownUI(endTime) {
    // Hide chat input
    const chatInput = document.querySelector('.chat-input-area');
    if (chatInput) chatInput.style.display = 'none';

    // Show cooldown banner
    let banner = document.getElementById('cooldown-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cooldown-banner';
      banner.className = 'cooldown-banner';

      const plan = _userProfile?.plan || 'free';
      const limit = CONFIG.LIMITS[plan] || CONFIG.LIMITS.free;

      banner.innerHTML = `
        <div class="cooldown-icon">⏰</div>
        <div class="cooldown-text">
          <div class="cooldown-title">Session limit reached!</div>
          <div class="cooldown-sub">Free plan mein ${limit.msgsPerSession} messages per session. Chat wapas shuru hoga:</div>
          <div class="cooldown-timer" id="cooldown-timer-display">--:--</div>
        </div>
        <button class="btn-upgrade-now" onclick="Dashboard.showUpgradePrompt()">
          ⚡ Upgrade for more
        </button>
      `;

      const chatMessages = document.getElementById('chat-messages');
      if (chatMessages && chatMessages.parentNode) {
        chatMessages.parentNode.insertBefore(banner, chatMessages.nextSibling);
      }
    }

    banner.style.display = 'flex';
    _updateCooldownTimer(endTime - Date.now());
  }

  function _hideCooldownUI() {
    const banner = document.getElementById('cooldown-banner');
    if (banner) banner.style.display = 'none';

    const chatInput = document.querySelector('.chat-input-area');
    if (chatInput) chatInput.style.display = 'flex';
  }

  function _updateCooldownTimer(remainingMs) {
    const display = document.getElementById('cooldown-timer-display');
    if (!display) return;

    const mins = Math.floor(remainingMs / 60000);
    const secs = Math.floor((remainingMs % 60000) / 1000);
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // ─── SESSION TIMER (for DB tracking only) ─────────────────────
  function startSessionTimer(onMinuteTick) {
    _sessionStartTime = Date.now();
    _sessionMsgs = 0;

    _sessionMinsTimer = setInterval(() => {
      const minsElapsed = Math.floor((Date.now() - _sessionStartTime) / 60000);
      if (onMinuteTick) onMinuteTick(minsElapsed);
    }, 60000);
  }

  function stopSessionTimer() {
    if (_sessionMinsTimer) {
      clearInterval(_sessionMinsTimer);
      _sessionMinsTimer = null;
    }
    if (_sessionStartTime) {
      const minsElapsed = Math.ceil((Date.now() - _sessionStartTime) / 60000);
      _sessionStartTime = null;
      return minsElapsed;
    }
    return 0;
  }

  // ─── CHAT UI ──────────────────────────────────────────────────
  function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;

    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    msgDiv.innerHTML = `<div class="message-bubble">${formatted}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator(show) {
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

  function clearChat(scenarioGreeting) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';

    // Hide cooldown if showing
    _hideCooldownUI();
    _sessionMsgs = 0;

    if (scenarioGreeting) appendMessage('assistant', scenarioGreeting);
  }

  // ─── COURSE RENDER ────────────────────────────────────────────
  function renderCourse() {
    const userPlan = _userProfile?.plan || 'free';
    const allowedWeeks = CONFIG.PLANS[userPlan]?.courseWeeks || 1;

    const lessons = [
      { week: 1, day: 1, title: 'Why You\'re Getting Ignored', free: true, done: true },
      { week: 1, day: 2, title: 'The Confidence Framework', free: true, done: false, today: true },
      { week: 1, day: 3, title: 'First Message Formula', free: false },
      { week: 1, day: 4, title: 'Reading Her Signals', free: false },
      { week: 1, day: 5, title: 'The Art of Banter', free: false },
      { week: 2, day: 8, title: 'Date Planning 101', free: false },
      { week: 2, day: 9, title: 'Conversation Depth', free: false },
    ];

    const container = document.getElementById('course-list');
    if (!container) return;

    container.innerHTML = lessons.map(lesson => {
      const isLocked = lesson.week > allowedWeeks && !lesson.free;
      return `
        <div class="lesson-item ${lesson.done ? 'done' : ''} ${lesson.today ? 'today' : ''} ${isLocked ? 'locked' : ''}">
          <div class="lesson-indicator">
            ${lesson.done ? '✓' : isLocked ? '🔒' : lesson.day}
          </div>
          <div class="lesson-info">
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-meta">Week ${lesson.week} · ${lesson.free ? 'Free' : 'Starter+'}${lesson.today ? ' · <strong>Today</strong>' : ''}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  return {
    setProfile, getProfile,
    renderStats, renderScenarios,
    handleScenarioClick, showUpgradePrompt,
    hasReachedLimit, incrementSessionMsg, resetSessionMsgs,
    startCooldown,
    startSessionTimer, stopSessionTimer,
    appendMessage, showTypingIndicator, clearChat,
    renderCourse,
  };
})();
