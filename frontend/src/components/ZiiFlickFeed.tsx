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

  useEffect(() => {
    const fetchFlicks = async () => {
      const { data, error } = await supabase
        .from('ZiiFlicks')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error.message);
      } else {
        setFlicks(data);
      }
      setLoading(false);
    };

    fetchFlicks();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">🎬 Latest ZiiFlicks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : flicks.length === 0 ? (
        <p>No flicks available to display.</p>
      ) : (
        <div className="grid gap-6">
          {flicks.map((flick) => (
            <div key={flick.id} className="border rounded shadow p-4">
              <h3 className="text-lg font-bold mb-1">{flick.title}</h3>
              <video controls src={flick.video_url} className="w-full max-h-[400px] mb-2" />
              <p className="text-sm text-gray-600">
                By {flick.creator_name || 'Unknown'} • {new Date(flick.created_at).toLocaleString()}
              </p>
              {flick.tags && (
                <div className="mt-1 text-xs text-blue-600 italic">
                  Tags: {flick.tags.split(',').map(tag => <span key={tag} className="mr-1">#{tag.trim()}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickFeed;
