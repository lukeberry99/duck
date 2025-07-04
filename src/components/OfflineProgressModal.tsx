import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { formatNumber } from '../utils/calculations';

export default function OfflineProgressModal() {
  const [offlineProgress, setOfflineProgress] = useState<{
    bugsFixed: number;
    codeQuality: number;
    timeAway: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { calculateOfflineProgress } = useGameStore();

  useEffect(() => {
    // Check for offline progress on mount
    const progress = calculateOfflineProgress();
    
    if (progress.bugsFixed > 0 && progress.timeAway > 60000) { // Only show if away for more than 1 minute
      setOfflineProgress(progress);
      setShowModal(true);
    }
  }, [calculateOfflineProgress]);

  const handleClose = () => {
    setShowModal(false);
    setOfflineProgress(null);
  };

  if (!showModal || !offlineProgress) return null;

  const timeAwayText = () => {
    const minutes = Math.floor(offlineProgress.timeAway / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-green-400 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-green-400 mb-4 text-center">
          Welcome Back!
        </h2>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-300 text-center">
            You were away for {timeAwayText()}
          </p>
          
          <div className="bg-gray-900 p-4 rounded border border-green-400">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-green-400 text-sm">Bugs Fixed</div>
                <div className="text-yellow-400 text-lg font-bold">
                  +{formatNumber(offlineProgress.bugsFixed)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-400 text-sm">Code Quality</div>
                <div className="text-yellow-400 text-lg font-bold">
                  +{formatNumber(offlineProgress.codeQuality)}
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm text-center">
            Your ducks continued debugging while you were away!
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Continue Debugging
        </button>
      </div>
    </div>
  );
}