import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../backend/supabaseClient';

interface ZiiFlick {
  id: string;
  title: string;
  video_url: string;
  creator_name: string;
  tags: string[];
  created_at: string;
}

function ZiiFlickSwipe() {
  const [flicks, setFlicks] = useState<ZiiFlick[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    const fetchFlicks = async () => {
      const { data, error } = await supabase
        .from('ziiflicks')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFlicks(data as ZiiFlick[]);
      }
    };

    fetchFlicks();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const buffer = 200;

      videoRefs.current.forEach((video, index) => {
        if (!video) return;

        const rect = video.getBoundingClientRect();
        const inView = rect.top >= 0 && rect.top <= window.innerHeight - buffer;

        if (inView) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [flicks]);

  return (
    <div className="bg-black text-white min-h-screen overflow-y-scroll snap-y snap-mandatory">
      {flicks.map((flick, index) => (
        <div
          key={flick.id}
          className="w-full h-screen flex flex-col justify-center items-center p-4 snap-start"
        >
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            src={flick.video_url}
            controls
            muted
            className="w-full h-5/6 object-cover rounded-lg shadow-lg"
          />
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{flick.title}</h2>
            <p className="text-sm text-gray-300">By {flick.creator_name}</p>
            <p className="text-xs text-gray-400">
              Tags: {flick.tags?.join(', ') || '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(flick.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ZiiFlickSwipe;
