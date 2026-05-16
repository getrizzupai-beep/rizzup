// ============================================
// DASHBOARD.JS — Course Reader Modal + Scroll Completion + Progress Save/Load
// ============================================

let currentDay = null;
let readingStartTime = null;
let scrollProgress = 0;
let quizAnswers = {};

// Initialize dashboard
async function initDashboard() {
  renderStats();
  renderCourseGrid();
  renderBadges();
  checkStreak();
}

// Render user stats
function renderStats() {
  const user = getCurrentUser();
  const profile = user?.profile || {};
  
  const xp = profile.xp || 0;
  const level = getLevelFromXP(xp);
  const streak = profile.streak || 0;
  const completedDays = Object.keys(profile.course_progress || {}).length;
  
  // Update DOM elements
  updateElement('userXP', xp + ' XP');
  updateElement('userLevel', level.name);
  updateElement('userLevelNum', 'Level ' + level.level);
  updateElement('userStreak', streak + ' 🔥');
  updateElement('completedDays', completedDays + '/30');
  
  // Progress bar
  const progressPercent = (completedDays / 30) * 100;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = progressPercent + '%';
  }
  
  // Level color
  const levelBadge = document.getElementById('levelBadge');
  if (levelBadge) {
    levelBadge.style.background = level.color;
  }
}

// Get level from XP
function getLevelFromXP(xp) {
  for (let i = CONFIG.LEVELS.length - 1; i >= 0; i--) {
    if (xp >= CONFIG.LEVELS[i].xpNeeded) {
      return CONFIG.LEVELS[i];
    }
  }
  return CONFIG.LEVELS[0];
}

// Render course grid
function renderCourseGrid() {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;
  
  const user = getCurrentUser();
  const progress = user?.profile?.course_progress || {};
  
  grid.innerHTML = CONFIG.COURSE.map((day, index) => {
    const isCompleted = progress[day.day];
    const isLocked = !day.isFree && !isPaidUser();
    const isNext = index === 0 || progress[CONFIG.COURSE[index - 1]?.day];
    
    let statusClass = '';
    let statusIcon = '';
    
    if (isCompleted) {
      statusClass = 'completed';
      statusIcon = '✅';
    } else if (isLocked) {
      statusClass = 'locked';
      statusIcon = '🔒';
    } else if (!isNext && index > 0) {
      statusClass = 'locked';
      statusIcon = '🔒';
    } else {
      statusClass = 'available';
      statusIcon = day.isFree ? '🆓' : '⭐';
    }
    
    return `
      <div class="course-card ${statusClass}" onclick="openDay(${day.day})" data-day="${day.day}">
        <div class="course-day">Day ${day.day}</div>
        <div class="course-phase">Phase ${day.phase}</div>
        <h4>${day.title}</h4>
        <div class="course-meta">
          <span>${day.duration}</span>
          <span class="status-icon">${statusIcon}</span>
        </div>
        ${isCompleted ? '<div class="completed-badge">✓ Done</div>' : ''}
      </div>
    `;
  }).join('');
}

// Check if user is paid
function isPaidUser() {
  // TODO: Implement payment check with Razorpay
  // For now, check localStorage or Supabase
  const user = getCurrentUser();
  return user?.profile?.is_paid || false;
}

