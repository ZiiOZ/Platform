// src/components/BoostButton.tsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

interface BoostButtonProps {
  commentId: number;
  currentBoosts: number;
}

function BoostButton({ commentId, currentBoosts }: BoostButtonProps) {
  const [boosts, setBoosts] = useState<number>(currentBoosts ?? 0);
  const [boosting, setBoosting] = useState(false);

  const handleBoost = async () => {
    setBoosting(true);
    const { data, error } = await supabase
      .from('comments')
      .update({ boosts: boosts + 1 })
      .eq('id', commentId)
      .select()
      .single();

    if (!error && data) {
      setBoosts(data.boosts);
    }
    setBoosting(false);
  };

  return (
    <button
      onClick={handleBoost}
      disabled={boosting}
      className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded"
    >
      🔥 Boost ({boosts})
    </button>
  );
}

export default BoostButton;
