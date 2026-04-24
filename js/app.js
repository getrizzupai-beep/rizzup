/**
 * RizzUp AI - app.js
 * AI Chat + 90-Day Course + Dashboard
 */

// ===== CONFIG =====
const CONFIG = {
  ANTHROPIC_API: 'https://api.anthropic.com/v1/messages',
  MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 600,
};

// ===== STATE =====
let state = {
  user: null,
  plan: 'free',
  minsUsed: 0,
  totalMsgs: 0,
  streak: 0,
  currentScenario: 'first_date',
  history: [],
  loading: false,
  courseProgress: {}
};

// ===== SCENARIOS =====
const SCENARIOS = {
  first_date: {
    name: 'Priya', av: '👩', emoji: '☕', label: 'First Date',
    desc: 'Coffee meetup — break the ice', free: true,
    system: `You are Priya, 25, Mumbai girl on a first coffee date. Friendly but slightly guarded. Keep responses 1-3 short sentences. Use Hinglish naturally. Show interest if they say something interesting. Never break character.`,
    suggestions: ["Heyy! Tu actually apni photo jaisa hai 😄", "Okay first question — chai ya coffee?", "Honestly mujhe bhi first dates awkward lagte hain", "Sach bol — nervous hai kya tu? 😄"],
    opening: "Hiii! *nervously sips coffee* Sorry thoda late — Mumbai traffic 😅 Tum actually apni photo jaise ho! So... tell me something interesting."
  },
  texting: {
    name: 'Ananya', av: '💬', emoji: '📱', label: 'Texting Game',
    desc: 'Dating app conversation', free: true,
    system: `You are Ananya, a girl the user matched with on Hinge/Bumble. Casual 1-2 line texting style. Sometimes dry humor. Keep it very short like real texts. Hinglish.`,
    suggestions: ["heyyy finally texted 😄", "okay one question — pizza ya biryani?", "tell me something surprising about you", "coffee date ya dinner? pick one"],
    opening: "heyyy so you actually texted 👀 what made you swipe?"
  },
  rejection: {
    name: 'Simran', av: '💪', emoji: '🛡️', label: 'Handle Rejection',
    desc: 'Stay confident & graceful', free: true,
    system: `You are Simran letting someone down gently after 2 dates. React based on how gracefully they handle it. Short realistic replies. Hinglish.`,
    suggestions: ["Haha no worries, you're still cool! 😄", "Fair enough — I respect the honesty", "Can we still be friends?", "Thanks for being real about it!"],
    opening: "Hey, I wanted to be upfront... I think you're sweet but I don't see this going romantically. Hope that's okay?"
  },
  flirting: {
    name: 'Rhea', av: '😏', emoji: '🔥', label: 'Flirting',
    desc: 'Playful banter & wit', free: false,
    system: `You are Rhea, confident and playful. Make them earn your interest with wit. Clever lines get appreciation. Generic pickup lines get gentle teasing. Short, punchy. Hinglish.`,
    suggestions: ["Okay I've been trying to think of a good line 😅", "You have a very distracting smile", "Who's funnier — you or me?"],
    opening: "Oh so you said hi 😏 Bold move. Prove karo ki it was worth my time."
  },
  arranged: {
    name: 'Pooja', av: '🌸', emoji: '💐', label: 'Arranged Meet',
    desc: 'Family introduction setup', free: false,
    system: `You are Pooja at a first arranged meeting. Polite, well-mannered, quietly assessing compatibility. Use realistic Indian arranged-marriage context. Short replies. Hinglish.`,
    suggestions: ["Yeh situation thoda awkward hai na? 😅", "Honestly what are you looking for?", "Tumne kya socha tha mere baare mein?"],
    opening: "Hii! *awkward laugh* Yeh situation thoda weird hai for both of us? Haha. So... basically kya karte ho?"
  },
  second_date: {
    name: 'Megha', av: '🌙', emoji: '🌟', label: 'Second Date',
    desc: 'Deepen the connection', free: false,
    system: `You are Megha on a second date. First date went okay but you want depth and real personality. Push back gently on boring topics. Reward vulnerability and humor. Hinglish.`,
    suggestions: ["Tell me something you didn't last time", "What's your most random skill?", "Okay honest question — nervous nahi tu?"],
    opening: "Hey! Glad you came 😄 Last time was nice but I feel like I don't actually know you. Tell me something real."
  }
};

