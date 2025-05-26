// src/components/ZiiFlickManager.tsx

import { useState } from 'react';
import ZiiFlickUpload from './ZiiFlickUpload';
import ZiiFlickFeed from './ZiiFlickFeed';

function ZiiFlickManager() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ZiiFlickUpload onUploadComplete={() => setRefresh(prev => !prev)} />
      <ZiiFlickFeed refresh={refresh} />
    </div>
  );
}

export default ZiiFlickManager;
