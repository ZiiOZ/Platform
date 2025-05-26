import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickManager from './components/ZiiFlickManager';
import ZiiFlickPublic from './components/ZiiFlickPublic';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ZiiFlickManager />} />
        <Route path="/ziiflicks" element={<ZiiFlickPublic />} />
      </Routes>
    </Router>
  );
}

export default App;
