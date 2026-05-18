// js/dashboard.js — Dashboard UI + stats
// FIX: renderCourse() HTML classes app.css se match karti hain ab

const Dashboard = (() => {
  let _userProfile = null;
  let _sessionStartTime = null;
  let _sessionMinsTimer = null;

  function setProfile(profile) {
    _userProfile = profile;
  }

  function getProfile() {
    return _userProfile;
  }

  // Dashboard stats render karo
  function renderStats() {
    if (!_userProfile) return;

    const plan = CONFIG.PLANS[_userProfile.plan] || CONFIG.PLANS.free;
    const minsUsed = _userProfile.mins_used || 0;
    const minsLimit = plan.dailyMinutes;
    const percentage = Math.min(100, (minsUsed / minsLimit) * 100);

    _setText('stat-mins-used', minsUsed);
    _setText('stat-mins-limit', minsLimit === 999 ? '∞' : minsLimit);
    _setText('stat-total-msgs', _userProfile.total_msgs || 0);
    _setText('stat-sessions', _userProfile.sessions || 0);
    _setText('stat-plan', (_userProfile.plan || 'free').toUpperCase());

    const progressBar = document.getElementById('mins-progress-bar');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }

    const limitWarning = document.getElementById('limit-warning');
    if (limitWarning) {
      const minsLeft = Math.max(0, minsLimit - minsUsed);
      limitWarning.style.display = minsLeft === 0 ? 'block' : 'none';
    }
  }

  // Scenarios render karo
  function renderScenarios(onScenarioClick) {
    const container = document.getElementById('scenarios-grid');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const allowedScenarios = CONFIG.PLANS[userPlan]?.scenarios || CONFIG.PLANS.free.scenarios;

    container.innerHTML = Object.values(CONFIG.SCENARIOS).map(scenario => {
      const isLocked = !allowedScenarios.includes(scenario.id);
      return `
        <div class="scenario-card ${isLocked ? 'locked' : ''}"
             ${!isLocked
               ? `onclick="Dashboard.handleScenarioClick('${scenario.id}')"`
               : 'onclick="Dashboard.showUpgradePrompt()"'}
             data-scenario="${scenario.id}">
          <div class="scenario-emoji">${scenario.emoji}</div>
          ${isLocked ? '<div class="lock-badge">🔒</div>' : ''}
          <div class="scenario-persona">${scenario.persona}</div>
          <div class="scenario-name">${scenario.name}</div>
          <div class="scenario-desc">${scenario.description}</div>
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

  function hasReachedLimit() {
    if (!_userProfile) return false;
    const plan = CONFIG.PLANS[_userProfile.plan] || CONFIG.PLANS.free;
    if (plan.dailyMinutes === 999) return false;
    return (_userProfile.mins_used || 0) >= plan.dailyMinutes;
  }

  function startSessionTimer(onMinuteTick) {
    _sessionStartTime = Date.now();
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

  // Chat message append karo
  function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    // No scenario state chhupao
    const noState = document.getElementById('no-scenario-state');
    if (noState) noState.style.display = 'none';

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;

    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    msgDiv.innerHTML = `<div class="message-bubble">${formattedContent}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Typing indicator
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

  // Chat clear + greeting
  function clearChat(scenarioGreeting) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';

    if (scenarioGreeting) {
      appendMessage('assistant', scenarioGreeting);
    }
  }

  // Helper
  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ─── COURSE RENDER ───────────────────────────────────────────────
  // FIX: HTML ab app.css ke .lesson-item classes se match karta hai
  function renderCourse() {
    const container = document.getElementById('course-list');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const allowedWeeks = CONFIG.PLANS[userPlan]?.courseWeeks || 1;

    const lessons = [
      // Week 1 — Foundation (Free)
      { week: 1, day: 1, title: 'Why You\'re Getting Ignored',    emoji: '🚫', duration: '5 min',  xp: 50,  free: true,  done: false },
      { week: 1, day: 2, title: 'The Confidence DNA',             emoji: '💡', duration: '6 min',  xp: 50,  free: true,  done: false, today: true },
      { week: 1, day: 3, title: 'First Message Formula',          emoji: '💬', duration: '7 min',  xp: 50,  free: true,  done: false },
      { week: 1, day: 4, title: 'Reading Her Signals',            emoji: '👁️', duration: '5 min',  xp: 50,  free: true,  done: false },
      { week: 1, day: 5, title: 'The Art of Banter',              emoji: '😏', duration: '8 min',  xp: 50,  free: true,  done: false },
      { week: 1, day: 6, title: 'From Text to Date',              emoji: '📅', duration: '6 min',  xp: 50,  free: true,  done: false },
      { week: 1, day: 7, title: 'Week 1 Practice Challenge',      emoji: '🏆', duration: '10 min', xp: 100, free: true,  done: false },
      // Week 2 — Dating Dynamics (Starter+)
      { week: 2, day: 8,  title: 'Date Planning 101',             emoji: '🗺️', duration: '7 min',  xp: 75,  free: false },
      { week: 2, day: 9,  title: 'Conversation Depth',            emoji: '🌊', duration: '8 min',  xp: 75,  free: false },
      { week: 2, day: 10, title: 'The Vulnerability Playbook',    emoji: '❤️', duration: '9 min',  xp: 75,  free: false },
      { week: 2, day: 11, title: 'Handling Awkward Silences',     emoji: '🤫', duration: '6 min',  xp: 75,  free: false },
      { week: 2, day: 12, title: 'Escalation & Comfort',         emoji: '🔥', duration: '10 min', xp: 75,  free: false },
      { week: 2, day: 13, title: 'The Follow-Up Game',            emoji: '📲', duration: '5 min',  xp: 75,  free: false },
      { week: 2, day: 14, title: 'Week 2 Practice Challenge',     emoji: '🏆', duration: '12 min', xp: 150, free: false },
      // Week 3 — Advanced (Starter+)
      { week: 3, day: 15, title: 'Mastering Flirting',            emoji: '💫', duration: '9 min',  xp: 100, free: false },
      { week: 3, day: 16, title: 'The Arranged Meet Playbook',    emoji: '💐', duration: '11 min', xp: 100, free: false },
      { week: 3, day: 17, title: 'Rejection Recovery',            emoji: '💪', duration: '8 min',  xp: 100, free: false },
      { week: 3, day: 18, title: 'Long Distance Texting',         emoji: '📡', duration: '7 min',  xp: 100, free: false },
      { week: 3, day: 19, title: 'Understanding Boundaries',      emoji: '🛡️', duration: '8 min',  xp: 100, free: false },
      { week: 3, day: 20, title: 'Building Real Attraction',      emoji: '✨', duration: '10 min', xp: 100, free: false },
      { week: 3, day: 21, title: 'Week 3 Practice Challenge',     emoji: '🏆', duration: '15 min', xp: 200, free: false },
      // Week 4 — Relationships (Starter+)
      { week: 4, day: 22, title: 'The Commitment Conversation',   emoji: '💍', duration: '9 min',  xp: 100, free: false },
      { week: 4, day: 23, title: 'Meeting Her Family',            emoji: '👨‍👩‍👧', duration: '10 min', xp: 100, free: false },
      { week: 4, day: 24, title: 'Conflict Resolution',           emoji: '🤝', duration: '8 min',  xp: 100, free: false },
      { week: 4, day: 25, title: 'Keeping the Spark Alive',       emoji: '🕯️', duration: '9 min',  xp: 100, free: false },
      { week: 4, day: 26, title: 'Social Media & Dating',         emoji: '📱', duration: '7 min',  xp: 100, free: false },
      { week: 4, day: 27, title: 'The Long Game',                 emoji: '♟️', duration: '11 min', xp: 100, free: false },
      { week: 4, day: 28, title: 'Final Challenge + Graduation',  emoji: '🎓', duration: '20 min', xp: 500, free: false },
    ];

    // Group by week
    const weeks = {};
    lessons.forEach(l => {
      if (!weeks[l.week]) weeks[l.week] = [];
      weeks[l.week].push(l);
    });

    const weekLabels = {
      1: 'Week 1 — Foundation 🏗️',
      2: 'Week 2 — Dating Dynamics 🎯',
      3: 'Week 3 — Advanced Skills 🚀',
      4: 'Week 4 — Relationships ❤️',
    };

    container.innerHTML = Object.entries(weeks).map(([week, items]) => {
      const weekNum = parseInt(week);
      const isWeekLocked = weekNum > allowedWeeks;

      const lessonsHTML = items.map(lesson => {
        const isLocked = isWeekLocked && !lesson.free;
        const statusClass = lesson.done ? 'done' : lesson.today ? 'today' : isLocked ? 'locked' : '';

        let indicatorContent;
        if (lesson.done) indicatorContent = '✓';
        else if (isLocked) indicatorContent = '🔒';
        else indicatorContent = lesson.day;

        return `
          <div class="lesson-item ${statusClass}">
            <div class="lesson-indicator">${indicatorContent}</div>
            <div class="lesson-info">
              <div class="lesson-title">${lesson.emoji} ${lesson.title}</div>
              <div class="lesson-meta">
                ${lesson.duration} • +${lesson.xp} XP
                ${lesson.today ? ' • <strong style="color:var(--primary)">Today\'s lesson</strong>' : ''}
                ${lesson.free ? ' • <span style="color:#059669;font-weight:600">Free</span>' : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="week-group">
          <div class="week-header ${isWeekLocked ? 'week-locked' : ''}">
            ${weekLabels[weekNum]}
            ${isWeekLocked ? '<span class="week-lock-tag">🔒 Starter+</span>' : ''}
          </div>
          ${lessonsHTML}
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
