import { useGameStore } from '../stores/gameStore';
import { formatNumber, isDependencyMet } from '../utils/calculations';
import { duckTypes, getDuckCost, isDuckUnlocked } from '../data/ducks';
import type { DuckType } from '../types/game';

export default function UpgradePanel() {
  const upgrades = useGameStore((state) => state.upgrades);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const ducks = useGameStore((state) => state.ducks);
  const purchaseUpgrade = useGameStore((state) => state.purchaseUpgrade);
  const purchaseDuck = useGameStore((state) => state.purchaseDuck);

  const handlePurchase = (upgradeId: string) => {
    purchaseUpgrade(upgradeId);
  };

  const handleDuckPurchase = (duckType: DuckType) => {
    purchaseDuck(duckType);
  };

  const availableUpgrades = upgrades.filter(upgrade => {
    const dependenciesMet = isDependencyMet(upgrade, upgrades);
    return upgrade.unlocked && !upgrade.purchased && dependenciesMet;
  });

  const availableDucks = (Object.keys(duckTypes) as DuckType[]).filter(duckType => 
    isDuckUnlocked(duckType, { bugsFixed, codeQuality })
  );

  const getDuckCount = (type: DuckType) => ducks.filter(d => d.type === type).length;

  if (availableUpgrades.length === 0 && availableDucks.length === 0) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
        <h2 className="text-green-400 text-xl font-bold mb-4">Upgrades</h2>
        <p className="text-gray-400 text-center">No upgrades available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400">
      <h2 className="text-green-400 text-xl font-bold mb-4">Upgrades</h2>
      
      {/* Duck Store */}
      {availableDucks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-green-400 text-lg font-semibold mb-3">Duck Store</h3>
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
                      ? 'border-green-400 bg-gray-800 hover:bg-gray-700' 
                      : 'border-gray-600 bg-gray-800 opacity-50'
                  } transition-colors`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-green-400 font-semibold">{duckInfo.name}</h4>
                      <p className="text-gray-400 text-sm">{duckInfo.description}</p>
                      <p className="text-blue-400 text-xs mt-1">
                        {duckInfo.specialization} • {duckInfo.baseDebugPower} debug/sec
                      </p>
                      {owned > 0 && (
                        <p className="text-yellow-400 text-xs">Owned: {owned}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        {formatNumber(cost)} CQ
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDuckPurchase(duckType)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-4 rounded font-mono text-sm transition-colors ${
                      canAfford
                        ? 'bg-blue-900 hover:bg-blue-800 text-green-400 border border-green-400'
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
      
      {/* Regular Upgrades */}
      {availableUpgrades.length > 0 && (
        <div>
          <h3 className="text-green-400 text-lg font-semibold mb-3">Upgrades</h3>
          <div className="space-y-3">
            {availableUpgrades.map(upgrade => {
              const canAfford = codeQuality >= upgrade.cost;
              
              return (
                <div
                  key={upgrade.id}
                  className={`p-3 rounded border ${
                    canAfford 
                      ? 'border-green-400 bg-gray-800 hover:bg-gray-700' 
                      : 'border-gray-600 bg-gray-800 opacity-50'
                  } transition-colors`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-green-400 font-semibold">{upgrade.name}</h4>
                      <p className="text-gray-400 text-sm">{upgrade.description}</p>
                      {upgrade.dependencies.length > 0 && (
                        <p className="text-blue-400 text-xs mt-1">
                          Requires: {upgrade.dependencies.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        {formatNumber(upgrade.cost)} CQ
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(upgrade.id)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-4 rounded font-mono text-sm transition-colors ${
                      canAfford
                        ? 'bg-blue-900 hover:bg-blue-800 text-green-400 border border-green-400'
                        : 'bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'PURCHASE' : 'INSUFFICIENT CQ'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}