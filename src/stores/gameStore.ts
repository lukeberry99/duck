import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameActions, Duck } from '../types/game';
import { calculateDebugRate, calculateOfflineProgress, canAffordUpgrade } from '../utils/calculations';

interface GameStore extends GameState, GameActions {}

const initialState: GameState = {
  bugsFixed: 0,
  codeQuality: 0,
  debugRate: 0,
  ducks: [],
  upgrades: [],
  lastUpdate: Date.now(),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Core actions
      debugCode: () => {
        set((state) => {
          const newBugsFixed = state.bugsFixed + 1;
          const newCodeQuality = state.codeQuality + 5; // 5 CQ per bug fixed
          
          return {
            bugsFixed: newBugsFixed,
            codeQuality: newCodeQuality,
            lastUpdate: Date.now(),
          };
        });
      },
      
      incrementBugsFixed: (amount = 1) => {
        set((state) => ({
          bugsFixed: state.bugsFixed + amount,
          codeQuality: state.codeQuality + (amount * 5),
          lastUpdate: Date.now(),
        }));
      },
      
      addCodeQuality: (amount: number) => {
        set((state) => ({
          codeQuality: state.codeQuality + amount,
          lastUpdate: Date.now(),
        }));
      },
      
      spendCodeQuality: (amount: number) => {
        const state = get();
        if (state.codeQuality >= amount) {
          set((prevState) => ({
            codeQuality: prevState.codeQuality - amount,
            lastUpdate: Date.now(),
          }));
          return true;
        }
        return false;
      },
      
      // Duck actions
      addDuck: (duck: Duck) => {
        set((state) => ({
          ducks: [...state.ducks, duck],
          lastUpdate: Date.now(),
        }));
        
        // Recalculate debug rate
        const newState = get();
        const newDebugRate = calculateDebugRate(newState.ducks, newState.upgrades);
        set({ debugRate: newDebugRate });
      },
      
      removeDuck: (duckId: string) => {
        set((state) => ({
          ducks: state.ducks.filter(duck => duck.id !== duckId),
          lastUpdate: Date.now(),
        }));
        
        // Recalculate debug rate
        const newState = get();
        const newDebugRate = calculateDebugRate(newState.ducks, newState.upgrades);
        set({ debugRate: newDebugRate });
      },
      
      upgradeDuck: (duckId: string) => {
        set((state) => ({
          ducks: state.ducks.map(duck => 
            duck.id === duckId 
              ? { ...duck, level: duck.level + 1, debugPower: duck.debugPower * 1.5 }
              : duck
          ),
          lastUpdate: Date.now(),
        }));
        
        // Recalculate debug rate
        const newState = get();
        const newDebugRate = calculateDebugRate(newState.ducks, newState.upgrades);
        set({ debugRate: newDebugRate });
      },
      
      // Upgrade actions
      purchaseUpgrade: (upgradeId: string) => {
        const state = get();
        const upgrade = state.upgrades.find(u => u.id === upgradeId);
        
        if (!upgrade || upgrade.purchased || !canAffordUpgrade(state.codeQuality, upgrade.cost)) {
          return false;
        }
        
        // Spend code quality
        const spendSuccess = get().spendCodeQuality(upgrade.cost);
        if (!spendSuccess) return false;
        
        // Mark upgrade as purchased
        set((prevState) => ({
          upgrades: prevState.upgrades.map(u => 
            u.id === upgradeId ? { ...u, purchased: true } : u
          ),
          lastUpdate: Date.now(),
        }));
        
        // Recalculate debug rate if needed
        if (upgrade.effect.target === 'debugRate' || upgrade.effect.target === 'duckEfficiency') {
          const newState = get();
          const newDebugRate = calculateDebugRate(newState.ducks, newState.upgrades);
          set({ debugRate: newDebugRate });
        }
        
        return true;
      },
      
      unlockUpgrade: (upgradeId: string) => {
        set((state) => ({
          upgrades: state.upgrades.map(u => 
            u.id === upgradeId ? { ...u, unlocked: true } : u
          ),
          lastUpdate: Date.now(),
        }));
      },
      
      // Utility actions
      calculateDebugRate: () => {
        const state = get();
        const newDebugRate = calculateDebugRate(state.ducks, state.upgrades);
        set({ debugRate: newDebugRate });
        return newDebugRate;
      },
      
      calculateOfflineProgress: () => {
        const state = get();
        const progress = calculateOfflineProgress(state.lastUpdate, state.debugRate);
        
        if (progress.bugsFixed > 0) {
          set({
            bugsFixed: state.bugsFixed + progress.bugsFixed,
            codeQuality: state.codeQuality + progress.codeQuality,
            lastUpdate: Date.now(),
          });
        }
        
        return progress;
      },
      
      reset: () => {
        set({
          ...initialState,
          lastUpdate: Date.now(),
        });
      },
    }),
    {
      name: 'duckos-game-storage',
      version: 1,
      partialize: (state) => ({
        bugsFixed: state.bugsFixed,
        codeQuality: state.codeQuality,
        debugRate: state.debugRate,
        ducks: state.ducks,
        upgrades: state.upgrades,
        lastUpdate: state.lastUpdate,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Calculate offline progress when the game loads
          const progress = calculateOfflineProgress(state.lastUpdate, state.debugRate);
          if (progress.bugsFixed > 0) {
            state.bugsFixed += progress.bugsFixed;
            state.codeQuality += progress.codeQuality;
          }
          state.lastUpdate = Date.now();
        }
      },
    }
  )
);