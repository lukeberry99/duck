import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getChallengesForCodeType, isChallengeUnlocked } from '../data/performanceChallenges';

export default function PerformanceChallenges() {
  const { 
    currentCodeType, 
    bugsFixed, 
    completedChallenges, 
    debugSessions,
    startPerformanceChallenge,
    completePerformanceChallenge
  } = useGameStore();

  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [challengeStartTime, setChallengeStartTime] = useState<number | null>(null);
  const [challengeProgress, setChallengeProgress] = useState(0);

  const challenges = getChallengesForCodeType(currentCodeType);

  const handleStartChallenge = (challengeId: string) => {
    const success = startPerformanceChallenge(challengeId);
    if (success) {
      setActiveChallengeId(challengeId);
      setChallengeStartTime(Date.now());
      setChallengeProgress(0);
    }
  };

  const handleCompleteChallenge = () => {
    if (!activeChallengeId || !challengeStartTime) return;
    
    const timeUsed = (Date.now() - challengeStartTime) / 1000;
    const success = completePerformanceChallenge(activeChallengeId, timeUsed);
    
    setActiveChallengeId(null);
    setChallengeStartTime(null);
    setChallengeProgress(0);
    
    return success;
  };

  const activeChallenge = challenges.find(c => c.id === activeChallengeId);
  const timeRemaining = activeChallenge && challengeStartTime 
    ? Math.max(0, activeChallenge.timeLimit - (Date.now() - challengeStartTime) / 1000)
    : 0;

  // Unlock challenges at 300 bugs fixed
  if (bugsFixed < 300) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Performance Challenges</h3>
        <div className="text-gray-400 text-center py-4">
          🔒 Performance challenges unlock at 300 bugs fixed
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3">Performance Challenges</h3>
      
      {/* Active Challenge */}
      {activeChallenge && (
        <div className="mb-4 p-4 bg-red-900 rounded-lg border-2 border-red-600">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-red-400">
              🎯 {activeChallenge.name}
            </h4>
            <div className="text-right">
              <div className="text-red-300 font-bold">
                {Math.floor(timeRemaining / 60)}:{(Math.floor(timeRemaining % 60)).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-red-400">
                {challengeProgress}/{activeChallenge.targetBugs} bugs
              </div>
            </div>
          </div>
          
          <div className="text-sm text-red-200 mb-2">
            {activeChallenge.description}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-red-800 rounded-full h-3 mb-3">
            <div 
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(challengeProgress / activeChallenge.targetBugs) * 100}%` }}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setChallengeProgress(Math.min(challengeProgress + 1, activeChallenge.targetBugs))}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Debug (+1)
            </button>
            
            {challengeProgress >= activeChallenge.targetBugs && (
              <button
                onClick={handleCompleteChallenge}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Complete Challenge
              </button>
            )}
            
            <button
              onClick={() => {
                setActiveChallengeId(null);
                setChallengeStartTime(null);
                setChallengeProgress(0);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Abandon
            </button>
          </div>
        </div>
      )}
      
      {/* Available Challenges */}
      {!activeChallenge && (
        <div className="space-y-2">
          {challenges.map(challenge => {
            const isUnlocked = isChallengeUnlocked(challenge, { bugsFixed, completedChallenges, debugSessions });
            const isCompleted = completedChallenges.includes(challenge.id);
            
            const difficultyColors = {
              easy: 'border-green-600 bg-green-900',
              medium: 'border-yellow-600 bg-yellow-900',
              hard: 'border-orange-600 bg-orange-900',
              expert: 'border-red-600 bg-red-900'
            };
            
            return (
              <div
                key={challenge.id}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200
                  ${isCompleted 
                    ? 'bg-gray-700 border-gray-500' 
                    : isUnlocked 
                      ? `${difficultyColors[challenge.difficulty]} hover:opacity-80 cursor-pointer`
                      : 'bg-gray-900 border-gray-600'
                  }
                `}
                onClick={() => isUnlocked && !isCompleted && handleStartChallenge(challenge.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className={`font-semibold ${isCompleted ? 'text-gray-400' : 'text-white'}`}>
                      {isCompleted ? '✅' : '🎯'} {challenge.name}
                    </div>
                    <div className="text-sm text-gray-300">{challenge.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">
                      {challenge.difficulty.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-300">
                      {challenge.timeLimit}s • {challenge.targetBugs} bugs
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-300">
                    Rewards: {challenge.rewards.codeQuality} CQ, {challenge.rewards.architecturePoints} AP
                    {challenge.rewards.title && (
                      <span className="text-yellow-400 ml-1">+ "{challenge.rewards.title}"</span>
                    )}
                  </div>
                  
                  {isCompleted && (
                    <span className="text-green-400 text-sm font-semibold">
                      COMPLETED
                    </span>
                  )}
                  
                  {!isUnlocked && (
                    <span className="text-gray-500 text-sm">
                      Unlock: {challenge.unlockCondition.value} {challenge.unlockCondition.type}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}