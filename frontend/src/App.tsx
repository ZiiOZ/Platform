import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickPublic from './components/ZiiFlickPublic';
import ZiiPostFeed from './components/ZiiPostFeed'; // ✅

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ZiiFlickUpload />} />
        <Route path="/ziiflicks" element={<ZiiFlickPublic />} />
        <Route path="/ziiposts" element={<ZiiPostFeed />} /> {/* ✅ New route */}
      </Routes>
    </Router>
  );
}

export default App;
