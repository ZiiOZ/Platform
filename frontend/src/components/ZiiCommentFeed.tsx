import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Comment = {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
};

const ZiiCommentFeed = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<{ [commentId: string]: string }>({});
  const [loadingReply, setLoadingReply] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(data || []);
    };

    fetchComments();
  }, [postId]);

  const handleZiiBotReply = async (commentId: string, content: string) => {
    if (replies[commentId]) return;

    setLoadingReply(commentId);

    try {
      const response = await axios.post('/api/ziibot-reply', {
        comment: content,
      });

      const reply = response.data?.reply || 'No response';
      setReplies((prev) => ({ ...prev, [commentId]: reply }));
    } catch (err) {
      console.error('ZiiBot reply error:', err);
      setReplies((prev) => ({ ...prev, [commentId]: '❌ Error from ZiiBot' }));
    } finally {
      setLoadingReply(null);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-50 p-3 rounded-xl border shadow-sm space-y-2"
        >
          <div className="text-sm text-gray-800">{comment.content}</div>

          <button
            className={`text-xs px-2 py-1 rounded-full ${
              replies[comment.id]
                ? 'text-gray-400 border border-gray-300 cursor-default'
                : 'text-purple-600 border border-purple-600 hover:bg-purple-50'
            }`}
            disabled={!!replies[comment.id] || loadingReply === comment.id}
            onClick={() => handleZiiBotReply(comment.id, comment.content)}
          >
            {loadingReply === comment.id ? 'ZiiBot typing...' : 'Ask ZiiBot 🤖'}
          </button>

          {replies[comment.id] && (
            <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded-lg">
              {replies[comment.id]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ZiiCommentFeed;
