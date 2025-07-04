import { useGameStore } from '../stores/gameStore';
import { formatNumber } from '../utils/calculations';

export default function ProgressIndicators() {
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const debugRate = useGameStore((state) => state.debugRate);
  const ducks = useGameStore((state) => state.ducks);

  const getMilestones = () => {
    const milestones = [
      { name: 'First Duck', target: 100, current: bugsFixed, type: 'bugs', description: 'Unlock your first rubber duck' },
      { name: 'Automation', target: 250, current: bugsFixed, type: 'bugs', description: 'Unlock automation upgrades' },
      { name: 'Specialization', target: 500, current: bugsFixed, type: 'bugs', description: 'Unlock duck specialization' },
      { name: 'Enterprise', target: 1000, current: bugsFixed, type: 'bugs', description: 'Unlock enterprise features' },
      { name: 'Quantum Scale', target: 2500, current: bugsFixed, type: 'bugs', description: 'Unlock quantum debugging' },
      { name: 'Cosmic Level', target: 10000, current: bugsFixed, type: 'bugs', description: 'Unlock cosmic debugging' },
      { name: 'Code Quality', target: 5000, current: codeQuality, type: 'cq', description: 'Reach 5k Code Quality' },
      { name: 'Debug Rate', target: 50, current: debugRate, type: 'rate', description: 'Achieve 50 debug/sec' },
      { name: 'Duck Army', target: 10, current: ducks.length, type: 'ducks', description: 'Own 10 ducks' }
    ];

    return milestones.filter(milestone => milestone.current < milestone.target);
  };

  const getNextMilestone = () => {
    const milestones = getMilestones();
    return milestones.length > 0 ? milestones[0] : null;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const nextMilestone = getNextMilestone();
  const allMilestones = getMilestones().slice(0, 3);

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
      <h2 className="text-green-400 text-xl font-bold mb-4">Progress & Goals</h2>
      
      {nextMilestone && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-400 font-semibold">Next Milestone</h3>
            <span className="text-yellow-400 text-sm">
              {formatNumber(nextMilestone.current)} / {formatNumber(nextMilestone.target)}
            </span>
          </div>
          <div className="bg-gray-800 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(getProgressPercentage(nextMilestone.current, nextMilestone.target))}`}
              style={{ width: `${getProgressPercentage(nextMilestone.current, nextMilestone.target)}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-green-400 font-semibold">{nextMilestone.name}</p>
            <p className="text-gray-400 text-sm">{nextMilestone.description}</p>
          </div>
        </div>
      )}

      {allMilestones.length > 1 && (
        <div>
          <h3 className="text-green-400 font-semibold mb-3">Upcoming Goals</h3>
          <div className="space-y-2">
            {allMilestones.slice(1).map((milestone, index) => (
              <div key={`${milestone.name}-${index}`} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <div className="text-lg">
                    {milestone.type === 'bugs' && '🐛'}
                    {milestone.type === 'cq' && '⭐'}
                    {milestone.type === 'rate' && '⚡'}
                    {milestone.type === 'ducks' && '🦆'}
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{milestone.name}</p>
                    <p className="text-gray-500 text-xs">{milestone.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-sm font-bold">
                    {formatNumber(milestone.current)} / {formatNumber(milestone.target)}
                  </div>
                  <div className="bg-gray-700 rounded-full h-1 w-16 mt-1">
                    <div
                      className={`h-1 rounded-full ${getProgressColor(getProgressPercentage(milestone.current, milestone.target))}`}
                      style={{ width: `${getProgressPercentage(milestone.current, milestone.target)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allMilestones.length === 0 && (
        <div className="text-center py-4">
          <p className="text-green-400 text-lg">🎉 All major milestones achieved!</p>
          <p className="text-gray-400 text-sm">Keep debugging to unlock new content</p>
        </div>
      )}
    </div>
  );
}