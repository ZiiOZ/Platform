// src/components/ZiiPostFeed.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Post {
  id: string;
  content: string;
  creator_name: string;
  image_url?: string;
  created_at: string;
}

function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts') // ✅ match table name exactly
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Post fetch error:', error.message);
      } else {
        console.log('✅ Posts fetched:', data);
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📝 Latest ZiiPosts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-600 italic">No posts available to display.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg shadow p-4 bg-white">
              <p className="text-sm text-gray-600 mb-1">
                By {post.creator_name || 'Anonymous'} •{' '}
                {new Date(post.created_at).toLocaleString()}
              </p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post Visual"
                  className="w-full max-h-[300px] object-cover rounded mb-2"
                />
              )}
              <p className="text-lg">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiPostFeed;
