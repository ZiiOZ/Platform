import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // ✅ frontend-safe import

interface Post {
  id: number;
  username: string;
  created_at: string;
  content: string;
  image_url?: string;
  boosts?: number;
}

interface Comment {
  id: number;
  post_id: number;
  username: string;
  content: string;
  created_at: string;
}

export default function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as Post[]);
      (data as Post[]).forEach((post) => fetchComments(post.id));
    }
  };

  const fetchComments = useCallback(async (postId: number) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments((prev) => ({ ...prev, [postId]: data as Comment[] }));
    }
  }, []);

  const handleCommentChange = (postId: number, text: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: text }));
  };

  const handlePostComment = async (postId: number) => {
    const content = newComments[postId]?.trim();
    if (!content) return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      username: 'Anonymous',
      content,
    });

    if (!error) {
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } else {
      console.error('Error posting comment:', error);
    }
  };

  const handleBoost = async (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const { error } = await supabase
      .from('posts')
      .update({ boosts: (post.boosts || 0) + 1 })
      .eq('id', postId);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, boosts: (p.boosts || 0) + 1 } : p
        )
      );
    }
  };

  const handleZiiBotReply = async (postId: number) => {
    const context = comments[postId]?.[comments[postId].length - 1]?.content;
    if (!context) return alert('No comment found to reply to.');

    try {
      const res = await fetch('https://ziioz-backend-platform.onrender.com/api/ziibot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, context }),
      });

      const data = await res.json();
      if (res.ok) fetchComments(postId);
      else alert('ZiiBot failed to reply.');
    } catch (err) {
      console.error(err);
      alert('ZiiBot request failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-8 px-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow-md p-4 mb-6 max-w-2xl w-full"
        >
          <div className="mb-2">
            <h2 className="font-bold text-lg text-blue-800">{post.username || 'Anonymous'}</h2>
            <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
          </div>

          <p className="text-gray-800 whitespace-pre-line mb-4">{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              className="rounded-lg w-full max-h-[400px] object-cover mb-4"
            />
          )}

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button
              onClick={() => handleBoost(post.id)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-full text-sm"
            >
              🔥 Boost
            </button>
            <span className="text-sm text-gray-600">{post.boosts || 0} Boosts</span>
          </div>

          <div className="border-t pt-4">
            <textarea
              value={newComments[post.id] || ''}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 mb-3 resize-none text-sm"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePostComment(post.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
              >
                Post Comment
              </button>
              <button
                onClick={() => handleZiiBotReply(post.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-full text-sm"
              >
                🤖 Reply with ZiiBot
              </button>
            </div>

            {comments[post.id]?.length > 0 && (
              <div className="mt-4 space-y-2">
                {comments[post.id].map((c) => (
                  <div key={c.id} className="text-sm text-gray-800 border rounded p-2">
                    <span className="font-semibold">{c.username || 'Anonymous'}:</span> {c.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
