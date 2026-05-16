// js/dashboard.js — Dashboard UI + stats + course + gamification
// No more mins tracking — message-based cooldown in main.js

const Dashboard = (() => {
  let _userProfile = null;
  let _courseProgress = {}; // day -> completed
  let _userXP = 0;
  let _userBadges = [];
  let _streak = 0;

  function setProfile(profile) {
    _userProfile = profile;
    // Load progress from profile if exists
    _courseProgress = profile?.course_progress || {};
    _userXP = profile?.xp || 0;
    _userBadges = profile?.badges || [];
    _streak = profile?.streak || 0;
  }

  function getProfile() {
    return _userProfile;
  }

  // ═══════════════════════════════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════════════════════════════
  function renderStats() {
    if (!_userProfile) return;

    const plan = _userProfile.plan || 'free';

    _setText('stat-total-msgs', _userProfile.total_msgs || 0);
    _setText('stat-sessions', _userProfile.sessions || 0);
    _setText('stat-plan', plan.toUpperCase());

    // XP & Level
    const level = _getLevel(_userXP);
    _setText('stat-xp', _userXP);
    _setText('stat-level', `${level.icon} ${level.name}`);

    // Streak
    _setText('stat-streak', `${_streak} 🔥`);
  }

  // ═══════════════════════════════════════════════════════════════════
  // COURSE RENDER
  // ═══════════════════════════════════════════════════════════════════
  function renderCourse() {
    const container = document.getElementById('course-list');
    if (!container) return;

    const userPlan = _userProfile?.plan || 'free';
    const isPaid = userPlan !== 'free';
    const maxFreeDay = CONFIG.COURSE.freeDays;

    let html = '';

    // Progress bar
    const completedDays = Object.keys(_courseProgress).filter(k => _courseProgress[k]).length;
    const progressPercent = Math.round((completedDays / CONFIG.COURSE.totalDays) * 100);

    html += `
      <div class="course-progress-bar">
        <div class="course-progress-fill" style="width:${progressPercent}%"></div>
        <span class="course-progress-text">${completedDays}/${CONFIG.COURSE.totalDays} days • ${progressPercent}%</span>
      </div>
      <div class="course-level-badge">
        ${_getLevel(_userXP).icon} Level ${_getLevel(_userXP).level} — ${_getLevel(_userXP).name}
      </div>
    `;

    // Resume banner - show if user has progress
    if (completedDays > 0 && completedDays < CONFIG.COURSE.totalDays) {
      const nextDay = completedDays + 1;
      const nextLesson = _findLesson(nextDay);
      if (nextLesson) {
        html += `
          <div class="course-resume-banner" onclick="Dashboard.openLesson(${nextDay})">
            <div class="resume-icon">▶️</div>
            <div class="resume-text">
              <strong>Resume Course</strong>
              <span>Continue Day ${nextDay}: ${nextLesson.emoji} ${nextLesson.title}</span>
            </div>
            <div class="resume-arrow">→</div>
          </div>
        `;
      }
    }

    // Phases
    CONFIG.COURSE.phases.forEach(phase => {
      const isPhaseFree = phase.free;
      const isLocked = !isPhaseFree && !isPaid;

      html += `
        <div class="course-phase ${isLocked ? 'locked' : ''}" data-phase="${phase.id}">
          <div class="phase-header">
            <div class="phase-name">${phase.emoji || '📚'} ${phase.name}</div>
            <div class="phase-meta">
              ${isLocked ? '🔒 ₹99 to unlock' : (isPhaseFree ? '✅ Free' : '✅ Unlocked')}
            </div>
          </div>
          <div class="phase-desc">${phase.description}</div>
          <div class="lessons-grid">
      `;

      phase.lessons.forEach(lesson => {
        const isCompleted = _courseProgress[lesson.day];
        const isDayFree = lesson.day <= maxFreeDay;
        const isDayLocked = !isDayFree && !isPaid;

        // FIX: Use data attributes instead of inline onclick for better handling
        html += `
          <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isDayLocked ? 'locked' : ''}"
               data-day="${lesson.day}"
               data-locked="${isDayLocked}">
            <div class="lesson-day">${isCompleted ? '✓' : lesson.day}</div>
            <div class="lesson-info">
              <div class="lesson-title">${lesson.emoji} ${lesson.title}</div>
              <div class="lesson-meta">${lesson.duration} • +${lesson.xp} XP</div>
            </div>
            ${isCompleted ? '<div class="lesson-check">✓</div>' : ''}
            ${isDayLocked ? '<div class="lesson-lock">🔒</div>' : ''}
          </div>
        `;
      });

      html += `</div></div>`;
    });

    // Bonus (Pro)
    html += `
      <div class="course-phase bonus-phase">
        <div class="phase-header">
          <div class="phase-name">🚀 Bonus (Pro)</div>
          <div class="phase-meta">Coming Soon</div>
        </div>
        <div class="lessons-grid">
          ${CONFIG.COURSE.bonus.map(b => `
            <div class="lesson-card locked">
              <div class="lesson-day">${b.day}</div>
              <div class="lesson-info">
                <div class="lesson-title">${b.emoji} ${b.title}</div>
                <div class="lesson-meta">${b.description}</div>
              </div>
              <div class="lesson-lock">🔒</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Badges section
    html += _renderBadges();

    container.innerHTML = html;

    // FIX: Attach event listeners after rendering
    _attachLessonListeners();
  }

  // NEW: Attach click listeners to lesson cards
  function _attachLessonListeners() {
    document.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', function(e) {
        const day = parseInt(this.dataset.day);
        const isLocked = this.dataset.locked === 'true';

        if (isLocked) {
          showUpgradePrompt();
        } else if (day) {
          openLesson(day);
        }
      });
    });
  }

  // NEW: Resume course - find next incomplete day
  function getNextLessonDay() {
    for (let day = 1; day <= CONFIG.COURSE.totalDays; day++) {
      if (!_courseProgress[day]) {
        return day;
      }
    }
    return null; // All complete
  }

  // NEW: Load progress from profile
  function loadProgress() {
    if (_userProfile) {
      _courseProgress = _userProfile.course_progress || {};
      _userXP = _userProfile.xp || 0;
      _userBadges = _userProfile.badges || [];
      _streak = _userProfile.streak || 0;
    }
  }

  function _findLesson(day) {
    for (const phase of CONFIG.COURSE.phases) {
      const lesson = phase.lessons.find(l => l.day === day);
      if (lesson) return lesson;
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════
  // SCENARIOS (same as before)
  // ═══════════════════════════════════════════════════════════════════
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

  // Helper
  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function _showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, 3500);
  }

  return {
    setProfile,
    getProfile,
    renderStats,
    renderScenarios,
    handleScenarioClick,
    showUpgradePrompt,
    renderCourse,
    openLesson,
    completeLesson,
    loadProgress,
    getNextLessonDay,
  };
})();
