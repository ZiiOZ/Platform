import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ZiiFlick {
  id: string;
  title: string;
  video_url: string;
  creator_name: string;
  tags: string[];
  created_at: string;
}

function ZiiFlickFeed() {
  const [flicks, setFlicks] = useState<ZiiFlick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlicks = async () => {
      const { data, error } = await supabase
        .from('ziiflicks')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setFlicks(data as ZiiFlick[]);
      }
      setLoading(false);
    };

    fetchFlicks();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ZiiFlick Preview (Internal)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : flicks.length === 0 ? (
        <p className="text-gray-500 text-center">No public flicks available.</p>
      ) : (
        <div className="space-y-6">
          {flicks.map(flick => (
            <div key={flick.id} className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold mb-2">{flick.title}</h3>
              <video
                src={flick.video_url}
                controls
                className="w-full rounded mb-2"
              />
              <p className="text-sm text-gray-600">By: {flick.creator_name}</p>
              <p className="text-xs text-gray-500">
                Tags: {flick.tags?.join(', ') || '—'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(flick.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickFeed;
