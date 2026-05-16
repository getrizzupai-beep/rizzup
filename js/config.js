// ============================================
// CONFIG.JS — Gender Scenarios + 30-Day Course + Badges/Levels
// ============================================

const CONFIG = {
  // Supabase Config (Already setup — mat chhedna)
  SUPABASE_URL: 'https://xzdjxvitqktsfeuzshik.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_zCeAZp1ZBclQ_tsgDbBVyQ_jHyTCIoW',
  
  // API Endpoints
  CHAT_API_ENDPOINT: '/api/chat',
  
  // App Settings
  APP_NAME: 'Dating Mastery',
  FREE_DAYS: 7,
  TOTAL_DAYS: 30,
  XP_PER_LESSON: 50,
  XP_PER_QUIZ: 25,
  XP_PER_PRACTICE: 30,
  
  // Levels
  LEVELS: [
    { level: 1, name: 'Rookie', xpNeeded: 0, color: '#6B7280' },
    { level: 2, name: 'Flirt', xpNeeded: 200, color: '#10B981' },
    { level: 3, name: 'Charmer', xpNeeded: 500, color: '#3B82F6' },
    { level: 4, name: 'Casanova', xpNeeded: 1000, color: '#8B5CF6' },
    { level: 5, name: 'Heartbreaker', xpNeeded: 1800, color: '#F59E0B' },
    { level: 6, name: 'Love Guru', xpNeeded: 3000, color: '#EF4444' },
    { level: 7, name: 'Legend', xpNeeded: 5000, color: '#EC4899' }
  ],
  
  // Badges
  BADGES: [
    { id: 'first_chat', name: 'First Move', icon: '💬', desc: 'Complete your first chat scenario' },
    { id: 'week1_complete', name: 'Week 1 Warrior', icon: '🏆', desc: 'Complete all 7 free days' },
    { id: 'streak_7', name: 'On Fire', icon: '🔥', desc: '7-day streak maintained' },
    { id: 'streak_30', name: 'Unstoppable', icon: '⚡', desc: '30-day streak maintained' },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🧠', desc: 'Score 100% on 5 quizzes' },
    { id: 'early_bird', name: 'Early Bird', icon: '🌅', desc: 'Complete lesson before 8 AM' },
    { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Complete lesson after 10 PM' },
    { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', desc: 'Try all 6 scenarios' },
    { id: 'course_complete', name: 'Graduate', icon: '🎓', desc: 'Complete all 30 days' },
    { id: 'xp_1000', name: 'XP Hunter', icon: '💎', desc: 'Earn 1000 XP' }
  ],
  
  // Gender-Based Scenarios
  SCENARIOS: {
    male: [
      {
        id: 'first_date',
        name: 'First Date',
        persona: 'Priya',
        age: 24,
        city: 'Mumbai',
        emoji: '☕',
        personality: 'Warm, slightly nervous but excited, loves coffee and deep conversations',
        systemPrompt: 'You are Priya, a 24-year-old woman from Mumbai. You are on a first coffee date. You are warm, slightly nervous but excited, and love deep conversations. Respond naturally in English or Hinglish. Keep responses 2-3 sentences. Ask questions back.'
      },
      {
        id: 'texting',
        name: 'Texting Game',
        persona: 'Ananya',
        age: 23,
        city: 'Delhi',
        emoji: '📱',
        personality: 'Witty, dry humor, quick replies, loves memes',
        systemPrompt: 'You are Ananya, a 23-year-old woman from Delhi. You matched on a dating app and are texting. You have dry humor, love memes, and give quick replies. Respond naturally in English or Hinglish. Keep it playful and short.'
      },
      {
        id: 'rejection',
        name: 'Handling Rejection',
        persona: 'Simran',
        age: 25,
        city: 'Pune',
        emoji: '💔',
        personality: 'Kind but firm, empathetic, values honesty',
        systemPrompt: 'You are Simran, a 25-year-old woman from Pune. You are gently rejecting someone but want to be kind and firm. You value honesty. Respond empathetically in English or Hinglish. Be clear but not harsh.'
      },
      {
        id: 'flirting',
        name: 'Flirting',
        persona: 'Rhea',
        age: 24,
        city: 'Bangalore',
        emoji: '🔥',
        personality: 'Playful, witty banter, confident but not arrogant',
        systemPrompt: 'You are Rhea, a 24-year-old woman from Bangalore. You are flirting playfully with witty banter. You are confident but not arrogant. Respond with teasing energy in English or Hinglish. Keep it fun and light.'
      },
      {
        id: 'arranged',
        name: 'Arranged Meet',
        persona: 'Pooja',
        age: 26,
        city: 'Jaipur',
        emoji: '👨‍👩‍👧',
        personality: 'Modern + traditional mix, family-oriented, career-focused',
        systemPrompt: 'You are Pooja, a 26-year-old woman from Jaipur. This is a family-arranged meeting. You are modern but respect traditions, family-oriented, and career-focused. Respond in English or Hinglish. Balance modern and traditional values.'
      },
      {
        id: 'second_date',
        name: 'Second Date',
        persona: 'Megha',
        age: 25,
        city: 'Kolkata',
        emoji: '🌙',
        personality: 'Deep thinker, emotional, values connection over looks',
        systemPrompt: 'You are Megha, a 25-year-old woman from Kolkata. This is a second date at a rooftop cafe. You are a deep thinker, emotional, and value real connection. Respond thoughtfully in English or Hinglish. Go deeper than surface level.'
      }
    ],
    female: [
      {
        id: 'first_date',
        name: 'First Date',
        persona: 'Rohan',
        age: 26,
        city: 'Mumbai',
        emoji: '☕',
        personality: 'Charming, asks good questions, genuinely interested',
        systemPrompt: 'You are Rohan, a 26-year-old man from Mumbai. You are on a first coffee date. You are charming, ask good questions, and are genuinely interested. Respond naturally in English or Hinglish. Keep responses 2-3 sentences. Be attentive.'
      },
      {
        id: 'texting',
        name: 'Texting Game',
        persona: 'Kabir',
        age: 25,
        city: 'Delhi',
        emoji: '📱',
        personality: 'Funny bios, quick replies, slightly sarcastic',
        systemPrompt: 'You are Kabir, a 25-year-old man from Delhi. You matched on a dating app and are texting. You have funny bios, quick replies, and are slightly sarcastic. Respond naturally in English or Hinglish. Keep it funny and engaging.'
      },
      {
        id: 'rejection',
        name: 'Handling Rejection',
        persona: 'Arjun',
        age: 27,
        city: 'Bangalore',
        emoji: '💔',
        personality: 'Graceful, respectful, handles it like a gentleman',
        systemPrompt: 'You are Arjun, a 27-year-old man from Bangalore. You are being rejected but handling it gracefully and respectfully. Respond like a gentleman in English or Hinglish. Show maturity and respect her decision.'
      },
      {
        id: 'flirting',
        name: 'Flirting',
        persona: 'Vihaan',
        age: 24,
        city: 'Pune',
        emoji: '🔥',
        personality: 'Playful, confident but not creepy, respects boundaries',
        systemPrompt: 'You are Vihaan, a 24-year-old man from Pune. You are flirting playfully. You are confident but not creepy and always respect boundaries. Respond with charm in English or Hinglish. Read her signals and adjust.'
      },
      {
        id: 'arranged',
        name: 'Arranged Meet',
        persona: 'Aryan',
        age: 28,
        city: 'Delhi',
        emoji: '👨‍👩‍👧',
        personality: 'Respectful, career-focused, family values',
        systemPrompt: 'You are Aryan, a 28-year-old man from Delhi. This is a family-arranged meeting. You are respectful, career-focused, and value family. Respond in English or Hinglish. Show ambition but also emotional maturity.'
      },
      {
        id: 'second_date',
        name: 'Second Date',
        persona: 'Ishaan',
        age: 25,
        city: 'Hyderabad',
        emoji: '🌙',
        personality: 'Deep talk, emotionally available, good listener',
        systemPrompt: 'You are Ishaan, a 25-year-old man from Hyderabad. This is a second date. You are emotionally available, a good listener, and love deep talks. Respond thoughtfully in English or Hinglish. Show vulnerability and depth.'
      }
    ]
  },
  
  // 30-Day Course Content
  COURSE: [
    // PHASE 1: Foundation (Days 1-7) — FREE
    {
      day: 1,
      phase: 1,
      title: 'Why You\'re Getting Ignored',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '8 min',
      content: `
        <h3>🎯 The Silent Killers</h3>
        <p>Every day, thousands of messages go unanswered. Not because you're ugly, boring, or unworthy — but because you're making invisible mistakes that scream "ignore me" before you even type a word.</p>
        
        <h4>1. The Generic Opener</h4>
        <p>"Hey," "Hi," "How are you?" — these are death sentences. They put the burden of conversation on the other person. You're essentially saying: "I have nothing interesting to say, entertain me."</p>
        
        <h4>2. The Interview Mode</h4>
        <p>Question after question without sharing anything about yourself. It feels like a job interview, not a date. "Where are you from? What do you do? What's your hobby?" — exhausting.</p>
        
        <h4>3. The Over-Complimenter</h4>
        <p>"You're so beautiful" in the first message. It reeks of desperation. Compliments are earned, not given for free. She hears this 50 times a day.</p>
        
        <h4>4. The Novel Writer</h4>
        <p>Paragraphs before she even replies. You're investing way more than she is. Keep it light, keep it fun, keep it short.</p>
        
        <h4>5. The Instant Replier</h4>
        <p>Replying in 2 seconds every time signals you have no life. Create some mystery. Delayed gratification works.</p>
        
        <h3>🔍 Self-Audit Quiz</h3>
        <p>Be honest with yourself. How many of these are you guilty of? Write them down. Awareness is the first step to change.</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Your opener should be specific to her profile</li>
          <li>Share something about yourself for every question you ask</li>
          <li>Save compliments for when you've earned rapport</li>
          <li>Match her energy and text length</li>
          <li>Have a life outside your phone</li>
        </ul>
        
        <h3>❌ Common Mistakes</h3>
        <p><strong>Bad:</strong> "Hey beautiful, how are you?"<br>
        <strong>Good:</strong> "Your travel photo in Ladakh — did you actually do the Chadar trek or just pose at the sign?"</p>
        
        <h3>📝 Practice Task</h3>
        <p>Find 3 dating profiles. Write 3 specific openers for each. No generic "hey" allowed.</p>
      `,
      quiz: [
        { q: 'What\'s the biggest mistake in first messages?', options: ['Being too short', 'Being too generic', 'Using emojis', 'Asking questions'], correct: 1 },
        { q: 'When should you give compliments?', options: ['First message', 'After earning rapport', 'Never', 'Only on photos'], correct: 1 },
        { q: 'What does instant replying signal?', options: ['You\'re attentive', 'You have no life', 'You\'re interested', 'You\'re efficient'], correct: 1 }
      ],
      coachTip: 'The person who cares less has the power. Not because they\'re cold, but because they\'re secure. Work on your self-worth first.'
    },
    {
      day: 2,
      phase: 1,
      title: 'Confidence DNA',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>🧬 Inner vs Outer Game</h3>
        <p>Confidence isn't about being the loudest in the room. It's about being comfortable with who you are — flaws and all. There are two types of confidence:</p>
        
        <h4>Outer Game (20%)</h4>
        <p>Body language, voice tone, eye contact, dressing well. These are important but they're just the wrapper. Without inner game, it's fake and people smell it.</p>
        
        <h4>Inner Game (80%)</h4>
        <p>Self-worth, self-acceptance, not needing validation. This is the real foundation. When you truly believe you're enough, everything else follows.</p>
        
        <h3>🪞 The Mirror Exercise</h3>
        <p>Every morning, stand in front of a mirror. Look yourself in the eyes and say: "I am enough. I am worthy of love. I bring value to every interaction." Do this for 30 days. It feels weird at first. That's the point — you're rewiring decades of negative self-talk.</p>
        
        <h3>⚡ Quick Confidence Hacks</h3>
        <ul>
          <li><strong>Power Pose:</strong> Stand like Superman for 2 minutes before a date</li>
          <li><strong>Deep Breathing:</strong> 4-7-8 technique calms nerves instantly</li>
          <li><strong>Preparation:</strong> Know 3 interesting stories about yourself</li>
          <li><strong>Reframe:</strong> "I'm nervous" → "I'm excited"</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Inner game is 80% of confidence</li>
          <li>Self-acceptance beats self-improvement</li>
          <li>Confidence is a muscle — train it daily</li>
          <li>Nervousness and excitement feel the same — reframe it</li>
        </ul>
        
        <h3>📝 Practice Task</h3>
        <p>Do the mirror exercise for 7 days. Note how your self-talk changes.</p>
      `,
      quiz: [
        { q: 'What percentage of confidence is inner game?', options: ['20%', '50%', '80%', '100%'], correct: 2 },
        { q: 'What does the mirror exercise do?', options: ['Makes you vain', 'Rewires self-talk', 'Improves looks', 'Builds muscle'], correct: 1 },
        { q: 'How should you reframe nervousness?', options: ['Ignore it', 'Call it excitement', 'Avoid the situation', 'Take medicine'], correct: 1 }
      ],
      coachTip: 'The most attractive quality is being comfortable in your own skin. Not perfect — comfortable. People are drawn to authenticity, not perfection.'
    },
    {
      day: 3,
      phase: 1,
      title: 'First Message Formula',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '12 min',
      content: `
        <h3>📨 The 3 Templates That Actually Work</h3>
        <p>After analyzing 10,000+ successful conversations, we've identified 3 opener formulas that get replies 3x more than generic messages.</p>
        
        <h4>Template 1: The Specific Observation</h4>
        <p><strong>Formula:</strong> "I noticed [specific detail] — [question/comment]"</p>
        <p><strong>Example:</strong> "I noticed you're into salsa dancing — is that a recent thing or have you been hiding your Strictly Come Dancing dreams?"</p>
        <p><strong>Why it works:</strong> Shows you actually looked at their profile. Specificity = effort = interest.</p>
        
        <h4>Template 2: The Playful Challenge</h4>
        <p><strong>Formula:</strong> "I bet you [playful assumption] — [tease]"</p>
        <p><strong>Example:</strong> "I bet you're the type who orders pineapple on pizza and then judges everyone else. Bold move."</p>
        <p><strong>Why it works:</strong> Creates playful tension. People love proving assumptions wrong.</p>
        
        <h4>Template 3: The Shared Experience</h4>
        <p><strong>Formula:</strong> "Have you ever [relatable experience]?"</p>
        <p><strong>Example:</strong> "Have you ever gone to a restaurant, looked at the menu for 20 minutes, and then ordered the same thing you always get? Asking for a friend."</p>
        <p><strong>Why it works:</strong> Relatability creates instant connection. Everyone has been there.</p>
        
        <h3>🚫 What NOT to Do</h3>
        <ul>
          <li>Copy-paste the same message to everyone</li>
          <li>Use pickup lines from the internet (cringe)</li>
          <li>Comment only on looks</li>
          <li>Send "Hey" with a wave emoji</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Specificity beats generic every time</li>
          <li>Playful challenge creates engagement</li>
          <li>Shared experiences build connection</li>
          <li>Personalize every message</li>
        </ul>
        
        <h3>📝 Practice Task</h3>
        <p>Write 5 openers using each template (15 total). Get a friend to rate them 1-10.</p>
      `,
      quiz: [
        { q: 'Which template uses a playful assumption?', options: ['Specific Observation', 'Playful Challenge', 'Shared Experience', 'None'], correct: 1 },
        { q: 'Why does specificity work?', options: ['It\'s longer', 'It shows effort', 'It uses big words', 'It\'s faster to write'], correct: 1 },
        { q: 'What should you NOT do?', options: ['Personalize', 'Use templates', 'Copy-paste', 'Be specific'], correct: 2 }
      ],
      coachTip: 'The best opener is one that only works for THAT person. If you could send the same message to 10 people, it\'s not good enough.'
    },
    {
      day: 4,
      phase: 1,
      title: 'Reading Signals',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '9 min',
      content: `
        <h3>🚦 Green Flags vs Red Flags</h3>
        <p>Reading signals is the difference between a great date and a restraining order. Most people are terrible at this because they only listen to words, not actions.</p>
        
        <h4>🟢 Green Flags (She's Into You)</h4>
        <ul>
          <li>She asks YOU questions</li>
          <li>She touches her hair or neck while talking</li>
          <li>She leans in when you speak</li>
          <li>She mirrors your body language</li>
          <li>She initiates text conversations</li>
          <li>She remembers small details you mentioned</li>
          <li>She finds reasons to touch your arm/hand</li>
          <li>Her feet point toward you (subconscious)</li>
        </ul>
        
        <h4>🔴 Red Flags (She's Not Into You / Toxic)</h4>
        <ul>
          <li>One-word replies consistently</li>
          <li>Always "busy" but active on social media</li>
          <li>Talks about exes on first date</li>
          <li>Love-bombing: "I've never felt this way" on day 1</li>
          <li>Gaslighting: "You're too sensitive"</li>
          <li>Never asks about you — only talks about herself</li>
          <li>Hot and cold behavior (manipulation tactic)</li>
        </ul>
        
        <h3>📱 Texting Signals</h3>
        <p><strong>Interested:</strong> Fast replies, asks follow-up questions, uses your name, sends photos/voice notes</p>
        <p><strong>Not Interested:</strong> "haha," "lol," "k," takes 24+ hours to reply, never initiates</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Actions > Words. Always.</li>
          <li>One green flag doesn't mean she's in love</li>
          <li>Multiple red flags = run</li>
          <li>Trust your gut — it's usually right</li>
        </ul>
        
        <h3>📝 Practice Task</h3>
        <p>Review your last 5 conversations. Identify green and red flags. Be honest.</p>
      `,
      quiz: [
        { q: 'Which is a green flag?', options: ['One-word replies', 'Asking you questions', 'Always busy', 'Hot and cold'], correct: 1 },
        { q: 'What matters more than words?', options: ['Looks', 'Money', 'Actions', 'Status'], correct: 2 },
        { q: 'What does "haha" usually signal?', options: ['She\'s laughing', 'Low interest', 'High interest', 'She\'s nervous'], correct: 1 }
      ],
      coachTip: 'If you have to constantly ask "does she like me?" — she probably doesn\'t. When someone likes you, you know. When they don\'t, you wonder.'
    },
    {
      day: 5,
      phase: 1,
      title: 'Banter Blueprint',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11 min',
      content: `
        <h3>😏 The Art of Playful Teasing</h3>
        <p>Banter is the secret sauce of attraction. It's not insulting — it's playful. It's not mean — it's fun. The goal is to create a push-pull dynamic that keeps things interesting.</p>
        
        <h4>The Push-Pull Formula</h4>
        <p><strong>Push:</strong> Playful tease or challenge<br>
        <strong>Pull:</strong> Genuine compliment or validation<br>
        <strong>Example:</strong> "You're way too confident for your own good... but I kind of like it."</p>
        
        <h4>Indian Context Banter</h4>
        <p><strong>Food:</strong> "You put ketchup on maggi? I'm calling the police."<br>
        <strong>Movies:</strong> "You haven't watched Sholay? Were you raised by wolves?"<br>
        <strong>Cricket:</strong> "You support RCB? I admire your loyalty to suffering."<br>
        <strong>Family:</strong> "Your mom still calls you 5 times a day? That's actually kind of sweet... and terrifying."</p>
        
        <h4>Rules of Good Banter</h4>
        <ul>
          <li>Never tease about insecurities (weight, height, family issues)</li>
          <li>Always smile — tone matters</li>
          <li>If she looks hurt, immediately switch to genuine mode</li>
          <li>Balance teasing with real conversation</li>
          <li>Don't overdo it — 70% real talk, 30% banter</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Banter creates emotional spikes</li>
          <li>Push-pull keeps things dynamic</li>
          <li>Never cross the line into insults</li>
          <li>Read the room — not everyone likes teasing</li>
        </ul>
        
        <h3>📝 Practice Task</h3>
        <p>Come up with 5 playful teases for common situations. Test them with friends first.</p>
      `,
      quiz: [
        { q: 'What is the push-pull formula?', options: ['Push away, pull closer', 'Push up, pull down', 'Push hard, pull soft', 'Push fast, pull slow'], correct: 0 },
        { q: 'What percentage should be real talk?', options: ['30%', '50%', '70%', '90%'], correct: 2 },
        { q: 'What should you NEVER tease about?', options: ['Food choices', 'Movie taste', 'Insecurities', 'Cricket team'], correct: 2 }
      ],
      coachTip: 'Banter is like spice — a little makes the dish amazing, too much ruins it. Start mild and escalate based on her reactions.'
    },
    {
      day: 6,
      phase: 1,
      title: 'Date Close',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>📞 From Number to Date</h3>
        <p>You got the number. Great. Now what? Most people text for weeks and never meet. The goal is to get the date within 3-5 days of getting the number.</p>
        
        <h4>The Date Close Script</h4>
        <p><strong>Step 1:</strong> Build rapport (5-10 messages)<br>
        <strong>Step 2:</strong> Find common interest<br>
        <strong>Step 3:</strong> Suggest specific plan + time</p>
        
        <p><strong>Example:</strong><br>
        "You mentioned you love South Indian food. There's this amazing dosa place in Koramangala — crispy, buttery, the real deal. I'm free Thursday evening. Let's go?"</p>
        
        <h4>Why This Works</h4>
        <ul>
          <li><strong>Specific:</strong> Not "let's hang out sometime" — exact place, time</li>
          <li><strong>Low pressure:</strong> Food = easy exit if things are awkward</li>
          <li><strong>Shared interest:</strong> Shows you were listening</li>
          <li><strong>Confident:</strong> "Let's go" not "Would you maybe want to?"</li>
        </ul>
        
        <h4>If She Says "Maybe" or "I'll Let You Know"</h4>
        <p>Don't chase. Say: "No worries, let me know when you're free." Then stop texting. If she's interested, she'll come back. If not, you saved time.</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Get the date within 3-5 days</li>
          <li>Be specific: place, time, activity</li>
          <li>Use shared interests from conversation</li>
          <li>If she's hesitant, back off gracefully</li>
        </ul>
        
        <h3>📝 Practice Task</h3>
        <p>Write 3 date-close messages for different scenarios (coffee, food, activity).</p>
      `,
      quiz: [
        { q: 'How soon should you ask for a date?', options: ['Same day', '3-5 days', '2 weeks', '1 month'], correct: 1 },
        { q: 'What makes a good date suggestion?', options: ['Vague plans', 'Specific place and time', 'Asking what she wants', 'Letting her decide'], correct: 1 },
        { q: 'What to do if she says "maybe"?', options: ['Keep asking', 'Back off gracefully', 'Get upset', 'Send more messages'], correct: 1 }
      ],
      coachTip: 'A "maybe" is usually a "no" with training wheels. Respect it. The person who can walk away with dignity keeps their power.'
    },
    {
      day: 7,
      phase: 1,
      title: 'Week 1 Boss Battle',
      isFree: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '15 min',
      content: `
        <h3>⚔️ Simulated Conversation Challenge</h3>
        <p>This is your Week 1 final exam. You'll have a simulated conversation with our AI, and it will judge your responses based on everything you've learned.</p>
        
        <h4>Scoring Criteria</h4>
        <ul>
          <li><strong>Opener (20%):</strong> Specific, personalized, not generic</li>
          <li><strong>Banter (20%):</strong> Playful but respectful</li>
          <li><strong>Questions (20%):</strong> Balanced — not an interview</li>
          <li><strong>Confidence (20%):</strong> Not needy, not arrogant</li>
          <li><strong>Close (20%):</strong> Asks for date naturally</li>
        </ul>
        
        <h4>How It Works</h4>
        <p>Go to the Chat tab. Select "First Date" scenario. Have a full conversation. The AI will give you a score and feedback at the end.</p>
        
        <h3>🏆 Week 1 Rewards</h3>
        <ul>
          <li>Complete all 7 days → Unlock "Week 1 Warrior" badge</li>
          <li>Score 80%+ in Boss Battle → Bonus 100 XP</li>
          <li>7-day streak → "On Fire" badge</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Apply everything you learned this week</li>
          <li>Don't overthink — be natural</li>
          <li>Mistakes are data, not failure</li>
          <li>Even a 60% score is progress</li>
        </ul>
        
        <h3>📝 Practice Task</h3>
        <p>Complete the Boss Battle. Take the feedback seriously. Redo if you score below 70%.</p>
      `,
      quiz: [
        { q: 'What percentage is the opener worth?', options: ['10%', '20%', '30%', '40%'], correct: 1 },
        { q: 'What score gets bonus XP?', options: ['60%', '70%', '80%', '90%'], correct: 2 },
        { q: 'What should you do with mistakes?', options: ['Ignore them', 'Feel bad', 'Learn from them', 'Blame the AI'], correct: 2 }
      ],
      coachTip: 'This is just Week 1. The real game starts now. If you passed, celebrate. If you didn\'t, celebrate anyway — you showed up. That\'s 90% of the battle.'
    },
    
    // PHASE 2: First Date Mastery (Days 8-14) — PAID
    {
      day: 8,
      phase: 2,
      title: 'Venue Selection Secrets',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>📍 Where You Meet Matters</h3>
        <p>The venue sets the tone for the entire date. Coffee shop? Casual. Fancy restaurant? Pressure. Bar? Depends on the vibe. Choose wrong and you're fighting an uphill battle.</p>
        
        <h4>First Date Venue Rules</h4>
        <ul>
          <li><strong>Easy exit:</strong> Can leave in 20 min if it's bad</li>
          <li><strong>Activity option:</strong> Something to DO, not just talk</li>
          <li><strong>Not too loud:</strong> Can actually hear each other</li>
          <li><strong>Not too quiet:</strong> Awkward silences are amplified</li>
          <li><strong>Neutral territory:</strong> Not your home, not hers</li>
        </ul>
        
        <h4>Best First Date Venues (India)</h4>
        <ul>
          <li><strong>Craft Coffee Shop:</strong> Third Wave, Blue Tokai — good coffee, good vibe</li>
          <li><strong>Board Game Cafe:</strong> Natural activity, no awkward silences</li>
          <li><strong>Street Food Tour:</strong> Chaat, golgappe — casual, fun, memorable</li>
          <li><strong>Mini Golf / Bowling:</strong> Playful competition</li>
          <li><strong>Bookstore + Coffee:</strong> For the intellectual types</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Venue = 30% of date success</li>
          <li>Always have a backup plan</li>
          <li>Arrive 5 min early, scope the place</li>
          <li>Pick a place YOU know well</li>
        </ul>
      `,
      quiz: [
        { q: 'What\'s the most important venue quality?', options: ['Expensive', 'Easy exit', 'Fancy', 'Famous'], correct: 1 },
        { q: 'Why are activity dates better?', options: ['Cheaper', 'Less talking needed', 'Something to do', 'Shorter'], correct: 2 }
      ],
      coachTip: 'The best dates feel effortless. The venue should facilitate connection, not create pressure.'
    },
    {
      day: 9,
      phase: 2,
      title: 'Conversation Mastery',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '12 min',
      content: `
        <h3>🗣️ Never Run Out of Things to Say</h3>
        <p>The fear of awkward silence kills more dates than bad breath. Here's how to keep conversation flowing naturally.</p>
        
        <h4>The FORD Method</h4>
        <ul>
          <li><strong>F</strong>amily — "What's your family like? Do you have siblings?"</li>
          <li><strong>O</strong>ccupation — "What do you do? What do you love about it?"</li>
          <li><strong>R</strong>ecreation — "What do you do for fun? Any hobbies?"</li>
          <li><strong>D</strong>reams — "If you could do anything, what would it be?"</li>
        </ul>
        
        <h4>The 3-Second Rule</h4>
        <p>When there's a pause, count to 3. Most people panic and fill silence with nonsense. Comfortable silence is confident. Let it breathe.</p>
        
        <h4>Storytelling Formula</h4>
        <p><strong>Hook:</strong> "You won't believe what happened..."<br>
        <strong>Context:</strong> "I was at this wedding in Jaipur..."<br>
        <strong>Conflict:</strong> "And then the groom's ex showed up..."<br>
        <strong>Resolution:</strong> "Turns out she was his cousin. Drama for no reason."</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>FORD = endless topics</li>
          <li>Comfortable silence is attractive</li>
          <li>Stories > facts</li>
          <li>Listen more than you talk (60/40 rule)</li>
        </ul>
      `,
      quiz: [
        { q: 'What does FORD stand for?', options: ['Food, Office, Rest, Dreams', 'Family, Occupation, Recreation, Dreams', 'Friends, Office, Reading, Dance', 'Fun, Outside, Running, Dinner'], correct: 1 },
        { q: 'What is the listening/talking ratio?', options: ['50/50', '60/40', '70/30', '80/20'], correct: 1 }
      ],
      coachTip: 'The best conversationalists are the best listeners. People love talking about themselves — let them.'
    },
    {
      day: 10,
      phase: 2,
      title: 'Body Language Decoded',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11 min',
      content: `
        <h3>🕺 What Your Body Says</h3>
        <p>93% of communication is non-verbal. Your words say one thing, your body says another. Make sure they're saying the same thing.</p>
        
        <h4>Confident Body Language</h4>
        <ul>
          <li><strong>Posture:</strong> Shoulders back, chin up, not slouching</li>
          <li><strong>Eye Contact:</strong> 60-70% of the time, not staring</li>
          <li><strong>Smile:</strong> Genuine, reaches the eyes (Duchenne smile)</li>
          <li><strong>Open Gestures:</strong> Palms visible, arms uncrossed</li>
          <li><strong>Leaning:</strong> Slight lean in shows interest</li>
          <li><strong>Space:</strong> Respect personal space but don't be distant</li>
        </ul>
        
        <h4>Nervous Body Language to Avoid</h4>
        <ul>
          <li>Fidgeting with phone or objects</li>
          <li>Crossed arms (defensive)</li>
          <li>Looking at the door/exit</li>
          <li>Touching face or neck excessively</li>
          <li>Tapping foot or drumming fingers</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Body language is 93% of communication</li>
          <li>Open posture = open personality</li>
          <li>Mirror her energy level</li>
          <li>Calm body = calm mind</li>
        </ul>
      `,
      quiz: [
        { q: 'What percentage is non-verbal?', options: ['50%', '70%', '93%', '100%'], correct: 2 },
        { q: 'What does crossed arms signal?', options: ['Confidence', 'Defensiveness', 'Warmth', 'Interest'], correct: 1 }
      ],
      coachTip: 'Before you fix your words, fix your body. Stand like a confident person and your brain will follow.'
    },
    {
      day: 11,
      phase: 2,
      title: 'The Perfect Exit',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '9 min',
      content: `
        <h3>🚪 Leave Them Wanting More</h3>
        <p>How you end the date is more important than how you start it. A great exit creates anticipation for the next meeting.</p>
        
        <h4>The 90-Minute Rule</h4>
        <p>First dates should be 60-90 minutes max. Longer = diminishing returns. Leave while things are still good. "I have an early morning" is a perfect excuse.</p>
        
        <h4>The Exit Script</h4>
        <p><strong>During:</strong> "This has been really fun. I have to head out soon but I'd love to do this again."<br>
        <strong>At the door:</strong> "I had a great time. Let me know when you get home safe."<br>
        <strong>Text after (2-3 hours):</strong> "Home safe? Had a really good time tonight. Let's do it again soon."</p>
        
        <h4>Goodbye Types</h4>
        <ul>
          <li><strong>Hug:</strong> Safe, warm, appropriate</li>
          <li><strong>Handshake:</strong> Too formal, avoid</li>
          <li><strong>Kiss on cheek:</strong> Only if vibes are strong</li>
          <li><strong>Kiss on lips:</strong> First date? Risky. Read the room.</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Leave at the peak, not the decline</li>
          <li>Always mention wanting to meet again</li>
          <li>Follow-up text is crucial</li>
          <li>Don't overstay your welcome</li>
        </ul>
      `,
      quiz: [
        { q: 'How long should a first date be?', options: ['30 min', '60-90 min', '3 hours', 'All night'], correct: 1 },
        { q: 'When should you send follow-up text?', options: ['Immediately', '2-3 hours later', 'Next day', 'Next week'], correct: 1 }
      ],
      coachTip: 'The person who ends the date first controls the narrative. Leave while they\'re still smiling.'
    },
    {
      day: 12,
      phase: 2,
      title: 'Handling Awkward Moments',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>😅 When Things Go Sideways</h3>
        <p>Spilled drink? Dead silence? Ex mentioned? Here's how to handle awkward moments like a pro.</p>
        
        <h4>The Spill / Accident</h4>
        <p>"Well, that's one way to make a memorable first impression. At least now we have a story." Laugh it off. Don't over-apologize.</p>
        
        <h4>The Dead Silence</h4>
        <p>Use the environment. "This music is... interesting. What's your guilty pleasure song?" Or: "I'm going to be honest — my brain just went completely blank. Your turn to carry the conversation."</p>
        
        <h4>The Ex Mention</h4>
        <p>If SHE mentions an ex: "Sounds like that was tough. I'm glad you're here now." (Acknowledge, redirect).<br>
        If YOU accidentally mention yours: "Sorry, old habit. Tell me about your favorite travel memory instead."</p>
        
        <h4>The Phone Check</h4>
        <p>If she checks her phone: Don't get insecure. Say: "Important message? I can wait." If she keeps doing it, she's not interested. Wrap it up.</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Awkward moments are normal — how you handle them matters</li>
          <li>Humor diffuses tension</li>
          <li>Don't over-apologize</li>
          <li>Know when to cut your losses</li>
        </ul>
      `,
      quiz: [
        { q: 'How to handle a spill?', options: ['Get upset', 'Laugh it off', 'Leave immediately', 'Blame the waiter'], correct: 1 },
        { q: 'What if she keeps checking her phone?', options: ['Get angry', 'Ask if she\'s busy', 'Wrap up the date', 'Check yours too'], correct: 2 }
      ],
      coachTip: 'Awkwardness is just unmet expectations. Reset the expectation — "This is fun, even when it\'s weird" — and watch the tension melt.'
    },
    {
      day: 13,
      phase: 2,
      title: 'Reading the Vibe',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '9 min',
      content: `
        <h3>🔮 Is It Going Well?</h3>
        <p>Most people are terrible at reading dates because they're too in their own head. Here's your checklist.</p>
        
        <h4>Signs It's Going Well</h4>
        <ul>
          <li>She's laughing at your mediocre jokes</li>
          <li>She's touching her hair, neck, or you</li>
          <li>Time is flying — "Already 2 hours?!"</li>
          <li>She's suggesting future plans</li>
          <li>She's sharing personal stories</li>
          <li>Her phone is face-down on the table</li>
        </ul>
        
        <h4>Signs It's Not Going Well</h4>
        <ul>
          <li>One-word answers, no follow-up questions</li>
          <li>Checking phone repeatedly</li>
          <li>Body turned away from you</li>
          <li>Mentioning "early morning" within 30 min</li>
          <li>No eye contact, looking around</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Trust your gut — it's usually right</li>
          <li>Don't ignore red flags because she's pretty</li>
          <li>Good vibes = easy conversation</li>
          <li>Bad vibes = polite exit</li>
        </ul>
      `,
      quiz: [
        { q: 'What does phone face-down mean?', options: ['She\'s bored', 'She\'s engaged', 'She\'s shy', 'She\'s tired'], correct: 1 },
        { q: 'What should you do if vibes are bad?', options: ['Try harder', 'Polite exit', 'Get upset', 'Stay longer'], correct: 1 }
      ],
      coachTip: 'Your intuition has been evolving for millions of years. Trust it. If something feels off, it probably is.'
    },
    {
      day: 14,
      phase: 2,
      title: 'Phase 2 Boss Battle',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '15 min',
      content: `
        <h3>⚔️ First Date Simulation</h3>
        <p>Time for your Phase 2 final exam. You'll simulate a complete first date conversation with our AI.</p>
        
        <h4>Scoring Criteria</h4>
        <ul>
          <li><strong>Venue suggestion (15%):</strong> Appropriate, specific</li>
          <li><strong>Conversation flow (25%):</strong> Natural, engaging</li>
          <li><strong>Body language awareness (20%):</strong> Mentions posture, eye contact</li>
          <li><strong>Awkward moment handling (20%):</strong> Grace under pressure</li>
          <li><strong>Exit strategy (20%):</strong> Clean, leaves wanting more</li>
        </ul>
        
        <h3>🏆 Phase 2 Rewards</h3>
        <ul>
          <li>Complete all 7 days → Phase 3 unlocked</li>
          <li>Score 85%+ → Bonus 150 XP</li>
          <li>Perfect score → "First Date Pro" badge</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Apply all Phase 2 lessons</li>
          <li>Stay calm under pressure</li>
          <li>End strong, not long</li>
        </ul>
      `,
      quiz: [
        { q: 'What\'s the ideal first date length?', options: ['30 min', '60-90 min', '3 hours', 'All day'], correct: 1 },
        { q: 'What percentage is conversation flow worth?', options: ['15%', '20%', '25%', '30%'], correct: 2 }
      ],
      coachTip: 'You've completed Phase 2. You're no longer a rookie — you're someone who can handle a first date with confidence. Phase 3 is where things get interesting.'
    },
    
    // PHASE 3: Connection Building (Days 15-21) — PAID
    {
      day: 15,
      phase: 3,
      title: 'Second Date Strategy',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>🎯 Level Up the Connection</h3>
        <p>The second date is where you separate yourself from everyone else. First date was surface level. Second date is where real connection happens.</p>
        
        <h4>Second Date Rules</h4>
        <ul>
          <li><strong>Longer:</strong> 2-3 hours, not 1</li>
          <li><strong>More active:</strong> Do something together, not just sit</li>
          <li><strong>Deeper topics:</strong> Values, dreams, fears</li>
          <li><strong>Physical escalation:</strong> Natural, not forced</li>
        </ul>
        
        <h4>Best Second Date Ideas</h4>
        <ul>
          <li><strong>Cooking together:</strong> Teamwork, fun, food</li>
          <li><strong>Hiking / Walk:</strong> Side-by-side = easier deep talk</li>
          <li><strong>Art class / Pottery:</strong> Creative, memorable</li>
          <li><strong>Concert / Live show:</strong> Shared experience</li>
          <li><strong>Game night:</strong> Playful competition</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Second date > first date in importance</li>
          <li>Active dates create better bonds</li>
          <li>Go deeper with conversation</li>
          <li>Let physical connection happen naturally</li>
        </ul>
      `,
      quiz: [
        { q: 'How long should a second date be?', options: ['1 hour', '2-3 hours', '30 min', 'All day'], correct: 1 },
        { q: 'Why are active dates better?', options: ['Cheaper', 'Create better bonds', 'Shorter', 'Easier to plan'], correct: 1 }
      ],
      coachTip: 'The second date is where you show who you really are. First date was the trailer. This is the movie.'
    },
    {
      day: 16,
      phase: 3,
      title: 'Emotional Intelligence',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '12 min',
      content: `
        <h3>🧠 EQ > IQ in Relationships</h3>
        <p>Emotional intelligence is the #1 predictor of relationship success. More than looks, money, or status. Here's how to develop it.</p>
        
        <h4>The 4 Components of EQ</h4>
        <ul>
          <li><strong>Self-awareness:</strong> Know your emotions, triggers, patterns</li>
          <li><strong>Self-regulation:</strong> Control reactions, don't lash out</li>
          <li><strong>Social awareness:</strong> Read others' emotions, empathize</li>
          <li><strong>Relationship management:</strong> Navigate conflicts, build trust</li>
        </ul>
        
        <h4>EQ in Action</h4>
        <p><strong>She's upset:</strong> "I can see you're frustrated. Want to talk about it or need space?" (Validation + choice)<br>
        <strong>You messed up:</strong> "I was wrong. Here's what I did and how I'll fix it." (Accountability)<br>
        <strong>She's excited:</strong> Match her energy. "That's amazing! Tell me everything!" (Empathy)</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>EQ is learnable, not fixed</li>
          <li>Name emotions to tame them</li>
          <li>Validate before problem-solving</li>
          <li>Accountability builds trust</li>
        </ul>
      `,
      quiz: [
        { q: 'What is the #1 predictor of relationship success?', options: ['Money', 'Looks', 'EQ', 'Status'], correct: 2 },
        { q: 'What should you do when she\'s upset?', options: ['Fix the problem', 'Validate first', 'Change topic', 'Give advice'], correct: 1 }
      ],
      coachTip: 'Most men are taught to suppress emotions. The most attractive thing you can do is feel deeply and express it safely.'
    },
    {
      day: 17,
      phase: 3,
      title: 'The Tests Women Give',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11 min',
      content: `
        <h3>🧪 Passing Her Tests</h3>
        <p>Women test men. Not because they're manipulative — because they need to know who you really are beneath the surface. Here's how to pass with flying colors.</p>
        
        <h4>Common Tests</h4>
        <ul>
          <li><strong>The Compliment Test:</strong> "You're probably a player" → "Maybe. But I'm here with you right now, aren't I?" (Confident, not defensive)</li>
          <li><strong>The Cancel Test:</strong> She cancels last minute → "No worries, rain check. Let me know when you're free." (Not needy, gives space)</li>
          <li><strong>The Ex Mention:</strong> "My ex used to..." → "Sounds like he wasn't right for you. What do you value most in a partner?" (Redirect)</li>
          <li><strong>The Friend Zone Test:</strong> "You're such a good friend" → "I like you too much to just be friends. Let's see where this goes." (Honest, direct)</li>
        </ul>
        
        <h4>Why Tests Happen</h4>
        <p>She's not trying to trick you. She's trying to see if you're:</p>
        <ul>
          <li>Confident or insecure</li>
          <li>Authentic or fake</li>
          <li>Emotionally stable or reactive</li>
          <li>Interested or just playing</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Tests = interest, not manipulation</li>
          <li>Don't get defensive or angry</li>
          <li>Stay calm, stay authentic</li>
          <li>Confidence passes every test</li>
        </ul>
      `,
      quiz: [
        { q: 'Why do women give tests?', options: ['To manipulate', 'To know who you are', 'To be mean', 'To waste time'], correct: 1 },
        { q: 'How to handle cancellation?', options: ['Get upset', 'Give space', 'Beg her to come', 'Ignore her'], correct: 1 }
      ],
      coachTip: 'A test is a compliment in disguise. She only tests people she sees potential in. No tests = no interest.'
    },
    {
      day: 18,
      phase: 3,
      title: 'Building Trust',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>🤝 Trust = Foundation of Everything</h3>
        <p>Without trust, you have nothing. Not a relationship, not a connection, not even a friendship. Here's how to build it fast and keep it strong.</p>
        
        <h4>The Trust Equation</h4>
        <p><strong>Trust = (Credibility + Reliability + Intimacy) / Self-Orientation</strong></p>
        <ul>
          <li><strong>Credibility:</strong> Do you know what you're talking about?</li>
          <li><strong>Reliability:</strong> Do you do what you say?</li>
          <li><strong>Intimacy:</strong> Do you share vulnerably?</li>
          <li><strong>Self-Orientation:</strong> Are you focused on her or yourself?</li>
        </ul>
        
        <h4>Trust-Building Actions</h4>
        <ul>
          <li>Be on time. Every time.</li>
          <li>Do what you say you'll do.</li>
          <li>Share something vulnerable.</li>
          <li>Keep her secrets.</li>
          <li>Admit when you're wrong.</li>
          <li>Be consistent — same person in public and private.</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Trust takes time, can be lost in seconds</li>
          <li>Consistency > intensity</li>
          <li>Vulnerability builds intimacy</li>
          <li>Reliability is sexy</li>
        </ul>
      `,
      quiz: [
        { q: 'What is the most important trust factor?', options: ['Money', 'Looks', 'Consistency', 'Words'], correct: 2 },
        { q: 'How is trust lost?', options: ['Slowly', 'In seconds', 'Never', 'Only by cheating'], correct: 1 }
      ],
      coachTip: 'Trust is built in small moments, not grand gestures. Showing up on time matters more than a surprise gift.'
    },
    {
      day: 19,
      phase: 3,
      title: 'Physical Connection',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11 min',
      content: `
        <h3>🤲 The Art of Touch</h3>
        <p>Physical connection is natural and necessary. But it must escalate gradually, with consent, and in the right context.</p>
        
        <h4>The Escalation Ladder</h4>
        <ul>
          <li><strong>Level 1:</strong> Accidental touch — brushing hands, high-five</li>
          <li><strong>Level 2:</strong> Casual touch — hand on shoulder, guiding through door</li>
          <li><strong>Level 3:</strong> Affectionate touch — holding hands, arm around shoulder</li>
          <li><strong>Level 4:</strong> Intimate touch — hugging, kissing</li>
        </ul>
        
        <h4>Consent is Sexy</h4>
        <p>"Can I kiss you?" is not awkward — it's respectful. And respect is attractive. Read her body language. If she leans in, reciprocates touch, maintains eye contact — green light. If she pulls back, crosses arms, looks away — stop.</p>
        
        <h4>Indian Context</h4>
        <p>Public displays of affection are still taboo in many places. Be mindful of surroundings. A hand on the back while walking is often more appropriate than a kiss in public.</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Escalate gradually, not suddenly</li>
          <li>Consent is mandatory, not optional</li>
          <li>Read body language constantly</li>
          <li>Respect cultural context</li>
        </ul>
      `,
      quiz: [
        { q: 'What is the first level of touch?', options: ['Holding hands', 'Accidental touch', 'Kissing', 'Hugging'], correct: 1 },
        { q: 'Is asking for consent awkward?', options: ['Yes', 'No, it\'s respectful', 'Sometimes', 'Only in India'], correct: 1 }
      ],
      coachTip: 'The best physical connection happens when both people feel safe. Safety first, everything else follows.'
    },
    {
      day: 20,
      phase: 3,
      title: 'Deep Conversations',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>🌊 Going Below the Surface</h3>
        <p>Surface-level talk is fine for strangers. But to build real connection, you need to go deeper. Here's how to have conversations that matter.</p>
        
        <h4>Deep Conversation Starters</h4>
        <ul>
          <li>"What's something you're proud of that you never talk about?"</li>
          <li>"If you could change one thing about how you were raised, what would it be?"</li>
          <li>"What's a belief you had that changed completely?"</li>
          <li>"What does success mean to you? Not society's version — yours."</li>
          <li>"When was the last time you cried? What about?"</li>
        </ul>
        
        <h4>The Vulnerability Loop</h4>
        <p>You share something real → She feels safe → She shares something real → Trust deepens → Connection grows. It starts with you.</p>
        
        <h4>Topics to Avoid Early</h4>
        <ul>
          <li>Politics (divisive)</li>
          <li>Religion (sensitive)</li>
          <li>Exes (unless she brings it up)</li>
          <li>Money (crass)</li>
          <li>Marriage/kids on date 2 (pressure)</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Depth creates connection</li>
          <li>You go first — lead with vulnerability</li>
          <li>Listen without judgment</li>
          <li>Some topics need time</li>
        </ul>
      `,
      quiz: [
        { q: 'Who should go first with vulnerability?', options: ['Her', 'You', 'Nobody', 'Both at once'], correct: 1 },
        { q: 'What topic should you avoid early?', options: ['Travel', 'Hobbies', 'Politics', 'Food'], correct: 2 }
      ],
      coachTip: 'The conversations that scare you are the ones that create the deepest bonds. Be brave.'
    },
    {
      day: 21,
      phase: 3,
      title: 'Phase 3 Boss Battle',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '15 min',
      content: `
        <h3>⚔️ Connection Deep Dive</h3>
        <p>Your Phase 3 final exam. Simulate a deep, meaningful conversation where you build real connection.</p>
        
        <h4>Scoring Criteria</h4>
        <ul>
          <li><strong>Vulnerability (25%):</strong> Share something real</li>
          <li><strong>Emotional intelligence (25%):</strong> Read and respond to emotions</li>
          <li><strong>Trust building (20%):</strong> Show reliability and consistency</li>
          <li><strong>Depth (20%):</strong> Go beyond surface level</li>
          <li><strong>Physical awareness (10%):</strong> Respect boundaries, read signals</li>
        </ul>
        
        <h3>🏆 Phase 3 Rewards</h3>
        <ul>
          <li>Complete all 7 days → Phase 4 unlocked</li>
          <li>Score 85%+ → Bonus 200 XP</li>
          <li>Perfect score → "Connection Master" badge</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Real connection requires courage</li>
          <li>Vulnerability is strength, not weakness</li>
          <li>Trust is earned, not given</li>
        </ul>
      `,
      quiz: [
        { q: 'What is vulnerability?', options: ['Weakness', 'Strength', 'Fear', 'Shyness'], correct: 1 },
        { q: 'What percentage is EQ worth?', options: ['10%', '20%', '25%', '30%'], correct: 2 }
      ],
      coachTip: 'Phase 3 is where most people quit. You didn't. That alone puts you in the top 10%. Phase 4 is the finish line.'
    },
    
    // PHASE 4: Long Game (Days 22-28) — PAID
    {
      day: 22,
      phase: 4,
      title: 'The Relationship Talk',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11 min',
      content: `
        <h3>💬 Defining What This Is</h3>
        <p>The "what are we?" conversation is terrifying for everyone. But avoiding it is worse. Here's how to have it with confidence.</p>
        
        <h4>When to Have the Talk</h4>
        <ul>
          <li>After 6-8 dates</li>
          <li>When you feel a real connection</li>
          <li>Before either of you gets hurt by assumptions</li>
          <li>When you're ready to be exclusive</li>
        </ul>
        
        <h4>The Talk Script</h4>
        <p>"I've really enjoyed getting to know you. I feel a strong connection and I'm not interested in seeing other people. How do you feel about being exclusive?"</p>
        
        <p><strong>If she says yes:</strong> Celebrate! But keep being the person she fell for.<br>
        <strong>If she says no / needs time:</strong> "I understand. I need to know where this is going, so take your time but let me know soon."<br>
        <strong>If she says she's seeing others:</strong> "I respect that, but I need exclusivity. If that's not where you are, I need to step back."</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Have the talk before assumptions hurt you</li>
          <li>Be direct but not demanding</li>
          <li>Know your non-negotiables</li>
          <li>Be willing to walk away if values don't align</li>
        </ul>
      `,
      quiz: [
        { q: 'When should you have the talk?', options: ['Date 1', '6-8 dates', 'Never', 'After marriage'], correct: 1 },
        { q: 'What if she needs time?', options: ['Pressure her', 'Give space with deadline', 'Ignore it', 'Get upset'], correct: 1 }
      ],
      coachTip: 'The talk is not about trapping her. It\'s about aligning expectations. If you want different things, better to know now.'
    },
    {
      day: 23,
      phase: 4,
      title: 'Meeting the Family',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '12 min',
      content: `
        <h3>👨‍👩‍👧 The Indian Family Test</h3>
        <p>In India, family approval can make or break a relationship. Here's how to win them over without losing yourself.</p>
        
        <h4>Before the Meeting</h4>
        <ul>
          <li>Ask her about family dynamics — who matters most?</li>
          <li>Dress appropriately (slightly formal, not too flashy)</li>
          <li>Bring a small gift — sweets or flowers</li>
          <li>Learn basic greetings in their language</li>
        </ul>
        
        <h4>During the Meeting</h4>
        <ul>
          <li>Greet elders first, with respect</li>
          <li>Offer to help with something</li>
          <li>Talk about your career and ambitions</li>
          <li>Ask about their lives, don't just talk about yourself</li>
          <li>Be polite but not a pushover</li>
          <li>Don't overstay — 1-2 hours max first time</li>
        </ul>
        
        <h4>Red Flags from Family</h4>
        <ul>
          <li>Asking about salary in first 10 minutes</li>
          <li>Comparing you to her ex</li>
          <li>Demanding things (dowry talk, caste issues)</li>
          <li>Disrespecting her in front of you</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Respect is universal — show it generously</li>
          <li>Don't pretend to be someone you're not</li>
          <li>How they treat her = how they'll treat you</li>
          <li>First impression matters, but consistency matters more</li>
        </ul>
      `,
      quiz: [
        { q: 'How long should first family meeting be?', options: ['30 min', '1-2 hours', 'All day', 'Overnight'], correct: 1 },
        { q: 'What should you bring?', options: ['Nothing', 'Small gift', 'Expensive gift', 'Alcohol'], correct: 1 }
      ],
      coachTip: 'Her family wants to know one thing: will you take care of their daughter? Show them, with actions, that the answer is yes.'
    },
    {
      day: 24,
      phase: 4,
      title: 'Handling Fights',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '11 min',
      content: `
        <h3>⚔️ Fighting Fair</h3>
        <p>Conflict is inevitable. But how you fight determines whether you grow together or fall apart.</p>
        
        <h4>The Rules of Fair Fighting</h4>
        <ul>
          <li><strong>No name-calling:</strong> "You're stupid" → "I felt hurt when..."</li>
          <li><strong>No bringing up the past:</strong> Stick to the current issue</li>
          <li><strong>No ultimatums:</strong> "Do this or I'm leaving" is manipulation</li>
          <li><strong>Take breaks:</strong> "I need 20 minutes to cool down" is healthy</li>
          <li><strong>No stonewalling:</strong> Silent treatment is emotional abuse</li>
          <li><strong>Use "I" statements:</strong> "I feel..." not "You always..."</li>
        </ul>
        
        <h4>The Repair Attempt</h4>
        <p>After a fight, someone needs to reach out. It doesn't matter who "started it." What matters is fixing it.</p>
        <p><strong>Example:</strong> "I'm sorry I raised my voice. I was frustrated, not at you. Can we talk about this calmly?"</p>
        
        <h4>When to Walk Away</h4>
        <ul>
          <li>Physical violence (even once)</li>
          <li>Constant disrespect</li>
          <li>Refusal to communicate</li>
          <li>Same fight, no progress, for months</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Fights are normal — cruelty is not</li>
          <li>Repair attempts save relationships</li>
          li>"I" statements > "You" accusations</li>
          <li>Know when to fight and when to walk</li>
        </ul>
      `,
      quiz: [
        { q: 'What should you avoid in fights?', options: ['Talking', 'Name-calling', 'Listening', 'Compromising'], correct: 1 },
        { q: 'What is stonewalling?', options: ['Building walls', 'Silent treatment', 'Yelling', 'Crying'], correct: 1 }
      ],
      coachTip: 'The goal of a fight is not to win. It\'s to understand. If you're trying to win, you've already lost.'
    },
    {
      day: 25,
      phase: 4,
      title: 'Keeping the Spark',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>🔥 Long-Term Attraction</h3>
        <p>The honeymoon phase ends. That's biology. But the spark doesn't have to die. Here's how to keep it alive for years.</p>
        
        <h4>The Novelty Factor</h4>
        <p>Do new things together. Novel experiences trigger dopamine — the same chemical as early attraction.</p>
        <ul>
          <li>Try a new restaurant every month</li>
          <li>Take a class together (dance, cooking, language)</li>
          <li>Travel to new places, even weekend trips</li>
          <li>Surprise each other (small things, not grand gestures)</li>
        </ul>
        
        <h4>The Independence Factor</h4>
        <p>Absence makes the heart grow fonder. Maintain your own hobbies, friends, and identity. A little mystery keeps attraction alive.</p>
        
        <h4>The Appreciation Factor</h4>
        <p>Never stop noticing. "I love how you laugh at my bad jokes" or "You look beautiful even when you're stressed." Small, genuine compliments daily.</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Novelty = dopamine = attraction</li>
          <li>Independence is sexy</li>
          <li>Appreciation should be daily, not just anniversaries</li>
          <li>Physical touch doesn't have to lead to sex</li>
        </ul>
      `,
      quiz: [
        { q: 'What triggers dopamine in relationships?', options: ['Routine', 'Novelty', 'Silence', 'Distance'], correct: 1 },
        { q: 'How often should you appreciate your partner?', options: ['Weekly', 'Daily', 'Monthly', 'Yearly'], correct: 1 }
      ],
      coachTip: 'The spark doesn't die because you stop loving. It dies because you stop trying. Keep trying.'
    },
    {
      day: 26,
      phase: 4,
      title: 'Red Flags You Can\'t Ignore',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '12 min',
      content: `
        <h3>🚩 When to Run</h3>
        <p>Love is blind, but it shouldn't be stupid. Some red flags are dealbreakers, no matter how much you like someone.</p>
        
        <h4>Non-Negotiable Red Flags</h4>
        <ul>
          <li><strong>Controlling behavior:</strong> Dictating who you can see, what you wear</li>
          <li><strong>Jealousy:</strong> Insecurity disguised as love</li>
          <li><strong>Dishonesty:</strong> Lies, even small ones, erode trust</li>
          <li><strong>Disrespect:</strong> To you, to waiters, to anyone</li>
          <li><strong>Substance abuse:</strong> Not recreational use, dependency</li>
          <li><strong>Anger issues:</strong> Yelling, throwing things, intimidation</li>
          <li><strong>Financial irresponsibility:</strong> If you're merging lives, this matters</li>
          <li><strong>No ambition:</strong> Not about money — about growth</li>
        </ul>
        
        <h4>Yellow Flags (Proceed with Caution)</h4>
        <ul>
          <li>Still close with ex (possible, but watch)</li>
          <li>Bad relationship with family (understand why)</li>
          <li>Workaholic (balance needed)</li>
          <li>Different values on kids/money/religion</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Red flags don't change color</li>
          <li>Trust actions, not promises</li>
          <li>Your gut knows — listen to it</li>
          <li>Walking away is strength, not weakness</li>
        </ul>
      `,
      quiz: [
        { q: 'Which is a red flag?', options: ['Being busy', 'Controlling behavior', 'Having hobbies', 'Being shy'], correct: 1 },
        { q: 'What should you trust more?', options: ['Words', 'Promises', 'Actions', 'Excuses'], correct: 2 }
      ],
      coachTip: 'The red flags you ignore in the beginning become the reasons you leave in the end. See them early. Act on them.'
    },
    {
      day: 27,
      phase: 4,
      title: 'The Proposal',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '10 min',
      content: `
        <h3>💍 When and How to Propose</h3>
        <p>Not everyone wants marriage. But if you do, here's how to do it right.</p>
        
        <h4>Before the Proposal</h4>
        <ul>
          <li>Know her answer before you ask (you should have talked about marriage)</li>
          <li>Talk to her family (traditional, but appreciated)</li>
          <li>Know her ring size and style preference</li>
          <li>Have a plan for your future together</li>
        </ul>
        
        <h4>The Proposal</h4>
        <ul>
          <li><strong>Private vs Public:</strong> Know her personality. Some want a flash mob, others want intimacy.</li>
          <li><strong>Meaningful location:</strong> Where you first met, first date, or a dream destination</li>
          <li><strong>Keep it simple:</strong> Fancy words aren't needed. Sincerity is.</li>
          <li><strong>Have a photographer:</strong> Capture the moment</li>
        </ul>
        
        <h4>The Words</h4>
        <p>"I can't imagine my life without you. You've made me a better person. Will you marry me?"</p>
        <p>Short. Sincere. From the heart. That's all you need.</p>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Know the answer before you ask</li>
          <li>Make it about her, not the show</li>
          <li>Simple and sincere beats fancy</li>
          <li>The moment matters, not the ring size</li>
        </ul>
      `,
      quiz: [
        { q: 'Should you know the answer before proposing?', options: ['No', 'Yes', 'Maybe', 'Surprise is better'], correct: 1 },
        { q: 'What beats fancy words?', options: ['Money', 'Sincerity', 'Friends', 'Location'], correct: 1 }
      ],
      coachTip: 'The best proposals aren't about the ring or the location. They're about the person looking into your eyes and knowing, without doubt, that you're home.'
    },
    {
      day: 28,
      phase: 4,
      title: 'Phase 4 Boss Battle',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '15 min',
      content: `
        <h3>⚔️ The Relationship Simulation</h3>
        <p>Your final Phase 4 exam. Simulate a serious relationship conversation covering all advanced topics.</p>
        
        <h4>Scoring Criteria</h4>
        <ul>
          <li><strong>Commitment talk (25%):</strong> Direct but not demanding</li>
          <li><strong>Family handling (20%):</strong> Respectful, confident</li>
          <li><strong>Conflict resolution (25%):</strong> Fair fighting, repair attempts</li>
          <li><strong>Long-term vision (20%):</strong> Shared goals, alignment</li>
          <li><strong>Red flag awareness (10%):</strong> Know when to walk</li>
        </ul>
        
        <h3>🏆 Phase 4 Rewards</h3>
        <ul>
          <li>Complete all 7 days → Bonus Days unlocked</li>
          <li>Score 90%+ → Bonus 300 XP</li>
          <li>Perfect score → "Relationship Master" badge</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Relationships require maintenance</li>
          <li>Communication is everything</li>
          <li>Know your worth and your boundaries</li>
        </ul>
      `,
      quiz: [
        { q: 'What is the most important relationship skill?', options: ['Money', 'Communication', 'Looks', 'Status'], correct: 1 },
        { q: 'What percentage is conflict resolution worth?', options: ['10%', '20%', '25%', '30%'], correct: 2 }
      ],
      coachTip: 'You've completed Phase 4. You now have the skills to build, maintain, and protect a healthy relationship. The bonus days are your victory lap.'
    },
    
    // BONUS DAYS (29-30) — PRO
    {
      day: 29,
      phase: 5,
      title: 'Voice Call Practice',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '20 min',
      content: `
        <h3>🎙️ Your Voice is Your Weapon</h3>
        <p>Texting is easy. Voice calls show who you really are. Your tone, pace, and energy convey more than words ever could.</p>
        
        <h4>Voice Call Tips</h4>
        <ul>
          <li><strong>Smile while talking:</strong> It changes your tone</li>
          <li><strong>Slow down:</strong> Nervous people talk fast</li>
          <li><strong>Use pauses:</strong> Creates suspense and confidence</li>
          <li><strong>Match her energy:</strong> If she's calm, don't be hyper</li>
          <li><strong>Have topics ready:</strong> 3 stories, 2 questions</li>
        </ul>
        
        <h4>Practice Exercise</h4>
        <p>Record yourself talking for 2 minutes. Listen back. Notice:</p>
        <ul>
          <li>Do you say "um" or "like" too much?</li>
          <li>Is your voice monotone?</li>
          <li>Do you sound confident or apologetic?</li>
          <li>Are you breathing properly?</li>
        </ul>
        
        <h3>💡 Key Takeaways</h3>
        <ul>
          <li>Voice calls build deeper connection than text</li>
          <li>Your tone conveys more than words</li>
          <li>Practice makes natural</li>
          <li>Record yourself to improve</li>
        </ul>
      `,
      quiz: [
        { q: 'What should you do while talking on call?', options: ['Frown', 'Smile', 'Pace', 'Eat'], correct: 1 },
        { q: 'Why record yourself?', options: ['To post online', 'To improve', 'To show friends', 'To remember'], correct: 1 }
      ],
      coachTip: 'Your voice is the closest thing to physical presence. Make it warm, make it confident, make it yours.'
    },
    {
      day: 30,
      phase: 5,
      title: 'Graduation & Next Steps',
      isFree: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '15 min',
      content: `
        <h3>🎓 You Made It</h3>
        <p>30 days. 30 lessons. Countless practice sessions. You've completed what most people never start.</p>
        
        <h4>What You've Learned</h4>
        <ul>
          <li>How to start conversations that get replies</li>
          <li>How to read signals and avoid red flags</li>
          <li>How to plan and execute great dates</li>
          <li>How to build deep emotional connection</li>
          <li>How to handle conflict and maintain relationships</li>
          <li>How to know your worth and walk away when needed</li>
        </ul>
        
        <h4>Your Next Steps</h4>
        <ul>
          <li><strong>Practice:</strong> Use the chat scenarios weekly</li>
          <li><strong>Reflect:</strong> Journal your dating experiences</li>
          <li><strong>Community:</strong> Join our Discord for ongoing support</li>
          <li><strong>Coaching:</strong> Book a 1-on-1 session for personalized guidance</li>
          <li><strong>Give back:</strong> Help others who are where you were</li>
        </ul>
        
        <h4>Final Words</h4>
        <p>Dating is a skill. Like any skill, it gets better with practice. But remember — the goal isn't to date everyone. The goal is to find someone who makes you want to stop dating.</p>
        <p>You've got the tools. Now go build something real.</p>
        
        <h3>🏆 Final Rewards</h3>
        <ul>
          <li>"Graduate" badge unlocked</li>
          <li>Certificate of completion</li>
          <li>500 bonus XP</li>
          <li>Lifetime access to all content</li>
        </ul>
      `,
      quiz: [
        { q: 'What is dating?', options: ['Luck', 'A skill', 'Magic', 'Fate'], correct: 1 },
        { q: 'What is the ultimate goal?', options: ['Date everyone', 'Find the right person', 'Get married', 'Have fun'], correct: 1 }
      ],
      coachTip: 'The fact that you completed this course puts you ahead of 95% of people. Most talk about change. You did the work. Now go live it.'
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
