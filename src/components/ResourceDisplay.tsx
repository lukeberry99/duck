import { useGameStore } from '../stores/gameStore';
import { formatNumber, formatRate } from '../utils/calculations';

export default function ResourceDisplay() {
  const bugsFixed = useGameStore((state) => state.bugsFixed);
  const codeQuality = useGameStore((state) => state.codeQuality);
  const debugRate = useGameStore((state) => state.debugRate);
  const ducks = useGameStore((state) => state.ducks);
  
  const isAutoDebugging = debugRate > 0 && ducks.length > 0;

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}