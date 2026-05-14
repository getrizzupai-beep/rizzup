export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { messages, system } = req.body;

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
    const reply = data.choices?.[0]?.message?.content || 'Kuch gadbad ho gayi. Try again.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ reply: 'Server error. Try again.' });
  }
}
