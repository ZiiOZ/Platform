import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ZiiFlick {
  id: string;
  title: string;
  video_url: string;
  creator_name: string;
  tags: string[];
  created_at: string;
  is_visible: boolean;
}

function ZiiFlickFeed() {
  const [flicks, setFlicks] = useState<ZiiFlick[]>([]);
  const [search, setSearch] = useState('');

  const fetchFlicks = async () => {
    const { data, error } = await supabase
      .from('ziiflicks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setFlicks(data as ZiiFlick[]);
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('ziiflicks')
      .update({ is_visible: !current })
      .eq('id', id);

    if (!error) fetchFlicks();
  };

  useEffect(() => {
    fetchFlicks();
  }, []);

  const filteredFlicks = flicks.filter(flick =>
    flick.title.toLowerCase().includes(search.toLowerCase()) ||
    flick.creator_name.toLowerCase().includes(search.toLowerCase()) ||
    flick.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">ZiiFlick Preview (Admin Control)</h2>
      <input
        type="text"
        placeholder="Search by title, creator or tag..."
        className="mb-4 w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredFlicks.length === 0 ? (
        <p className="text-gray-500 text-center">No flicks yet.</p>
      ) : (
        <div className="space-y-6">
          {filteredFlicks.map(flick => (
            <div key={flick.id} className="border p-3 rounded shadow-sm">
              <video src={flick.video_url} controls className="w-full rounded mb-2" />
              <h3 className="font-semibold">{flick.title}</h3>
              <p className="text-sm text-gray-500">By: {flick.creator_name}</p>
              <p className="text-xs text-gray-400">
                Tags: {flick.tags?.join(', ') || '—'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(flick.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => toggleVisibility(flick.id, flick.is_visible)}
                className={`mt-2 text-sm px-3 py-1 rounded ${
                  flick.is_visible ? 'bg-red-600' : 'bg-green-600'
                } text-white`}
              >
                {flick.is_visible ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickFeed;
