import { useEffect, useRef, useMemo } from 'react';

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function DebugLog() {
  const logs: LogEntry[] = useMemo(() => [
    {
      id: 1,
      timestamp: new Date().toLocaleTimeString(),
      message: 'Welcome to DuckOS: The Quacking debugging experience!',
      type: 'info'
    },
    {
      id: 2,
      timestamp: new Date().toLocaleTimeString(),
      message: 'Click the DEBUG CODE button to start fixing bugs.',
      type: 'info'
    }
  ], []);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

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
      default: return 'text-green-400';
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-green-400 h-64 overflow-y-auto font-mono text-sm">
      <div className="text-green-400 font-bold mb-2 uppercase tracking-wide">Debug Log</div>
      <div className="space-y-1">
        {logs.map((log) => (
          <div key={log.id} className={`${getLogColor(log.type)} leading-relaxed`}>
            <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}