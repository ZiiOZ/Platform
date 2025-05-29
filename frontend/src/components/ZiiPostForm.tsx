import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ZiiPostForm() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      // Upload image if provided
      let image_url = '';
      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('posts') // ✅ uses existing bucket
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);

        image_url = publicUrlData?.publicUrl || '';
      }

      // Call AI backend to enhance post
      const aiRes = await fetch('https://ziioz-backend-platform.onrender.com/api/ai-post-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const aiData = await aiRes.json();

      // Save post to Supabase
      const { error: insertError } = await supabase.from('posts').insert({
        username: 'Anonymous',
        content,
        image_url,
        hook: aiData.hook || '',
        hashtags: (aiData.hashtags || []).join(', '),
      });

      if (insertError) throw insertError;

      setContent('');
      setImage(null);
      alert('✅ Post uploaded with AI enhancements!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md space-y-4">
      <textarea
        className="w-full border border-gray-300 rounded p-2"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600"
      />
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Posting...' : 'Post with AI Boost'}
      </button>
    </div>
  );
}
