// js/chat.js — AI chat logic with gender support

const Chat = (() => {
  let _conversationHistory = [];
  let _currentScenario = null;
  let _isTyping = false;
  let _currentGender = 'female';

  // Detect language of a message
  function _detectLanguage(text) {
    const hindiWords = /(ka|ke|ki|hai|hain|ho|hoon|main|mera|meri|tum|tera|teri|aap|apka|yeh|woh|kya|kyun|kaise|kahan|kab|aur|ya|lekin|par|magar|toh|bhi|bahut|thoda|acha|bura|nahi|haan|ji|na|re|yaar|bhai|dost|ladki|ladka|pyaar|mohabbat|shadi|ghar|kaam|khana|paani|chai|coffee|school|college|office|naam|din|raat|subah|shaam|aaj|kal|abhi|pehle|baad|andar|bahar|upar|niche|sath|akela|sab|kuch|koi|har|ek|do|teen|char|paanch|das|sau|hazaar)/gi;
    const hindiScript = /[ऀ-ॿ]/;

    const hindiMatches = (text.match(hindiWords) || []).length;
    const hasHindiScript = hindiScript.test(text);

    if (hasHindiScript || hindiMatches >= 2) {
      return 'hinglish';
    }
    return 'english';
  }

  // Naya scenario start karo (with gender support)
  function startScenario(scenarioKey, gender = 'female') {
    _currentGender = gender;

    // Use male or female scenarios based on gender preference
    const scenarios = gender === 'male' ? CONFIG.MALE_SCENARIOS : CONFIG.SCENARIOS;
    const scenario = scenarios[scenarioKey];

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

  // Get current gender
  function getGender() {
    return _currentGender;
  }

  // Message bhejo, reply lo
  async function sendMessage(userMessage) {
    if (!_currentScenario) {
      throw new Error('No scenario selected');
    }

    if (_isTyping) {
      throw new Error('Already waiting for response');
    }

    // Detect user's language
    const userLang = _detectLanguage(userMessage);

    // User message history mein add karo
    _conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    _isTyping = true;

    try {
      // Build enhanced system prompt with language instruction
      let enhancedSystem = _currentScenario.systemPrompt;

      // Add explicit language instruction based on detection
      if (userLang === 'english') {
        enhancedSystem += `

CRITICAL: The user just wrote in ENGLISH. You MUST reply in ENGLISH only. No Hindi words. No Hinglish.`;
      } else {
        enhancedSystem += `

CRITICAL: The user just wrote in HINGLISH/HINDI. You MUST reply in HINGLISH only. Mix Hindi and English naturally.`;
      }

      const response = await fetch(CONFIG.CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: enhancedSystem,
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

  // Coach feedback lo
  async function getCoachFeedback() {
    if (_conversationHistory.length < 3) {
      return 'Practice a bit more first! At least 2-3 messages needed for coach feedback. 💪';
    }

    // Detect dominant language in conversation
    const userMessages = _conversationHistory.filter(m => m.role === 'user');
    const englishCount = userMessages.filter(m => _detectLanguage(m.content) === 'english').length;
    const totalUserMsgs = userMessages.length;
    const dominantLang = (englishCount / totalUserMsgs) >= 0.5 ? 'english' : 'hinglish';

    // Last kuch messages lo
    const recentMessages = _conversationHistory.slice(-6);
    const conversationText = recentMessages
      .map(m => `${m.role === 'user' ? 'User' : _currentScenario.persona}: ${m.content}`)
      .join('
');

    const feedbackLang = dominantLang === 'english' ? 'English' : 'Hinglish';

    try {
      const response = await fetch(CONFIG.CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are an expert Indian dating coach. Analyze the conversation and give honest feedback.
ALWAYS respond in ${feedbackLang}.
Use this format:
**Vibe Score: X/10** — [one line summary]

**What worked:** [2-3 bullet points]
**Improve:** [1-2 specific tips]  
**Say next:** "[exact suggested reply]"

Be honest — don't sugar coat.`,
          messages: [{
            role: 'user',
            content: `Analyze this conversation and give feedback:

${conversationText}`
          }]
        }),
      });

      if (!response.ok) throw new Error('Feedback API error');

      const data = await response.json();
      return data.reply || 'Coach feedback not available right now. Try again!';

    } catch (error) {
      console.error('Coach feedback error:', error);
      return 'Coach feedback not available right now. Try again later! 🙏';
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
    getGender,
    sendMessage,
    getCoachFeedback,
    getHistory,
    isTyping,
  };
})();
