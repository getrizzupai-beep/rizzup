// js/dashboard.js — Sirf dashboard UI + stats
// Kaam: stats dikhao, update karo, limits check karo
// Chat ya auth ke baare mein kuch nahi jaanta

const Dashboard = (() => {
  let _userProfile = null;
  let _sessionStartTime = null;
  let _sessionMinsTimer = null;

  // Profile set karo
  function setProfile(profile) {
    _userProfile = profile;
  }

  // Profile get karo
  function getProfile() {
    return _userProfile;
  }

  // Dashboard stats render karo
  function renderStats() {
    if (!_userProfile) return;

    const plan = CONFIG.PLANS[_userProfile.plan] || CONFIG.PLANS.free;
    const minsUsed = _userProfile.mins_used || 0;
    const minsLimit = plan.dailyMinutes;
    const minsLeft = Math.max(0, minsLimit - minsUsed);
    const percentage = Math.min(100, (minsUsed / minsLimit) * 100);

    // Stats update karo
    _setText('stat-mins-used', minsUsed);
    _setText('stat-mins-limit', minsLimit === 999 ? '∞' : minsLimit);
    _setText('stat-total-msgs', _userProfile.total_msgs || 0);
    _setText('stat-sessions', _userProfile.sessions || 0);
    _setText('stat-plan', _userProfile.plan?.toUpperCase() || 'FREE');

    // Progress bar
    const progressBar = document.getElementById('mins-progress-bar');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
      progressBar.style.background = percentage > 80
        ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)'
        : 'linear-gradient(90deg, #fd79a8, #e84393)';
    }

    // Limit reached warning
    const limitWarning = document.getElementById('limit-warning');
    if (limitWarning) {
      limitWarning.style.display = minsLeft === 0 ? 'block' : 'none';
    }
  }

  // Scenarios render karo based on plan
  function renderScenarios(onScenarioClick) {
    const container = document.getElementById('scenarios-grid');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const allowedScenarios = CONFIG.PLANS[userPlan]?.scenarios || CONFIG.PLANS.free.scenarios;

    container.innerHTML = Object.values(CONFIG.SCENARIOS).map(scenario => {
      const isLocked = !allowedScenarios.includes(scenario.id);
      return `
        <div class="scenario-card ${isLocked ? 'locked' : ''}" 
             ${!isLocked ? `onclick="Dashboard.handleScenarioClick('${scenario.id}')"` : 'onclick="Dashboard.showUpgradePrompt()"'}
             data-scenario="${scenario.id}">
          <div class="scenario-emoji">${scenario.emoji}</div>
          ${isLocked ? '<div class="lock-badge">🔒</div>' : ''}
          <div class="scenario-info">
            <div class="scenario-persona">${scenario.persona}</div>
            <div class="scenario-name">${scenario.name}</div>
            <div class="scenario-desc">${scenario.description}</div>
          </div>
          <div class="scenario-tag ${isLocked ? 'tag-paid' : 'tag-free'}">
            ${isLocked ? (userPlan === 'free' ? 'Starter+' : 'Pro+') : 'Free'}
          </div>
        </div>
      `;
    }).join('');

    _scenarioClickHandler = onScenarioClick;
  }

  let _scenarioClickHandler = null;

  function handleScenarioClick(scenarioId) {
    if (_scenarioClickHandler) {
      _scenarioClickHandler(scenarioId);
    }
  }

  function showUpgradePrompt() {
    const modal = document.getElementById('upgrade-modal');
    if (modal) modal.style.display = 'flex';
  }

  // Daily limit check
  function hasReachedLimit() {
    if (!_userProfile) return false;
    const plan = CONFIG.PLANS[_userProfile.plan] || CONFIG.PLANS.free;
    if (plan.dailyMinutes === 999) return false; // unlimited
    return (_userProfile.mins_used || 0) >= plan.dailyMinutes;
  }

  // Session timer shuru karo
  function startSessionTimer(onMinuteTick) {
    _sessionStartTime = Date.now();
    
    // Har minute check karo
    _sessionMinsTimer = setInterval(() => {
      const minsElapsed = Math.floor((Date.now() - _sessionStartTime) / 60000);
      if (onMinuteTick) onMinuteTick(minsElapsed);
    }, 60000); // 1 minute
  }

  // Session timer rok do
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

  // Chat messages render karo
  function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
    
    // Markdown bold support (*text* → bold)
    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    
    msgDiv.innerHTML = `<div class="message-bubble">${formattedContent}</div>`;
    chatMessages.appendChild(msgDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Typing indicator dikhao/chhupao
  function showTypingIndicator(show) {
    const existing = document.getElementById('typing-indicator');
    
    if (show && !existing) {
      const chatMessages = document.getElementById('chat-messages');
      if (!chatMessages) return;
      
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing-indicator';
      typingDiv.className = 'message ai-message';
      typingDiv.innerHTML = `
        <div class="message-bubble typing-bubble">
          <span></span><span></span><span></span>
        </div>
      `;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else if (!show && existing) {
      existing.remove();
    }
  }

  // Chat clear karo
  function clearChat(scenarioGreeting, scenarioPersona) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';
    
    if (scenarioGreeting) {
      appendMessage('assistant', scenarioGreeting);
    }
  }

  // Helper: element text set karo safely
  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // Course lessons render karo
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
            <div class="lesson-meta">
              Week ${lesson.week} · ${lesson.free ? 'Free' : 'Starter+'}
              ${lesson.today ? ' · <strong>Today\'s lesson</strong>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Public API
  return {
    setProfile,
    getProfile,
    renderStats,
    renderScenarios,
    handleScenarioClick,
    showUpgradePrompt,
    hasReachedLimit,
    startSessionTimer,
    stopSessionTimer,
    appendMessage,
    showTypingIndicator,
    clearChat,
    renderCourse,
  };
})();
