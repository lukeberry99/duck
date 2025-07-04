import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

interface DebugMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DebugMenu({ isOpen, onClose }: DebugMenuProps) {
  const { reset, addCodeQuality, addLogEntry, incrementBugsFixed, bugsFixed, codeQuality, ducks } = useGameStore();
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleReset = () => {
    reset();
    setLastAction('Game progress reset to 0');
    addLogEntry('[DEBUG] Game progress has been reset', 'warning');
  };

  const handleAddCQ = (amount: number) => {
    addCodeQuality(amount);
    setLastAction(`Added ${amount.toLocaleString()} Code Quality points`);
    addLogEntry(`[DEBUG] Added ${amount.toLocaleString()} Code Quality points`, 'info');
  };

  const handleAddBugs = (amount: number) => {
    incrementBugsFixed(amount);
    setLastAction(`Added ${amount.toLocaleString()} bugs fixed`);
    addLogEntry(`[DEBUG] Added ${amount.toLocaleString()} bugs fixed`, 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-6 max-w-md w-full mx-4 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-green-400 text-xl font-bold">
            <span className="text-red-400">[DEBUG]</span> Developer Menu
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-900 border border-red-400 rounded p-3 mb-4">
          <p className="text-red-400 text-sm">
            <span className="font-bold">⚠️ WARNING:</span> Debug commands will affect game progress
          </p>
        </div>

        {/* Current Game State */}
        <div className="bg-gray-800 border border-cyan-400 rounded p-3 mb-4">
          <h3 className="text-cyan-400 font-semibold mb-2">Current State</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div>Bugs Fixed: <span className="text-green-400">{bugsFixed.toLocaleString()}</span></div>
            <div>Code Quality: <span className="text-blue-400">{codeQuality.toLocaleString()}</span></div>
            <div>Ducks: <span className="text-yellow-400">{ducks.length}</span></div>
          </div>
        </div>

        {/* Last Action */}
        {lastAction && (
          <div className="bg-gray-800 border border-yellow-400 rounded p-2 mb-4">
            <p className="text-yellow-400 text-sm">
              <span className="text-green-400">&gt;</span> {lastAction}
            </p>
          </div>
        )}

        {/* Debug Actions */}
        <div className="space-y-3">
          <div className="border-b border-gray-700 pb-2">
            <h3 className="text-green-400 font-semibold mb-2">Game State</h3>
            <button
              onClick={handleReset}
              className="w-full bg-red-800 hover:bg-red-700 text-red-400 border border-red-400 rounded px-3 py-2 text-sm transition-colors"
            >
              <span className="font-bold">RESET</span> - Clear all progress
            </button>
          </div>

          <div className="border-b border-gray-700 pb-2">
            <h3 className="text-green-400 font-semibold mb-2">Code Quality Points</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddCQ(100)}
                className="bg-blue-800 hover:bg-blue-700 text-blue-400 border border-blue-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +100 CQ
              </button>
              <button
                onClick={() => handleAddCQ(1000)}
                className="bg-blue-800 hover:bg-blue-700 text-blue-400 border border-blue-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +1K CQ
              </button>
              <button
                onClick={() => handleAddCQ(10000)}
                className="bg-blue-800 hover:bg-blue-700 text-blue-400 border border-blue-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +10K CQ
              </button>
              <button
                onClick={() => handleAddCQ(100000)}
                className="bg-blue-800 hover:bg-blue-700 text-blue-400 border border-blue-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +100K CQ
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-green-400 font-semibold mb-2">Bugs Fixed</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddBugs(10)}
                className="bg-green-800 hover:bg-green-700 text-green-400 border border-green-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +10 Bugs
              </button>
              <button
                onClick={() => handleAddBugs(100)}
                className="bg-green-800 hover:bg-green-700 text-green-400 border border-green-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +100 Bugs
              </button>
              <button
                onClick={() => handleAddBugs(1000)}
                className="bg-green-800 hover:bg-green-700 text-green-400 border border-green-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +1K Bugs
              </button>
              <button
                onClick={() => handleAddBugs(10000)}
                className="bg-green-800 hover:bg-green-700 text-green-400 border border-green-400 rounded px-3 py-2 text-sm transition-colors"
              >
                +10K Bugs
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-xs text-center">
            Press <span className="bg-gray-800 px-1 rounded">ESC</span> to close • 
            Press <span className="bg-gray-800 px-1 rounded">D</span> to toggle debug menu
          </p>
        </div>
      </div>
    </div>
  );
}