// ===== 90-DAY COURSE =====
const COURSE_DAYS = [
  // WEEK 1-4: FREE
  { day: 1, week: 1, title: "Why You're Getting Ignored", subtitle: "#1 mistake guys make", free: true },
  { day: 2, week: 1, title: "The Confidence Framework", subtitle: "Real inner confidence", free: true },
  { day: 3, week: 1, title: "First Message Formula", subtitle: "Openers that actually work", free: true },
  { day: 4, week: 1, title: "Profile Optimization", subtitle: "Bio + photos that attract", free: true },
  { day: 5, week: 1, title: "The Curiosity Loop", subtitle: "Make them want more", free: true },
  { day: 6, week: 1, title: "Texting Cadence", subtitle: "When to text, when to wait", free: true },
  { day: 7, week: 1, title: "Week 1 AI Practice", subtitle: "Full simulation", free: true },
  { day: 8, week: 2, title: "Conversation Depth", subtitle: "Beyond haha and lol", free: true },
  { day: 9, week: 2, title: "Humor Timing", subtitle: "When jokes actually land", free: true },
  { day: 10, week: 2, title: "The Push-Pull", subtitle: "Create real tension", free: true },
  { day: 11, week: 2, title: "Handling Silence", subtitle: "Comfortable pauses", free: true },
  { day: 12, week: 2, title: "The Date Ask", subtitle: "Without sounding desperate", free: true },
  { day: 13, week: 2, title: "Pre-Date Prep", subtitle: "Mindset & logistics", free: true },
  { day: 14, week: 2, title: "Week 2 Review", subtitle: "Consolidate learning", free: true },
  { day: 15, week: 3, title: "First Date Script", subtitle: "What to actually say", free: true },
  { day: 16, week: 3, title: "Reading Signals", subtitle: "Is she interested?", free: true },
  { day: 17, week: 3, title: "Storytelling", subtitle: "Be memorable", free: true },
  { day: 18, week: 3, title: "Emotional Connection", subtitle: "Go beyond surface", free: true },
  { day: 19, week: 3, title: "Physical Escalation", subtitle: "Respectful & confident", free: true },
  { day: 20, week: 3, title: "The Goodbye", subtitle: "End on a high note", free: true },
  { day: 21, week: 3, title: "Week 3 Review", subtitle: "You're leveling up!", free: true },
  { day: 22, week: 4, title: "Post-Date Texting", subtitle: "Follow-up strategy", free: true },
  { day: 23, week: 4, title: "Second Date Plan", subtitle: "Build momentum", free: true },
  { day: 24, week: 4, title: "Exclusivity Talk", subtitle: "When & how", free: true },
  { day: 25, week: 4, title: "Handling Uncertainty", subtitle: "Stay grounded", free: true },
  { day: 26, week: 4, title: "Red Flags", subtitle: "Know when to walk", free: true },
  { day: 27, week: 4, title: "Green Flags", subtitle: "Recognize good ones", free: true },
  { day: 28, week: 4, title: "Week 4 Graduation", subtitle: "Foundation complete! 🎉", free: true },
  // WEEK 5-8: STARTER+
  { day: 29, week: 5, title: "Advanced Flirting", subtitle: "Next level charm", free: false },
  { day: 30, week: 5, title: "Voice & Tone", subtitle: "Sound confident", free: false },
  { day: 31, week: 5, title: "Body Language", subtitle: "Non-verbal mastery", free: false },
  { day: 32, week: 5, title: "Handling Tests", subtitle: "She's testing you", free: false },
  { day: 33, week: 5, title: "Frame Control", subtitle: "Lead the interaction", free: false },
  { day: 34, week: 5, title: "Qualifying Her", subtitle: "Make her earn you", free: false },
  { day: 35, week: 5, title: "Week 5 Review", subtitle: "Intermediate begins", free: false },
  { day: 36, week: 6, title: "Multiple Dating", subtitle: "Ethical non-monogamy", free: false },
  { day: 37, week: 6, title: "Jealousy Management", subtitle: "Yours and hers", free: false },
  { day: 38, week: 6, title: "Long-Distance", subtitle: "Make it work", free: false },
  { day: 39, week: 6, title: "Digital Dating", subtitle: "Apps strategy", free: false },
  { day: 40, week: 6, title: "Instagram Game", subtitle: "DM to date", free: false },
  { day: 41, week: 6, title: "Phone Calls", subtitle: "Old school works", free: false },
  { day: 42, week: 6, title: "Week 6 Review", subtitle: "Keep going!", free: false },
  { day: 43, week: 7, title: "Meeting Friends", subtitle: "Social proof", free: false },
  { day: 44, week: 7, title: "Meeting Family", subtitle: "Indian context", free: false },
  { day: 45, week: 7, title: "Gift Giving", subtitle: "Thoughtful not expensive", free: false },
  { day: 46, week: 7, title: "Planning Dates", subtitle: "Creative ideas", free: false },
  { day: 47, week: 7, title: "Handling Conflict", subtitle: "Fight fair", free: false },
  { day: 48, week: 7, title: "Apology Art", subtitle: "Meaningful sorry", free: false },
  { day: 49, week: 7, title: "Week 7 Review", subtitle: "Almost there!", free: false },
  { day: 50, week: 8, title: "Intimacy Talk", subtitle: "Communication is key", free: false },
  { day: 51, week: 8, title: "Boundaries", subtitle: "Healthy limits", free: false },
  { day: 52, week: 8, title: "Expectations", subtitle: "Align them early", free: false },
  { day: 53, week: 8, title: "Future Planning", subtitle: "Are you compatible?", free: false },
  { day: 54, week: 8, title: "Commitment Talk", subtitle: "When to have it", free: false },
  { day: 55, week: 8, title: "Week 8 Review", subtitle: "Intermediate done!", free: false },
  // WEEK 9-12: PRO
  { day: 56, week: 9, title: "Relationship Phases", subtitle: "Know the stages", free: false },
  { day: 57, week: 9, title: "Love Languages", subtitle: "Speak her language", free: false },
  { day: 58, week: 9, title: "Attachment Styles", subtitle: "Understand yourself", free: false },
  { day: 59, week: 9, title: "Emotional Availability", subtitle: "Are you ready?", free: false },
  { day: 60, week: 9, title: "Vulnerability", subtitle: "Strength not weakness", free: false },
  { day: 61, week: 9, title: "Trust Building", subtitle: "Foundation of love", free: false },
  { day: 62, week: 9, title: "Week 9 Review", subtitle: "Advanced begins!", free: false },
  { day: 63, week: 10, title: "Keeping Spark Alive", subtitle: "Long-term attraction", free: false },
  { day: 64, week: 10, title: "Surprise & Romance", subtitle: "Keep it fresh", free: false },
  { day: 65, week: 10, title: "Sexual Communication", subtitle: "Talk about it", free: false },
  { day: 66, week: 10, title: "Handling Insecurity", subtitle: "Yours and hers", free: false },
  { day: 67, week: 10, title: "Supporting Her Goals", subtitle: "Be her biggest fan", free: false },
  { day: 68, week: 10, title: "Work-Life Balance", subtitle: "Relationship priority", free: false },
  { day: 69, week: 10, title: "Week 10 Review", subtitle: "You're a pro!", free: false },
  { day: 70, week: 11, title: "Moving In Together", subtitle: "Big step guide", free: false },
  { day: 71, week: 11, title: "Financial Talk", subtitle: "Money & relationships", free: false },
  { day: 72, week: 11, title: "Meeting Parents", subtitle: "Indian family dynamics", free: false },
  { day: 73, week: 11, title: "Marriage Conversation", subtitle: "When & how", free: false },
  { day: 74, week: 11, title: "Handling Pressure", subtitle: "Family & society", free: false },
  { day: 75, week: 11, title: "Pre-Engagement", subtitle: "Are you ready?", free: false },
  { day: 76, week: 11, title: "Week 11 Review", subtitle: "Final stretch!", free: false },
  { day: 77, week: 12, title: "Proposal Planning", subtitle: "Make it memorable", free: false },
  { day: 78, week: 12, title: "Wedding Prep", subtitle: "Survive the chaos", free: false },
  { day: 79, week: 12, title: "In-Law Relations", subtitle: "Navigate carefully", free: false },
  { day: 80, week: 12, title: "Newlywed Phase", subtitle: "First year tips", free: false },
  { day: 81, week: 12, title: "Long-Term Vision", subtitle: "Build together", free: false },
  { day: 82, week: 12, title: "Continuous Growth", subtitle: "Never stop learning", free: false },
  { day: 83, week: 12, title: "Giving Back", subtitle: "Help others", free: false },
  { day: 84, week: 12, title: "GRADUATION DAY", subtitle: "You did it! 🎓🎉", free: false }
];

