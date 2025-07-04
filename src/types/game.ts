export interface GameState {
  bugsFixed: number;
  codeQuality: number;
  debugRate: number;
  ducks: Duck[];
  upgrades: Upgrade[];
  lastUpdate: number;
}

export interface Duck {
  id: string;
  type: DuckType;
  level: number;
  debugPower: number;
  specialization?: string;
  acquired: number; // timestamp when acquired
}

export interface Upgrade {
  id: string;
  type: UpgradeType;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  effect: UpgradeEffect;
}

export interface UpgradeEffect {
  type: 'multiplier' | 'additive' | 'unlock';
  target: 'debugRate' | 'codeQuality' | 'duckEfficiency' | 'special';
  value: number;
}

export type DuckType = 
  | 'rubber'
  | 'bath'
  | 'pirate'
  | 'fancy'
  | 'quantum'
  | 'cosmic';

export type UpgradeType = 
  | 'duck'
  | 'tool'
  | 'environment'
  | 'automation'
  | 'prestige';

export interface GameActions {
  // Core actions
  debugCode: () => void;
  incrementBugsFixed: (amount?: number) => void;
  addCodeQuality: (amount: number) => void;
  spendCodeQuality: (amount: number) => boolean;
  
  // Duck actions
  addDuck: (duck: Duck) => void;
  removeDuck: (duckId: string) => void;
  upgradeDuck: (duckId: string) => void;
  
  // Upgrade actions
  purchaseUpgrade: (upgradeId: string) => boolean;
  unlockUpgrade: (upgradeId: string) => void;
  
  // Utility actions
  calculateDebugRate: () => number;
  calculateOfflineProgress: () => void;
  reset: () => void;
}