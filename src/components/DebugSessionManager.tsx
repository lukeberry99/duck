import { useGameStore } from '../stores/gameStore';
import { codeTypeConfigs } from '../data/codeTypes';
import { calculateDuckEfficiency } from '../data/codeTypes';
import type { CodeType } from '../types/game';

export default function DebugSessionManager() {
  const { 
    debugSessions, 
    currentCodeType, 
    ducks, 
    bugsFixed,
    createDebugSession, 
    assignDuckToSession, 
    completeDebugSession 
  } = useGameStore();

  const activeSessions = debugSessions.filter(s => s.isActive);
  const completedSessions = debugSessions.filter(s => !s.isActive);
  const config = codeTypeConfigs[currentCodeType];

  const handleCreateSession = (difficulty: number) => {
    const sessionId = createDebugSession(currentCodeType, difficulty);
    return sessionId;
  };

  const handleAssignDuck = (sessionId: string, duckId: string) => {
    assignDuckToSession(sessionId, duckId);
  };

  const handleCompleteSession = (sessionId: string) => {
    completeDebugSession(sessionId);
  };

  const getDuckEfficiencyDisplay = (duckId: string, sessionCodeType: string) => {
    const duck = ducks.find(d => d.id === duckId);
    if (!duck) return '1.0x';
    
    const efficiency = calculateDuckEfficiency(duck.codeTypeSpecialty, sessionCodeType as CodeType);
    return `${efficiency.toFixed(1)}x`;
  };

  // Unlock sessions at 150 bugs fixed
  if (bugsFixed < 150) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Debug Sessions</h3>
        <div className="text-gray-400 text-center py-4">
          🔒 Debug sessions unlock at 150 bugs fixed
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3">Debug Sessions</h3>
      
      {/* Create New Session */}
      <div className="mb-4">
        <h4 className="text-md font-semibold text-green-300 mb-2">
          Create {config.name} Session
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => handleCreateSession(1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Easy (1x)
          </button>
          <button
            onClick={() => handleCreateSession(2)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
          >
            Medium (2x)
          </button>
          <button
            onClick={() => handleCreateSession(3)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Hard (3x)
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold text-green-300 mb-2">Active Sessions</h4>
          <div className="space-y-2">
            {activeSessions.map(session => (
              <div key={session.id} className="bg-gray-700 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-green-400">
                      {config.icon} {config.name} Session
                    </div>
                    <div className="text-sm text-gray-300">
                      {session.bugsRemaining}/{session.totalBugs} bugs remaining
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-400">
                      Difficulty: {session.difficulty}x
                    </div>
                    <div className="text-xs text-gray-400">
                      Reward: {session.rewards.codeQuality} CQ
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((session.totalBugs - session.bugsRemaining) / session.totalBugs) * 100}%` 
                    }}
                  />
                </div>
                
                {/* Assigned Ducks */}
                <div className="mb-2">
                  <div className="text-sm text-gray-300 mb-1">
                    Assigned Ducks ({session.assignedDucks.length}):
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {session.assignedDucks.map(duckId => {
                      const duck = ducks.find(d => d.id === duckId);
                      return duck ? (
                        <span key={duckId} className="bg-gray-600 text-xs px-2 py-1 rounded">
                          {duck.type} ({getDuckEfficiencyDisplay(duckId, session.codeType)})
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                
                {/* Duck Assignment */}
                <div className="flex gap-2 mb-2">
                  <select 
                    onChange={(e) => e.target.value && handleAssignDuck(session.id, e.target.value)}
                    className="bg-gray-600 text-white text-sm px-2 py-1 rounded"
                    value=""
                  >
                    <option value="">Assign Duck</option>
                    {ducks
                      .filter(duck => !session.assignedDucks.includes(duck.id))
                      .map(duck => (
                        <option key={duck.id} value={duck.id}>
                          {duck.type} (Level {duck.level}) - {getDuckEfficiencyDisplay(duck.id, session.codeType)}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                {/* Complete Session */}
                {session.bugsRemaining === 0 && (
                  <button
                    onClick={() => handleCompleteSession(session.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Complete Session
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-green-300 mb-2">Recent Completed</h4>
          <div className="space-y-1">
            {completedSessions.slice(-3).map(session => (
              <div key={session.id} className="bg-gray-700 rounded p-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-400">
                    {config.icon} {config.name} (Difficulty {session.difficulty}x)
                  </span>
                  <span className="text-gray-300">
                    +{session.rewards.codeQuality} CQ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}