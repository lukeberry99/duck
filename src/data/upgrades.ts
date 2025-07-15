import type { Upgrade } from '../types/game';

export const initialUpgrades: Upgrade[] = [
  // Duck Upgrades
  {
    id: 'basic-rubber-duck',
    type: 'duck',
    name: 'Basic Rubber Duck',
    description: 'A trusty rubber duck that helps debug code. Adds 1 debug per second.',
    cost: 100,
    purchased: false,
    unlocked: true,
    effect: {
      type: 'additive',
      target: 'debugRate',
      value: 1
    },
    dependencies: []
  },
  {
    id: 'bath-duck',
    type: 'duck',
    name: 'Bath Duck',
    description: 'Frontend specialist with waterproof styling. Adds 2 debug per manual click.',
    cost: 500,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'additive',
      target: 'debugRate',
      value: 2
    },
    dependencies: []
  },
  {
    id: 'pirate-duck',
    type: 'duck',
    name: 'Pirate Duck',
    description: 'Security expert with an eye for vulnerabilities. Adds 3 debug per manual click.',
    cost: 1000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'additive',
      target: 'debugRate',
      value: 3
    },
    dependencies: []
  },
  {
    id: 'fancy-duck',
    type: 'duck',
    name: 'Fancy Duck',
    description: 'Enterprise debugging with premium features. Adds 5 debug per manual click.',
    cost: 2500,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'additive',
      target: 'debugRate',
      value: 5
    },
    dependencies: []
  },
  {
    id: 'premium-duck',
    type: 'duck',
    name: 'Premium Duck',
    description: '1.4x efficiency with distinguished appearance.',
    cost: 25000,    // 5x increase from 5,000
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.4  // Changed from +4 additive to 1.4x multiplier
    },
    dependencies: []
  },
  {
    id: 'quantum-duck',
    type: 'duck',
    name: 'Quantum Duck',
    description: 'Handles paradoxes and quantum bugs. 1.6x debug rate.',
    cost: 100000,   // 10x increase from 10,000
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.6  // Changed from +10 additive to 1.6x multiplier
    },
    dependencies: []
  },
  {
    id: 'cosmic-duck',
    type: 'duck',
    name: 'Cosmic Duck',
    description: 'Universe-level debugging capabilities. 2x debug rate.',
    cost: 500000,   // 10x increase from 50,000
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 2.0  // Changed from +25 additive to 2x multiplier
    },
    dependencies: []
  },
  
  // Tool Upgrades
  {
    id: 'enhanced-debugging',
    type: 'tool',
    name: 'Enhanced Debugging Tools',
    description: 'Better tools mean better debugging. +2 Code Quality per bug fixed.',
    cost: 250,
    purchased: false,
    unlocked: true,
    effect: {
      type: 'additive',
      target: 'codeQuality',
      value: 2
    },
    dependencies: []
  },
  {
    id: 'ide-integration',
    type: 'tool',
    name: 'IDE Integration',
    description: 'Seamless integration with your development environment. 1.3x debug rate.',
    cost: 800,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.3
    },
    dependencies: ['enhanced-debugging']
  },
  {
    id: 'static-analysis',
    type: 'tool',
    name: 'Static Analysis Tools',
    description: 'Find bugs before they happen. 1.5x code quality generation.',
    cost: 1500,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'codeQuality',
      value: 1.5
    },
    dependencies: ['ide-integration']
  },
  {
    id: 'ai-assistant',
    type: 'tool',
    name: 'AI Debugging Assistant',
    description: 'AI helps identify complex bugs. 2x debug rate.',
    cost: 5000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 2.0
    },
    dependencies: ['static-analysis']
  },
  
  // Environment Upgrades
  {
    id: 'debugging-efficiency',
    type: 'environment',
    name: 'Debugging Efficiency',
    description: 'Optimize your debugging workflow. 1.5x debug rate multiplier.',
    cost: 500,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.5
    },
    dependencies: []
  },
  {
    id: 'ergonomic-workspace',
    type: 'environment',
    name: 'Ergonomic Workspace',
    description: 'Comfortable coding leads to better debugging. 1.2x duck efficiency.',
    cost: 1200,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 1.2
    },
    dependencies: ['debugging-efficiency']
  },
  {
    id: 'noise-cancellation',
    type: 'environment',
    name: 'Noise Cancellation',
    description: 'Focus without distractions. 1.4x debug rate.',
    cost: 2000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'debugRate',
      value: 1.4
    },
    dependencies: ['ergonomic-workspace']
  },
  {
    id: 'zen-garden',
    type: 'environment',
    name: 'Zen Garden',
    description: 'Achieve debugging enlightenment. 1.5x all bonuses.',
    cost: 8000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'special',
      value: 1.5
    },
    dependencies: ['noise-cancellation']
  },
  
  // Duck Enhancement Upgrades
  {
    id: 'duck-training',
    type: 'duck',
    name: 'Duck Training Program',
    description: 'Train your ducks to be more efficient. 1.2x duck efficiency multiplier.',
    cost: 750,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 1.2
    },
    dependencies: []
  },
  {
    id: 'premium-duck-feed',
    type: 'duck',
    name: 'Premium Duck Feed',
    description: 'High-quality feed makes for high-quality debugging. 1.5x duck efficiency multiplier.',
    cost: 1500,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 1.5
    },
    dependencies: ['duck-training']
  },
  {
    id: 'duck-motivation',
    type: 'duck',
    name: 'Duck Motivation Seminar',
    description: 'Motivated ducks are productive ducks. 2x duck efficiency multiplier.',
    cost: 3000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 2.0
    },
    dependencies: ['premium-duck-feed']
  },
  {
    id: 'duck-specialization',
    type: 'duck',
    name: 'Duck Specialization Program',
    description: 'Specialized ducks work more efficiently. 1.3x duck efficiency.',
    cost: 6000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 1.3
    },
    dependencies: ['duck-motivation']
  },
  {
    id: 'duck-enlightenment',
    type: 'duck',
    name: 'Duck Enlightenment',
    description: 'Transcendent debugging wisdom. 3x duck efficiency.',
    cost: 15000,
    purchased: false,
    unlocked: false,
    effect: {
      type: 'multiplier',
      target: 'duckEfficiency',
      value: 3.0
    },
    dependencies: ['duck-specialization']
  }
];