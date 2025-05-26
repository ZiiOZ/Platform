import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickPublic from './components/ZiiFlickPublic';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ZiiFlickUpload />} />
        <Route path="/ziiflicks" element={<ZiiFlickPublic />} />
      </Routes>
    </Router>
  );
}

export default App;
