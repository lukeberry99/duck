import DebugButton from './components/DebugButton';
import ResourceDisplay from './components/ResourceDisplay';
import DebugLog from './components/DebugLog';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-800 text-green-400 font-mono">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">DuckOS: The Quacking</h1>
          <p className="text-gray-400">Debug code with the help of sentient rubber ducks</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Resources and Debug Button */}
          <div className="lg:col-span-1 space-y-6">
            <ResourceDisplay />
            <div className="text-center">
              <DebugButton />
            </div>
          </div>
          
          {/* Right Panel - Debug Log */}
          <div className="lg:col-span-2">
            <DebugLog />
          </div>
        </div>
      </div>
    </div>
  );
}
