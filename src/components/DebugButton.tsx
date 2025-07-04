import { useGameStore } from '../stores/gameStore';

export default function DebugButton() {
  const debugCode = useGameStore((state) => state.debugCode);
  
  return (
    <button
      onClick={debugCode}
      className="bg-blue-900 hover:bg-blue-800 text-green-400 font-mono text-2xl px-8 py-4 rounded-lg border-2 border-green-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
    >
      DEBUG CODE
    </button>
  );
}