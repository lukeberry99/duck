import { useGameStore } from '../stores/gameStore';
import { formatNumber, formatRate, calculateClickPower } from '../utils/calculations';

export default function ResourceDisplay() {
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const debugRate = useGameStore((state) => state.debugRate);
  const architecturePoints = useGameStore((state) => state.architecturePoints);
  const ducks = useGameStore((state) => state.ducks);
  const upgrades = useGameStore((state) => state.upgrades);
  const clickStamina = useGameStore((state) => state.clickStamina);
  const maxClickStamina = useGameStore((state) => state.maxClickStamina);
  
  const totalClickPower = calculateClickPower(upgrades);
  const staminaPercentage = (clickStamina / maxClickStamina) * 100;
  
  const isAutoDebugging = debugRate > 0 && ducks.length > 0;
  const hasArchitecturePoints = architecturePoints > 0;

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
      
      {/* Click Power and Stamina */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-blue-400 text-sm">Click Power</div>
          <div className="text-blue-300 text-lg font-bold">{totalClickPower}</div>
          <div className="text-gray-400 text-xs">bugs per click</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 text-sm">Stamina</div>
          <div className="text-red-300 text-lg font-bold">{clickStamina}/{maxClickStamina}</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                staminaPercentage > 60 ? 'bg-green-500' : 
                staminaPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${staminaPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Balance Notice */}
      {totalClickPower >= 10 && (
        <div className="mt-4 text-center">
          <div className="text-orange-400 text-xs">
            ⚠️ Click power capped at {totalClickPower} for game balance
          </div>
        </div>
      )}
    </div>
  );
}