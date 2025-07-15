import { useGameStore } from '../stores/gameStore';
import { formatNumber, formatRate, calculateUpgradeEffects } from '../utils/calculations';

export default function ResourceDisplay() {
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const debugRate = useGameStore((state) => state.debugRate);
  const architecturePoints = useGameStore((state) => state.architecturePoints);
  const ducks = useGameStore((state) => state.ducks);
  const upgrades = useGameStore((state) => state.upgrades);
  
  const upgradeEffects = calculateUpgradeEffects(upgrades);
  
  // Calculate manual click power
  const baseClickPower = 1;
  const clickPowerBonus = upgradeEffects.debugRate.additive;
  const clickPowerMultiplier = upgradeEffects.debugRate.multiplier;
  const specialMultiplier = upgradeEffects.special.multiplier;
  const totalClickPower = Math.floor((baseClickPower + clickPowerBonus) * clickPowerMultiplier * specialMultiplier);
  
  const isAutoDebugging = debugRate > 0 && ducks.length > 0;
  const hasArchitecturePoints = architecturePoints > 0;
  const hasUpgrades = totalClickPower > 1 || upgradeEffects.codeQuality.multiplier > 1 || upgradeEffects.duckEfficiency.multiplier > 1;

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400 font-mono">
      <div className={`grid grid-cols-1 gap-4 ${hasArchitecturePoints ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        <div className="text-center">
          <div className="text-green-400 text-sm uppercase tracking-wide">Bugs Fixed</div>
          <div className="text-yellow-400 text-2xl font-bold">{formatNumber(bugsFixed)}</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-sm uppercase tracking-wide">Code Quality</div>
          <div className="text-yellow-400 text-2xl font-bold">{formatNumber(codeQuality)}</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-sm uppercase tracking-wide">Debug Rate</div>
          <div className="text-yellow-400 text-2xl font-bold">{formatRate(debugRate)}</div>
          {isAutoDebugging && (
            <div className="text-green-400 text-xs mt-1 flex items-center justify-center">
              <span className="animate-pulse">●</span>
              <span className="ml-1">Auto-debugging active</span>
            </div>
          )}
        </div>
        {hasArchitecturePoints && (
          <div className="text-center">
            <div className="text-green-400 text-sm uppercase tracking-wide">Architecture</div>
            <div className="text-purple-400 text-2xl font-bold">{formatNumber(architecturePoints)}</div>
            <div className="text-purple-300 text-xs">Points</div>
          </div>
        )}
      </div>
      
      {/* Click Power Indicator */}
      {totalClickPower > 1 && (
        <div className="mt-4 text-center">
          <div className="text-blue-400 text-sm">
            Manual Click Power: <span className="font-bold">{totalClickPower}</span> bug{totalClickPower !== 1 ? 's' : ''}
            {totalClickPower > 1 && (
              <span className="text-xs text-gray-400 ml-1">
                (1 + {clickPowerBonus} × {clickPowerMultiplier.toFixed(1)} × {specialMultiplier.toFixed(1)})
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Active Upgrade Effects */}
      {hasUpgrades && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          <div className="text-green-400 text-xs uppercase tracking-wide mb-2">Active Bonuses</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {upgradeEffects.debugRate.additive > 0 && (
              <div className="text-blue-400">
                +{upgradeEffects.debugRate.additive} click power
              </div>
            )}
            {upgradeEffects.debugRate.multiplier > 1 && (
              <div className="text-blue-400">
                {upgradeEffects.debugRate.multiplier.toFixed(1)}× debug rate
              </div>
            )}
            {upgradeEffects.codeQuality.additive > 0 && (
              <div className="text-yellow-400">
                +{upgradeEffects.codeQuality.additive} CQ/bug
              </div>
            )}
            {upgradeEffects.codeQuality.multiplier > 1 && (
              <div className="text-yellow-400">
                {upgradeEffects.codeQuality.multiplier.toFixed(1)}× CQ gain
              </div>
            )}
            {upgradeEffects.duckEfficiency.multiplier > 1 && (
              <div className="text-purple-400">
                {upgradeEffects.duckEfficiency.multiplier.toFixed(1)}× duck efficiency
              </div>
            )}
            {upgradeEffects.special.multiplier > 1 && (
              <div className="text-cyan-400">
                {upgradeEffects.special.multiplier.toFixed(1)}× all bonuses
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}