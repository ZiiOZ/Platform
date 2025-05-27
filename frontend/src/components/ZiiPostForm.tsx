// src/components/ZiiPostForm.tsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ZiiPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, imageFile);

    if (error) {
      console.error('Image upload failed:', error.message);
      return null;
    }

    return supabase.storage.from('post-images').getPublicUrl(data.path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (imageFile) imageUrl = await handleImageUpload();

    const { error } = await supabase.from('posts').insert([
      {
        title,
        content,
        image_url: imageUrl,
        author: 'Anonymous',
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Failed to post.');
      console.error(error);
    } else {
      navigate('/ziiposts');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-4 mt-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Create a Post</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-lg text-sm"
        required
      />

      <textarea
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border rounded-lg h-32 text-sm"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="text-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default ZiiPostForm;
