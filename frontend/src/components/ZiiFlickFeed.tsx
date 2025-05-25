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

function ZiiFlickFeed({ reload }: { reload: boolean }) {
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

  useEffect(() => {
    fetchFlicks();
  }, [reload]);

  const toggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('ZiiFlicks')
      .update({ is_visible: !current })
      .eq('id', id);

    if (error) {
      alert('Failed to update visibility: ' + error.message);
    } else {
      fetchFlicks(); // refresh UI
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-md font-semibold mb-2">ZiiFlick Preview (Admin Control)</h3>
      {loading ? (
        <p>Loading...</p>
      ) : flicks.length === 0 ? (
        <p>No flicks yet.</p>
      ) : (
        <div className="grid gap-4">
          {flicks.map((flick) => (
            <div key={flick.id} className="border p-3 rounded shadow">
              <h4 className="text-md font-bold">{flick.title}</h4>
              <p className="text-sm text-gray-600">
                Creator: {flick.creator_name || 'Unknown'} | Tags: {flick.tags || 'None'}
              </p>
              <video controls src={flick.video_url} className="w-full mt-2 max-h-[360px]" />
              <p className="text-xs text-gray-500 mt-1">
                Uploaded: {new Date(flick.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => toggleVisibility(flick.id, flick.is_visible)}
                className={`text-xs px-2 py-1 rounded mt-2 ${
                  flick.is_visible ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {flick.is_visible ? '👁 Visible (Click to Hide)' : '🙈 Hidden (Click to Show)'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickFeed;
