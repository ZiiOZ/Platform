// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickFeed from './components/ZiiFlickFeed';
import ZiiFlickUpload from './components/ZiiFlickUpload';

function App() {
  return (
    <Router>
      <div className="p-4 font-sans">
        <h1 className="text-2xl font-bold mb-6">🚀 ZiiOZ Platform</h1>
        <Routes>
          <Route path="/" element={<ZiiFlickUpload />} />
          <Route path="/ziiflicks" element={<ZiiFlickFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
