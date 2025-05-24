// App.tsx
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import BoostButton from './BoostButton';
import './App.css';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  content: string;
  boosts: number;
  created_at: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: postData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (postData) setPosts(postData);
    };

    const fetchComments = async () => {
      const { data: commentData } = await supabase
        .from('comments')
        .select('*');
      if (commentData) setComments(commentData);
    };

    fetchPosts();
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const { data, error } = await supabase.from('posts').insert([
      {
        content,
        author: author || 'Anonymous',
      },
    ]);

    if (!error && data) {
      setPosts([data[0], ...posts]);
      setContent('');
      setAuthor('');
    }
  };

  const handleComment = async (postId: number) => {
    const text = newComment[postId]?.trim();
    if (!text) return;

    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        content: text,
        boosts: 0,
      },
    ]);

    if (!error && data) {
      setComments([...comments, data[0]]);
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <div className="p-6 font-sans bg-white text-black min-h-screen">
      <header className="text-2xl font-bold mb-4">🚀 ZiiOZ Platform <span className="text-sm">v1</span></header>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Post
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="border rounded p-4 mb-6 shadow-sm">
          <div className="font-semibold text-gray-700">@{post.author}</div>
          <div className="mb-2">{post.content}</div>
          <div className="text-sm text-gray-500 mb-2">{new Date(post.created_at).toLocaleString()}</div>

          <div className="space-y-2">
            {comments.filter((c) => c.post_id === post.id).map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <span>{c.content}</span>
                <BoostButton commentId={c.id} currentBoosts={c.boosts} />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={newComment[post.id] || ''}
              onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
              placeholder="Add a comment..."
              className="border p-1 w-3/4 rounded mr-2"
            />
            <button
              onClick={() => handleComment(post.id)}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
            >
              Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
