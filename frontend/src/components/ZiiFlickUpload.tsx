// src/components/ZiiFlickUpload.tsx

import { useState } from 'react';
import { supabase } from '../supabaseClient';

interface Flick {
  id: string;
  title: string;
  creator_name: string;
  video_url: string;
  tags: string;
  created_at: string;
  is_visible: boolean;
}

function ZiiFlickUpload() {
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [publishNow, setPublishNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [latestFlick, setLatestFlick] = useState<Flick | null>(null);

  const handleUpload = async () => {
    if (!title || !file) {
      alert('Please enter a title and choose a file.');
      return;
    }

    setLoading(true);

    const filename = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('ziiflicks')
      .upload(filename, file);

    if (uploadError) {
      alert(`Upload failed: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const { data: publicData } = supabase
      .storage
      .from('ziiflicks')
      .getPublicUrl(filename);

    const publicURL = publicData.publicUrl;

    const { data: result, error: insertError } = await supabase
      .from('ziiflicks')
      .insert([
        {
          title,
          creator_name: creator || null,
          video_url: publicURL,
          tags,
          is_visible: publishNow
        }
      ])
      .select()
      .single();

    if (insertError) {
      alert(`Insert failed: ${insertError.message}`);
      setLoading(false);
      return;
    }

    alert('ZiiFlick uploaded successfully!');
    setLatestFlick({
      ...result,
      created_at: new Date().toISOString(),
    });

    setTitle('');
    setCreator('');
    setTags('');
    setFile(null);
    setPublishNow(true);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🚀 Upload ZiiFlick (Internal Only)</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Creator (optional)"
          value={creator}
          onChange={e => setCreator(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="video/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={publishNow}
            onChange={() => setPublishNow(!publishNow)}
          />
          Publish Now
        </label>
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Upload Flick'}
        </button>
      </div>

      {latestFlick && (
        <div className="mt-8 border rounded shadow p-4 bg-white">
          <h3 className="text-lg font-bold mb-1">{latestFlick.title}</h3>
          <video
            controls
            src={latestFlick.video_url}
            className="w-full max-h-[400px] mb-2 rounded"
          />
          <p className="text-sm text-gray-600">
            By {latestFlick.creator_name || 'Unknown'} • Just Now
          </p>
          {latestFlick.tags && (
            <div className="mt-1 text-xs text-blue-600 italic flex flex-wrap">
              {latestFlick.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  className="mr-2 mb-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ZiiFlickUpload() {
  return (
    <div className="p-4 text-center text-lg font-bold text-blue-600">
      ZiiFlick Upload Page
    </div>
  );
}