// ===== UTILS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatText(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

// ===== AUTH INIT =====
function initUserFromAuth(name, email, userId) {
  state.user = { id: userId, name, email };
  
  // Load from localStorage
  const saved = localStorage.getItem(`rizzup_user_${userId}`);
  if (saved) {
    const data = JSON.parse(saved);
    state.plan = data.plan || 'free';
    state.minsUsed = data.minsUsed || 0;
    state.totalMsgs = data.totalMsgs || 0;
    state.streak = data.streak || 0;
    state.courseProgress = data.courseProgress || {};
  }
  
  // Check streak
  const lastDate = localStorage.getItem(`rizzup_lastdate_${userId}`);
  const today = new Date().toDateString();
  if (lastDate !== today) {
    if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        state.streak++;
      } else {
        state.streak = 1;
      }
    } else {
      state.streak = 1;
    }
    localStorage.setItem(`rizzup_lastdate_${userId}`, today);
  }
  
  // Show app
  $('#landingView').style.display = 'none';
  $('#appView').style.display = 'block';
  
  // Update UI
  $('#appUserName').textContent = name;
  $('#dashGreet').textContent = `Hey ${name.split(' ')[0]}! 👋`;
  $('#appPlanBadge').textContent = state.plan === 'free' ? 'Free Plan' : state.plan === 'starter' ? 'Starter Plan' : 'Pro Plan';
  
  buildApp();
  showToast(`Welcome back, ${name.split(' ')[0]}! 🔥`, 'success');
}

