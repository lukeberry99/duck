import type { BatchOperation, CodeType } from '../types/game';

export const initialBatchOperations: BatchOperation[] = [
  {
    id: 'web-batch-basic',
    name: 'Web Bug Sweep',
    description: 'Process multiple web development bugs simultaneously',
    codeType: 'web',
    batchSize: 5,
    efficiency: 1.2,
    cost: 500,
    unlocked: false
  },
  {
    id: 'web-batch-advanced',
    name: 'Full Stack Analysis',
    description: 'Comprehensive web application debugging',
    codeType: 'web',
    batchSize: 10,
    efficiency: 1.5,
    cost: 1500,
    unlocked: false
  },
  {
    id: 'mobile-batch-basic',
    name: 'Mobile Bug Hunt',
    description: 'Batch processing for mobile app issues',
    codeType: 'mobile',
    batchSize: 3,
    efficiency: 1.4,
    cost: 800,
    unlocked: false
  },
  {
    id: 'mobile-batch-advanced',
    name: 'Cross-Platform Debug',
    description: 'Debug issues across iOS and Android',
    codeType: 'mobile',
    batchSize: 8,
    efficiency: 1.8,
    cost: 2000,
    unlocked: false
  },
  {
    id: 'backend-batch-basic',
    name: 'Server-Side Sweep',
    description: 'Batch process backend infrastructure bugs',
    codeType: 'backend',
    batchSize: 4,
    efficiency: 1.3,
    cost: 700,
    unlocked: false
  },
  {
    id: 'backend-batch-advanced',
    name: 'System-Wide Analysis',
    description: 'Comprehensive backend system debugging',
    codeType: 'backend',
    batchSize: 12,
    efficiency: 1.6,
    cost: 2500,
    unlocked: false
  },
  {
    id: 'aiml-batch-basic',
    name: 'ML Model Debug',
    description: 'Batch process machine learning bugs',
    codeType: 'aiml',
    batchSize: 2,
    efficiency: 1.8,
    cost: 1200,
    unlocked: false
  },
  {
    id: 'aiml-batch-advanced',
    name: 'AI System Optimization',
    description: 'Advanced AI/ML debugging and optimization',
    codeType: 'aiml',
    batchSize: 6,
    efficiency: 2.2,
    cost: 4000,
    unlocked: false
  }
];

export const getBatchOperationsForCodeType = (codeType: CodeType): BatchOperation[] => {
  return initialBatchOperations.filter(op => op.codeType === codeType);
};

export const unlockBatchOperation = (operationId: string, gameState: { 
  bugsFixed: number; 
  codeQuality: number; 
  completedChallenges: string[];
}): boolean => {
  const operation = initialBatchOperations.find(op => op.id === operationId);
  if (!operation) return false;
  
  // Define unlock conditions for each batch operation
  const unlockConditions: Record<string, { type: 'bugsFixed' | 'codeQuality' | 'challenges'; value: number }> = {
    'web-batch-basic': { type: 'bugsFixed', value: 200 },
    'web-batch-advanced': { type: 'bugsFixed', value: 1000 },
    'mobile-batch-basic': { type: 'bugsFixed', value: 600 },
    'mobile-batch-advanced': { type: 'bugsFixed', value: 2000 },
    'backend-batch-basic': { type: 'bugsFixed', value: 400 },
    'backend-batch-advanced': { type: 'bugsFixed', value: 1500 },
    'aiml-batch-basic': { type: 'bugsFixed', value: 3000 },
    'aiml-batch-advanced': { type: 'bugsFixed', value: 8000 }
  };
  
  const condition = unlockConditions[operationId];
  if (!condition) return false;
  
  switch (condition.type) {
    case 'bugsFixed':
      return gameState.bugsFixed >= condition.value;
    case 'codeQuality':
      return gameState.codeQuality >= condition.value;
    case 'challenges':
      return gameState.completedChallenges.length >= condition.value;
    default:
      return false;
  }
};

export const calculateBatchEfficiency = (
  operation: BatchOperation,
  assignedDucks: Array<{ codeTypeSpecialty?: CodeType; specializationBonus: number }>,
  codeType: CodeType
): number => {
  if (assignedDucks.length === 0) {
    return operation.efficiency;
  }
  
  // Calculate average duck efficiency for this code type
  const avgDuckEfficiency = assignedDucks.reduce((sum, duck) => {
    const specialtyBonus = duck.codeTypeSpecialty === codeType ? duck.specializationBonus : 1.0;
    return sum + specialtyBonus;
  }, 0) / assignedDucks.length;
  
  // Apply duck efficiency to batch operation
  return operation.efficiency * Math.min(avgDuckEfficiency, 2.5); // Cap at 2.5x
};