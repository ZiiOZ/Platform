// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZiiPostForm from './components/ZiiPostForm';
import ZiiPostFeed from './components/ZiiPostFeed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ziipostform" element={<ZiiPostForm />} />
        <Route path="/ziiposts" element={<ZiiPostFeed />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
