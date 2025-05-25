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
      is_visible: isVisible,
    });

    if (insertError) {
      alert('Insert failed: ' + insertError.message);
      console.error('Insert error:', insertError);
    } else {
      alert('Upload + Insert successful!');
      setTitle('');
      setCreator('');
      setTags('');
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mt-6">Upload ZiiFlick (Internal Only)</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-1 m-1"
      />
      <input
        type="text"
        placeholder="Creator (optional)"
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
        className="border p-1 m-1"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border p-1 m-1"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="p-1 m-1"
      />
      <label className="block mt-2 ml-1">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={() => setIsVisible(!isVisible)}
          className="mr-1"
        />
        Publish Now
      </label>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-black text-white px-4 py-1 mt-3 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload Flick'}
      </button>
    </div>
  );
}

export default ZiiFlickUpload;
