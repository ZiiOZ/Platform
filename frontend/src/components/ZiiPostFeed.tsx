// src/components/ZiiPostFeed.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Post {
  id: string;
  content: string;
  image_url: string;
  creator_name: string;
  created_at: string;
}

function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('ziiposts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Fetch error:', error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📝 ZiiOZ Posts Feed</h2>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-600 italic">No posts available.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded p-4 shadow bg-white">
              <p className="mb-2 text-gray-800">{post.content}</p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post visual"
                  className="w-full max-h-[300px] object-cover rounded"
                />
              )}
              <p className="text-sm text-gray-500 mt-1">
                By {post.creator_name || 'Anonymous'} •{' '}
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiPostFeed;
