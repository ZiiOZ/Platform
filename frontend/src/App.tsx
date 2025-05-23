import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/`)
      .then(res => res.text())
      .then(data => setMessage(data))
.catch((err) => {
  console.error(err);
  setMessage("Failed to connect to backend");
});

  }, []);

  return (
    <div className="app">
      <h1>🚀 ZiiOZ Platform</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
