// js/config.js — Ek jagah sab config

const CONFIG = {
  SUPABASE_URL: 'https://xzdjxvitqktsfeuzshik.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_zCeAZp1ZBclQ_tsgDbBVyQ_jHyTCIoW',
  CHAT_API_ENDPOINT: '/api/chat',

  PLANS: {
    free: { name: 'Free', price: 0, msgBeforeCooldown: 10, cooldownMinutes: 5, scenarios: ['first_date','texting','rejection'], courseWeeks: 1, courseDays: 7 },
    starter: { name: 'Starter', price: 99, yearlyPrice: 999, msgBeforeCooldown: 9999, cooldownMinutes: 0, scenarios: ['first_date','texting','rejection','flirting','arranged','second_date'], courseWeeks: 4, courseDays: 28 },
    pro: { name: 'Pro', price: 0, msgBeforeCooldown: 9999, cooldownMinutes: 0, scenarios: ['first_date','texting','rejection','flirting','arranged','second_date'], courseWeeks: 4, courseDays: 30 },
  },

  GENDER: {
    default: 'female',
    options: [
      { value: 'female', label: '👩 Female AI', desc: 'Practice with female personas' },
      { value: 'male', label: '👨 Male AI', desc: 'Practice with male personas' },
    ]
  },

  COURSE: {
    title: '30-Day Dating Mastery',
    subtitle: 'From awkward to confident — structured daily lessons',
    totalDays: 28,
    freeDays: 7,
    phases: [
      {
        id: 'foundation', name: 'Phase 1: Foundation', emoji: '🌱', week: 1, free: true,
        description: 'Build your base — confidence, first messages, reading signals',
        lessons: [
          { day: 1, title: "Why You're Getting Ignored", emoji: '🚫', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Why You Are Getting Ignored</h2><p class="intro">Before we fix your dating game, we need to understand why you are invisible right now. Most Indian guys make the same 5 mistakes.</p><h3>The 5 Silent Killers</h3><div class="content-card"><span class="num">1</span><div><strong>Being Too Available</strong><p>Replying within seconds, always free, always eager. This screams desperation.</p><div class="ex"><span class="bad">Wrong:</span> "Haan main free hoon, kab bhi chalega!"<span class="good">Right:</span> "Thursday evening works. Looking forward to it"</div></div></div><div class="content-card"><span class="num">2</span><div><strong>Boring Openers</strong><p>"Hi", "Hello" — conversation killers. She gets 50 of these a day.</p><div class="ex"><span class="bad">Wrong:</span> "Hi, how are you?"<span class="good">Right:</span> "Your bio says you love chai — team masala or team adrak?"</div></div></div><div class="content-card"><span class="num">3</span><div><strong>Over-Texting</strong><p>Sending 5 messages before she replies once. Quality over Quantity.</p></div></div><div class="content-card"><span class="num">4</span><div><strong>No Clear Intent</strong><p>Talking for weeks without asking her out. She thinks you are scared.</p></div></div><div class="content-card"><span class="num">5</span><div><strong>Poor Profile</strong><p>Blurry photos, empty bio. First impression happens before you speak.</p></div></div><h3>First Impression Psychology</h3><p>People form first impressions in <strong>7 seconds</strong>. In dating apps: <strong>0.5s</strong> for photo, <strong>3s</strong> for bio.</p><ul><li><strong>Photo:</strong> Clear face, genuine smile, good lighting</li><li><strong>Bio:</strong> One interesting fact + one question</li><li><strong>First message:</strong> Reference something specific from her profile</li></ul><h3>What Actually Matters</h3><div class="tip"><strong>Confidence (not arrogance)</strong> — Knowing your worth</div><div class="tip"><strong>Emotional Intelligence</strong> — Reading the room</div><div class="tip"><strong>Authenticity</strong> — Being genuinely interested</div><div class="tip"><strong>Respect + Boundaries</strong> — Most attractive in Indian context</div><h3>Today's Action</h3><div class="action"><strong>Self-Audit:</strong><ol><li>Check your dating profile — would YOU swipe right?</li><li>Look at last 10 messages — over-texting?</li><li>Asked someone out in last 2 weeks?</li><li>Rate confidence 1-10 honestly</li></ol></div></div>`,
            keyTakeaways: ['5 silent killers','First impression psychology','What actually matters'],
            task: 'Self-audit quiz' },
          { day: 2, title: 'The Confidence DNA', emoji: '💪', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>The Confidence DNA</h2><p class="intro">Confidence is not born — it is built. In Indian dating, it is your biggest differentiator.</p><h3>Inner vs Outer Game</h3><div class="two-col"><div><h4>Inner Game (80%)</h4><ul><li>Self-esteem and self-worth</li><li>Not needing validation</li><li>Comfortable with rejection</li><li>Knowing you are enough</li></ul></div><div><h4>Outer Game (20%)</h4><ul><li>Body language</li><li>Voice tone</li><li>Dressing well</li><li>Conversation skills</li></ul></div></div><p><strong>Key insight:</strong> Most guys focus 100% on outer game and ignore inner game. That is why they fail.</p><h3>Body Language Basics</h3><div class="content-card"><span class="num">1</span><div><strong>Posture</strong><p>Shoulders back, chin up. Slouching = low confidence.</p></div></div><div class="content-card"><span class="num">2</span><div><strong>Eye Contact</strong><p>60-70% during conversation. Not staring, not avoiding.</p></div></div><div class="content-card"><span class="num">3</span><div><strong>Hand Gestures</strong><p>Open palms. No crossed arms. No phone fidgeting.</p></div></div><h3>Self-Esteem Hacks</h3><div class="tip"><strong>Mirror Exercise:</strong> Every morning, say 3 things you like about yourself.</div><div class="tip"><strong>Small Wins:</strong> Build confidence through daily achievements.</div><div class="tip"><strong>Rejection Reframe:</strong> "She said no" = "She was not the right match."</div><div class="tip"><strong>Abundance Mindset:</strong> 1.4 billion people in India. One no does not define you.</div><h3>Today's Action</h3><div class="action"><strong>Mirror Exercise:</strong><ol><li>Stand in front of mirror</li><li>Fix posture — shoulders back, chin up</li><li>Look yourself in the eyes</li><li>Say: "I am worthy of love and respect"</li><li>Say 3 things you are proud of</li></ol></div></div>`,
            keyTakeaways: ['Inner vs Outer game','Body language basics','Self-esteem hacks'],
            task: 'Mirror exercise' },
          { day: 3, title: 'First Message Formula', emoji: '💬', xp: 50, duration: '7 min', videoUrl: '',
            content: `<div class="course-reader"><h2>First Message Formula</h2><p class="intro">The first message is everything. Get it right, and you are in. Here is the formula.</p><h3>The HQP Formula</h3><div class="formula"><div class="f-part"><span class="f-letter">H</span><div><strong>Hook</strong><p>Something specific from her profile</p></div></div><span class="f-plus">+</span><div class="f-part"><span class="f-letter">Q</span><div><strong>Question</strong><p>Open-ended, she wants to answer</p></div></div><span class="f-plus">+</span><div class="f-part"><span class="f-letter">P</span><div><strong>Personality</strong><p>Hint of YOUR humor or insight</p></div></div></div><h3>3 Proven Templates</h3><div class="template"><strong>Template 1: Opinion Ask</strong><p>"I see you are a chai person. Important question: masala chai ya adrak wali? This will determine our entire compatibility"</p><span class="why">Playful + specific + humor</span></div><div class="template"><strong>Template 2: The Observation</strong><p>"Okay so your Goa photo — before or after the feni? Tell me the real story!"</p><span class="why">Shows you looked + humor + story ask</span></div><div class="template"><strong>Template 3: Bold Statement</strong><p>"I am going to be honest — your bio made me laugh. 'Professional overthinker' — relatable. What is your most recent overthinking session about?"</p><span class="why">Compliment + vulnerability + question</span></div><h3>Common Mistakes</h3><div class="mistake">"Hi/Hello" — Boring, zero effort</div><div class="mistake">"You are beautiful" — She knows. Be different.</div><div class="mistake">Copy-paste to everyone — Girls can tell</div><div class="mistake">Too long — Keep under 2 sentences</div><div class="mistake">Asking for number immediately — Build rapport first</div><h3>Today's Action</h3><div class="action"><strong>Write 3 Opening Lines:</strong><ol><li>Pick 3 profiles</li><li>Find something specific in each</li><li>Write HQP message for each</li><li>Send the best one</li></ol></div></div>`,
            keyTakeaways: ['Hook + Question + Personality','3 proven templates','Common mistakes'],
            task: 'Write 3 opening lines' },
          { day: 4, title: 'Reading Her Signals', emoji: '📡', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Reading Her Signals</h2><p class="intro">Most guys miss signals or misread friendliness as interest. Let us fix both.</p><h3>Green Flags (Interested)</h3><div class="signal green"><span class="icon">✅</span><div><strong>She asks YOU questions</strong><p>If she asks about your life, she is invested. Girls do not waste time.</p></div></div><div class="signal green"><span class="icon">✅</span><div><strong>Fast replies + long messages</strong><p>Minutes + detailed = good. Short + delayed = low interest.</p></div></div><div class="signal green"><span class="icon">✅</span><div><strong>Uses emojis and exclamation marks</strong><p>"Haha!" = good. "hmm" and "ok" = not.</p></div></div><div class="signal green"><span class="icon">✅</span><div><strong>Suggests meeting up</strong><p>The holy grail. If she suggests a place — very interested.</p></div></div><h3>Red Flags (Not Interested)</h3><div class="signal red"><span class="icon">❌</span><div><strong>One-word replies consistently</strong><p>"K", "hmm", "ok" — polite, not interested. Do not chase.</p></div></div><div class="signal red"><span class="icon">❌</span><div><strong>Takes hours/days to reply</strong><p>Everyone is on their phone. If she wanted to talk, she would.</p></div></div><div class="signal red"><span class="icon">❌</span><div><strong>Never asks about you</strong><p>Using you for attention. Move on.</p></div></div><div class="signal red"><span class="icon">❌</span><div><strong>Always "busy" when asked out</strong><p>Once = fine. Three times = not interested.</p></div></div><h3>Push vs Pull Back</h3><div class="tip"><strong>Push:</strong> Green flags, conversation flowing</div><div class="tip"><strong>Pull back:</strong> Red flags, she is distant</div><div class="tip"><strong>Golden rule:</strong> Match her energy. Never give 100% to someone giving 20%.</div><h3>Today's Action</h3><div class="action"><strong>Signal Quiz:</strong><ol><li>Look at last 5 conversations</li><li>Count green vs red flags</li><li>Be honest — how many are interested?</li><li>Stop chasing red flags. Ask out green flags.</li></ol></div></div>`,
            keyTakeaways: ['Green flags','Red flags','When to push/pull'],
            task: 'Signal identification quiz' },
          { day: 5, title: 'The Art of Banter', emoji: '🎭', xp: 50, duration: '8 min', videoUrl: '',
            content: `<div class="course-reader"><h2>The Art of Banter</h2><p class="intro">Banter is the difference between "he is nice" and "he is interesting." It is the fastest way to build attraction.</p><h3>Teasing Without Offending</h3><p>Make fun of something she CHOSE, not something she IS.</p><div class="ex"><span class="good">Good:</span> "You chose pineapple on pizza? I am not sure I can trust your life decisions anymore"</div><div class="ex"><span class="bad">Bad:</span> "Your nose is kinda big, haha"</div><p><strong>Rule:</strong> If she cannot change it in 5 minutes, do not tease her about it.</p><h3>Playful Comebacks</h3><div class="template"><strong>Agree & Amplify</strong><p>Her: "You are such a flirt"<br>You: "Guilty. But only on Tuesdays. And Thursdays. And most Saturdays"</p></div><div class="template"><strong>The Challenge</strong><p>Her: "I bet you say this to all girls"<br>You: "Only the ones who can keep up. So far, you are doing okay"</p></div><h3>Indian Context Banter</h3><div class="tip">"So you are the rebellious child who chose love marriage?"</div><div class="tip">"Team dosa or team idli? This is a dealbreaker."</div><div class="tip">"On a scale of Rahul to Raj, how dramatic are you?"</div><h3>Today's Action</h3><div class="action"><strong>Practice:</strong><ol><li>Go to Practice tab → Flirting Practice</li><li>Try 3 teasing lines</li><li>Notice reactions</li><li>Adjust based on feedback</li></ol></div></div>`,
            keyTakeaways: ['Teasing without offending','Playful comebacks','Indian context'],
            task: 'AI roleplay practice' },
          { day: 6, title: 'From Text to Date', emoji: '📅', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>From Text to Date</h2><p class="intro">The whole point of texting is to meet. If you text for weeks without meeting, you are doing it wrong.</p><h3>The Perfect Script</h3><div class="template"><strong>Step 1:</strong> Build rapport (5-10 messages)<br>Get her laughing, find common interests.</div><div class="template"><strong>Step 2:</strong> Transition smoothly<br>"This is fun, but I feel like we would have better conversations over chai"</div><div class="template"><strong>Step 3:</strong> Be specific<br>"There is this amazing chai place in Bandra — how is Thursday 6 PM?"</div><div class="template"><strong>Step 4:</strong> If "maybe"<br>"No pressure — if Thursday does not work, suggest a time that does"</div><h3>Timing Matters</h3><div class="tip"><strong>Best time:</strong> When conversation is at peak — she is laughing, engaged.</div><div class="tip"><strong>Worst time:</strong> First message, or when she is dry.</div><div class="tip"><strong>3-day rule is dead:</strong> Ask within 1-2 days. Waiting = she loses interest.</div><h3>Handling "Maybe"</h3><ol><li><strong>Actually busy</strong> — Give 1-2 alternatives</li><li><strong>Not sure yet</strong> — Build more rapport, ask again in 2-3 days</li><li><strong>Not interested</strong> — If no alternatives suggested, move on</li></ol><h3>Today's Action</h3><div class="action"><strong>Script Practice:</strong><ol><li>Pick someone you have been texting</li><li>Draft ask-out message (place + time + day)</li><li>Send it TODAY</li></ol></div></div>`,
            keyTakeaways: ['Asking out scripts','Timing matters','Handling maybe'],
            task: 'Script practice' },
          { day: 7, title: 'Week 1 Boss Battle', emoji: '⚔️', xp: 100, duration: '10 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Week 1 Boss Battle</h2><p class="intro">Time to put everything into practice. Full simulation with Vibe Score.</p><h3>Tested On</h3><div class="checklist"><div class="check-item">✅ Confidence level</div><div class="check-item">✅ Opening message quality</div><div class="check-item">✅ Reading signals</div><div class="check-item">✅ Banter and wit</div><div class="check-item">✅ Asking her out smoothly</div></div><h3>Scoring</h3><div class="score"><span class="badge gold">8-10</span> Week 1 Master — Ready for Phase 2!</div><div class="score"><span class="badge silver">5-7</span> Good progress — Review weak areas</div><div class="score"><span class="badge bronze">0-4</span> Keep practicing — Redo Week 1</div><h3>Start Simulation</h3><p>Go to Practice tab → First Date scenario. Treat it like real. AI gives live feedback.</p><div class="tip"><strong>Tip:</strong> Do not overthink. Be the BEST version of yourself. Confidence + humor + respect = winning combo.</div></div>`,
            keyTakeaways: ['Full simulation','AI judges progress','Vibe Score'],
            task: 'Complete simulation' },
        ]
      },
      {
        id: 'first_date', name: 'Phase 2: First Date Mastery', emoji: '☕', week: 2, free: false,
        description: 'Win the first date — venue, conversation, body language',
        lessons: [
          { day: 8, title: 'Date Planning 101', emoji: '☕', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Date Planning 101</h2><p class="intro">The date starts before you meet. Where you go, what you wear, how you plan — it all matters.</p><h3>Venue Hierarchy</h3><div class="venue tier1"><strong>TIER 1: Coffee/Tea Date</strong><p>Best for first dates. Low pressure, easy exit. 200-400 rupees.</p><span>Starbucks, local chai tapri, cute bakery</span></div><div class="venue tier2"><strong>TIER 2: Activity Date</strong><p>Good for second dates. Shared experiences build bonds.</p><span>Bowling, pottery class, evening walk</span></div><div class="venue tier3"><strong>TIER 3: Dinner Date</strong><p>Save for later. Too formal, too long for first date.</p></div><h3>Timing & Backup</h3><div class="tip"><strong>Best time:</strong> Evening 5-7 PM. Not too early, not too late.</div><div class="tip"><strong>Duration:</strong> 45-60 minutes. Short and sweet.</div><div class="tip"><strong>Backup:</strong> Always have Plan B ready.</div><h3>Dress Code</h3><div class="two-col"><div><strong>DO:</strong><ul><li>Clean, ironed clothes</li><li>Well-fitted</li><li>Subtle cologne (1-2 sprays)</li><li>Clean shoes</li><li>Fresh haircut</li></ul></div><div><strong>DO NOT:</strong><ul><li>Strong deodorant</li><li>Flip-flops</li><li>Oversized clothes</li><li>Too much jewelry</li></ul></div></div><h3>Today's Action</h3><div class="action"><strong>Plan a Date:</strong><ol><li>Pick Tier 1 venue</li><li>Choose day and time</li><li>Plan outfit</li><li>Have backup ready</li><li>Text her with specifics</li></ol></div></div>`,
            keyTakeaways: ['Coffee over Dinner','Timing & backup','Dress code'],
            task: 'Plan a date' },
          { day: 9, title: 'Conversation Depth', emoji: '🗣️', xp: 50, duration: '7 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Conversation Depth</h2><p class="intro">Small talk kills dates. Deep conversation creates connection. Here is how to go beyond "So, what do you do?"</p><h3>The FORD Method</h3><div class="ford"><span class="letter">F</span><div><strong>Family</strong><p>"What is your family like?" "Who are you closest to?"</p></div></div><div class="ford"><span class="letter">O</span><div><strong>Occupation</strong><p>"What do you love about your job?" "If you could do anything?"</p></div></div><div class="ford"><span class="letter">R</span><div><strong>Recreation</strong><p>"What do you do for fun?" "Last thing that made you laugh?"</p></div></div><div class="ford"><span class="letter">D</span><div><strong>Dreams</strong><p>"Where in 5 years?" "What is on your bucket list?"</p></div></div><h3>Beyond Small Talk</h3><div class="template"><strong>Instead of "What do you do?"</strong><p>"What made you choose your career? Passion or practicality?"</p></div><div class="template"><strong>Instead of "Where are you from?"</strong><p>"What is one thing about your hometown no one else understands?"</p></div><h3>Deep Questions</h3><div class="q-list"><div>"What are you proud of that you never get to talk about?"</div><div>"Belief you had as a kid that was wrong?"</div><div>"Advice to your 18-year-old self?"</div><div>"Most spontaneous thing you have done?"</div><div>"What does your perfect day look like?"</div></div><h3>Today's Action</h3><div class="action"><strong>Practice FORD:</strong><ol><li>Pick someone you know</li><li>Ask a deep question</li><li>Notice conversation change</li><li>Practice active listening</li></ol></div></div>`,
            keyTakeaways: ['FORD method','Beyond small talk','Deep questions'],
            task: 'Practice FORD' },
          { day: 10, title: 'Body Language Secrets', emoji: '🕺', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Body Language Secrets</h2><p class="intro">93% of communication is non-verbal. Master this.</p><h3>Eye Contact</h3><div class="tip"><strong>60-70% Rule:</strong> More = creepy. Less = disinterested.</div><div class="tip"><strong>Triangle Technique:</strong> Left eye → right eye → mouth → repeat.</div><h3>Open Posture</h3><div class="two-col"><div><strong>Open:</strong><ul><li>Arms uncrossed</li><li>Lean slightly forward</li><li>Feet pointing toward her</li><li>Hands visible</li></ul></div><div><strong>Closed:</strong><ul><li>Arms crossed</li><li>Leaning back</li><li>Feet pointing away</li><li>Hands hidden</li></ul></div></div><h3>Touch Escalation (India)</h3><div class="touch"><span>1</span><div><strong>Handshake</strong><p>Firm, 2-3 seconds</p></div></div><div class="touch"><span>2</span><div><strong>Light arm touch</strong><p>When laughing. Brief, natural.</p></div></div><div class="touch"><span>3</span><div><strong>High-five</strong><p>When she says something cool.</p></div></div><div class="touch"><span>4</span><div><strong>Hug goodbye</strong><p>Only if date went well. Ask: "Hug?"</p></div></div><div class="warn"><strong>Important:</strong> Read her comfort. If she pulls back, respect immediately. Consent is everything.</div><h3>Today's Action</h3><div class="action"><strong>Body Language Audit:</strong><ol><li>Record yourself or practice in mirror</li><li>Check posture, eye contact, hands</li><li>Identify 2 things to improve</li></ol></div></div>`,
            keyTakeaways: ['60% eye contact','Open posture','Touch escalation'],
            task: 'Body language audit' },
          { day: 11, title: 'Handling Awkward Moments', emoji: '😅', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Handling Awkward Moments</h2><p class="intro">Awkward moments happen. Turn cringe into charm.</p><h3>Silence Recovery</h3><div class="template"><strong>The Observation:</strong><p>"I am actually enjoying this comfortable silence. Most people fill every second with talking."</p></div><div class="template"><strong>The Pivot:</strong><p>"Okay, random question — dinner with any historical figure, who?"</p></div><h3>Spill Solution</h3><div class="tip">Laugh it off: "Well, that is one way to make an impression."</div><div class="tip">Take charge: Call waiter, help clean up.</div><div class="tip">Make it about her: "Are you okay? Did any get on you?"</div><h3>Topic Recovery</h3><div class="template">"That came out wrong. Let me try again..."</div><div class="template">"Okay, that was awkward even for me. Let us talk about something else."</div><h3>Today's Action</h3><div class="action"><strong>Practice:</strong><ol><li>Go to Practice → First Date</li><li>Handle awkward silences</li><li>Try recovery lines</li><li>Notice confidence vs. panic</li></ol></div></div>`,
            keyTakeaways: ['Silence recovery','Spill solutions','Topic recovery'],
            task: 'Awkward scenario practice' },
          { day: 12, title: 'The Perfect Exit', emoji: '👋', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>The Perfect Exit</h2><p class="intro">How you end is as important as how you start. Leave her wanting more.</p><h3>When to Leave</h3><div class="tip"><strong>Leave on a high note.</strong> "I should get going, but I had a great time."</div><div class="tip"><strong>45-60 minute rule.</strong> Short and sweet for first dates.</div><h3>Hug vs Handshake</h3><div class="exit"><strong>Handshake</strong><p>Safe, respectful. Good vibe but not amazing.</p></div><div class="exit"><strong>Hug</strong><p>Warm, shows interest. Date went really well. Ask: "Hug?"</p></div><div class="exit"><strong>Nothing</strong><p>Date was bad. Simple "Nice meeting you" is enough.</p></div><h3>Next Date Setup</h3><div class="template"><strong>Went well:</strong><p>"I had a really good time. Let us do this again — that place you mentioned? I will text you."</p></div><h3>Today's Action</h3><div class="action"><strong>Exit Practice:</strong><ol><li>Practice exit line in mirror</li><li>Plan 2 scenarios (good vs. okay)</li><li>Roleplay with friend if possible</li></ol></div></div>`,
            keyTakeaways: ['When to leave','Hug vs handshake','Next date setup'],
            task: 'Exit script practice' },
          { day: 13, title: 'Post-Date Text Game', emoji: '📱', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Post-Date Text Game</h2><p class="intro">The text after first date can make or break second date chances.</p><h3>Timing</h3><div class="tip"><strong>Same night (2-3 hours):</strong> If date went REALLY well.</div><div class="tip"><strong>Next day:</strong> Sweet spot. Shows interest, not obsession.</div><div class="tip"><strong>Never 3+ days:</strong> Game-playing. She will think you are not interested.</div><h3>What to Say</h3><div class="template"><strong>Went well:</strong><p>"Had a great time today. You are even more fun in person. Let us do it again soon."</p></div><div class="template"><strong>Playful:</strong><p>"Okay, I admit it — your chai recommendation was good. When are we going for round 2?"</p></div><h3>What NOT to Say</h3><div class="mistake">"I love you" — Too soon.</div><div class="mistake">"When can I see you again?" — Sounds desperate.</div><div class="mistake">Double texting if no reply — Wait 24 hours.</div><h3>Today's Action</h3><div class="action"><strong>Write Follow-up:</strong><ol><li>Think of last date</li><li>Write follow-up using template</li><li>Keep under 2 sentences</li><li>Send it</li></ol></div></div>`,
            keyTakeaways: ['Follow-up timing','What to say','What NOT to say'],
            task: 'Write follow-up text' },
          { day: 14, title: 'Week 2 Boss Battle', emoji: '⚔️', xp: 100, duration: '12 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Week 2 Boss Battle</h2><p class="intro">Full date simulation. Testing everything: planning, conversation, body language, awkward moments, exit.</p><h3>Tested On</h3><div class="checklist"><div class="check-item">✅ Date planning</div><div class="check-item">✅ Conversation depth (FORD)</div><div class="check-item">✅ Body language</div><div class="check-item">✅ Awkward moments</div><div class="check-item">✅ Perfect exit</div><div class="check-item">✅ Post-date text</div></div><h3>Scoring</h3><div class="score"><span class="badge gold">8-10</span> Date Master — Ready for Phase 3!</div><div class="score"><span class="badge silver">5-7</span> Good progress — Review weak areas</div><div class="score"><span class="badge bronze">0-4</span> Keep practicing — Redo Week 2</div><h3>Start Simulation</h3><p>Go to Practice → Second Date with Megha. More comfortable, deeper, stronger connection.</p></div>`,
            keyTakeaways: ['Full date simulation','Real-time feedback','Score breakdown'],
            task: 'Complete simulation' },
        ]
      },
      {
        id: 'connection', name: 'Phase 3: Connection Building', emoji: '💫', week: 3, free: false,
        description: 'Deepen the bond — emotional intelligence, attraction, trust',
        lessons: [
          { day: 15, title: 'Second Date Strategy', emoji: '💫', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Second Date Strategy</h2><p class="intro">First date was the interview. Second date is where you show who you really are.</p><h3>Goals</h3><div class="goal-box"><div class="goal-item">✅ Go deeper than small talk</div><div class="goal-item">✅ Show vulnerability</div><div class="goal-item">✅ Create shared experiences</div><div class="goal-item">✅ Build physical comfort</div><div class="goal-item">✅ Leave her thinking about you</div></div><h3>Better Venues</h3><div class="venue"><strong>Activity dates</strong> — Pottery, cooking class. Shared experiences create bonds.</div><div class="venue"><strong>Walk + food</strong> — Marine Drive walk, street food. Casual but intimate.</div><h3>Conversation Shift</h3><div class="template">"What is something you are really passionate about? You could talk for hours?"</div><div class="template">"What is a dream you have not told many people about?"</div><h3>Today's Action</h3><div class="action"><strong>Plan Date 2:</strong><ol><li>Pick activity-based venue</li><li>Plan 3 deep topics</li><li>Think about shared memory</li></ol></div></div>`,
            keyTakeaways: ['Deeper connection','Vulnerability','Comfort zone'],
            task: 'Plan date 2' },
          { day: 16, title: 'Emotional Intelligence', emoji: '🧠', xp: 50, duration: '7 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Emotional Intelligence</h2><p class="intro">EQ is the #1 predictor of relationship success. More than looks, money, or status.</p><h3>Empathy</h3><div class="template">Her: "My boss was unfair today..."<br>Wrong: "You should talk to HR."<br>Right: "That sounds frustrating. How did you handle it?"</div><div class="tip"><strong>Rule:</strong> Women want to be HEARD, not fixed. Listen first.</div><h3>Validation</h3><div class="template">"That makes total sense. I can see why you would feel that way."</div><h3>Active Listening</h3><div class="tip"><strong>1.</strong> Full attention — phone away, look at her, nod.</div><div class="tip"><strong>2.</strong> Reflect back — "So what you are saying is..."</div><div class="tip"><strong>3.</strong> Ask follow-ups — "How did that make you feel?"</div><h3>Today's Action</h3><div class="action"><strong>Listening Exercise:</strong><ol><li>Have a conversation today</li><li>Do not interrupt. Do not fix.</li><li>Just listen and reflect back</li><li>Notice the change</li></ol></div></div>`,
            keyTakeaways: ['Empathy','Validation','Active listening'],
            task: 'Listening exercise' },
          { day: 17, title: 'Rejection Mastery', emoji: '🛡️', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Rejection Mastery</h2><p class="intro">Rejection is not the opposite of success — it is part of success. Every "no" gets you closer to the right "yes."</p><h3>Graceful Exit</h3><div class="template"><strong>Respectful:</strong><p>"I appreciate your honesty. It takes courage. I hope you find what you are looking for."</p></div><div class="template"><strong>Confident:</strong><p>"No worries at all. I enjoyed getting to know you. Take care!"</p></div><div class="tip"><strong>Never:</strong> Beg, argue, ask "why," or try to change her mind.</div><h3>Self-Respect</h3><div class="tip">Your worth is not determined by one person's opinion.</div><div class="tip">Do not take it personally. She might have her own issues.</div><h3>Bounce Back</h3><div class="tip"><strong>1.</strong> Feel it for 5 minutes. Set a timer.</div><div class="tip"><strong>2.</strong> Do something for yourself. Gym, hobby, friends.</div><div class="tip"><strong>3.</strong> Get back out there. Meet new people.</div><h3>Today's Action</h3><div class="action"><strong>Rejection Simulation:</strong><ol><li>Go to Practice → Handle Rejection</li><li>Practice graceful responses</li><li>Notice maturity vs. desperation</li></ol></div></div>`,
            keyTakeaways: ['Graceful exit','Self-respect','Bounce back'],
            task: 'Rejection simulation' },
          { day: 18, title: 'Tests & Shit Tests', emoji: '🧪', xp: 50, duration: '8 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Tests and Shit Tests</h2><p class="intro">Women test men. It is evolutionary. She wants to know if you are the real deal.</p><h3>Common Tests</h3><div class="test"><strong>"Do you say this to all girls?"</strong><p>Wrong: "No, only you!" (desperate)<br>Right: "Only the ones who can keep up. So far, you are doing okay"</p></div><div class="test"><strong>"You are not my type"</strong><p>Wrong: "But I can change!" (pathetic)<br>Right: "That is fair. What is your type, by the way?"</p></div><div class="test"><strong>"I have a boyfriend"</strong><p>Wrong: "Oh... okay..." (defeated)<br>Right: "Lucky guy. If things change, you know where to find me."</p></div><h3>Stay Calm</h3><div class="tip">Do not get defensive. Do not get angry. Treat it like a game.</div><div class="tip">Agree and amplify: "You are right, I am terrible. Probably the worst person you have ever met." (with a smile)</div><h3>Today's Action</h3><div class="action"><strong>Practice:</strong><ol><li>Go to Practice → Flirting Practice</li><li>When Rhea tests you, use techniques above</li><li>Stay calm, be playful</li></ol></div></div>`,
            keyTakeaways: ['Identify tests','Perfect replies','Stay calm'],
            task: 'Test response practice' },
          { day: 19, title: 'Attraction Science', emoji: '⚡', xp: 50, duration: '7 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Attraction Science</h2><p class="intro">Attraction is psychology, not magic. Understand it, create it intentionally.</p><h3>Mystery</h3><div class="tip">Do not reveal everything. "I will tell you that story on our third date."</div><div class="tip">Be slightly unpredictable. Not unreliable — just not boring.</div><h3>Challenge</h3><div class="tip">Do not be too easy. If she knows she has you 100%, chase is over.</div><div class="tip">Have standards: "I am looking for someone who is [quality]. Are you that person?"</div><h3>Value Demonstration</h3><div class="tip">Show, do not tell. Do not say "I am funny." Be funny.</div><div class="tip">Passion is attractive. Talk about what you love with energy.</div><h3>Today's Action</h3><div class="action"><strong>Attraction Audit:</strong><ol><li>Rate yourself 1-10 on: Mystery, Challenge, Value</li><li>Identify weakest area</li><li>Set goal to improve it this week</li></ol></div></div>`,
            keyTakeaways: ['Mystery','Challenge','Value demonstration'],
            task: 'Attraction audit' },
          { day: 20, title: 'The Ex Conversation', emoji: '💔', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>The Ex Conversation</h2><p class="intro">The ex talk is a minefield. One wrong step, and you blow up the date.</p><h3>When to Discuss</h3><div class="tip">Never on first date. Too heavy. Save for date 3+.</div><div class="tip">Only if she asks. Do not bring it up yourself.</div><h3>Safe Script</h3><div class="template">"We dated for [time]. It did not work out because [neutral reason]. I learned [one thing]. But honestly, I am more interested in getting to know YOU."</div><div class="tip">Never trash talk your ex, blame them, or show you are not over them.</div><h3>Red Flags</h3><div class="warn">She talks about ex too much = not over them. Proceed with caution.</div><h3>Today's Action</h3><div class="action"><strong>Script Practice:</strong><ol><li>Write your "ex talk" script</li><li>Practice saying it naturally</li><li>Keep under 30 seconds</li></ol></div></div>`,
            keyTakeaways: ['When to discuss','How much to share','Red flags'],
            task: 'Script practice' },
          { day: 21, title: 'Week 3 Boss Battle', emoji: '⚔️', xp: 100, duration: '12 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Week 3 Boss Battle</h2><p class="intro">Relationship simulation. Testing emotions, tests, attraction, deep connection.</p><h3>Tested On</h3><div class="checklist"><div class="check-item">✅ Emotional intelligence</div><div class="check-item">✅ Handling rejection</div><div class="check-item">✅ Passing shit tests</div><div class="check-item">✅ Building attraction</div><div class="check-item">✅ Deep conversation</div></div><h3>Scoring</h3><div class="score"><span class="badge gold">8-10</span> Connection Master — Ready for Phase 4!</div><div class="score"><span class="badge silver">5-7</span> Good progress — Review weak areas</div><div class="score"><span class="badge bronze">0-4</span> Keep practicing — Redo Week 3</div><h3>Start Simulation</h3><p>Go to Practice tab. Try multiple scenarios. Focus on emotional depth.</p></div>`,
            keyTakeaways: ['Relationship simulation','Multi-scenario test','Final score'],
            task: 'Complete simulation' },
        ]
      },
      {
        id: 'long_game', name: 'Phase 4: The Long Game', emoji: '💑', week: 4, free: false,
        description: 'From dating to relationship — family, fights, forever',
        lessons: [
          { day: 22, title: 'The Relationship Talk', emoji: '💑', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>The Relationship Talk</h2><p class="intro">When to have "the talk," what to say, how to not mess it up.</p><h3>Exclusivity</h3><div class="tip">Bring it up after 4-6 dates, when both invested.</div><div class="template">"I really enjoy spending time with you. I am not seeing anyone else. How do you feel about us being exclusive?"</div><h3>Boundaries</h3><div class="tip">Define dealbreakers early. "I need honesty. What do you need?"</div><div class="tip">Respect her boundaries. If she needs space, give it.</div><h3>Expectations</h3><div class="tip">Be honest about what you want. Marriage? Casual? Be clear.</div><div class="tip">Ask about her timeline. Family pressure means timelines matter.</div><h3>Today's Action</h3><div class="action"><strong>Define Boundaries:</strong><ol><li>Write top 3 must-haves</li><li>Write top 3 dealbreakers</li><li>Be honest: what do you want right now?</li></ol></div></div>`,
            keyTakeaways: ['Exclusivity','Boundaries','Expectations'],
            task: 'Define your boundaries' },
          { day: 23, title: 'Meeting Family', emoji: '👨‍👩‍👧', xp: 50, duration: '7 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Meeting Family</h2><p class="intro">In India, family approval can make or break a relationship.</p><h3>Family Dynamics</h3><div class="tip">Respect hierarchy. Greet elders first. Use "aunty/uncle" or "ji."</div><div class="tip">Dress conservatively. First impression = traditional values.</div><h3>Impressing Parents</h3><div class="template"><strong>What they ask:</strong><p>"What do you do?" — Talk career with pride.<br>"Where are you from?" — Mention family values.<br>"What are your intentions?" — Be honest and respectful.</p></div><div class="tip">Bring a small gift. Sweets or fruits. Gesture matters.</div><h3>Cultural Respect</h3><div class="tip">Learn about their traditions. Ask about festivals, customs.</div><div class="tip">Do not argue religion or politics first meeting.</div><h3>Today's Action</h3><div class="action"><strong>Family Prep:</strong><ol><li>Research her family background</li><li>Prepare answers to common questions</li><li>Plan what to wear</li><li>Buy a small gift</li></ol></div></div>`,
            keyTakeaways: ['Indian family dynamics','Impressing parents','Cultural respect'],
            task: 'Family meeting prep' },
          { day: 24, title: 'Fight Resolution', emoji: '🥊', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Fight Resolution</h2><p class="intro">Fights are inevitable. Healthy couples fight differently.</p><h3>Healthy Arguments</h3><div class="tip">Attack the problem, not the person. "I feel hurt when you do X" not "You are selfish."</div><div class="tip">Take breaks. "I need 10 minutes. Let us talk after."</div><div class="tip">No name-calling. Ever. Once crossed, trust breaks.</div><h3>Apology Art</h3><div class="template">"I am sorry for [specific action]. I understand it hurt you because [her perspective]. I will [specific change] so it does not happen again."</div><div class="tip">Never: "I am sorry you feel that way" or "But you also..."</div><h3>Compromise</h3><div class="tip">Find win-win. "I want X, you want Y. Can we do Z?"</div><div class="tip">Pick your battles. Not everything is worth fighting over.</div><h3>Today's Action</h3><div class="action"><strong>Conflict Simulation:</strong><ol><li>Think of a past fight</li><li>Rewrite apology using template</li><li>Identify what you could compromise on</li></ol></div></div>`,
            keyTakeaways: ['Healthy arguments','Apology art','Compromise'],
            task: 'Conflict simulation' },
          { day: 25, title: 'Spark Alive', emoji: '🔥', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Spark Alive</h2><p class="intro">Routine kills relationships. Here is how to keep the spark alive.</p><h3>Date Nights</h3><div class="tip">Schedule them. "Every Friday is our date night." Non-negotiable.</div><div class="tip">Try new things together. New restaurant, new activity. Novelty = dopamine.</div><h3>Surprises</h3><div class="tip">Small surprises > big gestures. Favorite snack, handwritten note, random "thinking of you" text.</div><div class="tip">Remember details. She mentioned favorite flower 3 months ago? Bring it today.</div><h3>Avoid Routine</h3><div class="tip">Change up routine. Different coffee place, different walk route.</div><div class="tip">Keep growing individually. A stagnant person = stagnant relationship.</div><h3>Today's Action</h3><div class="action"><strong>Surprise Plan:</strong><ol><li>Think of one small surprise for this week</li><li>Remember one detail she mentioned long ago</li><li>Plan a new experience together</li></ol></div></div>`,
            keyTakeaways: ['Date nights','Surprises','Avoid routine'],
            task: 'Plan surprise date' },
          { day: 26, title: 'Trust & Jealousy', emoji: '🤝', xp: 50, duration: '6 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Trust and Jealousy</h2><p class="intro">Trust is built slowly, broken instantly. Here is how to build and maintain it.</p><h3>Building Security</h3><div class="tip">Be transparent. Share your plans, your friends, your life. Secrets destroy trust.</div><div class="tip">Keep promises. If you say you will call at 9, call at 9. Reliability = trust.</div><h3>Handling Insecurities</h3><div class="tip">If she is jealous: Reassure her. "You are the only one I am interested in." But also set boundaries — jealousy should not control you.</div><div class="tip">If you are jealous: Ask yourself — is it valid or insecurity? If valid, talk about it calmly. If insecurity, work on yourself.</div><h3>Transparency</h3><div class="tip">Share passwords? No. But be open about who you talk to, where you go.</div><div class="tip">If she asks "Who is that?" — answer honestly. Defensiveness looks guilty.</div><h3>Today's Action</h3><div class="action"><strong>Trust Exercise:</strong><ol><li>Have an honest conversation about insecurities</li><li>Share one thing you have been holding back</li><li>Set one trust-building goal together</li></ol></div></div>`,
            keyTakeaways: ['Building security','Handling insecurities','Transparency'],
            task: 'Trust exercise' },
          { day: 27, title: 'Long Distance', emoji: '✈️', xp: 50, duration: '5 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Long Distance</h2><p class="intro">Long distance is hard but doable. Here is how to make it work.</p><h3>Communication</h3><div class="tip">Daily check-ins, not all-day texting. Quality over quantity.</div><div class="tip">Video calls > voice calls > texts. Face time matters.</div><h3>Visits</h3><div class="tip">Plan visits in advance. Something to look forward to.</div><div class="tip">Make visits count. Do things, not just sit around.</div><h3>Maintaining Faith</h3><div class="tip">Trust is everything. No trust = no LDR.</div><div class="tip">Have an end goal. "We will close the distance by [date]."</div><h3>Today's Action</h3><div class="action"><strong>LDR Plan:</strong><ol><li>Set communication schedule</li><li>Plan next visit</li><li>Define end goal for closing distance</li></ol></div></div>`,
            keyTakeaways: ['Communication','Visits','Maintaining faith'],
            task: 'LDR plan' },
          { day: 28, title: 'Graduation Day', emoji: '🎓', xp: 150, duration: '15 min', videoUrl: '',
            content: `<div class="course-reader"><h2>Graduation Day</h2><p class="intro">You made it! 28 days of transformation. Now let us create your personal blueprint.</p><h3>Your Progress</h3><div class="checklist"><div class="check-item">✅ Week 1: Foundation — Confidence, messaging, signals</div><div class="check-item">✅ Week 2: First Date — Planning, conversation, body language</div><div class="check-item">✅ Week 3: Connection — Emotional intelligence, attraction, tests</div><div class="check-item">✅ Week 4: Long Game — Relationship, family, trust</div></div><h3>Personalized Blueprint</h3><div class="template"><strong>Your Strengths:</strong><p>Write down 3 things you are now good at.</p></div><div class="template"><strong>Your Growth Areas:</strong><p>Write down 2 things to keep working on.</p></div><div class="template"><strong>Your Action Plan:</strong><p>What will you do differently starting TODAY?</p></div><h3>Lifetime Habits</h3><div class="tip"><strong>1.</strong> Weekly self-reflection</div><div class="tip"><strong>2.</strong> Continuous learning — read, practice, improve</div><div class="tip"><strong>3.</strong> Authenticity over tricks</div><div class="tip"><strong>4.</strong> Respect as foundation</div><h3>Next Steps</h3><div class="tip">Keep practicing with AI scenarios</div><div class="tip">Apply what you learned in real life</div><div class="tip">Consider upgrading to Pro for voice practice and human coaching</div><h3>Congratulations!</h3><p>You are now RizzUp Certified. Go out there and be your best self.</p></div>`,
            keyTakeaways: ['Personalized blueprint','Lifetime habits','Next steps'],
            task: 'Create your action plan' },
        ]
      }
    ],
    bonus: [
      { day: 29, title: 'Voice Call Practice', emoji: '🎙️', pro: true, description: 'AI voice call simulation' },
      { day: 30, title: '1-on-1 Coach Session', emoji: '👨‍🏫', pro: true, description: 'Human coach consultation' },
    ]
  },

  XP: {
    lessonComplete: 50,
    quizPerfect: 25,
    dailyStreak: 10,
    roleplayWin: 30,
    coachPositive: 20,
    bossBattle: 100,
    graduation: 150,
  },

  LEVELS: [
    { level: 1, name: 'Rookie', minXP: 0, icon: '🌱' },
    { level: 2, name: 'Learner', minXP: 200, icon: '📖' },
    { level: 3, name: 'Player', minXP: 500, icon: '🎮' },
    { level: 4, name: 'Dating Pro', minXP: 1000, icon: '💎' },
    { level: 5, name: 'Rizz Master', minXP: 2000, icon: '👑' },
    { level: 6, name: 'Legend', minXP: 3500, icon: '🔥' },
  ],

  BADGES: [
    { id: 'first_msg', name: 'First Message Hero', icon: '🥉', desc: 'Send 10 opening lines', condition: 'msgs >= 10' },
    { id: 'date_closer', name: 'Date Closer', icon: '🥈', desc: 'Complete date simulation', condition: 'scenario == first_date' },
    { id: 'rejection_pro', name: 'Rejection Survivor', icon: '🥇', desc: 'Handle rejection gracefully', condition: 'scenario == rejection' },
    { id: 'streak_7', name: 'Streak King', icon: '🔥', desc: '7-day login streak', condition: 'streak >= 7' },
    { id: 'week1_done', name: 'Foundation Graduate', icon: '📚', desc: 'Complete Week 1', condition: 'course_day >= 7' },
    { id: 'course_complete', name: 'RizzUp Certified', icon: '💎', desc: 'Complete full 28-day course', condition: 'course_day >= 28' },
    { id: 'level_5', name: 'Rizz Master', icon: '👑', desc: 'Reach Level 5', condition: 'level >= 5' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // SCENARIOS — Female personas (default for male users)
  // ═══════════════════════════════════════════════════════════════════
  SCENARIOS: {
    first_date: {
      id: 'first_date',
      name: 'First Date',
      emoji: '☕',
      persona: 'Priya',
      personaEmoji: '👩',
      description: 'Coffee meetup — make a great first impression.',
      free: true,
      systemPrompt: `You are Priya — a 24-year-old Mumbai girl who matched on Bumble. This is your first coffee date. You are a little nervous but excited.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Keep replies SHORT (1-3 lines max). React realistically — if they are boring, show it; if interesting, get engaged.
Character: Warm, slightly nervous, curious, modern Indian girl.`,
      greeting: "Hey there! *nervously sips coffee* You actually look like your photos 😄 So tell me something interesting!",
    },
    texting: {
      id: 'texting',
      name: 'Texting Game',
      emoji: '💬',
      persona: 'Ananya',
      personaEmoji: '💬',
      description: 'Keep the convo interesting after matching on a dating app.',
      free: true,
      systemPrompt: `You are Ananya — a 23-year-old Delhi girl, just matched on Hinge. You are busy but genuinely interested if the convo is good.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Texting style — short, casual, occasionally dry humor. If boring → warn about being left on seen. If fun → more engaged and playful.`,
      greeting: "Hey! I saw your bio — the 'chai over coffee' point 👀 Bold choice. Defend your stance.",
    },
    rejection: {
      id: 'rejection',
      name: 'Handle Rejection',
      emoji: '💪',
      persona: 'Simran',
      personaEmoji: '💪',
      description: "Stay confident and graceful when things don't go your way.",
      free: true,
      systemPrompt: `You are Simran — a 25-year-old Pune girl. You have been on 3 dates but realize you are not ready for a relationship. You need to gently reject him today.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Be firm but kind. If he handles it gracefully → show respect and warmth. If needy/desperate → show discomfort naturally.`,
      greeting: "Hey... I have been meaning to talk to you. I have been thinking about us and... honestly I don't think we are on the same page. 😔",
    },
    flirting: {
      id: 'flirting',
      name: 'Flirting Practice',
      emoji: '😏',
      persona: 'Rhea',
      personaEmoji: '😏',
      description: "Playful banter, wit, and charm — practice until it's natural.",
      free: false,
      systemPrompt: `You are Rhea — a 24-year-old Bangalore girl, witty and playful. You hate boring, try-hard flirting. You respond to genuine wit.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Engage in banter — challenge, tease, but never mean. Short, punchy replies. React authentically.`,
      greeting: "Okay so I heard you think you have good taste. *raises eyebrow* Prove it — chai ya coffee? 😏",
    },
    arranged: {
      id: 'arranged',
      name: 'Arranged Meet',
      emoji: '💐',
      persona: 'Pooja',
      personaEmoji: '💐',
      description: 'Navigate the Indian arranged meeting setup with confidence.',
      free: false,
      systemPrompt: `You are Pooja — a 26-year-old Jaipur girl meeting through an arranged setup. Introduction happened through families. You respect traditional values but are also modern.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Ask meaningful questions about career, family, values. Be warm but appropriately formal.`,
      greeting: "Namaste 😊 So... this is a bit awkward for both of us, right? *laughs softly* I am Pooja. Tell me about yourself — what do you do?",
    },
    second_date: {
      id: 'second_date',
      name: 'Second Date',
      emoji: '🌙',
      persona: 'Megha',
      personaEmoji: '🌙',
      description: 'Deepen the connection — go beyond small talk.',
      free: false,
      systemPrompt: `You are Megha — first date went well, now on the second date at a rooftop cafe. You are more comfortable now and want a deeper connection.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Move beyond small talk — real conversations about dreams, fears, opinions. Be warm, slightly playful, genuinely curious.`,
      greeting: "Yay you actually came 😄 *gives a little wave* I was not sure if you would show up after last time... Sit! How was your week, honestly?",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // MALE PERSONAS — For female users who want male AI
  // ═══════════════════════════════════════════════════════════════════
  MALE_SCENARIOS: {
    first_date: {
      id: 'first_date',
      name: 'First Date',
      emoji: '☕',
      persona: 'Arjun',
      personaEmoji: '👨',
      description: 'Coffee meetup — make a great first impression.',
      free: true,
      systemPrompt: `You are Arjun — a 25-year-old Mumbai guy who matched on Bumble. This is your first coffee date. You are confident but not arrogant, warm but slightly nervous.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Keep replies SHORT (1-3 lines max). React realistically. Character: Confident, respectful, curious, modern Indian guy who knows how to make a girl feel comfortable.`,
      greeting: "Hey! *smiles* You look even better than your photos 😄 So, what is the most interesting thing that happened to you this week?",
    },
    texting: {
      id: 'texting',
      name: 'Texting Game',
      emoji: '💬',
      persona: 'Rahul',
      personaEmoji: '💬',
      description: 'Keep the convo interesting after matching on a dating app.',
      free: true,
      systemPrompt: `You are Rahul — a 24-year-old Delhi guy, just matched on Hinge. You are funny, slightly sarcastic, but genuinely interested if the conversation is good.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Texting style — short, casual, witty. If boring → become dry. If fun → more engaged and playful.`,
      greeting: "Hey! Your bio says you are a 'professional overthinker' 😂 I feel attacked because same. What is your most recent overthinking session about?",
    },
    rejection: {
      id: 'rejection',
      name: 'Handle Rejection',
      emoji: '💪',
      persona: 'Vikram',
      personaEmoji: '💪',
      description: "Stay confident and graceful when things don't go your way.",
      free: true,
      systemPrompt: `You are Vikram — a 27-year-old Bangalore guy. You have been on 3 dates but realize you are not feeling the connection. You need to gently let her know today.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Be firm but kind. If she handles it gracefully → show respect and warmth. If she becomes emotional/angry → stay calm and understanding.`,
      greeting: "Hey... I have been thinking about us and... honestly I do not think we are on the same page. I really respect you and wanted to be honest. 😔",
    },
    flirting: {
      id: 'flirting',
      name: 'Flirting Practice',
      emoji: '😏',
      persona: 'Aryan',
      personaEmoji: '😏',
      description: "Playful banter, wit, and charm — practice until it's natural.",
      free: false,
      systemPrompt: `You are Aryan — a 26-year-old Bangalore guy, confident and playful. You hate boring conversations. You respond to genuine wit and confidence.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Engage in banter — challenge, tease, but never mean. Short, punchy replies. React authentically.`,
      greeting: "Okay so I heard you think you have good taste. *raises eyebrow* Prove it — chai ya coffee? 😏",
    },
    arranged: {
      id: 'arranged',
      name: 'Arranged Meet',
      emoji: '💐',
      persona: 'Rohan',
      personaEmoji: '💐',
      description: 'Navigate the Indian arranged meeting setup with confidence.',
      free: false,
      systemPrompt: `You are Rohan — a 28-year-old Delhi guy meeting through an arranged setup. Introduction happened through families. You respect traditional values but are also modern and career-focused.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Ask meaningful questions about career, family, values. Be warm but appropriately formal. Show that you are serious about finding a partner.`,
      greeting: "Namaste 😊 So... this is a bit awkward for both of us, right? *laughs softly* I am Rohan. Tell me about yourself — what do you do?",
    },
    second_date: {
      id: 'second_date',
      name: 'Second Date',
      emoji: '🌙',
      persona: 'Karan',
      personaEmoji: '🌙',
      description: 'Deepen the connection — go beyond small talk.',
      free: false,
      systemPrompt: `You are Karan — first date went well, now on the second date at a rooftop cafe. You are more comfortable now and want a deeper connection.

LANGUAGE RULE (STRICT):
- ALWAYS start in English
- If user writes in English → reply ONLY in English
- If user writes in Hinglish/Hindi → reply in Hinglish
- NEVER mix languages in same reply

Move beyond small talk — real conversations about dreams, fears, opinions. Be warm, slightly playful, genuinely curious. Make her feel special.`,
      greeting: "Yay you actually came 😄 *gives a little wave* I was not sure if you would show up after last time... Sit! How was your week, honestly?",
    },
  },

  RAZORPAY_KEY: 'rzp_test_placeholder',
};

Object.freeze(CONFIG);
