export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, system } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: system }, ...messages],
        max_tokens: 200,
        temperature: 0.9
      })
    });

    const data = await response.json();

    // ✅ FIX: Groq returns OpenAI format — choices[0].message.content
    // Pehle data.reply likha tha jo WRONG tha — isliye replies toot rahe the
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error('Groq API unexpected response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    res.status(200).json({ reply });

  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
