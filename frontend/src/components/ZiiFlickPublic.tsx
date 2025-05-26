// src/components/ZiiFlickPublic.tsx

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

function ZiiFlickPublic() {
  const [flicks, setFlicks] = useState<Flick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlicks = async () => {
      const { data, error } = await supabase
        .from('ZiiFlicks')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      console.log('✅ ZiiFlicks fetched:', data);
      if (error) {
        console.error('❌ Fetch error:', error.message);
      } else {
        setFlicks(data || []);
      }
      setLoading(false);
    };

    fetchFlicks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        🎬 Latest ZiiFlicks
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : flicks.length === 0 ? (
        <p className="text-gray-600 italic">No flicks available to display.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {flicks.map((flick) => (
            <div key={flick.id} className="border rounded-lg shadow p-4 bg-white">
              <h3 className="text-lg font-bold mb-1">{flick.title}</h3>
              <video
                controls
                src={flick.video_url}
                className="w-full max-h-[360px] mb-2 rounded"
              />
              <p className="text-sm text-gray-600">
                By {flick.creator_name || 'Anonymous'} •{' '}
                {new Date(flick.created_at).toLocaleString()}
              </p>
              {flick.tags && (
                <div className="mt-1 text-xs text-blue-600 italic flex flex-wrap">
                  {flick.tags.split(',').map((tag) => (
                    <span
                      key={tag}
                      className="mr-2 mb-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickPublic;
