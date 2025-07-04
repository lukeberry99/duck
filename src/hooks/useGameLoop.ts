import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useGameLoop = (tickInterval: number = 1000) => {
  const intervalRef = useRef<number | null>(null);
  const { debugRate, incrementBugsFixed, calculateOfflineProgress } = useGameStore();

  useEffect(() => {
    // Calculate offline progress on initial load
    calculateOfflineProgress();

    // Start the game loop if there's a debug rate
    if (debugRate > 0) {
      intervalRef.current = setInterval(() => {
        // Convert debug rate per second to per tick
        const bugsToAdd = Math.floor(debugRate * (tickInterval / 1000));
        if (bugsToAdd > 0) {
          incrementBugsFixed(bugsToAdd);
        }
      }, tickInterval);
    }

    // Cleanup interval on unmount or when debug rate changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [debugRate, tickInterval, incrementBugsFixed, calculateOfflineProgress]);

  return { isRunning: debugRate > 0 };
};