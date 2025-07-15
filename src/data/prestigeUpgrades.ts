import type { PrestigeUpgrade } from '../types/game';

export const initialPrestigeUpgrades: PrestigeUpgrade[] = [
  // Architecture Patterns - Permanent debugging bonuses
  {
    id: 'mvc-pattern',
    category: 'architecture',
    name: 'MVC Architecture',
    description: 'Structural clarity increases debugging efficiency by 25%',
    cost: 5,
    purchased: false,
    currentLevel: 0,
    maxLevel: 5,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.25
    }
  },
  {
    id: 'microservices',
    category: 'architecture',
    name: 'Microservices Pattern',
    description: 'Isolated failures are easier to debug. +50% debug rate',
    cost: 10,
    purchased: false,
    currentLevel: 0,
    maxLevel: 3,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.5
    }
  },
  {
    id: 'event-sourcing',
    category: 'architecture',
    name: 'Event Sourcing',
    description: 'Complete audit trail. +100% code quality generation',
    cost: 20,
    purchased: false,
    currentLevel: 0,
    maxLevel: 1,
    effect: {
      type: 'multiplier',
      target: 'codeQuality',
      value: 2.0
    }
  },
  {
    id: 'clean-architecture',
    category: 'architecture',
    name: 'Clean Architecture',
    description: 'Dependency inversion makes everything clearer. +75% duck efficiency',
    cost: 25,
    purchased: false,
    currentLevel: 0,
    maxLevel: 2,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 1.75
    }
  },

  // Code Review Processes - Quality multipliers
  {
    id: 'pair-programming',
    category: 'codeReview',
    name: 'Pair Programming',
    description: 'Two minds are better than one. +30% debug rate',
    cost: 3,
    purchased: false,
    currentLevel: 0,
    maxLevel: 10,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.3
    }
  },
  {
    id: 'code-review-culture',
    category: 'codeReview',
    name: 'Code Review Culture',
    description: 'Systematic quality checks. +40% code quality generation',
    cost: 8,
    purchased: false,
    currentLevel: 0,
    maxLevel: 5,
    effect: {
      type: 'multiplier',
      target: 'codeQuality',
      value: 1.4
    }
  },
  {
    id: 'static-analysis',
    category: 'codeReview',
    name: 'Static Analysis Tools',
    description: 'Automated code review. +60% debug rate',
    cost: 15,
    purchased: false,
    currentLevel: 0,
    maxLevel: 3,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.6
    }
  },
  {
    id: 'formal-verification',
    category: 'codeReview',
    name: 'Formal Verification',
    description: 'Mathematical proof of correctness. +200% code quality',
    cost: 50,
    purchased: false,
    currentLevel: 0,
    maxLevel: 1,
    effect: {
      type: 'multiplier',
      target: 'codeQuality',
      value: 3.0
    }
  },

  // Debugging Methodologies - Efficiency boosts
  {
    id: 'rubber-duck-mastery',
    category: 'methodology',
    name: 'Rubber Duck Mastery',
    description: 'Deep understanding of duck psychology. +50% duck efficiency',
    cost: 7,
    purchased: false,
    currentLevel: 0,
    maxLevel: 7,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 1.5
    }
  },
  {
    id: 'test-driven-debugging',
    category: 'methodology',
    name: 'Test-Driven Debugging',
    description: 'Write tests first, debug second. +35% debug rate',
    cost: 12,
    purchased: false,
    currentLevel: 0,
    maxLevel: 4,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.35
    }
  },
  {
    id: 'scientific-method',
    category: 'methodology',
    name: 'Scientific Method',
    description: 'Hypothesis-driven debugging. +80% debug rate',
    cost: 18,
    purchased: false,
    currentLevel: 0,
    maxLevel: 2,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.8
    }
  },
  {
    id: 'chaos-engineering',
    category: 'methodology',
    name: 'Chaos Engineering',
    description: 'Break things to make them stronger. +100% code quality',
    cost: 30,
    purchased: false,
    currentLevel: 0,
    maxLevel: 2,
    effect: {
      type: 'multiplier',
      target: 'codeQuality',
      value: 2.0
    }
  },

  // Universal Constants - Reality stability bonuses
  {
    id: 'universal-debugger',
    category: 'universal',
    name: 'Universal Debugger',
    description: 'Debug the universe itself. +20% to all gains',
    cost: 40,
    purchased: false,
    currentLevel: 0,
    maxLevel: 3,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.2
    }
  },
  {
    id: 'reality-compiler',
    category: 'universal',
    name: 'Reality Compiler',
    description: 'Optimize existence itself. +50% architecture point gain',
    cost: 60,
    purchased: false,
    currentLevel: 0,
    maxLevel: 2,
    effect: {
      type: 'multiplier',
      target: 'architecturePointsGain',
      value: 1.5
    }
  },
  {
    id: 'quantum-entanglement',
    category: 'universal',
    name: 'Quantum Entanglement',
    description: 'Bugs fixed in parallel universes. +300% debug rate',
    cost: 100,
    purchased: false,
    currentLevel: 0,
    maxLevel: 1,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 4.0
    }
  },
  {
    id: 'cosmic-consciousness',
    category: 'universal',
    name: 'Cosmic Consciousness',
    description: 'Transcend debugging itself. Start with 1000 CQ and 10 bugs fixed',
    cost: 150,
    purchased: false,
    currentLevel: 0,
    maxLevel: 1,
    effect: {
      type: 'special',
      target: 'startingResources',
      value: 1
    }
  }
];

