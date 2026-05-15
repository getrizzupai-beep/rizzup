// js/dashboard.js — Sirf dashboard UI + stats
// Kaam: stats dikhao, update karo, limits check karo
// Chat ya auth ke baare mein kuch nahi jaanta

const Dashboard = (() => {
  let _userProfile = null;

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
    const totalMsgs = _userProfile.total_msgs || 0;
    const sessions = _userProfile.sessions || 0;

    _setText('stat-total-msgs', totalMsgs);
    _setText('stat-sessions', sessions);
    _setText('stat-plan', (_userProfile.plan || 'free').toUpperCase());

    // For free plan show message window info
    if (!_userProfile.plan || _userProfile.plan === 'free') {
      _setText('stat-mins-used', totalMsgs);
      _setText('stat-mins-limit', '∞');
      const progressBar = document.getElementById('mins-progress-bar');
      if (progressBar) progressBar.style.width = '0%';
    } else {
      _setText('stat-mins-used', '∞');
      _setText('stat-mins-limit', '∞');
      const progressBar = document.getElementById('mins-progress-bar');
      if (progressBar) progressBar.style.width = '100%';
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
            ${isLocked ? 'Starter+' : 'Free'}
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

  // Chat messages render karo
  function appendMessage(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
    
    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    
    msgDiv.innerHTML = `<div class="message-bubble">${formattedContent}</div>`;
    chatMessages.appendChild(msgDiv);
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

  // Course lessons render karo — REAL CONTENT
  function renderCourse() {
    const userPlan = _userProfile?.plan || 'free';
    const allowedWeeks = CONFIG.PLANS[userPlan]?.courseWeeks || 1;

    const lessons = [
      // WEEK 1 — FREE
      { week: 1, day: 1, title: 'Why You Get Ignored (And How to Fix It)', desc: 'Understand the #1 reason your messages go unanswered — and the simple shift that changes everything.', free: true, done: false },
      { week: 1, day: 2, title: 'The Confidence Framework', desc: 'Confidence isn\'t about looks or money. Learn the 3-part framework that makes anyone attractive.', free: true, done: false },
      { week: 1, day: 3, title: 'How to Start a Conversation (First Message Formula)', desc: 'The exact formula for opening messages that get replies every time. No more "Hey, how are you?"', free: true, done: false },
      { week: 1, day: 4, title: 'Reading Her Signals', desc: 'Learn to spot green flags, red flags, and "keep going" signs in any conversation.', free: true, done: false },
      { week: 1, day: 5, title: 'The Art of Banter — Wit Without Trying Hard', desc: 'Playful conversation is a skill, not a personality trait. Practice the banter loop.', free: true, done: false },
      { week: 1, day: 6, title: 'When and How to Ask for a Date', desc: 'Stop waiting for "the right moment." Here\'s exactly when and how to ask — without rejection fear.', free: true, done: false },
      { week: 1, day: 7, title: 'Week 1 Review + Practice Session', desc: 'Consolidate everything from Week 1 with a guided practice session with Priya.', free: true, done: false },

      // WEEK 2 — STARTER+
      { week: 2, day: 8, title: 'Date Planning 101 — Impress Without Overspending', desc: 'How to plan a date that\'s fun, low-pressure, and memorable. No fancy restaurants needed.', free: false },
      { week: 2, day: 9, title: 'First Date Mastery — From Nervous to Natural', desc: 'The complete guide to first dates — what to say, what to avoid, how to create real connection.', free: false },
      { week: 2, day: 10, title: 'Deep Conversation Techniques', desc: 'Move beyond small talk. Learn the "question ladder" to build genuine emotional connection fast.', free: false },
      { week: 2, day: 11, title: 'Handling Awkward Silences Like a Pro', desc: 'Silence doesn\'t have to be awkward. Turn it into connection with these 3 techniques.', free: false },
      { week: 2, day: 12, title: 'Physical Escalation — Reading Comfort Levels', desc: 'Understand consent, comfort, and how to naturally progress physical connection respectfully.', free: false },
      { week: 2, day: 13, title: 'Texting Between Dates — Keep the Spark Alive', desc: 'Don\'t lose momentum between dates. The texting strategy that keeps her thinking about you.', free: false },
      { week: 2, day: 14, title: 'Week 2 Review + Second Date Practice', desc: 'Full second date simulation with Megha + personalized coaching report.', free: false },

      // WEEK 3 — STARTER+
      { week: 3, day: 15, title: 'Rejection Recovery — Bounce Back Like a Champion', desc: 'Rejection is data, not failure. The mindset shift that makes rejection your best teacher.', free: false },
      { week: 3, day: 16, title: 'The Arranged Meeting Masterclass', desc: 'Navigate India\'s unique arranged meeting culture with confidence, respect, and genuine connection.', free: false },
      { week: 3, day: 17, title: 'Online Dating Profile Optimization', desc: 'Craft a profile that gets 3x more matches. Photos, bio, prompts — all covered.', free: false },
      { week: 3, day: 18, title: 'Flirting Without Crossing Lines', desc: 'Playful, fun, confident flirting that feels natural — not creepy. The line and how to stay on the right side.', free: false },
      { week: 3, day: 19, title: 'Building Genuine Attraction vs Performance', desc: 'Why "trying to impress" kills attraction — and what actually works instead.', free: false },
      { week: 3, day: 20, title: 'The Mid-Conversation Reset', desc: 'Conversation going sideways? Here\'s how to gracefully steer back without making it awkward.', free: false },
      { week: 3, day: 21, title: 'Week 3 Review + Full Scenario Challenge', desc: 'Complete all 6 scenarios in one session + get a comprehensive vibe score report.', free: false },

      // WEEK 4 — STARTER+
      { week: 4, day: 22, title: 'Long-Term Attraction — From Dating to Relationship', desc: 'How to transition naturally from casual dating to something deeper without ruining it.', free: false },
      { week: 4, day: 23, title: 'Communication Styles — Know Your Type', desc: 'Discover your communication style and how to adapt to hers for effortless connection.', free: false },
      { week: 4, day: 24, title: 'Handling the "What Are We?" Conversation', desc: 'The most feared conversation — made simple. How to handle it with confidence and clarity.', free: false },
      { week: 4, day: 25, title: 'Social Circle Dating — Meeting People IRL', desc: 'Beyond apps — how to meet and attract people through your existing social circle.', free: false },
      { week: 4, day: 26, title: 'The Vulnerability Advantage', desc: 'Why showing real emotion makes you more attractive — and how to do it without oversharing.', free: false },
      { week: 4, day: 27, title: 'Your Dating Values Audit', desc: 'Clarify what you actually want in a partner. Most people skip this — it\'s why they keep dating the wrong people.', free: false },
      { week: 4, day: 28, title: '30-Day Challenge Final Review', desc: 'Your full transformation review. Compare Day 1 vs Day 28. Celebrate how far you\'ve come! 🎉', free: false },
    ];

    const container = document.getElementById('course-list');
    if (!container) return;

    // Group by week
    const weeks = {};
    lessons.forEach(l => {
      if (!weeks[l.week]) weeks[l.week] = [];
      weeks[l.week].push(l);
    });

    const weekNames = {
      1: 'Week 1 — Foundation',
      2: 'Week 2 — First Date Mastery',
      3: 'Week 3 — Advanced Skills',
      4: 'Week 4 — Long-Term Success',
    };

    container.innerHTML = Object.entries(weeks).map(([week, weekLessons]) => {
      const weekNum = parseInt(week);
      const isWeekLocked = weekNum > allowedWeeks;
      
      return `
        <div class="week-section">
          <div class="week-header">
            <h3 class="week-title">${weekNames[weekNum] || `Week ${weekNum}`}</h3>
            ${isWeekLocked ? '<span class="week-lock-badge">🔒 Starter+</span>' : '<span class="week-free-badge">✓ Free</span>'}
          </div>
          <div class="week-lessons">
            ${weekLessons.map(lesson => {
              const isLocked = isWeekLocked;
              return `
                <div class="lesson-item ${lesson.done ? 'done' : ''} ${isLocked ? 'locked' : ''}">
                  <div class="lesson-indicator">
                    ${lesson.done ? '✓' : isLocked ? '🔒' : lesson.day}
                  </div>
                  <div class="lesson-info">
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-desc">${lesson.desc}</div>
                    <div class="lesson-meta">
                      Week ${lesson.week} · Day ${lesson.day} · ${isLocked ? '<a href="#" onclick="document.querySelector(\'[data-tab=upgrade]\').click(); return false;" style="color:#e84393">Unlock with Starter →</a>' : 'Free'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
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
    appendMessage,
    showTypingIndicator,
    clearChat,
    renderCourse,
  };
})();
