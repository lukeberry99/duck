import { useGameStore } from '../stores/gameStore';
import { getBatchOperationsForCodeType, unlockBatchOperation } from '../data/batchOperations';

export default function BatchOperationsPanel() {
  const { 
    currentCodeType, 
    bugsFixed, 
    codeQuality, 
    completedChallenges,
    startBatchOperation 
  } = useGameStore();

  const availableOperations = getBatchOperationsForCodeType(currentCodeType);
  
  const handleStartBatchOperation = (operationId: string) => {
    startBatchOperation(operationId);
  };

  // Unlock batch operations at 200 bugs fixed
  if (bugsFixed < 200) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Batch Operations</h3>
        <div className="text-gray-400 text-center py-4">
          🔒 Batch operations unlock at 200 bugs fixed
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3">Batch Operations</h3>
      <div className="space-y-2">
        {availableOperations.map(operation => {
          const isUnlocked = unlockBatchOperation(operation.id, { bugsFixed, codeQuality, completedChallenges });
          const canAfford = codeQuality >= operation.cost;
          const isAvailable = isUnlocked && canAfford;
          
          return (
            <div
              key={operation.id}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200
                ${isAvailable 
                  ? 'bg-gray-700 border-green-600 hover:bg-gray-600' 
                  : 'bg-gray-900 border-gray-600'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-green-400">{operation.name}</div>
                  <div className="text-sm text-gray-300">{operation.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-400">
                    Cost: {operation.cost} CQ
                  </div>
                  <div className="text-xs text-gray-400">
                    {operation.batchSize} bugs @ {operation.efficiency}x
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  Total Output: {Math.floor(operation.batchSize * operation.efficiency)} bugs
                </div>
                <button
                  onClick={() => handleStartBatchOperation(operation.id)}
                  disabled={!isAvailable}
                  className={`
                    px-3 py-1 rounded text-sm font-medium transition-colors
                    ${isAvailable 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {!isUnlocked ? 'Locked' : !canAfford ? 'Not enough CQ' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}