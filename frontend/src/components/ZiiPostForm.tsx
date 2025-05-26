// src/components/ZiiPostForm.tsx

import { useState } from 'react';
import { supabase } from '../supabaseClient';

function ZiiPostForm() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!text.trim()) return alert('Post content required');
    setUploading(true);

    let imageUrl = '';
    if (image) {
      const fileName = `${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('ziiposts')
        .upload(fileName, image);

      if (uploadError) {
        alert('Image upload failed');
        setUploading(false);
        return;
      }

      imageUrl = `https://jgxhjtdyaodffyhzzlpy.supabase.co/storage/v1/object/public/ziiposts/${fileName}`;
    }

    const { error: insertError } = await supabase.from('ziiposts').insert({
      text,
      image_url: imageUrl,
    });

    setUploading(false);
    if (insertError) {
      alert('Post upload failed');
    } else {
      setText('');
      setImage(null);
      alert('Post uploaded successfully!');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">📝 Create ZiiPost</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What’s on your mind?"
        className="w-full border p-2 mb-3 rounded"
        rows={4}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}

export default ZiiPostForm;
