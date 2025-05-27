import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ZiiCommentSection from './ZiiCommentSection';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: string;
  boosts: number;
  visible: boolean;
}

const ZiiPostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('ziioz_admin') === 'true';
    setIsAdmin(admin);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts((data || []).filter((p) => p.visible || isAdmin));
      }

      setLoading(false);
    };

    fetchPosts();
  }, [isAdmin]);

  const handleBoost = async (postId: number) => {
    const key = `boosted_${postId}`;
    if (localStorage.getItem(key)) {
      alert('You already boosted this post.');
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const { error } = await supabase
      .from('posts')
      .update({ boosts: (post.boosts || 0) + 1 })
      .eq('id', postId);

    if (!error) {
      localStorage.setItem(key, 'true');
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, boosts: (p.boosts || 0) + 1 } : p
        )
      );
    } else {
      alert('Boost failed.');
      console.error(error);
    }
  };

  const handleDelete = async (postId: number) => {
    const confirm = window.confirm('Delete this post permanently?');
    if (!confirm) return;

    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleToggleVisibility = async (postId: number, visible: boolean) => {
    const { error } = await supabase
      .from('posts')
      .update({ visible: !visible })
      .eq('id', postId);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, visible: !visible } : p
        )
      );
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;
  if (posts.length === 0) return <p className="text-center mt-10 text-gray-600">No posts yet.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5 transition hover:shadow-md"
        >
          <Link
            to={`/post/${post.id}`}
            className="text-xl font-semibold text-blue-600 hover:underline block"
          >
            {post.title}
          </Link>

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

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => handleBoost(post.id)}
              className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-full text-sm"
            >
              🔥 Boost
            </button>
            <span className="text-sm text-gray-600">
              {post.boosts || 0} Boost{(post.boosts || 0) === 1 ? '' : 's'}
            </span>
          </div>

          {isAdmin && (
            <div className="flex gap-3 text-sm text-gray-600 mt-2">
              <button
                onClick={() => handleToggleVisibility(post.id, post.visible)}
                className="bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded"
              >
                {post.visible ? '🔒 Hide' : '✅ Show'}
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
              >
                🗑 Delete
              </button>
            </div>
          )}

          <ZiiCommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default ZiiPostFeed;
