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
      let image_url = '';

      // ✅ Upload image to Supabase Storage (post-images)
      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, image, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        image_url = publicUrlData?.publicUrl || '';
        console.log('✅ Image URL:', image_url);
      }

      // ✅ Call backend AI API to get hook and hashtags
      const aiRes = await fetch('https://ziioz-backend-platform.onrender.com/api/ai-post-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const aiData = await aiRes.json();

      // ✅ Insert post into Supabase
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
      console.error('❌ Upload failed:', err);
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
