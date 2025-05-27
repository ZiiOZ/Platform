// src/components/ZiiPostDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ZiiCommentSection from './ZiiCommentSection';

const ZiiPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setPost(data);
    };

    if (id) fetchPost();
  }, [id]);

  if (!post) return <p className="text-center mt-10 text-gray-500">Loading post...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold">{post.title}</h2>

      <p className="text-sm text-gray-500">
        Posted by <span className="font-medium">{post.author || 'Unknown'}</span> on{' '}
        {new Date(post.created_at).toLocaleString()}
      </p>

      <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          className="w-full rounded-lg border"
        />
      )}

      <p className="text-sm text-gray-600">{post.boosts || 0} Boosts</p>

      <ZiiCommentSection postId={post.id} />
    </div>
  );
};

export default ZiiPostDetail;
