// Reflection Depth Tracking System
export interface ReflectionMetrics {
  depth: number;
  insights: string[];
  emotionalAwareness: number;
  selfDiscovery: string[];
  breakthroughs: string[];
  sessionSummary?: string;
}

export interface ReflectionAnalysis {
  currentDepth: number;
  depthIncrease: boolean;
  qualityIndicators: string[];
  readyForSummary: boolean;
  nextSteps: string[];
}

// Patterns that indicate deeper reflection
const DEPTH_INDICATORS = {
  level1: {
    patterns: [
      /\b(I feel|I'm feeling|feeling|emotions?)\b/i,
      /\b(today|right now|currently|at the moment)\b/i
    ],
    weight: 1
  },
  level2: {
    patterns: [
      /\b(because|since|due to|caused by|triggered by)\b/i,
      /\b(I think|I believe|I wonder|maybe|perhaps)\b/i,
      /\b(reminds me|similar to|like when|happened before)\b/i
    ],
    weight: 2
  },
  level3: {
    patterns: [
      /\b(I realize|I understand|I see now|it makes sense|I notice)\b/i,
      /\b(pattern|always|usually|tend to|habit|recurring)\b/i,
      /\b(childhood|past|growing up|learned|taught)\b/i
    ],
    weight: 3
  },
  level4: {
    patterns: [
      /\b(I've learned|I'm changing|I want to|I will|I can)\b/i,
      /\b(growth|healing|progress|journey|transformation)\b/i,
      /\b(grateful|thankful|appreciate|value|meaningful)\b/i,
      /\b(purpose|meaning|why|deeper|core|essence)\b/i
    ],
    weight: 4
  },
  level5: {
    patterns: [
      /\b(wisdom|enlightened|awakened|transcend|spiritual)\b/i,
      /\b(interconnected|universal|human condition|shared experience)\b/i,
      /\b(compassion|empathy|understanding others|helping others)\b/i
    ],
    weight: 5
  }
};

// Quality indicators for reflection
const QUALITY_INDICATORS = [
  {
    pattern: /\b(I realize|I understand|I see now|it makes sense)\b/i,
    indicator: 'Self-awareness breakthrough'
  },
  {
    pattern: /\b(pattern|always|usually|tend to|habit)\b/i,
    indicator: 'Pattern recognition'
  },
  {
    pattern: /\b(childhood|past|growing up|learned)\b/i,
    indicator: 'Historical insight'
  },
  {
    pattern: /\b(I want to|I will|I can|I'm going to)\b/i,
    indicator: 'Future-oriented thinking'
  },
  {
    pattern: /\b(grateful|thankful|appreciate|value)\b/i,
    indicator: 'Gratitude expression'
  },
  {
    pattern: /\b(growth|healing|progress|journey)\b/i,
    indicator: 'Growth mindset'
  }
];

export function analyzeReflectionDepth(
  userInput: string, 
  previousDepth: number = 1,
  sessionHistory: string[] = []
): ReflectionAnalysis {
  const normalizedText = userInput.toLowerCase();
  let calculatedDepth = 1;
  let maxWeight = 0;
  
  // Calculate depth based on patterns
  for (const [level, config] of Object.entries(DEPTH_INDICATORS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        maxWeight = Math.max(maxWeight, config.weight);
      }
    }
  }
  
  calculatedDepth = maxWeight || 1;
  
  // Ensure depth doesn't decrease dramatically (gradual progression)
  const currentDepth = Math.max(calculatedDepth, Math.min(previousDepth, calculatedDepth + 1));
  
  // Detect quality indicators
  const qualityIndicators: string[] = [];
  for (const indicator of QUALITY_INDICATORS) {
    if (indicator.pattern.test(normalizedText)) {
      qualityIndicators.push(indicator.indicator);
    }
  }
  
  // Determine if ready for summary (depth >= 4 or significant insights)
  const readyForSummary = currentDepth >= 4 || qualityIndicators.length >= 3;
  
  // Generate next steps based on current depth
  const nextSteps = generateNextSteps(currentDepth, qualityIndicators);
  
  return {
    currentDepth,
    depthIncrease: currentDepth > previousDepth,
    qualityIndicators,
    readyForSummary,
    nextSteps
  };
}

function generateNextSteps(depth: number, indicators: string[]): string[] {
  const steps: string[] = [];
  
  if (depth >= 4) {
    steps.push("You've reached significant depth in your reflection");
    steps.push("Consider how these insights might guide your future actions");
    steps.push("Think about what you've learned about yourself today");
  } else if (depth === 3) {
    steps.push("You're developing meaningful insights");
    steps.push("Explore how these patterns might connect to other areas of your life");
  } else if (depth === 2) {
    steps.push("You're beginning to explore underlying causes");
    steps.push("Consider what experiences might have shaped these feelings");
  } else {
    steps.push("You're sharing your current emotional state");
    steps.push("Explore what might be contributing to these feelings");
  }
  
  return steps;
}

export function generateReflectionSummary(
  sessionHistory: string[],
  finalDepth: number,
  insights: string[]
): string {
  const summaryParts = [
    `Today you reached a reflection depth of ${finalDepth}/5, showing meaningful self-exploration.`,
  ];
  
  if (insights.length > 0) {
    summaryParts.push(`Key insights you discovered: ${insights.join(', ')}.`);
  }
  
  if (finalDepth >= 4) {
    summaryParts.push("You demonstrated exceptional emotional courage and self-awareness in this session.");
  } else if (finalDepth >= 3) {
    summaryParts.push("You showed willingness to explore deeper patterns and connections.");
  } else {
    summaryParts.push("You took important first steps in emotional exploration.");
  }
  
  summaryParts.push("Remember: every moment of honest self-reflection contributes to your growth and healing.");
  
  return summaryParts.join(' ');
}