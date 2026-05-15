// js/dashboard.js — Dashboard UI + stats
// No more mins tracking — message-based cooldown in main.js

const Dashboard = (() => {
  let _userProfile = null;

  function setProfile(profile) {
    _userProfile = profile;
  }

  function getProfile() {
    return _userProfile;
  }

  // Stats render
  function renderStats() {
    if (!_userProfile) return;

    const plan = _userProfile.plan || 'free';

    _setText('stat-total-msgs', _userProfile.total_msgs || 0);
    _setText('stat-sessions', _userProfile.sessions || 0);
    _setText('stat-plan', plan.toUpperCase());
  }

  // Scenarios render based on plan
  function renderScenarios(onScenarioClick) {
    const container = document.getElementById('scenarios-grid');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const allowedScenarios = CONFIG.PLANS[userPlan]?.scenarios || CONFIG.PLANS.free.scenarios;

    container.innerHTML = Object.values(CONFIG.SCENARIOS).map(scenario => {
      const isLocked = !allowedScenarios.includes(scenario.id);
      return `
        <div class="scenario-card ${isLocked ? 'locked' : ''}"
             onclick="${isLocked ? "Dashboard.showUpgradePrompt()" : `Dashboard.handleScenarioClick('${scenario.id}')`}"
             data-scenario="${scenario.id}">
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

  let _scenarioClickHandler = null;

  function handleScenarioClick(scenarioId) {
    if (_scenarioClickHandler) _scenarioClickHandler(scenarioId);
  }

  function showUpgradePrompt() {
    const modal = document.getElementById('upgrade-modal');
    if (modal) modal.style.display = 'flex';
  }

  // Course render — coming soon state
  function renderCourse() {
    const container = document.getElementById('course-list');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const allowedWeeks = CONFIG.PLANS[userPlan]?.courseWeeks || 1;

    // Preview of upcoming lessons
    const lessons = [
      { week: 1, day: 1, title: "Why You're Getting Ignored", free: true, comingSoon: true },
      { week: 1, day: 2, title: 'The Confidence Framework', free: true, comingSoon: true },
      { week: 1, day: 3, title: 'First Message Formula', free: false, comingSoon: true },
      { week: 1, day: 4, title: 'Reading Her Signals', free: false, comingSoon: true },
      { week: 1, day: 5, title: 'The Art of Banter', free: false, comingSoon: true },
      { week: 2, day: 8, title: 'Date Planning 101', free: false, comingSoon: true },
      { week: 2, day: 9, title: 'Conversation Depth', free: false, comingSoon: true },
    ];

    container.innerHTML = lessons.map(lesson => {
      const isLocked = (lesson.week > allowedWeeks && !lesson.free);
      return `
        <div class="lesson-item ${isLocked ? 'locked' : ''} coming-soon-lesson">
          <div class="lesson-indicator">
            ${isLocked ? '🔒' : lesson.day}
          </div>
          <div class="lesson-info">
            <div class="lesson-title">${lesson.title}</div>
            <div class="lesson-meta">
              Week ${lesson.week} · ${lesson.free ? 'Free' : 'Starter+'}
              · <span class="coming-soon-tag">Coming Soon</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Helper
  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  return {
    setProfile,
    getProfile,
    renderStats,
    renderScenarios,
    handleScenarioClick,
    showUpgradePrompt,
    renderCourse,
  };
})();
