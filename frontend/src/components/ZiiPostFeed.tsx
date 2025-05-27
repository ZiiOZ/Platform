import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Post {
  id: string;
  username: string;
  created_at: string;
  content: string;
  image_url?: string;
  boosts?: number;
}

export default function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data as Post[]);
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
            <p className="text-sm text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </p>
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
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-full text-sm">
              🔥 Boost
            </button>
            <span className="text-sm text-gray-600">{post.boosts || 0} Boosts</span>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
              🔒 Hide
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              🗑 Delete
            </button>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Comments
            </label>
            <textarea
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-lg p-2 mb-2 resize-none text-sm"
            />
            <div className="flex items-center gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm">
                Post Comment
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-full text-sm">
                🤖 Reply with ZiiBot
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
