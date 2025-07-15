export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'duck';
  phase?: 'discovery' | 'consultant' | 'whisperer' | 'reality';
}

export interface PrestigeUpgrade {
  id: string;
  category: PrestigeCategory;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  effect: PrestigeEffect;
  maxLevel?: number;
  currentLevel: number;
}

export interface PrestigeEffect {
  type: 'multiplier' | 'additive' | 'special';
  target: 'debugRate' | 'codeQuality' | 'duckEfficiency' | 'architecturePointsGain' | 'startingResources';
  value: number;
}

export interface PrestigeStats {
  totalRefactors: number;
  totalArchitecturePoints: number;
  bestBugsFixedRun: number;
  totalLifetimeBugs: number;
}

export interface DebugSession {
  id: string;
  codeType: CodeType;
  bugsRemaining: number;
  totalBugs: number;
  assignedDucks: string[];
  isActive: boolean;
  startTime: number;
  completionTime?: number;
  difficulty: number;
  rewards: {
    codeQuality: number;
    architecturePoints?: number;
  };
}

export interface PerformanceChallenge {
  id: string;
  name: string;
  description: string;
  codeType: CodeType;
  timeLimit: number;
  targetBugs: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  rewards: {
    codeQuality: number;
    architecturePoints: number;
    title?: string;
  };
  unlockCondition: {
    type: 'bugsFixed' | 'sessionsCompleted' | 'challengesCompleted';
    value: number;
  };
}

export interface BatchOperation {
  id: string;
  name: string;
  description: string;
  codeType: CodeType;
  batchSize: number;
  efficiency: number;
  cost: number;
  unlocked: boolean;
}

export interface GameState {
  bugsFixed: number;
  codeQuality: number;
  debugRate: number;
  ducks: Duck[];
  upgrades: Upgrade[];
  logs: LogEntry[];
  lastUpdate: number;
  
  // Achievement tracking (peak values)
  achievements: {
    peakBugsFixed: number;
    peakCodeQuality: number;
    peakDebugRate: number;
  };
  
  // Prestige system
  architecturePoints: number;
  prestigeUpgrades: PrestigeUpgrade[];
  prestigeStats: PrestigeStats;
  
  // Advanced features
  debugSessions: DebugSession[];
  activeBatchOperations: BatchOperation[];
  performanceChallenges: PerformanceChallenge[];
  currentCodeType: CodeType;
  completedChallenges: string[];
  
  // Balance fixes
  clickStamina: number;
  maxClickStamina: number;
  staminaRegen: number;
  lastClickTime: number;
}

export interface Duck {
  id: string;
  type: DuckType;
  level: number;
  debugPower: number;
  specialization?: string;
  acquired: number; // timestamp when acquired
  codeTypeSpecialty?: CodeType;
  specializationBonus: number;
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
  dependencies: string[];
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
  | 'premium'
  | 'quantum'
  | 'cosmic';

export type CodeType = 'web' | 'mobile' | 'backend' | 'aiml';

export type UpgradeType = 
  | 'duck'
  | 'tool'
  | 'environment'
  | 'automation'
  | 'prestige';

export type PrestigeCategory =
  | 'architecture'
  | 'codeReview'
  | 'methodology'
  | 'universal';

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
  purchaseBasicRubberDuck: () => boolean;
  purchaseDuck: (type: DuckType) => boolean;
  
  // Log actions
  addLogEntry: (message: string, type: LogEntry['type'], phase?: LogEntry['phase']) => void;
  clearLogs: () => void;
  
  // Prestige actions
  calculateArchitecturePoints: (bugsFixed: number) => number;
  canRefactor: () => boolean;
  refactor: () => void;
  purchasePrestigeUpgrade: (upgradeId: string) => boolean;
  getPrestigeMultipliers: () => { debugRate: number; codeQuality: number; duckEfficiency: number; architecturePointsGain: number };
  
  // Advanced features actions
  createDebugSession: (codeType: CodeType, difficulty: number) => string;
  assignDuckToSession: (sessionId: string, duckId: string) => boolean;
  completeDebugSession: (sessionId: string) => void;
  startBatchOperation: (operationId: string) => boolean;
  completeBatchOperation: (operationId: string) => void;
  startPerformanceChallenge: (challengeId: string) => boolean;
  completePerformanceChallenge: (challengeId: string, timeUsed: number) => boolean;
  setCurrentCodeType: (codeType: CodeType) => void;
  
  // Utility actions
  calculateDebugRate: () => number;
  calculateOfflineProgress: () => { bugsFixed: number; codeQuality: number; timeAway: number };
  reset: () => void;
}