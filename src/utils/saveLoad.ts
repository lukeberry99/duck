import type { GameState } from '../types/game';

export const SAVE_KEY = 'duckos-game-storage';

export const saveGameState = (state: GameState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, serializedState);
    
    // Create backup save
    localStorage.setItem(`${SAVE_KEY}-backup`, serializedState);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const serializedState = localStorage.getItem(SAVE_KEY);
    if (!serializedState) return null;
    
    const state = JSON.parse(serializedState);
    return validateGameState(state) ? state : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return loadBackupGameState();
  }
};

export const loadBackupGameState = (): GameState | null => {
  try {
    const serializedState = localStorage.getItem(`${SAVE_KEY}-backup`);
    if (!serializedState) return null;
    
    const state = JSON.parse(serializedState);
    return validateGameState(state) ? state : null;
  } catch (error) {
    console.error('Failed to load backup game state:', error);
    return null;
  }
};

export const validateGameState = (state: unknown): state is GameState => {
  if (!state || typeof state !== 'object') return false;
  
  const gameState = state as Record<string, unknown>;
  const requiredFields = ['bugsFixed', 'codeQuality', 'debugRate', 'ducks', 'upgrades', 'lastUpdate'];
  
  for (const field of requiredFields) {
    if (!(field in gameState)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate types
  if (typeof gameState.bugsFixed !== 'number' || gameState.bugsFixed < 0) return false;
  if (typeof gameState.codeQuality !== 'number' || gameState.codeQuality < 0) return false;
  if (typeof gameState.debugRate !== 'number' || gameState.debugRate < 0) return false;
  if (!Array.isArray(gameState.ducks)) return false;
  if (!Array.isArray(gameState.upgrades)) return false;
  if (typeof gameState.lastUpdate !== 'number' || gameState.lastUpdate <= 0) return false;
  
  return true;
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(`${SAVE_KEY}-backup`);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

export const exportGameState = (): string => {
  const state = localStorage.getItem(SAVE_KEY);
  if (!state) throw new Error('No game state to export');
  
  // Encode to base64 for easy sharing
  return btoa(state);
};

export const importGameState = (encodedState: string): boolean => {
  try {
    const decodedState = atob(encodedState);
    const state = JSON.parse(decodedState);
    
    if (!validateGameState(state)) {
      throw new Error('Invalid game state format');
    }
    
    localStorage.setItem(SAVE_KEY, decodedState);
    return true;
  } catch (error) {
    console.error('Failed to import game state:', error);
    return false;
  }
};