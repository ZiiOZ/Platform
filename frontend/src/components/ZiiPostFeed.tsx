// src/components/ZiiPostFeed.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: string;
}

const ZiiPostFeed = () => {
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
    return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No posts yet.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3 transition hover:shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>

          <p className="text-sm text-gray-500">
            Posted by <span className="font-medium">{post.author || 'Unknown'}</span> on{' '}
            {new Date(post.created_at).toLocaleString()}
          </p>

          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post visual"
              className="w-full rounded-lg mt-3 border"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ZiiPostFeed;
