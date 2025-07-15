import type { CodeType } from '../types/game';

export interface CodeTypeConfig {
  name: string;
  description: string;
  icon: string;
  bugPatterns: string[];
  baseDebugDifficulty: number;
  specialistBonus: number;
  unlockCondition: {
    type: 'bugsFixed' | 'codeQuality' | 'ducksOwned';
    value: number;
  };
}

export const codeTypeConfigs: Record<CodeType, CodeTypeConfig> = {
  web: {
    name: 'Web Development',
    description: 'Frontend and web application debugging',
    icon: '🌐',
    bugPatterns: [
      'CSS selector not found',
      'JavaScript undefined error',
      'React component not rendering',
      'API endpoint returning 404',
      'DOM manipulation failure',
      'CORS policy violation',
      'Missing dependency in package.json',
      'Browser compatibility issue',
      'Memory leak in event listeners',
      'Async/await promise rejection'
    ],
    baseDebugDifficulty: 1.0,
    specialistBonus: 1.5,
    unlockCondition: { type: 'bugsFixed', value: 0 }
  },
  
  mobile: {
    name: 'Mobile Development',
    description: 'iOS and Android app debugging',
    icon: '📱',
    bugPatterns: [
      'Memory warning on device',
      'Network request timeout',
      'UI thread blocking operation',
      'Crash on app background',
      'Permission denied error',
      'Battery optimization conflict',
      'Touch gesture not recognized',
      'Device orientation issue',
      'Platform-specific API failure',
      'App store submission rejected'
    ],
    baseDebugDifficulty: 1.2,
    specialistBonus: 1.6,
    unlockCondition: { type: 'bugsFixed', value: 500 }
  },
  
  backend: {
    name: 'Backend Development',
    description: 'Server-side and API debugging',
    icon: '🖥️',
    bugPatterns: [
      'Database connection timeout',
      'Memory leak in request handler',
      'Authentication token expired',
      'Race condition in concurrent requests',
      'SQL injection vulnerability',
      'Server overload under traffic',
      'Microservice communication failure',
      'Docker container crash',
      'Load balancer misconfiguration',
      'Deadlock in database transaction'
    ],
    baseDebugDifficulty: 1.3,
    specialistBonus: 1.4,
    unlockCondition: { type: 'bugsFixed', value: 250 }
  },
  
  aiml: {
    name: 'AI/ML Development',
    description: 'Machine learning and AI system debugging',
    icon: '🤖',
    bugPatterns: [
      'Model training divergence',
      'Gradient exploding/vanishing',
      'Overfitting on training data',
      'Data pipeline corruption',
      'GPU memory allocation failed',
      'Feature engineering bug',
      'Model inference timeout',
      'Bias in training dataset',
      'Tensor shape mismatch',
      'Hyperparameter optimization stuck'
    ],
    baseDebugDifficulty: 1.5,
    specialistBonus: 2.0,
    unlockCondition: { type: 'bugsFixed', value: 2500 }
  }
};

export const getCodeTypeConfig = (codeType: CodeType): CodeTypeConfig => {
  return codeTypeConfigs[codeType];
};

export const getRandomBugPattern = (codeType: CodeType): string => {
  const config = codeTypeConfigs[codeType];
  return config.bugPatterns[Math.floor(Math.random() * config.bugPatterns.length)];
};

export const isCodeTypeUnlocked = (codeType: CodeType, gameState: { 
  bugsFixed: number; 
  codeQuality: number; 
  ducks: Array<{ type: string }>; 
}): boolean => {
  const condition = codeTypeConfigs[codeType].unlockCondition;
  
  switch (condition.type) {
    case 'bugsFixed':
      return gameState.bugsFixed >= condition.value;
    case 'codeQuality':
      return gameState.codeQuality >= condition.value;
    case 'ducksOwned':
      return gameState.ducks.length >= condition.value;
    default:
      return true;
  }
};

export const calculateDuckEfficiency = (duckSpecialty: CodeType | undefined, sessionCodeType: CodeType): number => {
  if (!duckSpecialty) {
    return 1.0; // General ducks work at base efficiency
  }
  
  if (duckSpecialty === sessionCodeType) {
    return codeTypeConfigs[sessionCodeType].specialistBonus;
  }
  
  // Cross-specialization penalties/bonuses
  const crossSpecializationMatrix: Record<CodeType, Record<CodeType, number>> = {
    web: { web: 1.0, mobile: 0.8, backend: 0.7, aiml: 0.5 },
    mobile: { web: 0.8, mobile: 1.0, backend: 0.6, aiml: 0.4 },
    backend: { web: 0.7, mobile: 0.6, backend: 1.0, aiml: 0.8 },
    aiml: { web: 0.5, mobile: 0.4, backend: 0.8, aiml: 1.0 }
  };
  
  return crossSpecializationMatrix[duckSpecialty][sessionCodeType] || 0.5;
};