// Open day modal
async function openDay(dayNum) {
  const day = CONFIG.COURSE.find(d => d.day === dayNum);
  if (!day) return;
  
  // Check if locked
  if (!day.isFree && !isPaidUser()) {
    showPaywall(day);
    return;
  }
  
  currentDay = day;
  scrollProgress = 0;
  quizAnswers = {};
  readingStartTime = Date.now();
  
  // Render modal content
  const modal = document.getElementById('courseModal');
  const content = document.getElementById('courseModalContent');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="course-reader">
      <div class="reader-header">
        <div class="reader-day">Day ${day.day} · Phase ${day.phase}</div>
        <h2>${day.title}</h2>
        <div class="reader-meta">
          <span>⏱️ ${day.duration}</span>
          <span>🎥 Video included</span>
        </div>
      </div>
      
      <div class="video-container">
        <iframe src="${day.videoUrl}" frameborder="0" allowfullscreen></iframe>
      </div>
      
      <div class="reader-content" id="readerContent">
        ${day.content}
      </div>
      
      <div class="reading-progress">
        <div class="progress-label">Reading Progress</div>
        <div class="progress-bar-container">
          <div class="progress-bar" id="readingProgressBar" style="width: 0%"></div>
        </div>
        <div class="progress-text" id="progressText">0%</div>
      </div>
      
      <div class="quiz-section" id="quizSection">
        <h3>🧠 Quick Quiz</h3>
        ${day.quiz.map((q, i) => `
          <div class="quiz-question" data-q="${i}">
            <p><strong>Q${i + 1}:</strong> ${q.q}</p>
            <div class="quiz-options">
              ${q.options.map((opt, j) => `
                <label class="quiz-option">
                  <input type="radio" name="q${i}" value="${j}" onchange="selectAnswer(${i}, ${j})">
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="coach-tip">
        <div class="coach-avatar">🎯</div>
        <div class="coach-text">
          <strong>Coach Tip:</strong>
          <p>${day.coachTip}</p>
        </div>
      </div>
      
      <button class="btn-complete" id="completeBtn" onclick="completeDay()" disabled>
        Mark Complete (+${CONFIG.XP_PER_LESSON} XP)
      </button>
    </div>
  `;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Setup scroll tracking
  setupScrollTracking();
  
  // Setup timer
  setupReadingTimer();
}

// Setup scroll tracking for completion
function setupScrollTracking() {
  const content = document.getElementById('readerContent');
  if (!content) return;
  
  content.addEventListener('scroll', () => {
    const scrollTop = content.scrollTop;
    const scrollHeight = content.scrollHeight - content.clientHeight;
    scrollProgress = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
    
    // Update progress bar
    const bar = document.getElementById('readingProgressBar');
    const text = document.getElementById('progressText');
    if (bar) bar.style.width = scrollProgress + '%';
    if (text) text.textContent = scrollProgress + '%';
    
    // Enable complete button at 80% scroll
    const btn = document.getElementById('completeBtn');
    if (btn && scrollProgress >= 80) {
      btn.disabled = false;
      btn.classList.add('active');
    }
  });
}

// Setup reading timer (minimum 2 minutes)
function setupReadingTimer() {
  const btn = document.getElementById('completeBtn');
  if (!btn) return;
  
  let timeElapsed = 0;
  const minTime = 120; // 2 minutes in seconds
  
  const timer = setInterval(() => {
    timeElapsed++;
    
    // Only enable if both scroll and time conditions met
    if (timeElapsed >= minTime && scrollProgress >= 80) {
      btn.disabled = false;
      btn.classList.add('active');
      clearInterval(timer);
    }
  }, 1000);
}

// Select quiz answer
function selectAnswer(questionIndex, answerIndex) {
  quizAnswers[questionIndex] = answerIndex;
}

// Complete day
async function completeDay() {
  if (!currentDay) return;
  
  const user = getCurrentUser();
  if (!user) {
    alert('Please login first!');
    return;
  }
  
  // Calculate quiz score
  let correctAnswers = 0;
  currentDay.quiz.forEach((q, i) => {
    if (quizAnswers[i] === q.correct) correctAnswers++;
  });
  
  const quizScore = Math.round((correctAnswers / currentDay.quiz.length) * 100);
  const quizBonus = quizScore === 100 ? CONFIG.XP_PER_QUIZ : 0;
  
  // Calculate total XP
  const totalXP = CONFIG.XP_PER_LESSON + quizBonus;
  
  // Update progress
  const progress = user.profile?.course_progress || {};
  progress[currentDay.day] = {
    completed: true,
    completedAt: new Date().toISOString(),
    quizScore: quizScore,
    timeSpent: Math.round((Date.now() - readingStartTime) / 1000)
  };
  
  // Update user stats
  const updates = {
    xp: (user.profile?.xp || 0) + totalXP,
    course_progress: progress
  };
  
  await updateUserStats(updates);
  
  // Check badges
  checkCourseBadges(progress);
  
  // Show completion modal
  showCompletionModal(totalXP, quizScore);
  
  // Refresh dashboard
  renderStats();
  renderCourseGrid();
  
  // Close reader
  closeCourseModal();
}

// Check course-related badges
function checkCourseBadges(progress) {
  const completedDays = Object.keys(progress).length;
  
  if (completedDays >= 7) unlockBadge('week1_complete');
  if (completedDays >= 30) unlockBadge('course_complete');
  
  // Check streak
  checkStreak();
}

// Check streak
function checkStreak() {
  const user = getCurrentUser();
  const lastCompleted = user?.profile?.last_completed_at;
  
  if (!lastCompleted) return;
  
  const lastDate = new Date(lastCompleted);
  const today = new Date();
  const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  
  let streak = user?.profile?.streak || 0;
  
  if (diffDays === 1) {
    streak++;
  } else if (diffDays > 1) {
    streak = 1; // Reset but count today
  }
  
  if (streak >= 7) unlockBadge('streak_7');
  if (streak >= 30) unlockBadge('streak_30');
  
  // Update streak in DB
  updateUserStats({ streak: streak, last_completed_at: new Date().toISOString() });
}

// Show completion modal
function showCompletionModal(xp, quizScore) {
  const modal = document.createElement('div');
  modal.className = 'completion-modal';
  modal.innerHTML = `
    <div class="completion-content">
      <div class="completion-emoji">🎉</div>
      <h2>Day ${currentDay.day} Complete!</h2>
      <div class="completion-stats">
        <div class="stat">
          <span class="stat-value">+${xp}</span>
          <span class="stat-label">XP Earned</span>
        </div>
        <div class="stat">
          <span class="stat-value">${quizScore}%</span>
          <span class="stat-label">Quiz Score</span>
        </div>
      </div>
      <button onclick="this.closest('.completion-modal').remove()" class="btn-primary">
        Continue
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    modal.remove();
  }, 3000);
}

