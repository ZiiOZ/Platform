import { useState } from 'react';
import { supabase } from './supabaseClient';
import ZiiCommentFeed from './comments/ZiiCommentFeed';

interface Post {
  id: number;
  content: string;
  image_url?: string;
  boosts?: number;
  visible?: boolean;
  hook?: string;
  hashtags?: string;
  username?: string;
}

export default function PostCard({ post }: { post: Post }) {
  const [isVisible, setIsVisible] = useState(post.visible ?? true);
  const [deleted, setDeleted] = useState(false);

  const handleToggleVisibility = async () => {
    const { error } = await supabase
      .from('posts')
      .update({ visible: !isVisible })
      .eq('id', post.id);

    if (!error) setIsVisible(!isVisible);
    else console.error('Visibility toggle failed', error);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (!error) setDeleted(true);
    else console.error('Post deletion failed', error);
  };

  if (deleted) return null;
  if (!isVisible) return null;

  return (
    <div className="border rounded p-4 shadow mb-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-semibold">📢 Public Post</div>
        <div className="flex gap-2">
          <button
            className="bg-yellow-400 text-black text-xs px-2 py-1 rounded"
            onClick={handleToggleVisibility}
          >
            {isVisible ? 'Hide' : 'Unhide'}
          </button>
          <button
            className="bg-red-500 text-white text-xs px-2 py-1 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          className="rounded mb-2 w-full max-h-60 object-cover"
        />
      )}

      {post.hook && (
        <div className="text-sm text-purple-700 font-semibold italic mb-1">
          {post.hook}
        </div>
      )}

      <div className="text-gray-800 text-base mb-2">{post.content}</div>

      {post.hashtags && (
        <div className="text-xs text-gray-600 italic mb-1">
          #{post.hashtags.split(',').join(' #')}
        </div>
      )}

      {post.username && (
        <div className="text-xs text-gray-500 mb-2">👤 Posted by: {post.username}</div>
      )}

      {typeof post.boosts === 'number' && (
        <div className="text-xs text-green-600 font-bold mb-2">
          🚀 Boosts: {post.boosts}
        </div>
      )}

      <ZiiCommentFeed postId={post.id.toString()} />
    </div>
  );
}
