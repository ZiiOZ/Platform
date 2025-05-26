// src/components/ZiiFlickUpload.tsx

import { useState } from 'react';
import { supabase } from '../supabaseClient';

function ZiiFlickUpload() {
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) return alert('Title and file are required');
    setUploading(true);

    const filename = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('ziiflicks')
      .upload(filename, file);

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const video_url = `https://jgxhjtdyaodffyhzzlpy.supabase.co/storage/v1/object/public/ziiflicks/${filename}`;

    const { error: insertError } = await supabase.from('ZiiFlicks').insert({
      title,
      creator_name: creator,
      tags,
      video_url,
      is_visible: isVisible
    });

    setUploading(false);
    if (insertError) {
      console.error('Insert Error:', insertError.message);
      alert('Insert failed: ' + insertError.message);
    } else {
      setTitle('');
      setCreator('');
      setTags('');
      setFile(null);
      setIsVisible(true);
      alert('Upload + Insert successful!');
    }
  };

  const handleGenerateTags = async () => {
    if (!title) return alert('Enter a title to generate tags.');

    try {
      const res = await fetch('https://ziioz-backend-platform.onrender.com/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: title })
      });

      const data = await res.json();
      if (data?.tags) {
        setTags(data.tags.join(', '));
      } else {
        alert('No tags generated.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate tags.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">🚀 Upload ZiiFlick (Internal Only)</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Creator (optional)"
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button
          onClick={handleGenerateTags}
          className="ml-2 text-xs text-blue-700 underline"
        >
          Auto-generate tags
        </button>
      </div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-2"
      />
      <label className="block mb-4">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={() => setIsVisible(!isVisible)}
          className="mr-2"
        />
        Publish Now
      </label>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        {uploading ? 'Uploading...' : 'Upload Flick'}
      </button>
    </div>
  );
}

export default ZiiFlickUpload;
