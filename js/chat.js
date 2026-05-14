// js/chat.js — Sirf AI chat logic
// Kaam: message bhejo, reply lo, coach feedback lo
// Auth ya UI ke baare mein kuch nahi jaanta yeh file

const Chat = (() => {
  let _conversationHistory = [];
  let _currentScenario = null;
  let _isTyping = false;

  // Naya scenario start karo
  function startScenario(scenarioKey) {
    const scenario = CONFIG.SCENARIOS[scenarioKey];
    if (!scenario) {
      console.error('Unknown scenario:', scenarioKey);
      return null;
    }

    _currentScenario = scenario;
    _conversationHistory = [];

    // AI ka pehla greeting message history mein add karo
    _conversationHistory.push({
      role: 'assistant',
      content: scenario.greeting
    });

    return scenario;
  }

  // Conversation reset
  function resetConversation() {
    _conversationHistory = [];
    _currentScenario = null;
  }

  // Current scenario
  function getCurrentScenario() {
    return _currentScenario;
  }

  // Message bhejo, reply lo
  async function sendMessage(userMessage) {
    if (!_currentScenario) {
      throw new Error('No scenario selected');
    }

    if (_isTyping) {
      throw new Error('Already waiting for response');
    }

    // User message history mein add karo
    _conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    _isTyping = true;

    try {
      const response = await fetch(CONFIG.CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: _currentScenario.systemPrompt,
          messages: _conversationHistory,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply;

      if (!reply) throw new Error('Empty response from server');

      // AI reply history mein add karo
      _conversationHistory.push({
        role: 'assistant',
        content: reply
      });

      return reply;

    } finally {
      _isTyping = false;
    }
  }

  // Coach feedback lo — alag API call, conversation history se analyze karo
  async function getCoachFeedback() {
    if (_conversationHistory.length < 3) {
      return 'Thoda aur practice karo pehle! Kam se kam 2-3 messages ke baad coach feedback milega. 💪';
    }

    // Last kuch messages lo
    const recentMessages = _conversationHistory.slice(-6);
    const conversationText = recentMessages
      .map(m => `${m.role === 'user' ? 'User' : _currentScenario.persona}: ${m.content}`)
      .join('\n');

    try {
      const response = await fetch(CONFIG.CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Tu ek expert Indian dating coach hai. Conversation analyze karke honest feedback do.
Hamesha is format mein respond karo:
**Vibe Score: X/10** — [ek line summary]

**Kya kaam kiya:** [2-3 bullet points]
**Improve karo:** [1-2 specific tips]  
**Next bolna chahiye:** "[exact suggested reply]"

Hinglish mein respond karo. Honest raho — sugar coat mat karo.`,
          messages: [{
            role: 'user',
            content: `Yeh conversation analyze karo aur feedback do:\n\n${conversationText}`
          }]
        }),
      });

      if (!response.ok) throw new Error('Feedback API error');

      const data = await response.json();
      return data.reply || 'Coach feedback abhi available nahi hai. Try again!';

    } catch (error) {
      console.error('Coach feedback error:', error);
      return 'Coach feedback abhi available nahi hai. Thodi der mein try karo! 🙏';
    }
  }

  // Conversation history
  function getHistory() {
    return [..._conversationHistory];
  }

  // Typing state
  function isTyping() {
    return _isTyping;
  }

  // Public API
  return {
    startScenario,
    resetConversation,
    getCurrentScenario,
    sendMessage,
    getCoachFeedback,
    getHistory,
    isTyping,
  };
})();
