// src/components/ZiiPostForm.tsx

import { useState } from 'react';
import { supabase } from '../supabaseClient';

function ZiiPostForm() {
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePost = async () => {
    if (!content) return alert('Post content is required');
    setUploading(true);

    let imageUrl = '';
    if (file) {
      const filename = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('ziiposts').upload(filename, file);

      if (uploadError) {
        alert('Image upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }

      imageUrl = `https://jgxhjtdyaodffyhzzlpy.supabase.co/storage/v1/object/public/ziiposts/${filename}`;
    }

    const { error: insertError } = await supabase.from('posts').insert({
      content,
      creator_name: creator,
      image_url: imageUrl,
    });

    if (insertError) {
      alert('Post failed: ' + insertError.message);
    } else {
      alert('Post successful!');
      setContent('');
      setCreator('');
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">📝 Create ZiiPost</h2>
      <input
        type="text"
        placeholder="Your name (optional)"
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 mb-2 w-full h-32"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-4"
      />
      <button
        onClick={handlePost}
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        {uploading ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}

export default ZiiPostForm;
