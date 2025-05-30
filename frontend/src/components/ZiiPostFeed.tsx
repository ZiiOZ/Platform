import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BoostButton } from './BoostButton'; // adjust path as needed

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface Post {
  id: number;
  title?: string;
  content?: string;
  image_url?: string;
  boosts: number;
}

export default function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-10 text-gray-500">No posts found.</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl border border-gray-200 shadow-md p-5 space-y-3 transition hover:shadow-lg"
        >
          {post.title && (
            <div className="text-lg font-semibold text-gray-900">{post.title}</div>
          )}

          {post.image_url ? (
            <img
              src={post.image_url}
              alt="Post"
              className="w-full h-auto rounded-xl border object-cover"
            />
          ) : null}

          {post.content && (
            <div className="text-sm text-gray-700">{post.content}</div>
          )}

          <div className="pt-2">
            <BoostButton postId={post.id} initialBoosts={post.boosts || 0} />
          </div>
        </div>
      ))}
    </div>
  );
}
