// Cognitive Distortion Detection System
export interface CognitiveDistortion {
  type: string;
  name: string;
  description: string;
  patterns: RegExp[];
  explanation: string;
  reframe: string;
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
    reframe: "What evidence do you have that this worst-case scenario will actually happen? What are some other possible outcomes?"
  },
  {
    type: 'all_or_nothing',
    name: 'All-or-Nothing Thinking',
    description: 'Seeing things in black and white, with no middle ground',
    patterns: [
      /\b(always|never|everyone|no one|everything|nothing|completely|totally|absolutely)\b/i,
      /\b(perfect|failure|useless|worthless|hopeless|impossible)\b/i,
      /\b(either.*or|all.*none|100%|0%)\b/i
    ],
    explanation: "I notice some all-or-nothing thinking here — seeing things as completely one way or another.",
    reframe: "What would a more balanced perspective look like? Are there shades of gray in this situation?"
  },
  {
    type: 'mind_reading',
    name: 'Mind Reading',
    description: 'Assuming you know what others are thinking',
    patterns: [
      /\b(they think|he thinks|she thinks|they must think|probably thinks)\b/i,
      /\b(they hate me|they don't like|they're judging|they think I'm)\b/i,
      /\b(I know what.*thinking|obviously thinks|clearly believes)\b/i
    ],
    explanation: "It sounds like you might be mind reading — assuming you know what others are thinking without evidence.",
    reframe: "How can you know for certain what they're thinking? What evidence supports this assumption?"
  },
  {
    type: 'fortune_telling',
    name: 'Fortune Telling',
    description: 'Predicting negative outcomes without evidence',
    patterns: [
      /\b(will definitely|going to happen|bound to|sure to|inevitable)\b/i,
      /\b(I know.*will|it's going to|will never|won't work|will fail)\b/i,
      /\b(destined to|fate|meant to fail|no point trying)\b/i
    ],
    explanation: "You seem to be fortune telling — predicting negative outcomes as if they're certain to happen.",
    reframe: "What evidence do you have that this prediction will come true? What other outcomes are possible?"
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
    reframe: "What factors outside your control might have contributed to this situation? How much responsibility is actually yours?"
  },
  {
    type: 'mental_filter',
    name: 'Mental Filter',
    description: 'Focusing only on negative aspects while ignoring positives',
    patterns: [
      /\b(only|just|nothing but|all I see|can't see anything|except for the bad)\b/i,
      /\b(everything is|all.*negative|only the worst|nothing good|no positives)\b/i,
      /\b(focus on.*bad|dwelling on|can't stop thinking about.*negative)\b/i
    ],
    explanation: "You might be using a mental filter — focusing only on the negative aspects while filtering out the positives.",
    reframe: "What positive aspects of this situation might you be overlooking? What's the complete picture?"
  },
  {
    type: 'emotional_reasoning',
    name: 'Emotional Reasoning',
    description: 'Believing something is true because you feel it strongly',
    patterns: [
      /\b(I feel.*so it must be|because I feel|my feelings tell me|I feel like.*therefore)\b/i,
      /\b(feels true|must be true because|feeling means|emotions don't lie)\b/i,
      /\b(gut feeling says|instinct tells me|feel it in my bones)\b/i
    ],
    explanation: "You might be using emotional reasoning — believing something is true simply because you feel it strongly.",
    reframe: "What evidence exists beyond your feelings? How might your emotions be coloring your perception?"
  },
  {
    type: 'should_statements',
    name: 'Should Statements',
    description: 'Using rigid rules about how things should be',
    patterns: [
      /\b(should|shouldn't|must|mustn't|have to|need to|ought to|supposed to)\b/i,
      /\b(always should|never should|should have|shouldn't have|must be)\b/i,
      /\b(expected to|required to|obligated to|duty to)\b/i
    ],
    explanation: "I notice some 'should' statements — rigid expectations about how things ought to be.",
    reframe: "Where did this rule come from? What would happen if you were more flexible with this expectation?"
  },
  {
    type: 'labeling',
    name: 'Labeling',
    description: 'Defining yourself or others with negative labels',
    patterns: [
      /\b(I am.*idiot|I'm.*stupid|I'm.*failure|I'm.*loser|I'm.*worthless)\b/i,
      /\b(he's.*jerk|she's.*crazy|they're.*idiots|complete.*moron)\b/i,
      /\b(I'm just.*person who|I'm the type who always|I'm someone who)\b/i
    ],
    explanation: "You're using labeling — defining yourself or others with harsh, global terms.",
    reframe: "What specific behaviors are you concerned about? How might you describe this without using labels?"
  },
  {
    type: 'magnification',
    name: 'Magnification/Minimization',
    description: 'Blowing things out of proportion or minimizing importance',
    patterns: [
      /\b(huge|enormous|massive|gigantic|tiny|insignificant|doesn't matter)\b/i,
      /\b(blown out of proportion|making.*big deal|not important|no big deal)\b/i,
      /\b(catastrophic|earth-shattering|life-changing|meaningless|trivial)\b/i
    ],
    explanation: "You might be magnifying or minimizing — either blowing things out of proportion or making them seem less important than they are.",
    reframe: "What would be a more balanced way to view the importance of this situation?"
  }
];

export function detectCognitiveDistortions(text: string): DistortionDetectionResult {
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
  const suggestions = detectedDistortions.map(d => d.reframe);
  
  return {
    detected: detectedDistortions.length > 0,
    distortions: detectedDistortions,
    confidence,
    suggestions
  };
}

export function generateDistortionExplanation(distortions: CognitiveDistortion[]): string {
  if (distortions.length === 0) return '';
  
  if (distortions.length === 1) {
    return distortions[0].explanation;
  }
  
  // Multiple distortions detected
  const distortionNames = distortions.map(d => d.name).join(' and ');
  return `I notice some patterns that might be ${distortionNames}. These thinking patterns can sometimes make situations feel more overwhelming than they need to be.`;
}