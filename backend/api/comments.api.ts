// backend/api/comments.api.ts
import express from 'express';
import supabase from '../backend/supabaseServerClient';

const router = express.Router();

// GET comments for a post
router.get('/comments', async (req, res) => {
  const postId = req.query.postId;

  if (!postId) {
    return res.status(400).json({ error: 'Missing postId' });
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error.message);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }

  res.json(data);
});

export default router;
