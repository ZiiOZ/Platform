import { useState } from 'react';
import { supabase } from './supabaseClient';

interface BoostButtonProps {
  commentId: number;
  currentBoosts: number;
}

export default function BoostButton({ commentId, currentBoosts }: BoostButtonProps) {
  const [boosts, setBoosts] = useState(currentBoosts);
  const [loading, setLoading] = useState(false);

  const handleBoost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .update({ boosts: boosts + 1 })
      .eq('id', commentId);

    if (!error && data) {
      setBoosts(boosts + 1);
    } else {
      console.error('Boost failed:', error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleBoost}
      disabled={loading}
      className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded"
    >
      🚀 Boost ({boosts})
    </button>
  );
}