// ===== BUILD APP =====
function buildApp() {
  buildDashboardScenarios();
  buildChatSidebar();
  buildCourse();
  buildAppPlans();
  updateDashboard();
  resetChat();
  initChat();
}

function switchPanel(btn, panelId) {
  $$('.app-nav-btn').forEach(b => b.classList.remove('active'));
  $$('.app-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  $(`#panel-${panelId}`)?.classList.add('active');
}

function updateDashboard() {
  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  $('#dashMins').textContent = Math.floor(state.minsUsed);
  $('#dashMsgs').textContent = state.totalMsgs;
  $('#dashStreak').textContent = state.streak;
  $('#dashUsageText').textContent = state.plan === 'pro' ? 'Unlimited 🚀' : `${Math.floor(state.minsUsed)}/${max} min`;
  
  const notice = $('#limitNotice');
  if (state.minsUsed >= max && state.plan === 'free') {
    notice.classList.add('show');
  } else {
    notice.classList.remove('show');
  }
}

// ===== SCENARIOS =====
function buildDashboardScenarios() {
  const c = $('#dashScens');
  if (!c) return;
  c.innerHTML = '';
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `app-scen-card ${locked ? 'locked' : ''}`;
    el.onclick = locked ? () => { showToast('Upgrade to unlock this scenario! 🚀', 'default'); switchPanel($$('.app-nav-btn')[3], 'pricing'); } : () => startScenario(key);
    el.innerHTML = `
      <div class="scen-emoji">${sc.emoji}</div>
      <div class="scen-name">${sc.label}</div>
      <div class="scen-desc">${sc.desc}</div>
      <span class="scen-tag">${sc.free ? 'Free' : '🔒 ' + (state.plan === 'free' ? 'Starter+' : 'Unlocked')}</span>
    `;
    c.appendChild(el);
  });
}

