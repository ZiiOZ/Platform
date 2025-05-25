import './App.css';
import ZiiFlickUpload from './components/ZiiFlickUpload';
import ZiiFlickSwipe from './components/ZiiFlickSwipe';

function App() {
  return (
    <ZiiFlickSwipe />
  );
}


function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-black p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">🚀 ZiiOZ Platform v1</h1>
        <p className="text-sm text-gray-600">Internal ZiiFlick Admin Panel</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <ZiiFlickUpload />
        <ZiiFlickFeed />
      </div>
    </div>
  );
}

export default App;
