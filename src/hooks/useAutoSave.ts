import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useAutoSave = (saveInterval: number = 5000) => {
  const gameState = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // The zustand persist middleware handles saving automatically
      // This hook just ensures we update the lastUpdate timestamp regularly
      gameState.lastUpdate = Date.now();
    }, saveInterval);

    return () => clearInterval(interval);
  }, [gameState, saveInterval]);
};