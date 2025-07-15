import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getPrestigeUpgradeCost, canAffordPrestigeUpgrade } from '../data/prestigeUpgrades';
import { formatNumber } from '../utils/calculations';
import type { PrestigeCategory } from '../types/game';

export default function PrestigePanel() {
  const {
    bugsFixed,
    architecturePoints,
    prestigeUpgrades,
    prestigeStats,
    calculateArchitecturePoints,
    canRefactor,
    refactor,
    purchasePrestigeUpgrade,
    getPrestigeMultipliers
  } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState<PrestigeCategory>('architecture');

  const categories = [
    { id: 'architecture', name: 'Architecture Patterns', icon: '🏗️' },
    { id: 'codeReview', name: 'Code Review Processes', icon: '👥' },
    { id: 'methodology', name: 'Debugging Methodologies', icon: '🧪' },
    { id: 'universal', name: 'Universal Constants', icon: '🌌' }
  ] as const;

  const categoryUpgrades = prestigeUpgrades.filter(upgrade => upgrade.category === selectedCategory);
  const earnedPoints = calculateArchitecturePoints(bugsFixed);
  const multipliers = getPrestigeMultipliers();

  // Calculate efficiency and optimal timing hints
  const efficiency = bugsFixed > 0 ? earnedPoints / bugsFixed : 0;
  const nextMilestonePoints = getNextMilestonePoints(bugsFixed);
  const recommendRefactor = efficiency > 0.1 && bugsFixed >= 5000; // Good efficiency threshold

  function getNextMilestonePoints(bugs: number): { bugs: number; points: number } | null {
    const milestones = [1000, 5000, 10000, 25000, 50000, 100000];
    const nextMilestone = milestones.find(m => m > bugs);
    if (nextMilestone) {
      return {
        bugs: nextMilestone,
        points: calculateArchitecturePoints(nextMilestone)
      };
    }
    return null;
  }

  const handleRefactor = () => {
    if (window.confirm('This will reset all progress except prestige upgrades. Are you sure?')) {
      refactor();
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-purple-400 space-y-4">
      <div className="text-purple-400 text-xl font-bold mb-4 uppercase tracking-wide">
        🔄 Refactoring Lab
      </div>

      {/* Prestige Stats */}
      <div className="bg-gray-800 border border-purple-300 rounded p-3">
        <h3 className="text-purple-300 font-semibold mb-2">Architecture Status</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Architecture Points:</span>
            <span className="text-purple-400 ml-2 font-bold">{formatNumber(architecturePoints)}</span>
          </div>
          <div>
            <span className="text-gray-400">Total Refactors:</span>
            <span className="text-blue-400 ml-2">{prestigeStats.totalRefactors}</span>
          </div>
          <div>
            <span className="text-gray-400">Best Run:</span>
            <span className="text-green-400 ml-2">{formatNumber(prestigeStats.bestBugsFixedRun)}</span>
          </div>
          <div>
            <span className="text-gray-400">Lifetime Bugs:</span>
            <span className="text-yellow-400 ml-2">{formatNumber(prestigeStats.totalLifetimeBugs)}</span>
          </div>
        </div>
      </div>

      {/* Refactoring Section */}
      <div className="bg-gray-800 border border-yellow-400 rounded p-3">
        <h3 className="text-yellow-400 font-semibold mb-2">Refactor Progress</h3>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-400">Current Run:</span>
            <span className="text-green-400 ml-2 font-bold">{formatNumber(bugsFixed)} bugs</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Would Earn:</span>
            <span className="text-purple-400 ml-2 font-bold">
              {formatNumber(Math.floor(earnedPoints * multipliers.architecturePointsGain))} AP
            </span>
          </div>
          <button
            onClick={handleRefactor}
            disabled={!canRefactor()}
            className={`w-full py-2 px-3 rounded text-sm font-bold transition-colors ${
              recommendRefactor
                ? 'bg-green-700 hover:bg-green-600 text-white border border-green-400'
                : canRefactor()
                ? 'bg-purple-700 hover:bg-purple-600 text-white border border-purple-400'
                : 'bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed'
            }`}
          >
            {recommendRefactor ? '✨ RECOMMENDED REFACTOR' : canRefactor() ? '🔄 REFACTOR' : `Need ${formatNumber(1000)} bugs to refactor`}
          </button>
          
          {/* Timing guidance */}
          {canRefactor() && (
            <div className="text-xs mt-2 space-y-1">
              <div className="text-gray-400">
                Efficiency: <span className={efficiency > 0.1 ? 'text-green-400' : 'text-yellow-400'}>
                  {(efficiency * 1000).toFixed(1)} AP/1K bugs
                </span>
              </div>
              {nextMilestonePoints && (
                <div className="text-gray-400">
                  Next milestone: <span className="text-blue-400">
                    {formatNumber(nextMilestonePoints.bugs)} bugs (+{nextMilestonePoints.points - earnedPoints} AP)
                  </span>
                </div>
              )}
              {recommendRefactor && (
                <div className="text-green-400 font-semibold">Good time to refactor!</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Multipliers */}
      {(multipliers.debugRate > 1 || multipliers.codeQuality > 1 || multipliers.duckEfficiency > 1) && (
        <div className="bg-gray-800 border border-green-400 rounded p-3">
          <h3 className="text-green-400 font-semibold mb-2">Active Bonuses</h3>
          <div className="text-sm space-y-1">
            {multipliers.debugRate > 1 && (
              <div>Debug Rate: <span className="text-green-400">+{((multipliers.debugRate - 1) * 100).toFixed(0)}%</span></div>
            )}
            {multipliers.codeQuality > 1 && (
              <div>Code Quality: <span className="text-blue-400">+{((multipliers.codeQuality - 1) * 100).toFixed(0)}%</span></div>
            )}
            {multipliers.duckEfficiency > 1 && (
              <div>Duck Efficiency: <span className="text-yellow-400">+{((multipliers.duckEfficiency - 1) * 100).toFixed(0)}%</span></div>
            )}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-t transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-700 text-purple-200 border-l border-r border-t border-purple-400'
                : 'bg-gray-800 text-gray-400 hover:text-purple-300 border border-gray-600'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Prestige Upgrades */}
      <div className="bg-gray-800 border border-purple-300 rounded-b p-3 space-y-2 max-h-64 overflow-y-auto">
        {categoryUpgrades.map(upgrade => {
          const cost = getPrestigeUpgradeCost(upgrade);
          const canAfford = canAffordPrestigeUpgrade(architecturePoints, upgrade);
          const isMaxed = Boolean(upgrade.maxLevel && upgrade.currentLevel >= upgrade.maxLevel);
          
          return (
            <div
              key={upgrade.id}
              className={`p-3 rounded border transition-colors ${
                canAfford && !isMaxed
                  ? 'border-purple-400 bg-purple-900 bg-opacity-30'
                  : isMaxed
                  ? 'border-green-400 bg-green-900 bg-opacity-20'
                  : 'border-gray-600 bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="text-purple-300 font-semibold text-sm">
                    {upgrade.name}
                    {upgrade.currentLevel > 0 && (
                      <span className="text-yellow-400 ml-1">Lv.{upgrade.currentLevel}</span>
                    )}
                    {upgrade.maxLevel && (
                      <span className="text-gray-400 text-xs ml-1">/{upgrade.maxLevel}</span>
                    )}
                  </h4>
                  <p className="text-gray-300 text-xs mt-1">{upgrade.description}</p>
                </div>
                <button
                  onClick={() => purchasePrestigeUpgrade(upgrade.id)}
                  disabled={!canAfford || isMaxed}
                  className={`ml-2 px-2 py-1 rounded text-xs font-bold transition-colors ${
                    isMaxed
                      ? 'bg-green-600 text-white cursor-default'
                      : canAfford
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isMaxed ? 'MAX' : `${formatNumber(cost)} AP`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}