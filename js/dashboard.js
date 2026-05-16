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
    _courseProgress = profile.course_progress || {};
    _userXP = profile.xp || 0;
    _userBadges = profile.badges || [];
    _streak = profile.streak || 0;
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

    // Phases
    CONFIG.COURSE.phases.forEach(phase => {
      const isPhaseFree = phase.free;
      const isLocked = !isPhaseFree && !isPaid;

      html += `
        <div class="course-phase ${isLocked ? 'locked' : ''}" data-phase="${phase.id}">
          <div class="phase-header">
            <div class="phase-name">${phase.emoji} ${phase.name}</div>
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

        html += `
          <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isDayLocked ? 'locked' : ''}"
               onclick="${isDayLocked ? 'Dashboard.showUpgradePrompt()' : `Dashboard.openLesson(${lesson.day})`}">
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
  }

  // ═══════════════════════════════════════════════════════════════════
  // LESSON MODAL
  // ═══════════════════════════════════════════════════════════════════
  function openLesson(day) {
    const lesson = _findLesson(day);
    if (!lesson) return;

    const phase = CONFIG.COURSE.phases.find(p => p.lessons.some(l => l.day === day));

    // Check if already completed
    const isCompleted = _courseProgress[day];

    const modal = document.getElementById('lesson-modal');
    const content = document.getElementById('lesson-modal-content');

    if (!modal || !content) return;

    content.innerHTML = `
      <div class="lesson-modal-header">
        <div class="lesson-modal-day">Day ${lesson.day}</div>
        <h3>${lesson.emoji} ${lesson.title}</h3>
        <div class="lesson-modal-meta">${phase.name} • ${lesson.duration} • +${lesson.xp} XP</div>
      </div>

      <div class="lesson-content">
        <div class="lesson-section">
          <h4>🎯 Today's Task</h4>
          <p>${lesson.task}</p>
        </div>

        <div class="lesson-section">
          <h4>💡 Key Takeaways</h4>
          <ul>
            ${lesson.keyTakeaways.map(k => `<li>${k}</li>`).join('')}
          </ul>
        </div>

        <div class="lesson-section">
          <h4>📝 Practice</h4>
          <p>Complete today's task to earn <strong>+${lesson.xp} XP</strong>!</p>
        </div>
      </div>

      <div class="lesson-actions">
        ${isCompleted 
          ? '<button class="btn-primary" disabled>✓ Completed</button>'
          : `<button class="btn-primary" onclick="Dashboard.completeLesson(${day})">Complete Lesson ✓</button>`
        }
      </div>
    `;

    modal.style.display = 'flex';
  }

  // ═══════════════════════════════════════════════════════════════════
  // COMPLETE LESSON
  // ═══════════════════════════════════════════════════════════════════
  function completeLesson(day) {
    if (_courseProgress[day]) return; // Already completed

    const lesson = _findLesson(day);
    if (!lesson) return;

    // Mark complete
    _courseProgress[day] = true;

    // Add XP
    _userXP += lesson.xp;

    // Check for new badges
    const newBadges = _checkBadges();

    // Save to profile
    if (_userProfile) {
      _userProfile.course_progress = _courseProgress;
      _userProfile.xp = _userXP;
      _userProfile.badges = [...new Set([..._userBadges, ...newBadges])];
      Auth.updateUserStats(_userProfile.id, {
        course_progress: _courseProgress,
        xp: _userXP,
        badges: _userProfile.badges,
      });
    }

    // Close modal
    document.getElementById('lesson-modal').style.display = 'none';

    // Show celebration
    _showToast(`🎉 +${lesson.xp} XP earned! Day ${day} complete!`, 'success');

    // Show new badges
    newBadges.forEach(badgeId => {
      const badge = CONFIG.BADGES.find(b => b.id === badgeId);
      if (badge) {
        setTimeout(() => {
          _showToast(`🏆 New Badge: ${badge.icon} ${badge.name}!`, 'success');
        }, 1500);
      }
    });

    // Re-render
    renderCourse();
    renderStats();
  }

  // ═══════════════════════════════════════════════════════════════════
  // BADGES
  // ═══════════════════════════════════════════════════════════════════
  function _renderBadges() {
    const earnedBadges = CONFIG.BADGES.filter(b => _userBadges.includes(b.id));
    const lockedBadges = CONFIG.BADGES.filter(b => !_userBadges.includes(b.id));

    return `
      <div class="badges-section">
        <h3 class="section-heading">🏆 Your Badges</h3>
        <div class="badges-grid">
          ${earnedBadges.map(b => `
            <div class="badge-card earned">
              <div class="badge-icon">${b.icon}</div>
              <div class="badge-name">${b.name}</div>
              <div class="badge-desc">${b.desc}</div>
            </div>
          `).join('')}
          ${lockedBadges.map(b => `
            <div class="badge-card locked">
              <div class="badge-icon">🔒</div>
              <div class="badge-name">${b.name}</div>
              <div class="badge-desc">${b.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function _checkBadges() {
    const newBadges = [];
    const totalMsgs = _userProfile?.total_msgs || 0;
    const sessions = _userProfile?.sessions || 0;
    const completedDays = Object.keys(_courseProgress).filter(k => _courseProgress[k]).length;
    const level = _getLevel(_userXP).level;

    CONFIG.BADGES.forEach(badge => {
      if (_userBadges.includes(badge.id)) return;

      let earned = false;
      switch(badge.id) {
        case 'first_msg': earned = totalMsgs >= 10; break;
        case 'date_closer': earned = sessions >= 1; break;
        case 'rejection_pro': earned = sessions >= 3; break;
        case 'streak_7': earned = _streak >= 7; break;
        case 'week1_done': earned = completedDays >= 7; break;
        case 'course_complete': earned = completedDays >= 28; break;
        case 'level_5': earned = level >= 5; break;
      }

      if (earned) newBadges.push(badge.id);
    });

    return newBadges;
  }

  // ═══════════════════════════════════════════════════════════════════
  // LEVEL SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  function _getLevel(xp) {
    for (let i = CONFIG.LEVELS.length - 1; i >= 0; i--) {
      if (xp >= CONFIG.LEVELS[i].minXP) {
        return CONFIG.LEVELS[i];
      }
    }
    return CONFIG.LEVELS[0];
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
  };
})();
