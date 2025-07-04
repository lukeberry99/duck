export interface LogMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'duck';
  phase?: 'discovery' | 'consultant' | 'whisperer' | 'reality';
  weight?: number;
  trigger?: {
    type: 'bugsFixed' | 'duckPurchased' | 'upgradeUnlocked' | 'milestone';
    value?: number | string;
  };
}

export interface DuckDialogue {
  duckType: string;
  squeaks: string[];
  translations: string[];
  personality: string;
}

// Discovery Phase: Player realizes ducks are helping
export const discoveryMessages: LogMessage[] = [
  {
    id: 'discovery-1',
    message: 'Initializing debugging environment...',
    type: 'info',
    phase: 'discovery',
    weight: 1
  },
  {
    id: 'discovery-2',
    message: 'Strange... that rubber duck seems to be nodding along.',
    type: 'warning',
    phase: 'discovery',
    weight: 2,
    trigger: { type: 'bugsFixed', value: 5 }
  },
  {
    id: 'discovery-3',
    message: 'Did that duck just... squeak in approval?',
    type: 'info',
    phase: 'discovery',
    weight: 3,
    trigger: { type: 'bugsFixed', value: 10 }
  },
  {
    id: 'discovery-4',
    message: 'The duck methodology is working better than expected...',
    type: 'success',
    phase: 'discovery',
    weight: 2,
    trigger: { type: 'bugsFixed', value: 25 }
  },
  {
    id: 'discovery-5',
    message: 'Wait... are these ducks actually SENTIENT?',
    type: 'warning',
    phase: 'discovery',
    weight: 4,
    trigger: { type: 'bugsFixed', value: 50 }
  }
];

// Consultant Phase: Building debugging business
export const consultantMessages: LogMessage[] = [
  {
    id: 'consultant-1',
    message: 'Your debugging skills are attracting attention.',
    type: 'info',
    phase: 'consultant',
    weight: 2,
    trigger: { type: 'bugsFixed', value: 100 }
  },
  {
    id: 'consultant-2',
    message: 'Local startups are requesting your "duck-assisted debugging".',
    type: 'success',
    phase: 'consultant',
    weight: 3,
    trigger: { type: 'bugsFixed', value: 250 }
  },
  {
    id: 'consultant-3',
    message: 'The ducks seem to specialize in different types of bugs...',
    type: 'info',
    phase: 'consultant',
    weight: 2,
    trigger: { type: 'duckPurchased', value: 'bath' }
  },
  {
    id: 'consultant-4',
    message: 'Enterprise clients are paying premium rates for your services.',
    type: 'success',
    phase: 'consultant',
    weight: 3,
    trigger: { type: 'bugsFixed', value: 500 }
  },
  {
    id: 'consultant-5',
    message: 'The duck collective seems to be sharing knowledge telepathically.',
    type: 'warning',
    phase: 'consultant',
    weight: 4,
    trigger: { type: 'bugsFixed', value: 1000 }
  }
];

// Duck Whisperer Phase: Corporate contracts and fame
export const whispererMessages: LogMessage[] = [
  {
    id: 'whisperer-1',
    message: 'Fortune 500 companies are fighting over your debugging services.',
    type: 'success',
    phase: 'whisperer',
    weight: 2,
    trigger: { type: 'bugsFixed', value: 2500 }
  },
  {
    id: 'whisperer-2',
    message: 'The ducks are starting to debug bugs that don\'t exist yet.',
    type: 'warning',
    phase: 'whisperer',
    weight: 4,
    trigger: { type: 'bugsFixed', value: 5000 }
  },
  {
    id: 'whisperer-3',
    message: 'Your quantum duck just fixed a bug in the space-time continuum.',
    type: 'error',
    phase: 'whisperer',
    weight: 5,
    trigger: { type: 'duckPurchased', value: 'quantum' }
  },
  {
    id: 'whisperer-4',
    message: 'The tech industry has officially recognized "Duck Whisperer" as a job title.',
    type: 'success',
    phase: 'whisperer',
    weight: 3,
    trigger: { type: 'bugsFixed', value: 7500 }
  }
];

// Reality Debugger Phase: Cosmic debugging responsibilities
export const realityMessages: LogMessage[] = [
  {
    id: 'reality-1',
    message: 'Your cosmic duck is debugging the universe itself.',
    type: 'error',
    phase: 'reality',
    weight: 5,
    trigger: { type: 'duckPurchased', value: 'cosmic' }
  },
  {
    id: 'reality-2',
    message: 'Reality.exe has encountered a critical error. Ducks are on it.',
    type: 'error',
    phase: 'reality',
    weight: 6,
    trigger: { type: 'bugsFixed', value: 15000 }
  },
  {
    id: 'reality-3',
    message: 'The ducks reveal their true purpose: maintaining universal stability.',
    type: 'warning',
    phase: 'reality',
    weight: 7,
    trigger: { type: 'bugsFixed', value: 25000 }
  },
  {
    id: 'reality-4',
    message: 'Congratulations, you are now a certified Universal Debugger.',
    type: 'success',
    phase: 'reality',
    weight: 4,
    trigger: { type: 'bugsFixed', value: 50000 }
  }
];

