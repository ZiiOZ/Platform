import { useEffect, useState } from 'react';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickFeed from './components/ZiiFlickFeed';

function App() {
  return (
    <div>
      <ZiiFlickUpload />
      <ZiiFlickFeed />
    </div>
  );
}

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('https://ziioz-backend-platform.onrender.com/') // Replace with exact backend URL
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error(err);
        setMessage('❌ Backend error');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black text-center">
      <div>
        <h1 className="text-3xl font-bold mb-4">🚀 ZiiOZ Platform</h1>
        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
}

export default App;
