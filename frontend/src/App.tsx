// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickFeed from './components/ZiiFlickFeed';

function App() {
  return (
    <Router>
      <div className="p-6 font-sans">
        <h1 className="text-3xl font-bold mb-6">🚀 ZiiOZ Platform</h1>

        <Routes>
          <Route path="/" element={<ZiiFlickUpload />} />
          <Route path="/ziiflicks" element={<ZiiFlickFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
