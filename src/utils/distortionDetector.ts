// Cognitive Distortion Detection System
export interface CognitiveDistortion {
  type: string;
  name: string;
  description: string;
  patterns: RegExp[];
  explanation: string;
  reframeQuestions: string[];
  examples: string[];
}

export interface DistortionDetectionResult {
  detected: boolean;
  distortions: CognitiveDistortion[];
  confidence: number;
  suggestions: string[];
}

// Comprehensive cognitive distortion patterns
const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    type: 'catastrophizing',
    name: 'Catastrophizing',
    description: 'Expecting the worst possible outcome',
    patterns: [
      /\b(disaster|catastrophe|terrible|awful|horrible|worst case|everything will fall apart|complete failure)\b/i,
      /\b(what if.*goes wrong|bound to fail|doomed|ruined|destroyed)\b/i,
      /\b(never recover|end of the world|can't handle|will be terrible)\b/i
    ],
    explanation: "You might be catastrophizing — imagining the worst possible outcome when there are many other possibilities.",
    reframeQuestions: [
      "What evidence do you have that this worst-case scenario will actually happen?",
      "What are some other possible outcomes?",
      "If the worst did happen, what resources do you have to handle it?"
    ],
    examples: [
      "This is going to be a complete disaster.",
      "Everything is going to fall apart.",
      "I'll never recover from this mistake."
    ]
  },
  {
    type: 'all_or_nothing',
    name: 'Black-and-white thinking',
    description: 'Seeing things in black and white, with no middle ground',
    patterns: [
      /\b(always|never|everyone|no one|everything|nothing|completely|totally|absolutely)\b/i,
      /\b(perfect|failure|useless|worthless|hopeless|impossible)\b/i,
      /\b(either.*or|all.*none|100%|0%)\b/i
    ],
    explanation: "I notice some black-and-white thinking here — seeing things as completely one way or another.",
    reframeQuestions: [
      "What would a more balanced perspective look like?",
      "Are there shades of gray in this situation?",
      "Can something be partially successful rather than a complete success or failure?"
    ],
    examples: [
      "I always mess everything up.",
      "Nobody ever listens to me.",
      "If I can't do it perfectly, there's no point in trying."
    ]
  },
  {
    type: 'mind_reading',
    name: 'Mind reading',
    description: 'Assuming you know what others are thinking',
    patterns: [
      /\b(they think|he thinks|she thinks|they must think|probably thinks)\b/i,
      /\b(they hate me|they don't like|they're judging|they think I'm)\b/i,
      /\b(I know what.*thinking|obviously thinks|clearly believes)\b/i
    ],
    explanation: "It sounds like you might be mind reading — assuming you know what others are thinking without evidence.",
    reframeQuestions: [
      "How can you know for certain what they're thinking?",
      "What evidence supports this assumption?",
      "What are some other possible interpretations of their behavior?"
    ],
    examples: [
      "They think I'm incompetent.",
      "Everyone at the party was judging me.",
      "My boss obviously thinks I'm not good enough."
    ]
  },
  {
    type: 'overgeneralization',
    name: 'Overgeneralization',
    description: 'Taking one negative event and applying it to all situations',
    patterns: [
      /\b(always happens|never works|every time|everyone always|no one ever|everything always)\b/i,
      /\b(this always|that never|it's always|they're always|I'm always)\b/i,
      /\b(every single|each time|without fail|consistently|repeatedly)\b/i
    ],
    explanation: "You might be overgeneralizing — taking one experience and applying it broadly to different situations.",
    reframeQuestions: [
      "Are there any exceptions to this pattern?",
      "Have there been times when this wasn't true?",
      "What specific circumstances might make this situation different?"
    ],
    examples: [
      "I always get rejected when I apply for jobs.",
      "Every time I try something new, I fail.",
      "Nobody ever appreciates what I do."
    ]
  },
  {
    type: 'personalization',
    name: 'Personalization',
    description: 'Taking responsibility for things outside your control',
    patterns: [
      /\b(it's my fault|I'm to blame|because of me|I caused|I'm responsible for)\b/i,
      /\b(if only I|I should have|I could have prevented|my fault that)\b/i,
      /\b(I ruined|I destroyed|I made.*happen|because I)\b/i
    ],
    explanation: "You might be personalizing — taking responsibility for things that aren't entirely within your control.",
    reframeQuestions: [
      "What factors outside your control might have contributed to this situation?",
      "How much responsibility is actually yours?",
      "Would you hold someone else 100% responsible in this situation?"
    ],
    examples: [
      "It's all my fault that the project failed.",
      "If only I had been a better partner, they wouldn't have left.",
      "I'm responsible for everyone's happiness at the event."
    ]
  },
  {
    type: 'emotional_reasoning',
    name: 'Emotional reasoning',
    description: 'Believing something is true because you feel it strongly',
    patterns: [
      /\b(I feel.*so it must be|because I feel|my feelings tell me|I feel like.*therefore)\b/i,
      /\b(feels true|must be true because|feeling means|emotions don't lie)\b/i,
      /\b(gut feeling says|instinct tells me|feel it in my bones)\b/i
    ],
    explanation: "You might be using emotional reasoning — believing something is true simply because you feel it strongly.",
    reframeQuestions: [
      "What evidence exists beyond your feelings?",
      "How might your emotions be coloring your perception?",
      "If you felt differently, how might you view this situation?"
    ],
    examples: [
      "I feel like a failure, so I must be one.",
      "I feel anxious about the presentation, which means it's going to go badly.",
      "I feel like they don't respect me, so they must not."
    ]
  },
  {
    type: 'fortune_telling',
    name: 'Fortune-telling',
    description: 'Predicting negative outcomes without evidence',
    patterns: [
      /\b(will definitely|going to happen|bound to|sure to|inevitable)\b/i,
      /\b(I know.*will|it's going to|will never|won't work|will fail)\b/i,
      /\b(destined to|fate|meant to fail|no point trying)\b/i
    ],
    explanation: "You seem to be fortune telling — predicting negative outcomes as if they're certain to happen.",
    reframeQuestions: [
      "What evidence do you have that this prediction will come true?",
      "What other outcomes are possible?",
      "How have similar situations turned out in the past?"
    ],
    examples: [
      "I'll definitely fail the interview.",
      "This relationship is bound to end badly.",
      "I know they're going to reject my idea."
    ]
  },
  {
    type: 'filtering',
    name: 'Filtering',
    description: 'Focusing only on negative aspects while ignoring positives',
    patterns: [
      /\b(only|just|nothing but|all I see|can't see anything|except for the bad)\b/i,
      /\b(everything is|all.*negative|only the worst|nothing good|no positives)\b/i,
      /\b(focus on.*bad|dwelling on|can't stop thinking about.*negative)\b/i
    ],
    explanation: "You might be using a mental filter — focusing only on the negative aspects while filtering out the positives.",
    reframeQuestions: [
      "What positive aspects of this situation might you be overlooking?",
      "What's the complete picture?",
      "If a friend were in this situation, what positives might you point out to them?"
    ],
    examples: [
      "Nothing good ever happens to me.",
      "I got feedback on my work, but all I can think about is the one criticism.",
      "The entire day was ruined because of that one bad moment."
    ]
  }
];

/**
 * Detects cognitive distortions in the provided text
 */
export function detectDistortions(text: string): DistortionDetectionResult {
  const detectedDistortions: CognitiveDistortion[] = [];
  const normalizedText = text.toLowerCase();
  
  for (const distortion of COGNITIVE_DISTORTIONS) {
    let matchCount = 0;
    for (const pattern of distortion.patterns) {
      if (pattern.test(normalizedText)) {
        matchCount++;
      }
    }
    
    // If at least one pattern matches, consider it detected
    if (matchCount > 0) {
      detectedDistortions.push(distortion);
    }
  }
  
  // Calculate confidence based on number of matches and text length
  const confidence = Math.min(detectedDistortions.length * 0.3, 1.0);
  
  // Generate suggestions based on detected distortions
  const suggestions = detectedDistortions.flatMap(d => d.reframeQuestions);
  
  return {
    detected: detectedDistortions.length > 0,
    distortions: detectedDistortions,
    confidence,
    suggestions
  };
}

/**
 * Parses the output from the Distortion Detector GPT block
 * and converts it to a structured result
 */
export function parseDistortionDetectorOutput(output: string): DistortionDetectionResult {
  // If output contains "None detected", return no distortions
  if (output.includes("None detected")) {
    return {
      detected: false,
      distortions: [],
      confidence: 0,
      suggestions: []
    };
  }
  
  // Otherwise, parse the output to extract distortions
  const detectedDistortions: CognitiveDistortion[] = [];
  const lines = output.split('\n');
  
  // Check for distortion names
  for (const line of lines) {
    for (const distortion of COGNITIVE_DISTORTIONS) {
      if (line.includes(distortion.name)) {
        detectedDistortions.push(distortion);
        break;
      }
    }
  }
  
  // Calculate confidence based on number of distortions
  const confidence = Math.min(detectedDistortions.length * 0.3, 1.0);
  
  // Generate suggestions
  const suggestions = detectedDistortions.flatMap(d => d.reframeQuestions);
  
  return {
    detected: detectedDistortions.length > 0,
    distortions: detectedDistortions,
    confidence,
    suggestions
  };
}

/**
 * Gets a specific distortion by name
 */
export function getDistortionByName(name: string): CognitiveDistortion | undefined {
  return COGNITIVE_DISTORTIONS.find(d => 
    d.name.toLowerCase() === name.toLowerCase() || 
    d.type.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Gets all available distortion types
 */
export function getAllDistortionTypes(): string[] {
  return COGNITIVE_DISTORTIONS.map(d => d.name);
}