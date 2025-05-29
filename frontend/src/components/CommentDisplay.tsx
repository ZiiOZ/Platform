import { useState } from 'react';
import { supabase } from '../supabaseClient'; // ✅ GOOD PATH for frontend

interface CommentProps {
  id: number;
  content: string;
  boosts: number;
  created_at: string;
  post_id: number;
  profile_id?: string;
}

export default function CommentDisplay({ comment }: { comment: CommentProps }) {
  const [boosts, setBoosts] = useState(comment.boosts || 0);

  const handleBoost = async () => {
    const { error } = await supabase
      .from('comments')
      .update({ boosts: boosts + 1 })
      .eq('id', comment.id);

    if (!error) {
      setBoosts(boosts + 1);
    }
  };

  return (
    <div className="bg-gray-800 p-2 rounded mt-2 text-white border border-gray-700">
      <p className="text-sm">{comment.content}</p>
      <div className="text-xs text-gray-400 mt-1">{new Date(comment.created_at).toLocaleString()}</div>
      <button
        className="mt-2 px-2 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 text-sm"
        onClick={handleBoost}
      >
        ⚡ Boost ({boosts})
      </button>
    </div>
  );
}
