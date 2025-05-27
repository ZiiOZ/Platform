// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiPostForm from './components/ZiiPostForm';
import ZiiPostFeed from './components/ZiiPostFeed';
import ZiiPostDetail from './components/ZiiPostDetail';

...

<Routes>
  <Route path="/ziipostform" element={<ZiiPostForm />} />
  <Route path="/ziiposts" element={<ZiiPostFeed />} />
  <Route path="/post/:id" element={<ZiiPostDetail />} />
</Routes>



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ziipostform" element={<ZiiPostForm />} />
        <Route path="/ziiposts" element={<ZiiPostFeed />} />
        <Route path="*" element={<div className="p-6 text-center">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