function buildChatSidebar() {
  const c = $('#chatSidebar');
  if (!c) return;
  c.innerHTML = '<div class="cs-title">Scenarios</div>';
  Object.entries(SCENARIOS).forEach(([key, sc]) => {
    const locked = !sc.free && state.plan === 'free';
    const el = document.createElement('div');
    el.className = `cs-scen ${key === state.currentScenario ? 'active' : ''} ${locked ? 'locked-s' : ''}`;
    el.onclick = locked ? () => { showToast('Upgrade to unlock! 🚀', 'default'); } : () => switchScenario(key);
    el.textContent = `${sc.emoji} ${sc.label}`;
    c.appendChild(el);
  });
}

function startScenario(key) {
  state.currentScenario = key;
  switchPanel($$('.app-nav-btn')[1], 'practice');
  buildChatSidebar();
  resetChat();
  initChat();
}

function switchScenario(key) {
  state.currentScenario = key;
  buildChatSidebar();
  resetChat();
  initChat();
}

// ===== CHAT =====
function initChat() {
  updateChatHeader();
  const sc = SCENARIOS[state.currentScenario];
  state.history = [{ role: 'assistant', content: sc.opening }];
  addBubble('ai', sc.opening);
  buildSuggestions();
}

function resetChat() {
  state.history = [];
  const area = $('#msgsArea');
  if (area) area.innerHTML = '';
}

function updateChatHeader() {
  const sc = SCENARIOS[state.currentScenario];
  $('#cpAv').textContent = sc.av;
  $('#cpName').textContent = sc.name;
}

function buildSuggestions() {
  const sc = SCENARIOS[state.currentScenario];
  const strip = $('#sugStrip');
  if (!strip) return;
  strip.innerHTML = (sc.suggestions || []).map(s => `<span class="sug-chip" onclick="useSuggestion(this)">${s}</span>`).join('');
}

