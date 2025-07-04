import { useGameStore } from '../stores/gameStore';
import { formatNumber } from '../utils/calculations';

export default function StatisticsPanel() {
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const debugRate = useGameStore((state) => state.debugRate);
  const ducks = useGameStore((state) => state.ducks);
  const upgrades = useGameStore((state) => state.upgrades);

  const getPlaytime = () => {
    const firstDuck = ducks.reduce((earliest, duck) => {
      return duck.acquired < earliest ? duck.acquired : earliest;
    }, Date.now());
    
    if (ducks.length === 0) return 0;
    
    const playtimeMs = Date.now() - firstDuck;
    const playtimeHours = playtimeMs / (1000 * 60 * 60);
    return playtimeHours;
  };

  const getAchievements = () => {
    const achievements = [
      { name: 'First Steps', description: 'Fix your first bug', condition: bugsFixed >= 1 },
      { name: 'Duck Whisperer', description: 'Own your first duck', condition: ducks.length >= 1 },
      { name: 'Efficiency Expert', description: 'Reach 10 debug/sec', condition: debugRate >= 10 },
      { name: 'Quality Assurance', description: 'Accumulate 1000 Code Quality', condition: codeQuality >= 1000 },
      { name: 'Bug Crusher', description: 'Fix 100 bugs', condition: bugsFixed >= 100 },
      { name: 'Duck Army', description: 'Own 5 ducks', condition: ducks.length >= 5 },
      { name: 'Speed Demon', description: 'Reach 50 debug/sec', condition: debugRate >= 50 },
      { name: 'Code Master', description: 'Fix 1000 bugs', condition: bugsFixed >= 1000 },
      { name: 'Automation King', description: 'Purchase 10 upgrades', condition: upgrades.filter(u => u.purchased).length >= 10 },
      { name: 'Duck Collector', description: 'Own 10 ducks', condition: ducks.length >= 10 },
      { name: 'Quality Control', description: 'Accumulate 10,000 Code Quality', condition: codeQuality >= 10000 },
      { name: 'Debug Legend', description: 'Fix 10,000 bugs', condition: bugsFixed >= 10000 },
    ];

    return achievements;
  };

  const achievements = getAchievements();
  const completedAchievements = achievements.filter(a => a.condition);
  const playtimeHours = getPlaytime();
  const totalUpgrades = upgrades.filter(u => u.purchased).length;
  const totalDuckPower = ducks.reduce((sum, duck) => sum + duck.debugPower, 0);
  const avgDuckLevel = ducks.length > 0 ? ducks.reduce((sum, duck) => sum + duck.level, 0) / ducks.length : 0;

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
      <h2 className="text-green-400 text-xl font-bold mb-4">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">🐛 Debugging Stats</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Bugs Fixed:</span>
              <span className="text-white font-bold">{formatNumber(bugsFixed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Debug Rate:</span>
              <span className="text-blue-400 font-bold">{formatNumber(debugRate)}/sec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Code Quality:</span>
              <span className="text-yellow-400 font-bold">{formatNumber(codeQuality)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bugs/Hour:</span>
              <span className="text-green-400 font-bold">{formatNumber(debugRate * 3600)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">🦆 Duck Stats</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Ducks:</span>
              <span className="text-white font-bold">{ducks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Power:</span>
              <span className="text-blue-400 font-bold">{formatNumber(totalDuckPower)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average Level:</span>
              <span className="text-green-400 font-bold">{avgDuckLevel.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duck Types:</span>
              <span className="text-yellow-400 font-bold">{new Set(ducks.map(d => d.type)).size}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">⚙️ Progress Stats</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Upgrades Owned:</span>
              <span className="text-white font-bold">{totalUpgrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Upgrades:</span>
              <span className="text-gray-500">{upgrades.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completion:</span>
              <span className="text-green-400 font-bold">{((totalUpgrades / upgrades.length) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Session Time:</span>
              <span className="text-blue-400 font-bold">{playtimeHours.toFixed(1)}h</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">📊 Efficiency</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">CQ per Bug:</span>
              <span className="text-white font-bold">{bugsFixed > 0 ? (codeQuality / bugsFixed).toFixed(1) : '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Power per Duck:</span>
              <span className="text-blue-400 font-bold">{ducks.length > 0 ? (totalDuckPower / ducks.length).toFixed(1) : '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bugs per Hour:</span>
              <span className="text-green-400 font-bold">{formatNumber(debugRate * 3600)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CQ per Hour:</span>
              <span className="text-yellow-400 font-bold">{formatNumber(debugRate * 3600 * 5)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-3 rounded-lg">
        <h3 className="text-green-400 font-semibold mb-3">🏆 Achievements ({completedAchievements.length}/{achievements.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${
                achievement.condition
                  ? 'bg-green-900 border border-green-500'
                  : 'bg-gray-700 border border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {achievement.condition ? '✅' : '⏳'}
                </span>
                <div>
                  <p className={`font-semibold ${achievement.condition ? 'text-green-400' : 'text-gray-400'}`}>
                    {achievement.name}
                  </p>
                  <p className={`text-xs ${achievement.condition ? 'text-green-300' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}