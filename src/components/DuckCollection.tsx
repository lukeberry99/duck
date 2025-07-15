import { useGameStore } from '../stores/gameStore';
import { duckTypes, getDuckCost, isDuckUnlocked } from '../data/ducks';
import { formatNumber } from '../utils/calculations';
import type { DuckType } from '../types/game';
import { useState } from 'react';

export default function DuckCollection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const ducks = useGameStore((state) => state.ducks);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const achievements = useGameStore((state) => state.achievements);
  const purchaseDuck = useGameStore((state) => state.purchaseDuck);

  const handleDuckPurchase = (duckType: DuckType) => {
    purchaseDuck(duckType);
  };

  const availableDucks = (Object.keys(duckTypes) as DuckType[]).filter(duckType => 
    isDuckUnlocked(duckType, { bugsFixed, codeQuality, achievements })
  );

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

  const getDuckCount = (type: DuckType) => ducks.filter(d => d.type === type).length;

  const duckStats = getDuckStats();
  const totalDucks = ducks.length;
  const totalPower = ducks.reduce((sum, duck) => sum + duck.debugPower, 0);

  return (
    <div className="space-y-6">
      {/* Duck Store */}
      {availableDucks.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg border border-blue-400">
          <h2 className="text-blue-400 text-xl font-bold mb-4">Duck Store</h2>
          <div className="space-y-3">
            {availableDucks.map(duckType => {
              const duckInfo = duckTypes[duckType];
              const owned = getDuckCount(duckType);
              const cost = getDuckCost(duckType, owned);
              const canAfford = codeQuality >= cost;
              
              return (
                <div
                  key={duckType}
                  className={`p-3 rounded border ${
                    canAfford 
                      ? 'border-blue-400 bg-gray-800 hover:bg-gray-700' 
                      : 'border-gray-600 bg-gray-800 opacity-50'
                  } transition-all duration-200 relative`}
                  onMouseEnter={() => setHoveredItem(`duck-${duckType}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2">
                      <div className="text-2xl">{getDuckIcon(duckType)}</div>
                      <div>
                        <h4 className="text-blue-400 font-semibold">{duckInfo.name}</h4>
                        <p className="text-gray-400 text-sm">{duckInfo.description}</p>
                        <p className="text-cyan-400 text-xs mt-1">
                          {duckInfo.specialization} • {duckInfo.baseDebugPower} debug/sec
                        </p>
                        {owned > 0 && (
                          <p className="text-yellow-400 text-xs">Owned: {owned}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        {formatNumber(cost)} CQ
                      </div>
                    </div>
                  </div>
                  
                  {hoveredItem === `duck-${duckType}` && (
                    <div className="absolute z-10 bg-gray-900 border border-blue-400 rounded p-2 -top-2 left-full ml-2 w-64 shadow-lg">
                      <p className="text-xs text-gray-300">
                        <strong>Specialization:</strong> {duckInfo.specialization}<br/>
                        <strong>Base Power:</strong> {duckInfo.baseDebugPower} debug/sec<br/>
                        <strong>Cost scaling:</strong> Increases by ~15% per duck<br/>
                        <strong>Efficiency:</strong> Works automatically when purchased
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleDuckPurchase(duckType)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-4 rounded font-mono text-sm transition-colors ${
                      canAfford
                        ? 'bg-blue-900 hover:bg-blue-800 text-blue-400 border border-blue-400'
                        : 'bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'BUY DUCK' : 'INSUFFICIENT CQ'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Duck Collection */}
      <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
        <h2 className="text-green-400 text-xl font-bold mb-4">Duck Collection</h2>
        
        {totalDucks === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🦆</div>
            <p className="text-gray-400">No ducks yet</p>
            <p className="text-gray-500 text-sm">Purchase your first duck above to start debugging automatically!</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}