// Show paywall
function showPaywall(day) {
  const modal = document.getElementById('courseModal');
  const content = document.getElementById('courseModalContent');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="paywall">
      <div class="paywall-icon">🔒</div>
      <h2>Unlock Day ${day.day}</h2>
      <p>This content is part of the premium course.</p>
      <div class="paywall-features">
        <div class="feature">✅ Days 8-30 Full Content</div>
        <div class="feature">✅ AI Voice Call Practice</div>
        <div class="feature">✅ 1-on-1 Coach Session</div>
        <div class="feature">✅ Certificate of Completion</div>
      </div>
      <div class="paywall-price">₹99/month</div>
      <button class="btn-primary" onclick="initiatePayment()">
        Unlock Now
      </button>
      <button class="btn-secondary" onclick="closeCourseModal()">
        Maybe Later
      </button>
    </div>
  `;
  
  modal.style.display = 'flex';
}

// Close course modal
function closeCourseModal() {
  const modal = document.getElementById('courseModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  currentDay = null;
}

// Render badges
function renderBadges() {
  const container = document.getElementById('badgesContainer');
  if (!container) return;
  
  const user = getCurrentUser();
  const earnedBadges = user?.profile?.badges || [];
  
  container.innerHTML = CONFIG.BADGES.map(badge => {
    const isEarned = earnedBadges.includes(badge.id);
    return `
      <div class="badge ${isEarned ? 'earned' : 'locked'}" title="${badge.desc}">
        <span class="badge-icon">${isEarned ? badge.icon : '🔒'}</span>
        <span class="badge-name">${badge.name}</span>
      </div>
    `;
  }).join('');
}

// Unlock badge
async function unlockBadge(badgeId) {
  const user = getCurrentUser();
  if (!user) return;
  
  const badges = user.profile?.badges || [];
  if (badges.includes(badgeId)) return; // Already have it
  
  badges.push(badgeId);
  await updateUserStats({ badges: badges });
  
  // Show notification
  const badge = CONFIG.BADGES.find(b => b.id === badgeId);
  if (badge) {
    showBadgeNotification(badge);
  }
  
  renderBadges();
}

// Show badge notification
function showBadgeNotification(badge) {
  const notif = document.createElement('div');
  notif.className = 'badge-notification';
  notif.innerHTML = `
    <div class="badge-notif-content">
      <span class="badge-notif-icon">${badge.icon}</span>
      <div>
        <strong>Badge Unlocked!</strong>
        <p>${badge.name}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Payment placeholder
function initiatePayment() {
  alert('Payment integration coming soon! Contact support to upgrade.');
}

// Helper: Update element text
function updateElement(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initDashboard,
    openDay,
    closeCourseModal,
    completeDay,
    selectAnswer,
    unlockBadge
  };
}
