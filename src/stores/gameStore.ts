import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameActions, Duck, DuckType } from '../types/game';
import { calculateDebugRate, calculateOfflineProgress, canAffordUpgrade } from '../utils/calculations';
import { initialUpgrades } from '../data/upgrades';
import { createDuck, getDuckCost, isDuckUnlocked } from '../data/ducks';

interface GameStore extends GameState, GameActions {}

const initialState: GameState = {
  bugsFixed: 0,
  codeQuality: 0,
  debugRate: 0,
  ducks: [],
  upgrades: initialUpgrades,
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
        set((state) => {
          const newBugsFixed = state.bugsFixed + amount;
          
          // Check for upgrade unlocks
          const updatedUpgrades = state.upgrades.map(upgrade => {
            if (!upgrade.unlocked) {
              // Define unlock conditions based on bugs fixed
              const unlockConditions: { [key: string]: number } = {
                'debugging-efficiency': 50,
                'duck-training': 100,
                'premium-duck-feed': 250,
                'duck-motivation': 500,
                'bath-duck': 100,
                'pirate-duck': 250,
                'fancy-duck': 500,
                'premium-duck': 1000,
                'quantum-duck': 2500,
                'cosmic-duck': 10000,
                'ide-integration': 150,
                'static-analysis': 400,
                'ai-assistant': 1500,
                'ergonomic-workspace': 200,
                'noise-cancellation': 600,
                'zen-garden': 2000,
                'duck-specialization': 1200,
                'duck-enlightenment': 5000
              };
              
              const condition = unlockConditions[upgrade.id];
              if (condition && newBugsFixed >= condition) {
                // Also check if dependencies are met
                const dependenciesMet = upgrade.dependencies.every(depId => 
                  state.upgrades.find(u => u.id === depId)?.purchased || false
                );
                
                if (dependenciesMet) {
                  return { ...upgrade, unlocked: true };
                }
              }
            }
            return upgrade;
          });
          
          return {
            bugsFixed: newBugsFixed,
            codeQuality: state.codeQuality + (amount * 5),
            upgrades: updatedUpgrades,
            lastUpdate: Date.now(),
          };
        });
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
        
        // Check dependencies
        const dependenciesMet = upgrade.dependencies.every(depId => 
          state.upgrades.find(u => u.id === depId)?.purchased || false
        );
        
        if (!dependenciesMet) {
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
        
        // Unlock dependent upgrades
        const newState = get();
        const dependentUpgrades = newState.upgrades.filter(u => 
          u.dependencies.includes(upgradeId) && !u.unlocked
        );
        
        if (dependentUpgrades.length > 0) {
          set((prevState) => ({
            upgrades: prevState.upgrades.map(u => 
              dependentUpgrades.some(dep => dep.id === u.id) ? { ...u, unlocked: true } : u
            ),
            lastUpdate: Date.now(),
          }));
        }
        
        // Recalculate debug rate if needed
        if (upgrade.effect.target === 'debugRate' || upgrade.effect.target === 'duckEfficiency') {
          const finalState = get();
          const newDebugRate = calculateDebugRate(finalState.ducks, finalState.upgrades);
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
      
      purchaseBasicRubberDuck: () => {
        return get().purchaseDuck('rubber');
      },
      
      purchaseDuck: (type: DuckType) => {
        const state = get();
        const ownedOfType = state.ducks.filter(d => d.type === type).length;
        const duckCost = getDuckCost(type, ownedOfType);
        
        // Check if duck type is unlocked
        if (!isDuckUnlocked(type, { bugsFixed: state.bugsFixed, codeQuality: state.codeQuality })) {
          return false;
        }
        
        if (state.codeQuality >= duckCost) {
          const spendSuccess = get().spendCodeQuality(duckCost);
          if (spendSuccess) {
            const newDuck = createDuck(type);
            get().addDuck(newDuck);
            return true;
          }
        }
        return false;
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
          // Just update the timestamp, don't calculate offline progress yet
          state.lastUpdate = Date.now();
        }
      },
    }
  )
);