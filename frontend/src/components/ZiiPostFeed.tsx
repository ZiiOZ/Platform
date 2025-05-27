// src/components/ZiiPostFeed.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Post {
  id: number;
  content: string;
  author: string;
  created_at: string;
  image_url?: string;
}

function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  const fetchPosts = async () => {
    setLoading(true);

    const query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'mine') {
      // Replace this with your actual auth user when hooked up
      query.eq('author', 'ziioz');
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Failed to fetch posts:', error.message);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📝 ZiiPosts</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        <select
          className="px-2 py-1 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'mine')}
        >
          <option value="all">All Posts</option>
          <option value="mine">My Posts</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-600 italic">No posts found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded shadow bg-white">
              <p className="text-sm text-gray-500 mb-1">
                <strong>{post.author || 'Anonymous'}</strong> •{' '}
                {new Date(post.created_at).toLocaleString()}
              </p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Attached"
                  className="w-full max-h-60 object-cover rounded mb-2"
                />
              )}
              <p className="text-base">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ZiiPostFeed() {
  return <div>ZiiPost Feed</div>;
}

