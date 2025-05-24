import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import CommentDisplay from './components/CommentDisplay';
import './App.css';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  image_url?: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/`)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(() => setMessage("⚠️ Failed to connect to backend"));

    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let imageUrl = '';

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const upload = await supabase.storage.from('posts').upload(fileName, file);
      if (!upload.error) {
        const { data: publicUrlData } = supabase.storage.from('posts').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    const insert = await supabase.from('posts').insert([
      {
        content,
        author: author || 'Anonymous',
        image_url: imageUrl,
      },
    ]);

    if (!insert.error && insert.data) {
      setPosts([insert.data[0], ...posts]);
      setContent('');
      setAuthor('');
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <header className="w-full p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="text-xl font-bold flex items-center space-x-2">
          <span className="text-2xl">🚀</span>
          <span>ZiiOZ Platform</span>
        </div>
        <div className="text-sm text-gray-400">v1</div>
      </header>

      <main className="flex-grow px-4 py-6 space-y-8">
        {/* New Post Form */}
        <section className="max-w-2xl mx-auto bg-gray-900 p-4 rounded-lg shadow-md space-y-4 border border-gray-800">
          <h2 className="text-xl font-semibold text-white">New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
              rows={2}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-900 text-gray-300"
            />
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="rounded mt-2 max-h-48 object-cover" />
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
            >
              Post
            </button>
          </form>
        </section>

        {/* Feed */}
        <section className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white">Your Feed</h2>
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-800"
            >
              <div className="text-sm text-gray-400 mb-1">@{post.author}</div>
              <div className="text-white text-lg font-medium mb-2">{post.content}</div>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="post visual"
                  className="rounded mb-2 max-h-64 object-cover"
                />
              )}
              <div className="text-xs text-gray-500 mb-2">
                {new Date(post.created_at).toLocaleString()}
              </div>
              {/* Comments Section */}
              <CommentDisplay postId={post.id} />
            </div>
          ))}
        </section>

        <div className="text-green-400 text-sm mt-6 text-center">{message}</div>
      </main>

      <footer className="w-full p-4 border-t border-gray-800 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ZiiOZ · All rights reserved
      </footer>
    </div>
  );
}

export default App;
