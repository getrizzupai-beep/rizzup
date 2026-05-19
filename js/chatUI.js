// js/chatUI.js — AI chat logic
// Renamed from chat.js to avoid Vercel serverless conflict with api/chat.js

const Chat = (() => {
  let _conversationHistory = [];
  let _currentScenario = null;
  let _isTyping = false;

  function startScenario(scenarioKey) {
    const scenario = CONFIG.SCENARIOS[scenarioKey];
    if (!scenario) {
      console.error('Unknown scenario:', scenarioKey);
      return null;
    }
    _currentScenario = scenario;
    _conversationHistory = [];
    _conversationHistory.push({
      role: 'assistant',
      content: scenario.greeting
    });
    return scenario;
  }

  function resetConversation() {
    _conversationHistory = [];
    _currentScenario = null;
  }

  function getCurrentScenario() {
    return _currentScenario;
  }

  async function sendMessage(userMessage) {
    if (!_currentScenario) throw new Error('No scenario selected');
    if (_isTyping) throw new Error('Already waiting for response');

    _conversationHistory.push({ role: 'user', content: userMessage });
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

      _conversationHistory.push({ role: 'assistant', content: reply });
      return reply;

    } finally {
      _isTyping = false;
    }
  }

  async function getCoachFeedback() {
    if (_conversationHistory.length < 3) {
      return 'Thoda aur practice karo pehle! Kam se kam 2-3 messages ke baad coach feedback milega. 💪';
    }

    const recentMessages = _conversationHistory.slice(-6);
    const conversationText = recentMessages
      .map(m => `${m.role === 'user' ? 'User' : _currentScenario.persona}: ${m.content}`)
      .join('\n');

    try {
      const response = await fetch(CONFIG.CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are an expert Indian dating coach. Analyze the conversation and give honest feedback.
Always respond in this format:
**Vibe Score: X/10** — [one line summary]

**What worked:** [2-3 bullet points]
**Improve karo:** [1-2 specific tips]
**Next bolna chahiye:** "[exact suggested reply]"

Be honest — don't sugar coat. Respond in Hinglish.`,
          messages: [{
            role: 'user',
            content: `Analyze this conversation and give feedback:\n\n${conversationText}`
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

  function getHistory() {
    return [..._conversationHistory];
  }

  function isTyping() {
    return _isTyping;
  }

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
