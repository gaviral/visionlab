/**
 * Main App component with routing
 * Following design principles: Modular layout, clear separation of concerns
 */
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneContent } from './components/scene/SceneContent';
import { Layout } from './components/ui/Layout';
import { Toolbar } from './components/ui/Toolbar';
import { ArchitecturePage } from './components/ui/ArchitecturePage';
import { Button } from './components/ui/Button';
import './index.css';

type ViewMode = 'simulator' | 'architecture';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('simulator');

  if (viewMode === 'architecture') {
    return (
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 border-b border-gray-700 h-14 flex items-center px-6">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('simulator')}>
            ← Back to Vision Lab
          </Button>
          <h1 className="text-base font-semibold ml-4 text-white">
            Architecture Documentation
          </h1>
        </header>
        <ArchitecturePage />
      </div>
    );
  }

  return (
    <Layout>
      <Toolbar />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setViewMode('architecture')}
        className="absolute top-4 right-4 z-10"
      >
        View Architecture
      </Button>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SceneContent />
        <OrbitControls makeDefault />
      </Canvas>
    </Layout>
  );
}

export default App;
