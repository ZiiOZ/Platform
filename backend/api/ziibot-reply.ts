import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { supabase } from '../supabaseClient';

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST /api/ziibot-reply
router.post('/ziibot-reply', async (req, res) => {
  const { postId, context } = req.body;

  if (!postId || !context) {
    return res.status(400).json({ error: 'Missing postId or context' });
  }

  try {
    const prompt = `Reply in a natural, witty tone to this comment:\n"${context}"`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
    });

    const replyText = completion.data.choices[0].message?.content?.trim();

    if (!replyText) {
      return res.status(500).json({ error: 'No reply generated' });
    }

    // Save reply into Supabase comments table
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      username: 'ZiiBot 🤖',
      content: replyText,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save comment' });
    }

    res.status(200).json({ message: 'ZiiBot replied', content: replyText });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'ZiiBot failed to reply' });
  }
});

export default router;
