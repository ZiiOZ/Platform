import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

router.post('/ai-post-enhance', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'No content provided' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `
Generate a catchy 1-line hook for the following content. 
Then create 3-5 relevant hashtags without "#" prefix.
Respond in JSON format: { "hook": "...", "hashtags": ["...", "..."] }

Content:
${content}
        `
      }]
    });

    const json = response.choices?.[0]?.message?.content?.trim();
    const parsed = JSON.parse(json || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('[AI Enhance Error]', err.message || err);
    res.status(500).json({ error: 'AI failed to enhance post' });
  }
});

export default router;
