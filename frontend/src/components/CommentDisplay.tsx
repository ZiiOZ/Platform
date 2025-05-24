import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  boosts: number;
  post_id: number;
  profile_id?: string;
}

interface CommentDisplayProps {
  postId: number;
}

export default function CommentDisplay({ postId }: CommentDisplayProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    } else {
      console.error('Error loading comments:', error);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        content: newComment,
        boosts: 0, // default to 0 boosts
      },
    ]);

    if (!error) {
      setNewComment('');
      fetchComments();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-3 mt-4">
      {comments.slice(0, visibleCount).map((comment) => (
        <div key={comment.id} className="bg-gray-800 p-3 rounded border border-gray-700">
          <div className="text-sm text-white">{comment.content}</div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(comment.created_at).toLocaleString()} · {comment.boosts} boosts
          </div>
        </div>
      ))}

      {comments.length > visibleCount && (
        <button
          onClick={loadMore}
          className="text-sm text-blue-400 hover:underline mt-2"
        >
          View more comments
        </button>
      )}

      <form onSubmit={handleCommentSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
