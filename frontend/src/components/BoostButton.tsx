import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface BoostButtonProps {
  postId: number;
  initialBoosts: number;
}

export function BoostButton({ postId, initialBoosts }: BoostButtonProps) {
  const [boosted, setBoosted] = useState(false);
  const [boosts, setBoosts] = useState(initialBoosts);

  useEffect(() => {
    const stored = localStorage.getItem(`boosted_post_${postId}`);
    setBoosted(stored === 'true');
  }, [postId]);

  const handleBoost = async () => {
    if (boosted) return;

    const { data, error } = await supabase
      .from('posts')
      .update({ boosts: boosts + 1 })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Boost failed:', error.message);
      return;
    }

    setBoosts((prev) => prev + 1);
    setBoosted(true);
    localStorage.setItem(`boosted_post_${postId}`, 'true');
  };

  return (
    <button
      onClick={handleBoost}
      disabled={boosted}
      className={`text-sm font-medium px-4 py-2 rounded-full transition ${
        boosted
          ? 'text-gray-400 bg-gray-100 border border-gray-300 cursor-not-allowed'
          : 'text-white bg-purple-600 hover:bg-purple-700 shadow active:scale-95'
      }`}
    >
      🚀 Boost ({boosts})
    </button>
  );
}
