import { useGameStore } from '../stores/gameStore';
import type { LogEntry } from '../types/game';

export default function DebugLog() {
  const logs = useGameStore((state) => state.logs);

  // Future function for adding new log entries
  // const addLog = (message: string, type: LogEntry['type'] = 'info') => {
  //   const newLog: LogEntry = {
  //     id: Date.now(),
  //     timestamp: new Date().toLocaleTimeString(),
  //     message,
  //     type
  //   };
  //   setLogs(prev => [...prev, newLog]);
  // };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'duck': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400 h-64 overflow-y-auto font-mono text-sm">
      <div className="text-green-400 font-bold mb-2 uppercase tracking-wide">Debug Log</div>
      <div className="space-y-1">
        {logs.map((log) => (
          <div key={log.id} className={`${getLogColor(log.type)} leading-relaxed`}>
            <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}