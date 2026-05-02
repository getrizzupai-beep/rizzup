export default async function handler(req, res) {
  // CORS headers — required for browser fetch
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, system } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: { message: 'GROQ_API_KEY not set in Vercel env vars' } });
  }

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

    if (!response.ok) {
      return res.status(response.status).json({ error: { message: data.error?.message || 'Groq API error' } });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message || 'Server error' } });
  }
}
