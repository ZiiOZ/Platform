import { useState } from 'react';
import { supabase } from '../supabaseClient';

function ZiiFlickUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const handleGenerateTags = async () => {
    if (!title && !file) return;

    const input = `${title || ''} ${file?.name || ''}`;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    const data = await response.json();
    if (data?.tags) {
      setSuggestedTags(data.tags);
      setTags(data.tags.join(', '));
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setStatus('Title and file are required');
      return;
    }

    setUploading(true);
    setStatus('');

    const filename = `${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('ziiflicks')
      .upload(filename, file);

    if (storageError) {
      console.error(storageError);
      setStatus('Upload failed');
      setUploading(false);
      return;
    }

    const { data: publicURLData } = supabase
      .storage
      .from('ziiflicks')
      .getPublicUrl(filename);

    const { error: insertError } = await supabase
      .from('ziiflicks')
      .insert([
        {
          title,
          video_url: publicURLData.publicUrl,
          creator_name: creatorName || 'Admin',
          tags: tags.split(',').map(t => t.trim()),
          is_visible: false
        }
      ]);

    if (insertError) {
      console.error(insertError);
      setStatus('Database insert failed');
    } else {
      setStatus('✅ Flick uploaded (hidden)');
      setFile(null);
      setTitle('');
      setCreatorName('');
      setTags('');
      setSuggestedTags([]);
    }

    setUploading(false);
  };

  return (
    <div className="bg-gray-100 rounded p-4">
      <h2 className="text-xl font-bold mb-2">Upload ZiiFlick (Internal Only)</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 p-1 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Creator (optional)"
        className="w-full mb-2 p-1 border rounded"
        value={creatorName}
        onChange={(e) => setCreatorName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="w-full mb-2 p-1 border rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="flex justify-between items-center mb-2">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded ml-2"
          onClick={handleGenerateTags}
        >
          Suggest Tags
        </button>
      </div>
      {suggestedTags.length > 0 && (
        <p className="text-xs text-gray-600 mb-2">Suggested: {suggestedTags.join(', ')}</p>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {uploading ? 'Uploading...' : 'Upload Flick'}
      </button>
      {status && <p className="text-sm mt-2 text-center">{status}</p>}
    </div>
  );
}

export default ZiiFlickUpload;
