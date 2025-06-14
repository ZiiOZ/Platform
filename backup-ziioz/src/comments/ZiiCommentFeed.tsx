import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';


interface Comment {
  id: number;
  post_id: string;
  username: string;
  content: string;
  created_at: string;
}

export default function ZiiCommentFeed({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) console.error('Error loading comments:', error);
    else setComments(data);
  };

  const handleSubmit = async () => {
    if (!newComment || !username) return;
    const { error } = await supabase.from('comments').insert([
      { post_id: postId, content: newComment, username },
    ]);
    if (error) console.error('Submit error:', error);
    else {
      setNewComment('');
      fetchComments();
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-md font-semibold mb-2">Comments</h3>

      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-2 rounded bg-gray-50">
            <div className="text-sm text-gray-700">{comment.content}</div>
            <div className="text-xs text-gray-500">— {comment.username}</div>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your name"
        className="border p-1 w-full mb-2 text-sm rounded"
      />
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        className="border p-2 w-full mb-2 text-sm rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
      >
        Submit
      </button>
    </div>
  );
}
