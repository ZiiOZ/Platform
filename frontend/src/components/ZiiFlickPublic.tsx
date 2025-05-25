import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Flick {
  id: string;
  title: string;
  creator_name: string;
  video_url: string;
  tags: string;
  created_at: string;
}

function ZiiFlickPublic() {
  const [flicks, setFlicks] = useState<Flick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicFlicks = async () => {
      const { data, error } = await supabase
        .from('ZiiFlicks')
        .select('id, title, creator_name, tags, video_url, created_at')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (!error && data) setFlicks(data);
      setLoading(false);
    };

    fetchPublicFlicks();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🎬 Latest ZiiFlicks</h2>

      {loading ? (
        <p>Loading public flicks...</p>
      ) : flicks.length === 0 ? (
        <p className="text-gray-500">No flicks available to display.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {flicks.map((flick) => (
            <div key={flick.id} className="rounded-lg border shadow-sm p-4 bg-white">
              <h3 className="text-lg font-semibold">{flick.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                By: {flick.creator_name || 'Anonymous'} • {new Date(flick.created_at).toLocaleDateString()}
              </p>
              <video
                src={flick.video_url}
                controls
                className="w-full rounded mb-3 max-h-[340px]"
              />
              {flick.tags && (
                <p className="text-xs text-gray-600">Tags: {flick.tags}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ZiiFlickPublic;
