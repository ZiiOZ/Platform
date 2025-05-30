import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { formatDistanceToNow } from 'date-fns';
import ZiiCommentFeed from '../comments/ZiiCommentFeed';


type Post = {
  id: string;
  content: string;
  image_url?: string;
  hook?: string;
  hashtags?: string | string[];
  created_at: string;
  boost_count?: number;
};

const ZiiPostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    };

    fetchPosts();
  }, []);

  const hasBoosted = (postId: string) => {
    const boosted = JSON.parse(localStorage.getItem('boosted_posts') || '[]');
    return boosted.includes(postId);
  };

  const handleBoost = async (postId: string) => {
    if (hasBoosted(postId)) return;

    const { error } = await supabase
      .from('posts')
      .update({ boost_count: supabase.raw('boost_count + 1') })
      .eq('id', postId);

    if (!error) {
      const boosted = JSON.parse(localStorage.getItem('boosted_posts') || '[]');
      localStorage.setItem('boosted_posts', JSON.stringify([...boosted, postId]));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, boost_count: (p.boost_count || 0) + 1 } : p
        )
      );
    } else {
      console.error('Boost failed:', error);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl p-4 shadow-sm border space-y-2"
        >
          {post.hook && (
            <div className="text-xl font-semibold text-blue-600">{post.hook}</div>
          )}

          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post"
              className="w-full h-auto rounded-lg mt-2"
            />
          )}

          {post.hashtags && (
            <div className="text-sm text-gray-500">
              {(Array.isArray(post.hashtags)
                ? post.hashtags
                : (post.hashtags as string).split(',')
              ).map((tag, index) => (
                <span key={index} className="mr-2">#{tag.trim()}</span>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>

            <button
              className={`text-sm font-medium px-3 py-1 rounded-full border ${
                hasBoosted(post.id)
                  ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => handleBoost(post.id)}
              disabled={hasBoosted(post.id)}
            >
              🚀 Boost {post.boost_count || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ZiiPostFeed;
