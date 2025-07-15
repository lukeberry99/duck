import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useGameLoop = (tickInterval: number = 1000) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { debugRate, incrementBugsFixed, calculateOfflineProgress } = useGameStore();

  useEffect(() => {
    // Calculate offline progress on initial load
    calculateOfflineProgress();

    // Start the game loop for both auto-debug and stamina regen
    intervalRef.current = setInterval(() => {
      const store = useGameStore.getState();
      
      // Auto-debug if there's a debug rate
      if (debugRate > 0) {
        const bugsToAdd = Math.floor(debugRate * (tickInterval / 1000));
        if (bugsToAdd > 0) {
          incrementBugsFixed(bugsToAdd);
        }
      }
      
      // Regenerate stamina
      if (store.clickStamina < store.maxClickStamina) {
        useGameStore.setState((state) => ({
          clickStamina: Math.min(state.maxClickStamina, state.clickStamina + state.staminaRegen),
          lastUpdate: Date.now()
        }));
      }
    }, tickInterval);

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