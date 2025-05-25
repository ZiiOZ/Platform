import { useState } from 'react';
import { supabase } from '../supabaseClient';

function ZiiFlickUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

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
      setStatus('Upload to storage failed');
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
          tags: tags ? tags.split(',').map(t => t.trim()) : [],
          is_visible: false // default to hidden
        }
      ]);

    if (insertError) {
      console.error(insertError);
      setStatus('Failed to save flick metadata');
    } else {
      setStatus('✅ Flick uploaded (hidden)');
      setFile(null);
      setTitle('');
      setCreatorName('');
      setTags('');
    }

    setUploading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload ZiiFlick (Internal Only)</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 px-2 py-1 border rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Creator (optional)"
        className="w-full mb-2 px-2 py-1 border rounded"
        value={creatorName}
        onChange={e => setCreatorName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full mb-2 px-2 py-1 border rounded"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <input
        type="file"
        accept="video/*"
        className="w-full mb-2"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {uploading ? 'Uploading...' : 'Upload Flick'}
      </button>
      {status && <p className="mt-2 text-sm text-center">{status}</p>}
    </div>
  );
}

export default ZiiFlickUpload;
