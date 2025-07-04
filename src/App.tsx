import DebugButton from './components/DebugButton';
import ResourceDisplay from './components/ResourceDisplay';
import DebugLog from './components/DebugLog';
import UpgradePanel from './components/UpgradePanel';
import OfflineProgressModal from './components/OfflineProgressModal';
import FloatingNumbers from './components/FloatingNumbers';
import ProgressIndicators from './components/ProgressIndicators';
import DuckCollection from './components/DuckCollection';
import StatisticsPanel from './components/StatisticsPanel';
import DebugMenu from './components/DebugMenu';
import { useGameLoop } from './hooks/useGameLoop';
import { useAutoSave } from './hooks/useAutoSave';
import { useDebugMenu } from './hooks/useDebugMenu';
import { useGameStore } from './stores/gameStore';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'debug' | 'collection' | 'stats'>('debug');
  useGameLoop();
  useAutoSave();
  const { isDebugMenuOpen, closeDebugMenu } = useDebugMenu();
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const ducks = useGameStore((state) => state.ducks);

  const tabs = [
    { id: 'debug', label: 'Debug', icon: '🐛' },
    { id: 'collection', label: 'Ducks', icon: '🦆', badge: ducks.length > 0 ? ducks.length : null },
    { id: 'stats', label: 'Stats', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-800 text-green-400 font-mono">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <header className="text-center mb-6 md:mb-8 relative">
          <h1 className="text-2xl md:text-4xl font-bold text-green-400 mb-2">DuckOS: The Quacking</h1>
          <p className="text-gray-400 text-sm md:text-base">Debug code with the help of sentient rubber ducks</p>
          
          {/* Debug Menu Indicator */}
          <div className="absolute top-0 right-0 text-xs text-gray-500 font-mono">
            <span className="bg-gray-800 px-1 rounded">D</span> = Debug
          </div>
        </header>
        
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-gray-900 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-green-900 text-green-400'
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Resources and Debug Button */}
          <div className="lg:col-span-1 space-y-6">
            <ResourceDisplay />
            <div className="text-center">
              <DebugButton />
            </div>
            <ProgressIndicators />
          </div>
          
          {/* Middle Panel - Upgrades */}
          <div className="lg:col-span-1 space-y-6">
            <UpgradePanel />
          </div>
          
          {/* Right Panel - Debug Log and Collections */}
          <div className="lg:col-span-2 space-y-6">
            <DebugLog />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DuckCollection />
              <StatisticsPanel />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="mb-6">
            <ResourceDisplay />
            <div className="text-center mt-4">
              <DebugButton />
            </div>
          </div>

          {activeTab === 'debug' && (
            <div className="space-y-6">
              <ProgressIndicators />
              <UpgradePanel />
              <DebugLog />
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="space-y-6">
              <DuckCollection />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <StatisticsPanel />
            </div>
          )}
        </div>
      </div>
      
      <OfflineProgressModal />
      <FloatingNumbers trigger={bugsFixed} />
      <DebugMenu isOpen={isDebugMenuOpen} onClose={closeDebugMenu} />
    </div>
  );
}
