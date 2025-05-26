import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickFeed from './components/ZiiFlickFeed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ZiiFlickFeed />} />
        <Route path="/upload" element={<ZiiFlickUpload />} />
        <Route path="/viewer" element={<ZiiFlickFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
