import { useGameStore } from '../stores/gameStore';
import { duckTypes } from '../data/ducks';
import { formatNumber } from '../utils/calculations';
import type { DuckType } from '../types/game';

export default function DuckCollection() {
  const ducks = useGameStore((state) => state.ducks);

  const getDuckIcon = (type: DuckType) => {
    const icons = {
      rubber: '🦆',
      bath: '🛁', 
      pirate: '🏴‍☠️',
      fancy: '🎩',
      premium: '⭐',
      quantum: '⚛️',
      cosmic: '🌌'
    };
    return icons[type] || '🦆';
  };

  const getDuckStats = () => {
    const stats = new Map<DuckType, { count: number; totalPower: number; avgLevel: number }>();
    
    ducks.forEach(duck => {
      const existing = stats.get(duck.type) || { count: 0, totalPower: 0, avgLevel: 0 };
      stats.set(duck.type, {
        count: existing.count + 1,
        totalPower: existing.totalPower + duck.debugPower,
        avgLevel: existing.avgLevel + duck.level
      });
    });

    stats.forEach((value) => {
      if (value.count > 0) {
        value.avgLevel = value.avgLevel / value.count;
      }
    });

    return stats;
  };

  const duckStats = getDuckStats();
  const totalDucks = ducks.length;
  const totalPower = ducks.reduce((sum, duck) => sum + duck.debugPower, 0);

  if (totalDucks === 0) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
        <h2 className="text-green-400 text-xl font-bold mb-4">Duck Collection</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🦆</div>
          <p className="text-gray-400">No ducks yet</p>
          <p className="text-gray-500 text-sm">Purchase your first duck to start debugging automatically!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
      <h2 className="text-green-400 text-xl font-bold mb-4">Duck Collection</h2>
      
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-green-400 font-semibold">Total Ducks: {totalDucks}</p>
            <p className="text-blue-400 text-sm">Combined Power: {formatNumber(totalPower)} debug/sec</p>
          </div>
          <div className="text-4xl">🦆</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from(duckStats.entries()).map(([type, stats]) => {
          const duckInfo = duckTypes[type];
          
          return (
            <div key={type} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{getDuckIcon(type)}</div>
                <div>
                  <h3 className="text-green-400 font-semibold">{duckInfo.name}</h3>
                  <p className="text-gray-400 text-sm">{duckInfo.specialization}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Count</p>
                  <p className="text-yellow-400 font-bold">{stats.count}</p>
                </div>
                <div>
                  <p className="text-gray-500">Power</p>
                  <p className="text-blue-400 font-bold">{formatNumber(stats.totalPower)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg Level</p>
                  <p className="text-green-400 font-bold">{stats.avgLevel.toFixed(1)}</p>
                </div>
              </div>
              
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.totalPower / totalPower) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.totalPower / totalPower) * 100).toFixed(1)}% of total power
              </p>
            </div>
          );
        })}
      </div>

      {ducks.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">Recent Acquisitions</h3>
          <div className="space-y-1">
            {ducks
              .slice()
              .sort((a, b) => b.acquired - a.acquired)
              .slice(0, 3)
              .map(duck => (
                <div key={duck.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{getDuckIcon(duck.type)}</span>
                    <span className="text-gray-300">{duckTypes[duck.type].name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-400">Lv.{duck.level}</span>
                    <span className="text-gray-500 ml-2">
                      {new Date(duck.acquired).toLocaleDateString()}
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