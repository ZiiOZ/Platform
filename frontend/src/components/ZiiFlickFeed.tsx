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

  const toggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('ZiiFlicks')
      .update({ is_visible: !current })
      .eq('id', id);
    if (!error) fetchFlicks();
  };

  const deleteFlick = async (id: string) => {
    const confirm = window.confirm('Delete this ZiiFlick?');
    if (!confirm) return;

    const { error } = await supabase.from('ZiiFlicks').delete().eq('id', id);
    if (!error) fetchFlicks();
  };

  useEffect(() => {
    fetchFlicks();
  }, []);

  return (
    <div className="mt-10">
      <h3 className="text-md font-semibold mb-3">ZiiFlick Preview (Admin Control)</h3>
      {loading ? (
        <p>Loading...</p>
      ) : flicks.length === 0 ? (
        <p>No flicks yet.</p>
      ) : (
        <div className="grid gap-4">
          {flicks.map((flick) => (
            <div key={flick.id} className="border p-3 rounded shadow bg-white">
              <h4 className="text-lg font-semibold">{flick.title}</h4>
              <p className="text-sm text-gray-600">
                Creator: {flick.creator_name || 'Unknown'} | Tags: {flick.tags || '—'}
              </p>
              <video
                controls
                src={flick.video_url}
                className="w-full mt-2 rounded max-h-[400px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Uploaded: {new Date(flick.created_at).toLocaleString()}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <button
                  onClick={() => toggleVisibility(flick.id, flick.is_visible)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  {flick.is_visible ? 'Hide' : 'Make Visible'}
                </button>
                <button
                  onClick={() => deleteFlick(flick.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
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
