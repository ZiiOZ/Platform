import express from 'express';
import { supabase } from '../supabase.server';

const router = express.Router();

router.get('/comments', async (req, res) => {
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ error: 'Missing postId' });
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[GET /comments] Supabase error:', error);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }

  res.json(data);
});

export default router;
