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

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('post-images') // Make sure this bucket exists in Supabase
      .upload(fileName, imageFile);

    if (error) {
      console.error('Image upload error:', error.message);
      return null;
    }

    const url = supabase.storage
      .from('post-images')
      .getPublicUrl(data.path).data.publicUrl;

    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }

    const { data, error } = await supabase.from('posts').insert([
      {
        title,
        content,
        image_url: imageUrl,
        author: 'Anonymous', // Replace with Supabase Auth user later
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Error submitting post');
      console.error(error);
    } else {
      alert('Post submitted!');
      navigate('/ziiposts');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Create a Post</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded h-32"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Submitting...' : 'Post'}
      </button>
    </form>
  );
};

export default ZiiPostForm;
