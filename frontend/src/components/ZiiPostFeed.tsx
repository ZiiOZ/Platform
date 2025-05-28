import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

interface Post {
  id: number;
  username: string;
  created_at: string;
  content: string;
  image_url?: string;
  boosts?: number;
}

interface Comment {
  id: number;
  post_id: number;
  username: string;
  content: string;
  created_at: string;
}

export default function ZiiPostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data as Post[]);
      (data as Post[]).forEach((post) => fetchComments(post.id));
    }
  };

  const fetchComments = useCallback(async (postId: number) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments((prev) => ({ ...prev, [postId]: data as Comment[] }));
    }
  }, []);

  const handleCommentChange = (postId: number, text: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: text }));
  };

  const handlePostComment = async (postId: number) => {
    const content = newComments[postId]?.trim();
    if (!content) return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      username: 'Anonymous',
      content,
    });

    if (!error) {
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } else {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-8 px-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow-md p-4 mb-6 max-w-2xl w-full"
        >
          <div className="mb-2">
            <h2 className="font-bold text-lg text-blue-800">{post.username || 'Anonymous'}</h2>
            <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
          </div>

          <p className="text-gray-800 whitespace-pre-line mb-4">{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              className="rounded-lg w-full max-h-[400px] object-cover mb-4"
            />
          )}

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-full text-sm">🔥 Boost</button>
            <span className="text-sm text-gray-600">{post.boosts || 0} Boosts</span>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">🔒 Hide</button>
