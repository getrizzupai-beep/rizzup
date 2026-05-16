// ============================================
// CHAT.JS — Gender-based Persona Selection + Language Detection
// ============================================

let currentScenario = null;
let chatHistory = [];
let isTyping = false;

// Initialize chat
function initChat() {
  renderScenarioButtons();
  
  // Check if user has tried all scenarios
  const triedScenarios = JSON.parse(localStorage.getItem('triedScenarios') || '[]');
  if (triedScenarios.length >= 6) {
    unlockBadge('social_butterfly');
  }
}

// Get scenarios based on user gender
function getScenarios() {
  const gender = getUserGender();
  return CONFIG.SCENARIOS[gender] || CONFIG.SCENARIOS.male;
}

// Render scenario buttons
function renderScenarioButtons() {
  const container = document.getElementById('scenarioButtons');
  if (!container) return;
  
  const scenarios = getScenarios();
  container.innerHTML = scenarios.map(s => `
    <button class="scenario-btn" onclick="startScenario('${s.id}')" data-scenario="${s.id}">
      <span class="scenario-emoji">${s.emoji}</span>
      <div class="scenario-info">
        <h4>${s.name}</h4>
        <p>${s.persona}, ${s.age}, ${s.city}</p>
      </div>
    </button>
  `).join('');
}

// Start a scenario
async function startScenario(scenarioId) {
  const scenarios = getScenarios();
  currentScenario = scenarios.find(s => s.id === scenarioId);
  
  if (!currentScenario) {
    console.error('Scenario not found:', scenarioId);
    return;
  }
  
  // Clear chat
  chatHistory = [];
  const chatContainer = document.getElementById('chatMessages');
  if (chatContainer) chatContainer.innerHTML = '';
  
  // Show scenario info
  showScenarioInfo();
  
  // Send initial AI message
  const initialMessage = getInitialMessage();
  await addMessage('ai', initialMessage);
  
  // Mark scenario as tried
  const triedScenarios = JSON.parse(localStorage.getItem('triedScenarios') || '[]');
  if (!triedScenarios.includes(scenarioId)) {
    triedScenarios.push(scenarioId);
    localStorage.setItem('triedScenarios', JSON.stringify(triedScenarios));
    
    if (triedScenarios.length === 1) {
      unlockBadge('first_chat');
    }
    if (triedScenarios.length >= 6) {
      unlockBadge('social_butterfly');
    }
  }
}

// Get initial message based on scenario
function getInitialMessage() {
  const s = currentScenario;
  const gender = getUserGender();
  
  if (gender === 'male') {
    // Female persona talking to male user
    switch(s.id) {
      case 'first_date':
        return `Hi! *nervous smile* I'm ${s.persona}. Thanks for meeting me. This place has great coffee, right?`;
      case 'texting':
        return `Hey! So we matched. Your profile was... interesting. What's your most controversial opinion?`;
      case 'rejection':
        return `Hey... I need to talk to you about something. Can we be honest for a minute?`;
      case 'flirting':
        return `Well well, look who it is. I was wondering if you'd actually show up. 😏`;
      case 'arranged':
        return `Namaste! I'm ${s.persona}. My parents have been talking about you non-stop. Shall we get to know each other?`;
      case 'second_date':
        return `I'm so glad we could meet again. The rooftop view here is beautiful, isn't it?`;
      default:
        return `Hi! I'm ${s.persona}. Nice to meet you!`;
    }
  } else {
    // Male persona talking to female user
    switch(s.id) {
      case 'first_date':
        return `Hey! I'm ${s.persona}. I hope you didn't have trouble finding this place. I ordered us some coffee — hope that's okay?`;
      case 'texting':
        return `Hey! Your bio made me laugh. The one about hating pineapple on pizza — controversial but I respect it.`;
      case 'rejection':
        return `Hey... I wanted to talk to you about us. I feel like we need to be honest about where this is going.`;
      case 'flirting':
        return `There she is. I was starting to think you stood me up just to make me nervous. 😄`;
      case 'arranged':
        return `Namaste! I'm ${s.persona}. My mom showed me your photo and... well, I had to meet you.`;
      case 'second_date':
        return `I'm really glad you said yes to meeting again. I've been looking forward to this all week.`;
      default:
        return `Hi! I'm ${s.persona}. Nice to meet you!`;
    }
  }
}

// Show scenario info in chat
function showScenarioInfo() {
  const infoEl = document.getElementById('scenarioInfo');
  if (!infoEl || !currentScenario) return;
  
  infoEl.innerHTML = `
    <div class="scenario-card">
      <span class="scenario-emoji-large">${currentScenario.emoji}</span>
      <div>
        <h3>${currentScenario.name}</h3>
        <p>${currentScenario.persona}, ${currentScenario.age}, ${currentScenario.city}</p>
        <small>${currentScenario.personality}</small>
      </div>
    </div>
  `;
  infoEl.style.display = 'block';
}

// Send message
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim() || isTyping) return;
  
  const message = input.value.trim();
  input.value = '';
  
  // Add user message
  await addMessage('user', message);
  
  // Show typing indicator
  showTyping();
  
  // Get AI response
  try {
    const response = await getAIResponse(message);
    hideTyping();
    await addMessage('ai', response);
  } catch (err) {
    hideTyping();
    console.error('AI error:', err);
    await addMessage('ai', 'Sorry, I got distracted. Can you say that again?');
  }
}

// Get AI response from Groq API
async function getAIResponse(userMessage) {
  if (!currentScenario) return 'Please select a scenario first!';
  
  // Build conversation history
  const messages = [
    {
      role: 'system',
      content: currentScenario.systemPrompt + '\n\nKeep responses short (2-3 sentences). Be natural and conversational. Match the user\'s language (English or Hinglish).'
    },
    ...chatHistory.map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.content
    })),
    {
      role: 'user',
      content: userMessage
    }
  ];
  
  // Call API
  const response = await fetch(CONFIG.CHAT_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  const data = await response.json();
  return data.content || data.message || 'Hmm, interesting... tell me more!';
}

// Add message to chat
async function addMessage(role, content) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  
  const avatar = role === 'user' ? '👤' : currentScenario?.emoji || '🤖';
  const name = role === 'user' ? 'You' : (currentScenario?.persona || 'AI');
  
  msgDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-name">${name}</div>
      <div class="message-text">${escapeHtml(content)}</div>
    </div>
  `;
  
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  
  // Save to history
  chatHistory.push({ role, content });
  
  // Limit history to last 20 messages
  if (chatHistory.length > 20) {
    chatHistory = chatHistory.slice(-20);
  }
}

// Show typing indicator
function showTyping() {
  isTyping = true;
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai typing-indicator';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="message-avatar">${currentScenario?.emoji || '🤖'}</div>
    <div class="message-content">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
  isTyping = false;
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handle Enter key
function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initChat,
    startScenario,
    sendChatMessage,
    handleChatKey,
    getUserGender
  };
}
