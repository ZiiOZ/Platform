import { useState } from 'react';
import { supabase } from './supabaseClient';

interface BoostButtonProps {
  commentId: number;
  currentBoosts: number;
}

function BoostButton({ commentId, currentBoosts }: BoostButtonProps) {
  const [boosts, setBoosts] = useState(currentBoosts);
  const [boosting, setBoosting] = useState(false);

  const handleBoost = async () => {
    setBoosting(true);
    const { data, error } = await supabase
      .from('comments')
      .update({ boosts: boosts + 1 })
      .eq('id', commentId);

    if (!error && data) {
      setBoosts(boosts + 1);
    }
    setBoosting(false);
  };

  return (
    <button
      onClick={handleBoost}
      disabled={boosting}
      className="ml-4 px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-black text-sm"
    >
      🔥 {boosts}
    </button>
  );
}

export default BoostButton;
