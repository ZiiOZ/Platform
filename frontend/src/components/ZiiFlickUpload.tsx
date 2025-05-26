// src/components/ZiiFlickUpload.tsx

import { useState } from 'react';
import { supabase } from '../supabaseClient';

function ZiiFlickUpload({ onUpload }: { onUpload?: () => void }) {
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) {
      alert('Please provide a title and video file.');
      return;
    }

    setLoading(true);

    const filePath = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from('ziiflicks')
      .upload(filePath, file);

    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const { data: publicData } = supabase
      .storage
      .from('ziiflicks')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('ziiflicks') // ✅ lowercase table name
      .insert([{
        title,
        creator_name: creatorName,
        tags,
        video_url: publicData.publicUrl,
        is_visible: isVisible,
      }]);

    if (insertError) {
      console.error('Insert Error:', insertError.message);
      alert(`Insert failed: ${insertError.message}`);
    } else {
      alert('ZiiFlick uploaded successfully!');
      setTitle('');
      setCreatorName('');
      setTags('');
      setFile(null);
      if (onUpload) onUpload();
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚀 Upload ZiiFlick (Internal Only)</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Creator (optional)"
        value={creatorName}
        onChange={(e) => setCreatorName(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="mr-2"
          />
          Publish Now
        </label>
      </div>
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {loading ? 'Uploading...' : 'Upload Flick'}
      </button>
    </div>
  );
}

export default ZiiFlickUpload;
