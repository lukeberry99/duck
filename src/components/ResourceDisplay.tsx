import { useGameStore } from '../stores/gameStore';

export default function ResourceDisplay() {
  const { bugsFixed, codeQuality, debugRate } = useGameStore((state) => ({
    bugsFixed: state.bugsFixed,
    codeQuality: state.codeQuality,
    debugRate: state.debugRate,
  }));

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-green-400 text-sm uppercase tracking-wide">Bugs Fixed</div>
          <div className="text-yellow-400 text-2xl font-bold">{bugsFixed.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-sm uppercase tracking-wide">Code Quality</div>
          <div className="text-yellow-400 text-2xl font-bold">{codeQuality.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-sm uppercase tracking-wide">Debug Rate</div>
          <div className="text-yellow-400 text-2xl font-bold">{debugRate.toFixed(1)}/s</div>
        </div>
      </div>
    </div>
  );
}