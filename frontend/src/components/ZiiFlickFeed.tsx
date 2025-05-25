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

    if (!error && data) setFlicks(data);
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

    if (!error) fetchFlicks();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this flick?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('ZiiFlicks').delete().eq('id', id);
    if (!error) fetchFlicks();
  };

  const filteredFlicks = flicks.filter((flick) =>
    flick.title.toLowerCase().includes(search.toLowerCase()) ||
    flick.creator_name?.toLowerCase().includes(search.toLowerCase()) ||
    flick.tags?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">ZiiFlick Admin Panel</h3>

      <input
        type="text"
        placeholder="Search by title, creator or tags"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-2 border border-gray-300 rounded mb-6"
      />

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : filteredFlicks.length === 0 ? (
        <p className="text-gray-500 italic">No flicks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFlicks.map((flick) => (
            <div key={flick.id} className="rounded-lg border shadow-md p-4 bg-white">
              <h4 className="text-lg font-semibold">{flick.title}</h4>
              <p className="text-sm text-gray-600 mb-1">
                By: {flick.creator_name || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Tags: {flick.tags || '—'} • {new Date(flick.created_at).toLocaleString()}
              </p>
              <video
                src={flick.video_url}
                controls
                className="w-full rounded mb-3 max-h-[340px]"
              />
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => handleToggleVisibility(flick.id, flick.is_visible)}
                  className={`flex-1 py-1 text-sm rounded ${
                    flick.is_visible
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                  }`}
                >
                  {flick.is_visible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDelete(flick.id)}
                  className="flex-1 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
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
