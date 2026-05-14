// api/chat.js — Vercel Serverless Function
// Groq API proxy — browser se direct API call nahi hogi, sab yahan se jayega
// Environment variable: GROQ_API_KEY (Vercel dashboard mein set karo)

export default async function handler(req, res) {
  // CORS headers — sabse pehle
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS preflight request handle karo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sirf POST allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key check
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Groq API call
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          // System message pehle add karo agar diya hai
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'AI service error', 
        details: response.status 
      });
    }

    const data = await response.json();
    
    // Groq/OpenAI format se reply extract karo
    const reply = data.choices?.[0]?.message?.content;
    
    if (!reply) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
