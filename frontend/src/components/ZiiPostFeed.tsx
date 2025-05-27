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
    return <p className="text-center mt-8">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center mt-8">No posts yet.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Posted by {post.author || 'Unknown'} on{' '}
            {new Date(post.created_at).toLocaleString()}
          </p>
          <p className="mb-2">{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post visual"
              className="w-full rounded mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ZiiPostFeed;
