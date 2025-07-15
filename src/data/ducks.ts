import type { Duck, DuckType, CodeType } from '../types/game';

export const createDuck = (type: DuckType): Duck => {
  const duckConfig = duckTypes[type];
  return {
    id: `duck-${type}-${Date.now()}`,
    type,
    level: 1,
    debugPower: duckConfig.baseDebugPower,
    specialization: duckConfig.specialization,
    acquired: Date.now(),
    codeTypeSpecialty: duckConfig.codeTypeSpecialty,
    specializationBonus: duckConfig.specializationBonus || 1.0
  };
};

export const createBasicRubberDuck = (): Duck => createDuck('rubber');

export const duckTypes = {
  rubber: {
    name: 'Basic Rubber Duck',
    description: 'A classic debugging companion',
    specialization: 'General Debugging',
    baseDebugPower: 1,
    baseCost: 100,
    unlockCondition: { type: 'bugsFixed', value: 0 },
    specialBonus: { type: 'none', value: 0 },
    codeTypeSpecialty: undefined,
    specializationBonus: 1.0
  },
  bath: {
    name: 'Bath Duck',
    description: 'Frontend specialist with waterproof styling',
    specialization: 'Frontend Development',
    baseDebugPower: 2,
    baseCost: 500,
    unlockCondition: { type: 'bugsFixed', value: 100 },
    specialBonus: { type: 'webBugMultiplier', value: 2 },
    codeTypeSpecialty: 'web' as CodeType,
    specializationBonus: 1.5
  },
  pirate: {
    name: 'Pirate Duck',
    description: 'Security expert with an eye for vulnerabilities',
    specialization: 'Security Analysis',
    baseDebugPower: 3,
    baseCost: 1000,
    unlockCondition: { type: 'bugsFixed', value: 250 },
    specialBonus: { type: 'criticalBugChance', value: 0.1 },
    codeTypeSpecialty: 'backend' as CodeType,
    specializationBonus: 1.4
  },
  fancy: {
    name: 'Fancy Duck',
    description: 'Enterprise debugging with premium features',
    specialization: 'Enterprise Systems',
    baseDebugPower: 5,
    baseCost: 2500,
    unlockCondition: { type: 'bugsFixed', value: 500 },
    specialBonus: { type: 'codeQualityBonus', value: 2 },
    codeTypeSpecialty: 'backend' as CodeType,
    specializationBonus: 1.3
  },
  premium: {
    name: 'Premium Duck',
    description: '2x efficiency with distinguished appearance',
    specialization: 'Premium Debugging',
    baseDebugPower: 4,
    baseCost: 5000,
    unlockCondition: { type: 'bugsFixed', value: 1000 },
    specialBonus: { type: 'efficiencyMultiplier', value: 2 },
    codeTypeSpecialty: 'mobile' as CodeType,
    specializationBonus: 1.6
  },
  quantum: {
    name: 'Quantum Duck',
    description: 'Handles paradoxes and quantum bugs',
    specialization: 'Quantum Computing',
    baseDebugPower: 10,
    baseCost: 10000,
    unlockCondition: { type: 'bugsFixed', value: 2500 },
    specialBonus: { type: 'quantumEntanglement', value: 0.05 },
    codeTypeSpecialty: 'aiml' as CodeType,
    specializationBonus: 2.0
  },
  cosmic: {
    name: 'Cosmic Duck',
    description: 'Universe-level debugging capabilities',
    specialization: 'Cosmic Maintenance',
    baseDebugPower: 25,
    baseCost: 50000,
    unlockCondition: { type: 'bugsFixed', value: 10000 },
    specialBonus: { type: 'universalDebugger', value: 1.5 },
    codeTypeSpecialty: undefined,
    specializationBonus: 3.0
  }
};

export const getDuckCost = (type: DuckType, owned: number): number => {
  const baseCost = duckTypes[type].baseCost;
  return Math.floor(baseCost * Math.pow(1.15, owned));
};

export const isDuckUnlocked = (type: DuckType, gameState: { bugsFixed: number; codeQuality: number; achievements: { peakBugsFixed: number; peakCodeQuality: number; peakDebugRate: number } }): boolean => {
  const condition = duckTypes[type].unlockCondition;
  
  switch (condition.type) {
    case 'bugsFixed':
      return gameState.achievements.peakBugsFixed >= condition.value;
    case 'codeQuality':
      return gameState.achievements.peakCodeQuality >= condition.value;
    default:
      return true;
  }
};