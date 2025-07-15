import type { PerformanceChallenge, CodeType } from '../types/game';

export const initialPerformanceChallenges: PerformanceChallenge[] = [
  // Web Development Challenges
  {
    id: 'web-speed-demon',
    name: 'Speed Demon',
    description: 'Fix 10 web bugs in under 60 seconds',
    codeType: 'web',
    timeLimit: 60,
    targetBugs: 10,
    difficulty: 'easy',
    rewards: {
      codeQuality: 200,
      architecturePoints: 1
    },
    unlockCondition: { type: 'bugsFixed', value: 100 }
  },
  {
    id: 'web-frontend-master',
    name: 'Frontend Master',
    description: 'Debug 25 complex web issues in 3 minutes',
    codeType: 'web',
    timeLimit: 180,
    targetBugs: 25,
    difficulty: 'medium',
    rewards: {
      codeQuality: 500,
      architecturePoints: 3,
      title: 'Frontend Wizard'
    },
    unlockCondition: { type: 'bugsFixed', value: 500 }
  },
  {
    id: 'web-fullstack-god',
    name: 'Fullstack God',
    description: 'Master 50 web bugs in 5 minutes',
    codeType: 'web',
    timeLimit: 300,
    targetBugs: 50,
    difficulty: 'hard',
    rewards: {
      codeQuality: 1000,
      architecturePoints: 8,
      title: 'Web Deity'
    },
    unlockCondition: { type: 'challengesCompleted', value: 3 }
  },
  
  // Mobile Development Challenges
  {
    id: 'mobile-app-rescue',
    name: 'App Rescue',
    description: 'Save a crashing mobile app - 8 bugs in 90 seconds',
    codeType: 'mobile',
    timeLimit: 90,
    targetBugs: 8,
    difficulty: 'easy',
    rewards: {
      codeQuality: 300,
      architecturePoints: 2
    },
    unlockCondition: { type: 'bugsFixed', value: 600 }
  },
  {
    id: 'mobile-cross-platform',
    name: 'Cross-Platform Hero',
    description: 'Debug 20 mobile issues across platforms in 4 minutes',
    codeType: 'mobile',
    timeLimit: 240,
    targetBugs: 20,
    difficulty: 'medium',
    rewards: {
      codeQuality: 700,
      architecturePoints: 5,
      title: 'Mobile Architect'
    },
    unlockCondition: { type: 'bugsFixed', value: 1200 }
  },
  {
    id: 'mobile-performance-ninja',
    name: 'Performance Ninja',
    description: 'Optimize 40 mobile performance issues in 6 minutes',
    codeType: 'mobile',
    timeLimit: 360,
    targetBugs: 40,
    difficulty: 'hard',
    rewards: {
      codeQuality: 1500,
      architecturePoints: 10,
      title: 'Mobile Sensei'
    },
    unlockCondition: { type: 'challengesCompleted', value: 5 }
  },
  
  // Backend Development Challenges
  {
    id: 'backend-server-saver',
    name: 'Server Saver',
    description: 'Fix critical server bugs - 6 bugs in 2 minutes',
    codeType: 'backend',
    timeLimit: 120,
    targetBugs: 6,
    difficulty: 'easy',
    rewards: {
      codeQuality: 400,
      architecturePoints: 2
    },
    unlockCondition: { type: 'bugsFixed', value: 300 }
  },
  {
    id: 'backend-infrastructure-master',
    name: 'Infrastructure Master',
    description: 'Debug 15 backend systems in 3 minutes',
    codeType: 'backend',
    timeLimit: 180,
    targetBugs: 15,
    difficulty: 'medium',
    rewards: {
      codeQuality: 800,
      architecturePoints: 6,
      title: 'System Administrator'
    },
    unlockCondition: { type: 'bugsFixed', value: 800 }
  },
  {
    id: 'backend-distributed-systems',
    name: 'Distributed Systems God',
    description: 'Master 35 distributed system bugs in 7 minutes',
    codeType: 'backend',
    timeLimit: 420,
    targetBugs: 35,
    difficulty: 'expert',
    rewards: {
      codeQuality: 2000,
      architecturePoints: 15,
      title: 'Infrastructure Deity'
    },
    unlockCondition: { type: 'challengesCompleted', value: 8 }
  },
  
  // AI/ML Development Challenges
  {
    id: 'aiml-model-debug',
    name: 'Model Debug',
    description: 'Fix 4 critical ML model bugs in 3 minutes',
    codeType: 'aiml',
    timeLimit: 180,
    targetBugs: 4,
    difficulty: 'medium',
    rewards: {
      codeQuality: 600,
      architecturePoints: 4
    },
    unlockCondition: { type: 'bugsFixed', value: 3000 }
  },
  {
    id: 'aiml-neural-network',
    name: 'Neural Network Surgeon',
    description: 'Debug 12 deep learning issues in 5 minutes',
    codeType: 'aiml',
    timeLimit: 300,
    targetBugs: 12,
    difficulty: 'hard',
    rewards: {
      codeQuality: 1200,
      architecturePoints: 8,
      title: 'AI Researcher'
    },
    unlockCondition: { type: 'bugsFixed', value: 5000 }
  },
  {
    id: 'aiml-singularity',
    name: 'Approach Singularity',
    description: 'Debug 30 AI system bugs in 8 minutes',
    codeType: 'aiml',
    timeLimit: 480,
    targetBugs: 30,
    difficulty: 'expert',
    rewards: {
      codeQuality: 3000,
      architecturePoints: 20,
      title: 'AI Overlord'
    },
    unlockCondition: { type: 'challengesCompleted', value: 10 }
  }
];

export const getChallengesForCodeType = (codeType: CodeType): PerformanceChallenge[] => {
  return initialPerformanceChallenges.filter(challenge => challenge.codeType === codeType);
};

export const getChallengesByDifficulty = (difficulty: PerformanceChallenge['difficulty']): PerformanceChallenge[] => {
  return initialPerformanceChallenges.filter(challenge => challenge.difficulty === difficulty);
};

export const isChallengeUnlocked = (challenge: PerformanceChallenge, gameState: {
  bugsFixed: number;
  completedChallenges: string[];
  debugSessions: Array<{ isActive: boolean }>;
}): boolean => {
  const condition = challenge.unlockCondition;
  
  switch (condition.type) {
    case 'bugsFixed':
      return gameState.bugsFixed >= condition.value;
    case 'challengesCompleted':
      return gameState.completedChallenges.length >= condition.value;
    case 'sessionsCompleted':
      return gameState.debugSessions.filter(s => !s.isActive).length >= condition.value;
    default:
      return false;
  }
};

export const calculateChallengeScore = (timeUsed: number, timeLimit: number, targetBugs: number): number => {
  const timeRatio = timeUsed / timeLimit;
  const speedBonus = Math.max(0, 1 - timeRatio);
  const baseScore = targetBugs * 10;
  
  return Math.floor(baseScore * (1 + speedBonus));
};

export const getDifficultyMultiplier = (difficulty: PerformanceChallenge['difficulty']): number => {
  const multipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 3.0
  };
  
  return multipliers[difficulty] || 1.0;
};