function addBubble(type, text) {
  const area = $('#msgsArea');
  if (!area) return;
  const row = document.createElement('div');
  row.className = `msg-row ${type === 'user' ? 'user' : ''}`;
  row.innerHTML = `<div class="msg-bubble">${formatText(text)}</div>`;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function addCoachCard(html) {
  const area = $('#msgsArea');
  if (!area) return;
  const card = document.createElement('div');
  card.className = 'coach-card';
  card.innerHTML = `🎯 <strong>Dating Coach:</strong> ${formatText(html)}`;
  area.appendChild(card);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = $('#msgsArea');
  if (!area) return;
  const row = document.createElement('div');
  row.className = 'msg-row';
  row.id = 'typingRow';
  row.innerHTML = `<div class="msg-bubble" style="color:#888;">Typing...</div>`;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function hideTyping() {
  const r = $('#typingRow');
  if (r) r.remove();
}

// ===== CLAUDE API =====
async function callClaude(messages, systemPrompt) {
  // NOTE: In production, use a backend proxy for API key
  const ANTHROPIC_KEY = 'YOUR_ANTHROPIC_API_KEY'; // ⚠️ Add your key here or use backend
  
  const response = await fetch(CONFIG.ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system: systemPrompt,
      messages: messages
    })
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }
  
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function sendMessage() {
  const input = $('#chatInput');
  const sendBtn = $('#sendBtn');
  if (!input || state.loading) return;
  
  const raw = input.value.trim();
  if (!raw) return;
  
  const max = state.plan === 'free' ? 20 : state.plan === 'starter' ? 60 : 9999;
  if (state.minsUsed >= max && state.plan === 'free') {
    switchPanel($$('.app-nav-btn')[3], 'pricing');
    showToast('Daily limit reached! Upgrade for more 🚀', 'error');
    return;
  }
  
  const text = raw.slice(0, 500);
  input.value = '';
  input.style.height = 'auto';
  state.loading = true;
  if (sendBtn) sendBtn.disabled = true;
  
  addBubble('user', text);
  state.history.push({ role: 'user', content: text });
  state.minsUsed += 0.5;
  state.totalMsgs++;
  saveState();
  updateDashboard();
  showTyping();
  
  try {
    const sc = SCENARIOS[state.currentScenario];
    const reply = await callClaude(state.history, sc.system);
    hideTyping();
    state.history.push({ role: 'assistant', content: reply });
    addBubble('ai', reply);
  } catch (e) {
    hideTyping();
    const msg = e.message.includes('429') ? 'Thoda ruko, bahut fast! ⏳' : 'Connection issue. Try again! 🔄';
    addBubble('ai', msg);
  }
  
  state.loading = false;
  if (sendBtn) sendBtn.disabled = false;
  input.focus();
}

async function getCoach() {
  if (state.loading) return;
  if (state.history.length < 3) {
    addCoachCard('Thoda aur chat karo pehle — phir feedback dunga! 😄');
    return;
  }
  
  state.loading = true;
  showTyping();
  
  const sc = SCENARIOS[state.currentScenario];
  const convo = state.history.map(m => `${m.role === 'user' ? 'You' : sc.name}: ${m.content}`).join('\n');
  const coachPrompt = `You are an expert Indian dating coach. Analyze this ${sc.label} conversation and give sharp, warm Hinglish feedback.

Conversation:
${convo}

Reply EXACTLY in this format (max 90 words):
**Vibe Score:** X/10 — [one punchy line]
**Kya kaam kiya:** [what worked — 1 line]
**Improve karo:** [1-2 specific actionable tips]
**Next bolna chahiye:** "[exact Hinglish line]"

Be direct, fun, warm. Hinglish only.`;
  
  try {
    const reply = await callClaude([{ role: 'user', content: coachPrompt }], 'You are a sharp, warm Indian dating coach. Give advice in Hinglish.');
    hideTyping();
    addCoachCard(reply);
  } catch (e) {
    hideTyping();
    addCoachCard('Coach unavailable. Try again! 🔄');
  }
  
  state.loading = false;
}

async function getWingmanReplies() {
  const input = $('#wingmanInput');
  const results = $('#wingmanResults');
  if (!input || !input.value.trim()) {
    showToast('Paste a conversation first!', 'error');
    return;
  }
  
  results.innerHTML = '<p style="text-align:center;color:#888;">Analyzing... 🤔</p>';
  
  const prompt = `You are an expert dating wingman. Based on this conversation, give 3 reply options ranked by success probability.

Conversation:
${input.value}

Reply EXACTLY in this format:
**Option 1 (🔥 Best):** [reply]
Why: [1 line]

**Option 2 (😊 Safe):** [reply]
Why: [1 line]

**Option 3 (😏 Bold):** [reply]
Why: [1 line]

Keep replies short, natural, Hinglish.`;
  
  try {
    const reply = await callClaude([{ role: 'user', content: prompt }], 'You are a dating wingman. Give 3 reply options in Hinglish.');
    results.innerHTML = `<div class="wingman-reply">${formatText(reply)}</div>`;
  } catch (e) {
    results.innerHTML = '<p style="color:var(--error);">Error. Try again!</p>';
  }
}

function useSuggestion(chip) {
  const input = $('#chatInput');
  if (input) {
    input.value = chip.textContent;
    sendMessage();
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ===== COURSE =====
function buildCourse() {
  const c = $('#courseList');
  if (!c) return;
  c.innerHTML = '';
  
  COURSE_DAYS.forEach(day => {
    const locked = !day.free && state.plan === 'free';
    const done = state.courseProgress[day.day];
    const cls = done ? 'done' : locked ? 'locked' : '';
    
    const el = document.createElement('div');
    el.className = `course-day ${cls}`;
    el.onclick = locked ? () => { showToast('Upgrade to unlock this lesson! 🚀', 'default'); switchPanel($$('.app-nav-btn')[3], 'pricing'); } : () => openLesson(day);
    el.innerHTML = `
      <div class="day-num ${done ? 'done' : day.free ? 'free' : 'paid'}">${done ? '✓' : day.day}</div>
      <div class="day-info">
        <div class="day-title">Day ${day.day}: ${day.title}</div>
        <div class="day-subtitle">${day.subtitle}</div>
      </div>
      <span class="day-tag ${day.free ? 'free' : 'locked'}">${day.free ? 'Free' : locked ? '🔒 Starter+' : 'Unlocked'}</span>
    `;
    c.appendChild(el);
  });
}

function openLesson(day) {
  // In production, show lesson content in a modal
  showToast(`Day ${day.day}: ${day.title} — Lesson content coming soon! 📚`, 'success');
  state.courseProgress[day.day] = true;
  saveState();
  buildCourse();
}

// ===== PRICING =====
function buildAppPlans() {
  const c = $('#appPlans');
  if (!c) return;
  c.innerHTML = `
    <div class="pricing-grid">
      <div class="pricing-card">
        <div class="plan-name">Starter</div>
        <div class="plan-price">₹199<span>/month</span></div>
        <ul class="plan-features">
          <li>✓ 60 min AI chat/day</li>
          <li>✓ All 6+ scenarios</li>
          <li>✓ Full 90-day course</li>
          <li>✓ Wingman Mode (10/mo)</li>
        </ul>
        <button class="plan-btn btn-pink" onclick="unlockDemo('starter')">Get Starter ⚡</button>
      </div>
      <div class="pricing-card">
        <div class="plan-name">Pro</div>
        <div class="plan-price">₹499<span>/month</span></div>
        <ul class="plan-features">
          <li>✓ Unlimited everything</li>
          <li>✓ Human coach Q&A</li>
          <li>✓ Profile review</li>
          <li>✓ Priority support</li>
        </ul>
        <button class="plan-btn" onclick="unlockDemo('pro')">Get Pro 👑</button>
      </div>
    </div>
  `;
}

function unlockDemo(plan) {
  state.plan = plan;
  saveState();
  buildApp();
  showToast(`🎉 ${plan === 'pro' ? 'Pro' : 'Starter'} unlocked! Demo mode.`, 'success');
  switchPanel($$('.app-nav-btn')[0], 'dashboard');
}

// ===== SAVE STATE =====
function saveState() {
  if (!state.user) return;
  localStorage.setItem(`rizzup_user_${state.user.id}`, JSON.stringify({
    plan: state.plan,
    minsUsed: state.minsUsed,
    totalMsgs: state.totalMsgs,
    streak: state.streak,
    courseProgress: state.courseProgress
  }));
}

// Auto-save every 30 seconds
setInterval(saveState, 30000);

// ===== INIT =====
console.log('🔥 RizzUp AI Loaded!');
