import express from 'express';
import OpenAI from 'openai';
import { supabase } from '../supabaseClient';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

router.post('/ziibot-reply', async (req, res) => {
  const { comment, post_id } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: comment }],
    });

    const botReply = response.choices[0].message.content;

    const { error } = await supabase.from('comments').insert({
      post_id,
      username: 'ZiiBot',
      content: botReply,
    });

    if (error) {
      return res.status(500).json({ error: 'Failed to save reply' });
    }

    res.json({ reply: botReply });
  } catch (err) {
    console.error('ZiiBot error:', err);
    res.status(500).json({ error: 'OpenAI failed to reply' });
  }
});

export default router;
