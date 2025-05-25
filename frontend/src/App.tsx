import { useState } from 'react';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickFeed from './components/ZiiFlickFeed';

function App() {
  const [reloadFlag, setReloadFlag] = useState(false);

  return (
    <div className="p-6">
      <ZiiFlickUpload onUploadSuccess={() => setReloadFlag(!reloadFlag)} />
      <ZiiFlickFeed reload={reloadFlag} />
    </div>
  );
}

export default App;
