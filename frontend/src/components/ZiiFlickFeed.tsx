// src/components/ZiiFlickFeed.tsx

import { useEffect, useState } from 'react';
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

function ZiiFlickFeed() {
  const [flicks, setFlicks] = useState<Flick[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFlicks = async () => {
    const { data, error } = await supabase
      .from('ZiiFlicks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setFlicks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlicks();
  }, []);

  const handleToggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('ZiiFlicks')
      .update({ is_visible: !current })
      .eq('id', id);

    if (error) {
      alert('Toggle failed: ' + error.message);
    } else {
      fetchFlicks();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this flick?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('ZiiFlicks').delete().eq('id', id);

    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      fetchFlicks();
    }
  };

  const filteredFlicks = flicks.filter((flick) =>
    flick.title.toLowerCase().includes(search.toLowerCase()) ||
    flick.creator_name?.toLowerCase().includes(search.toLowerCase()) ||
    flick.tags?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold mb-2">ZiiFlick Preview (Admin Control)</h3>
      <input
        type="text"
        placeholder="Search by title, creator or tags"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1 mb-3 w-full max-w-sm"
      />
      {loading ? (
        <p>Loading...</p>
      ) : filteredFlicks.length === 0 ? (
        <p>No flicks yet.</p>
      ) : (
        <div className="grid gap-4">
          {filteredFlicks.map((flick) => (
            <div key={flick.id} className="border p-3 rounded shadow">
              <h4 className="text-md font-bold">{flick.title}</h4>
              <p className="text-sm text-gray-600">
                Creator: {flick.creator_name || 'Unknown'} | Tags: {flick.tags || 'None'}
              </p>
              <video controls src={flick.video_url} className="w-full mt-2 max-h-[360px]" />
              <p className="text-xs text-gray-500 mt-1">
                Uploaded: {new Date(flick.created_at).toLocaleString()}
              </p>
              <div className="flex items-center mt-2 gap-3">
                <button
                  onClick={() => handleToggleVisibility(flick.id, flick.is_visible)}
                  className="text-sm px-2 py-1 rounded bg-blue-600 text-white"
                >
                  {flick.is_visible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDelete(flick.id)}
                  className="text-sm px-2 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickFeed;
