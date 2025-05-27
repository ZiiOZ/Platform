// src/components/ZiiCommentSection.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ZiiCommentSectionProps {
  postId: number;
}

const ZiiCommentSection = ({ postId }: ZiiCommentSectionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error) {
      setComments(data || []);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        content: newComment,
        created_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      setNewComment('');
      fetchComments();
    }

    setLoading(false);
  };

  const handleZiiBotReply = async () => {
    const prompt = `Write a smart, engaging reply to this comment thread:\n\n${comments
      .map((c) => `• ${c.content}`)
      .join('\n')}`;

    const res = await fetch('https://ziioz-backend-platform.onrender.com/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const result = await res.json();
    const aiReply = result.reply || 'Thanks for your comment!';

    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        content: aiReply,
        created_at: new Date().toISOString(),
      },
    ]);

    if (!error) fetchComments();
  };

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-md font-semibold text-gray-800">Comments</h4>

      {comments.map((c) => (
        <div key={c.id} className="bg-gray-50 p-3 rounded text-sm border">
          {c.content}
        </div>
      ))}

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-2 border rounded resize-none"
        rows={2}
        placeholder="Write a comment..."
      />

      <div className="flex gap-2">
        <button
          onClick={submitComment}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>

        <button
          onClick={handleZiiBotReply}
          className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
        >
          🤖 Reply with ZiiBot
        </button>
      </div>
    </div>
  );
};

export default ZiiCommentSection;
