import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickPublic from './components/ZiiFlickPublic';
import ZiiPostFeed from './components/ZiiPostFeed';
import ZiiPostForm from './components/ZiiPostForm';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ZiiFlickUpload />} />
        <Route path="/ziiflicks" element={<ZiiFlickPublic />} />
        <Route path="/ziiposts" element={<ZiiPostFeed />} />
        <Route path="/create-post" element={<ZiiPostForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