// Architecture Points calculation
export const calculateArchitecturePoints = (bugsFixed: number): number => {
  if (bugsFixed < 25000) return 0;  // Increased from 1000 to 25000
  
  // Base formula: sqrt(total_bugs_fixed) / 25 (reduced from /10)
  let points = Math.floor(Math.sqrt(bugsFixed) / 25);
  
  // Bonus multipliers for milestones (reduced from original values)
  if (bugsFixed >= 500000) points *= 1.5;      // Reduced from 2x
  else if (bugsFixed >= 100000) points *= 1.3; // Reduced from 1.8x
  else if (bugsFixed >= 50000) points *= 1.2;  // Reduced from 1.6x
  else if (bugsFixed >= 25000) points *= 1.1;  // Reduced from 1.4x (at 10000)
  
  return Math.floor(points);
};

// Get prestige upgrade by category
export const getPrestigeUpgradesByCategory = (upgrades: PrestigeUpgrade[], category: string) => {
  return upgrades.filter(upgrade => upgrade.category === category);
};

// Calculate total prestige multipliers
export const calculatePrestigeMultipliers = (upgrades: PrestigeUpgrade[]) => {
  const multipliers = {
    debugRate: 1,
    codeQuality: 1,
    duckEfficiency: 1,
    architecturePointsGain: 1
  };

  upgrades
    .filter(upgrade => upgrade.purchased)
    .forEach(upgrade => {
      const totalLevels = upgrade.currentLevel;
      if (totalLevels > 0) {
        const effectValue = Math.pow(upgrade.effect.value, totalLevels);
        
        switch (upgrade.effect.target) {
          case 'debugRate':
            multipliers.debugRate *= effectValue;
            break;
          case 'codeQuality':
            multipliers.codeQuality *= effectValue;
            break;
          case 'duckEfficiency':
            multipliers.duckEfficiency *= effectValue;
            break;
          case 'architecturePointsGain':
            multipliers.architecturePointsGain *= effectValue;
            break;
        }
      }
    });

  return multipliers;
};

// Check if can afford prestige upgrade
export const canAffordPrestigeUpgrade = (architecturePoints: number, upgrade: PrestigeUpgrade): boolean => {
  if (upgrade.maxLevel && upgrade.currentLevel >= upgrade.maxLevel) return false;
  
  const costMultiplier = Math.pow(2, upgrade.currentLevel);
  const totalCost = upgrade.cost * costMultiplier;
  
  return architecturePoints >= totalCost;
};

// Get cost for next level of prestige upgrade
export const getPrestigeUpgradeCost = (upgrade: PrestigeUpgrade): number => {
  const costMultiplier = Math.pow(2, upgrade.currentLevel);
  return upgrade.cost * costMultiplier;
};