import { useState } from 'react';
import { supabase } from '../../../backend/supabaseClient';

interface BoostButtonProps {
  commentId: number;
  currentBoosts: number;
}

function BoostButton({ commentId, currentBoosts }: BoostButtonProps) {
  const [boosts, setBoosts] = useState<number>(currentBoosts ?? 0);
  const [boosting, setBoosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBoost = async () => {
    setBoosting(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ boosts: boosts + 1 })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setBoosts(data.boosts);
      }
    } catch (err: any) {
      setError("Failed to boost. Please try again.");
      console.error(err.message);
    } finally {
      setBoosting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBoost}
        disabled={boosting}
        className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded"
      >
        {boosting ? "Boosting..." : `🔥 Boost (${boosts})`}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default BoostButton;
