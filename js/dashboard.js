// js/dashboard.js — Dashboard UI + stats (with gender selection)
const Dashboard = (() => {
  let _userProfile = null;
  let _sessionStartTime = null;
  let _sessionMinsTimer = null;
  let _scenarioClickHandler = null;
  let _userGender = null; // 'male' ya 'female' — user kya hai
  let _genderSelectCallback = null;

  function setProfile(profile) {
    _userProfile = profile;
    if (profile.gender) _userGender = profile.gender;
  }

  function getProfile() { return _userProfile; }
  function getUserGender() { return _userGender; }

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
      progressBar.style.background = percentage > 80
        ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)'
        : 'linear-gradient(90deg, #fd79a8, #e84393)';
    }

    const limitWarning = document.getElementById('limit-warning');
    if (limitWarning) {
      limitWarning.style.display = hasReachedLimit() ? 'block' : 'none';
    }
  }

  // ─── GENDER SELECTION UI ─────────────────────────────────────────
  function renderGenderSelect(onGenderSelected) {
    const container = document.getElementById('scenarios-grid');
    if (!container) return;
    _genderSelectCallback = onGenderSelected;

    container.innerHTML = `
      <div class="gender-select-card">
        <div class="gender-select-title">Main hun:</div>
        <div class="gender-select-subtitle">Tumhare liye AI persona choose hoga 👇</div>
        <div class="gender-btns">
          <button class="gender-btn male-btn" onclick="Dashboard.selectGender('male')">
            <span class="gender-emoji">👦</span>
            <span class="gender-label">Boy</span>
            <span class="gender-sublabel">Female AI se practice karunga</span>
          </button>
          <button class="gender-btn female-btn" onclick="Dashboard.selectGender('female')">
            <span class="gender-emoji">👧</span>
            <span class="gender-label">Girl</span>
            <span class="gender-sublabel">Male AI se practice karungi</span>
          </button>
        </div>
      </div>
    `;
  }

  function selectGender(gender) {
    _userGender = gender;
    if (_userProfile) {
      _userProfile.gender = gender;
      Auth.updateUserStats(_userProfile.id, { gender });
    }
    renderScenarios(_scenarioClickHandler);
    if (_genderSelectCallback) _genderSelectCallback(gender);
  }

  function resetGender() {
    _userGender = null;
    if (_userProfile) _userProfile.gender = null;
    renderScenarios(_scenarioClickHandler);
  }

  // ─── SCENARIOS RENDER ────────────────────────────────────────────
  function renderScenarios(onScenarioClick) {
    _scenarioClickHandler = onScenarioClick;
    const container = document.getElementById('scenarios-grid');
    if (!container) return;

    // Gender nahi chuna → show gender selection
    if (!_userGender) {
      renderGenderSelect(onScenarioClick);
      return;
    }

    const userPlan = _userProfile?.plan || 'free';
    const allowedScenarios = CONFIG.PLANS[userPlan]?.scenarios || CONFIG.PLANS.free.scenarios;

    // Male user → female AI personas | Female user → male AI personas
    const scenarioSet = _userGender === 'male'
      ? CONFIG.SCENARIOS_FEMALE
      : CONFIG.SCENARIOS_MALE;

    const genderLabel = _userGender === 'male' ? '👦 Boy Mode' : '👧 Girl Mode';
    const switchLabel = _userGender === 'male' ? 'Switch to Girl Mode' : 'Switch to Boy Mode';

    const cardsHtml = Object.values(scenarioSet).map(scenario => {
      const isLocked = !allowedScenarios.includes(scenario.id);
      return `
        <div class="scenario-card ${isLocked ? 'locked' : ''}"
             onclick="${isLocked ? "Dashboard.showUpgradePrompt()" : `Dashboard.handleScenarioClick('${scenario.id}')`}">
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

    container.innerHTML = `
      <div class="gender-toggle-bar">
        <span class="gender-active-badge">${genderLabel}</span>
        <button class="gender-switch-btn" onclick="Dashboard.resetGender()">🔄 ${switchLabel}</button>
      </div>
      ${cardsHtml}
    `;
  }

  function handleScenarioClick(scenarioId) {
    if (_scenarioClickHandler) _scenarioClickHandler(scenarioId);
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
    if (_sessionMinsTimer) { clearInterval(_sessionMinsTimer); _sessionMinsTimer = null; }
    if (_sessionStartTime) {
      const mins = Math.ceil((Date.now() - _sessionStartTime) / 60000);
      _sessionStartTime = null;
      return mins;
    }
    return 0;
  }

  function renderCourse() {
    const userPlan = _userProfile?.plan || 'free';
    const allowedWeeks = CONFIG.PLANS[userPlan]?.courseWeeks || 1;
    const container = document.getElementById('course-list');
    if (!container) return;

    // Group lessons by week
    const weeks = {};
    CONFIG.COURSE.forEach(lesson => {
      if (!weeks[lesson.week]) weeks[lesson.week] = [];
      weeks[lesson.week].push(lesson);
    });

    container.innerHTML = Object.entries(weeks).map(([weekNum, lessons]) => {
      const weekLocked = parseInt(weekNum) > allowedWeeks;
      return `
        <div class="week-section ${weekLocked ? 'week-locked' : ''}">
          <div class="week-header">
            <span class="week-label">Week ${weekNum}</span>
            ${weekLocked
              ? '<span class="week-lock-badge">🔒 Starter+</span>'
              : '<span class="week-free-badge">✓ Included</span>'
            }
          </div>
          ${lessons.map(lesson => {
            const isLocked = weekLocked;
            return `
              <div class="lesson-item ${lesson.done ? 'done' : ''} ${lesson.today ? 'today' : ''} ${isLocked ? 'locked' : ''}">
                <div class="lesson-indicator">
                  ${lesson.done ? '✓' : isLocked ? '🔒' : lesson.today ? '▶' : lesson.day}
                </div>
                <div class="lesson-info">
                  <div class="lesson-title">${lesson.title}</div>
                  <div class="lesson-meta">
                    ${lesson.subtitle}
                    ${lesson.today ? ' · <strong style="color:var(--pink)">Today</strong>' : ''}
                  </div>
                </div>
                ${lesson.today && !isLocked ? '<div class="lesson-cta" onclick="switchAppTab(\'chat\')">Start →</div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }).join('');
  }

  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  return {
    setProfile, getProfile, getUserGender,
    renderStats,
    renderGenderSelect, selectGender, resetGender,
    renderScenarios, handleScenarioClick,
    showUpgradePrompt, hasReachedLimit,
    startSessionTimer, stopSessionTimer,
    renderCourse,
  };
})();