// General debugging messages for ongoing gameplay
export const generalMessages: LogMessage[] = [
  {
    id: 'general-1',
    message: 'Fixed a null pointer exception. Classic.',
    type: 'success',
    weight: 2
  },
  {
    id: 'general-2',
    message: 'Rubber duck suggests checking the semicolon. Always the semicolon.',
    type: 'info',
    weight: 3
  },
  {
    id: 'general-3',
    message: 'Off-by-one error detected and squashed.',
    type: 'success',
    weight: 2
  },
  {
    id: 'general-4',
    message: 'Duck points out the obvious solution you\'ve been missing.',
    type: 'success',
    weight: 3
  },
  {
    id: 'general-5',
    message: 'Memory leak plugged. The duck looks satisfied.',
    type: 'success',
    weight: 2
  },
  {
    id: 'general-6',
    message: 'Race condition eliminated. Time flows normally again.',
    type: 'success',
    weight: 1
  },
  {
    id: 'general-7',
    message: 'Infinite loop broken. The universe thanks you.',
    type: 'warning',
    weight: 1
  }
];

// Duck-specific dialogue
export const duckDialogues: DuckDialogue[] = [
  {
    duckType: 'rubber',
    squeaks: ['*quack*', '*squeak*', '*gentle quack*'],
    translations: [
      'Have you tried turning it off and on again?',
      'The bug is in the last place you\'ll look.',
      'Rubber duck debugging is a legitimate technique.'
    ],
    personality: 'Supportive and encouraging'
  },
  {
    duckType: 'bath',
    squeaks: ['*stylish squeak*', '*bubbly quack*', '*CSS-compliant quack*'],
    translations: [
      'That div isn\'t centering because you forgot flexbox.',
      'The button needs more padding. Everything needs more padding.',
      'Your color scheme is debugging my eyes.'
    ],
    personality: 'Fashion-forward and design-conscious'
  },
  {
    duckType: 'pirate',
    squeaks: ['*arr-quack*', '*security squeak*', '*penetrating quack*'],
    translations: [
      'Ye be exposing sensitive data, matey!',
      'This code has more holes than a pirate ship.',
      'SQL injection vulnerability detected, arr!'
    ],
    personality: 'Gruff but protective'
  },
  {
    duckType: 'fancy',
    squeaks: ['*enterprise quack*', '*business squeak*', '*professional quack*'],
    translations: [
      'This needs to scale to enterprise requirements.',
      'Have you considered the ROI of this debugging session?',
      'The stakeholders won\'t approve this technical debt.'
    ],
    personality: 'Corporate and efficiency-focused'
  },
  {
    duckType: 'premium',
    squeaks: ['*premium squeak*', '*golden quack*', '*luxury quack*'],
    translations: [
      'Only the finest debugging techniques will suffice.',
      'This bug is beneath my usual standards.',
      'Excellence in debugging is not negotiable.'
    ],
    personality: 'Refined and perfectionist'
  },
  {
    duckType: 'quantum',
    squeaks: ['*quantum squeak*', '*superposition quack*', '*entangled quack*'],
    translations: [
      'The bug exists in multiple states simultaneously.',
      'Have you tried debugging in parallel universes?',
      'This code violates several laws of physics.'
    ],
    personality: 'Mysterious and scientifically minded'
  },
  {
    duckType: 'cosmic',
    squeaks: ['*cosmic rumble*', '*universal quack*', '*reality squeak*'],
    translations: [
      'This bug threatens the stability of existence itself.',
      'I\'ve seen this error pattern across seventeen dimensions.',
      'The universe is debugging itself through you.'
    ],
    personality: 'Wise and otherworldly'
  }
];

// Bug descriptions with escalating absurdity
export const bugDescriptions: string[] = [
  // Normal bugs
  'Variable not defined error in login function',
  'Array index out of bounds in data processing',
  'Memory leak in file handler',
  'SQL injection vulnerability in user input',
  'Race condition in multi-threaded operation',
  
  // Slightly absurd
  'Function returns Tuesday instead of boolean',
  'CSS making divs float into another dimension',
  'Loop counting backwards through time',
  'Database query returning philosophical questions',
  'API endpoint having an existential crisis',
  
  // More absurd
  'Code commenting itself out in protest',
  'Algorithm achieving sentience and demanding vacation days',
  'Function recursively calling its own lawyer',
  'Boolean variable stuck in quantum superposition',
  'Error message written in ancient hieroglyphs',
  
  // Cosmic absurdity
  'Bug has created its own startup and received funding',
  'Error stack trace spans multiple universes',
  'Code has formed a union and is on strike',
  'Function has transcended physical reality',
  'Bug has become self-aware and is debugging itself'
];

// Get appropriate messages based on game state
export const getMessagesForPhase = (bugsFixed: number): LogMessage[] => {
  if (bugsFixed >= 10000) return realityMessages;
  if (bugsFixed >= 2500) return whispererMessages;
  if (bugsFixed >= 100) return consultantMessages;
  return discoveryMessages;
};

// Get random message from pool with weight consideration
export const getRandomMessage = (messages: LogMessage[]): LogMessage | null => {
  if (messages.length === 0) return null;
  
  const totalWeight = messages.reduce((sum, msg) => sum + (msg.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const message of messages) {
    random -= (message.weight || 1);
    if (random <= 0) return message;
  }
  
  return messages[0];
};

// Get duck dialogue
export const getDuckDialogue = (duckType: string): { squeak: string; translation: string } | null => {
  const dialogue = duckDialogues.find(d => d.duckType === duckType);
  if (!dialogue) return null;
  
  const randomIndex = Math.floor(Math.random() * dialogue.squeaks.length);
  return {
    squeak: dialogue.squeaks[randomIndex],
    translation: dialogue.translations[randomIndex]
  };
};