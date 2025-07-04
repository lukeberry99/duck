import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameActions, Duck, DuckType, LogEntry } from '../types/game';
import { calculateDebugRate, calculateOfflineProgress, canAffordUpgrade } from '../utils/calculations';
import { initialUpgrades } from '../data/upgrades';
import { createDuck, getDuckCost, isDuckUnlocked } from '../data/ducks';
import { 
  getMessagesForPhase, 
  getRandomMessage, 
  getDuckDialogue, 
  generalMessages,
  bugDescriptions
} from '../data/lore';

interface GameStore extends GameState, GameActions {}

const initialState: GameState = {
  bugsFixed: 0,
  codeQuality: 0,
  debugRate: 0,
  ducks: [],
  upgrades: initialUpgrades,
  logs: [
    {
      id: 'welcome',
      timestamp: Date.now(),
      message: 'Welcome to DuckOS: The Quacking debugging experience!',
      type: 'info',
      phase: 'discovery'
    },
    {
      id: 'start',
      timestamp: Date.now() + 1,
      message: 'Click the DEBUG CODE button to start fixing bugs.',
      type: 'info',
      phase: 'discovery'
    }
  ],
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
          
          // Add a log entry for the debug action
          const debugMessage = getRandomDebugMessage(newBugsFixed, state.ducks);
          const newLogEntry: LogEntry = {
            id: `debug-${Date.now()}`,
            timestamp: Date.now(),
            message: debugMessage,
            type: 'success',
            phase: getCurrentPhase(newBugsFixed)
          };
          
          // Keep only the last 100 log entries to prevent memory issues
          const updatedLogs = [...state.logs, newLogEntry].slice(-100);
          
          return {
            bugsFixed: newBugsFixed,
            codeQuality: newCodeQuality,
            logs: updatedLogs,
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
        
        // Check for milestone messages after state update
        const currentState = get();
        const phaseMessages = getMessagesForPhase(currentState.bugsFixed);
        const milestoneMessage = phaseMessages.find(msg => 
          msg.trigger?.type === 'bugsFixed' && msg.trigger.value === currentState.bugsFixed
        );
        
        if (milestoneMessage) {
          get().addLogEntry(milestoneMessage.message, milestoneMessage.type);
        }
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
        
        // Add log entry for duck purchase
        const duckTypeNames = {
          rubber: 'Basic Rubber Duck',
          bath: 'Bath Duck',
          pirate: 'Pirate Duck',
          fancy: 'Fancy Duck',
          premium: 'Premium Duck',
          quantum: 'Quantum Duck',
          cosmic: 'Cosmic Duck'
        };
        
        get().addLogEntry(
          `${duckTypeNames[duck.type]} joined your debugging team!`,
          'success'
        );
        
        // Check for duck-specific milestone messages
        const currentState = get();
        const phaseMessages = getMessagesForPhase(currentState.bugsFixed);
        const duckMessage = phaseMessages.find(msg => 
          msg.trigger?.type === 'duckPurchased' && msg.trigger.value === duck.type
        );
        
        if (duckMessage) {
          get().addLogEntry(duckMessage.message, 'warning');
        }
        
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
      
      // Log actions
      addLogEntry: (message: string, type: LogEntry['type'], phase?: LogEntry['phase']) => {
        set((state) => {
          const newLogEntry: LogEntry = {
            id: `log-${Date.now()}`,
            timestamp: Date.now(),
            message,
            type,
            phase: phase || getCurrentPhase(state.bugsFixed)
          };
          
          // Keep only the last 100 log entries
          const updatedLogs = [...state.logs, newLogEntry].slice(-100);
          
          return {
            logs: updatedLogs,
            lastUpdate: Date.now(),
          };
        });
      },
      
      clearLogs: () => {
        set({
          logs: [],
          lastUpdate: Date.now(),
        });
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
        logs: state.logs,
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

// Helper functions for narrative system
const getCurrentPhase = (bugsFixed: number): LogEntry['phase'] => {
  if (bugsFixed >= 10000) return 'reality';
  if (bugsFixed >= 2500) return 'whisperer';
  if (bugsFixed >= 100) return 'consultant';
  return 'discovery';
};

const getRandomDebugMessage = (bugsFixed: number, ducks: Duck[]): string => {
  // Get phase-specific messages
  const phaseMessages = getMessagesForPhase(bugsFixed);
  
  // Check for milestone messages
  const milestoneMessage = phaseMessages.find(msg => 
    msg.trigger?.type === 'bugsFixed' && msg.trigger.value === bugsFixed
  );
  
  if (milestoneMessage) {
    return milestoneMessage.message;
  }
  
  // 30% chance for duck dialogue if ducks are present
  if (ducks.length > 0 && Math.random() < 0.3) {
    const randomDuck = ducks[Math.floor(Math.random() * ducks.length)];
    const dialogue = getDuckDialogue(randomDuck.type);
    if (dialogue) {
      return `${dialogue.squeak} ("${dialogue.translation}")`;
    }
  }
  
  // 20% chance for escalating bug description
  if (Math.random() < 0.2) {
    const bugIndex = Math.min(
      Math.floor(bugsFixed / 100), 
      bugDescriptions.length - 1
    );
    return `Fixed: ${bugDescriptions[bugIndex]}`;
  }
  
  // Default to general messages
  const randomMessage = getRandomMessage(generalMessages);
  return randomMessage ? randomMessage.message : 'Bug fixed successfully!';
};