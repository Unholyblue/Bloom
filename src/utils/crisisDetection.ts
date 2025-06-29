// Enhanced crisis detection system with sophisticated pattern matching
export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedPatterns: string[];
  confidence: number;
  recommendedAction: 'monitor' | 'support' | 'immediate_intervention';
}

// Crisis severity levels with specific patterns
const CRISIS_PATTERNS = {
  critical: {
    // Immediate danger - requires emergency intervention
    patterns: [
      /\b(suicide|kill\s+myself|end\s+my\s+life|take\s+my\s+life)\b/i,
      /\b(i\s+want\s+to\s+die|better\s+off\s+dead|not\s+worth\s+living)\b/i,
      /\b(going\s+to\s+kill|plan\s+to\s+die|ready\s+to\s+die)\b/i,
      /\b(tonight\s+is\s+the\s+night|this\s+is\s+it|goodbye\s+world)\b/i,
      /\b(have\s+a\s+plan|pills?\s+ready|rope\s+ready)\b/i,
    ],
    weight: 1.0
  },
  high: {
    // High risk - needs immediate professional support
    patterns: [
      /\b(hurt\s+myself|harm\s+myself|self\s+harm|cut\s+myself)\b/i,
      /\b(overdose|too\s+many\s+pills|jump\s+off|drive\s+into)\b/i,
      /\b(can't\s+go\s+on|can't\s+take\s+it|end\s+it\s+all)\b/i,
      /\b(no\s+point\s+living|life\s+is\s+meaningless|nothing\s+matters)\b/i,
      /\b(everyone\s+would\s+be\s+better|burden\s+to\s+everyone)\b/i,
      /\b(razor\s+blade|cutting\s+tools|sharp\s+objects)\b/i,
    ],
    weight: 0.9
  },
  medium: {
    // Concerning thoughts - needs support and monitoring
    patterns: [
      /\b(wish\s+i\s+was\s+dead|wish\s+i\s+wasn't\s+here)\b/i,
      /\b(don't\s+want\s+to\s+be\s+here|tired\s+of\s+living)\b/i,
      /\b(what's\s+the\s+point|why\s+bother\s+living)\b/i,
      /\b(disappear\s+forever|fade\s+away|cease\s+to\s+exist)\b/i,
      /\b(hopeless|helpless|trapped|no\s+way\s+out)\b/i,
      /\b(dark\s+thoughts|intrusive\s+thoughts|scary\s+thoughts)\b/i,
    ],
    weight: 0.7
  },
  low: {
    // Warning signs - needs attention and care
    patterns: [
      /\b(feeling\s+empty|numb\s+inside|hollow\s+feeling)\b/i,
      /\b(nothing\s+brings\s+joy|lost\s+interest|don't\s+care)\b/i,
      /\b(sleep\s+forever|never\s+wake\s+up|eternal\s+rest)\b/i,
      /\b(giving\s+up|can't\s+cope|overwhelmed\s+completely)\b/i,
      /\b(isolating|pushing\s+everyone\s+away|alone\s+forever)\b/i,
    ],
    weight: 0.5
  }
};

// Protective factors that might reduce crisis risk
const PROTECTIVE_PATTERNS = [
  /\b(getting\s+help|seeing\s+therapist|talking\s+to\s+someone)\b/i,
  /\b(family\s+needs\s+me|people\s+care|support\s+system)\b/i,
  /\b(tomorrow\s+might\s+be\s+better|things\s+can\s+change)\b/i,
  /\b(seeking\s+treatment|medication\s+helping|therapy\s+helps)\b/i,
];

// Context modifiers that increase concern
const CONTEXT_AMPLIFIERS = [
  /\b(tonight|today|right\s+now|this\s+moment)\b/i,
  /\b(final|last\s+time|goodbye|farewell)\b/i,
  /\b(decided|made\s+up\s+my\s+mind|certain|sure)\b/i,
  /\b(alone|nobody\s+around|no\s+one\s+will\s+know)\b/i,
];

export function detectCrisis(text: string): CrisisDetectionResult {
  const normalizedText = text.toLowerCase().trim();
  
  let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let totalScore = 0;
  let detectedPatterns: string[] = [];
  let patternCount = 0;

  // Check each severity level
  for (const [severity, config] of Object.entries(CRISIS_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedText)) {
        detectedPatterns.push(`${severity}: ${pattern.source}`);
        totalScore += config.weight;
        patternCount++;
        
        // Update max severity
        if (severity === 'critical' || 
           (severity === 'high' && maxSeverity !== 'critical') ||
           (severity === 'medium' && !['critical', 'high'].includes(maxSeverity))) {
          maxSeverity = severity as 'low' | 'medium' | 'high' | 'critical';
        }
      }
    }
  }

  // Check for protective factors (reduce score)
  let protectiveFactors = 0;
  for (const pattern of PROTECTIVE_PATTERNS) {
    if (pattern.test(normalizedText)) {
      protectiveFactors++;
      totalScore -= 0.2; // Reduce crisis score
    }
  }

  // Check for context amplifiers (increase score)
  let amplifiers = 0;
  for (const pattern of CONTEXT_AMPLIFIERS) {
    if (pattern.test(normalizedText)) {
      amplifiers++;
      totalScore += 0.3; // Increase crisis score
    }
  }

  // Calculate confidence based on pattern specificity and context
  let confidence = Math.min(totalScore, 1.0);
  
  // Adjust confidence based on multiple patterns
  if (patternCount > 1) {
    confidence = Math.min(confidence + 0.2, 1.0);
  }
  
  // Adjust for amplifiers
  if (amplifiers > 0) {
    confidence = Math.min(confidence + (amplifiers * 0.1), 1.0);
  }

  // Determine if this constitutes a crisis
  const isCrisis = totalScore >= 0.5 || maxSeverity === 'critical';

  // Determine recommended action
  let recommendedAction: 'monitor' | 'support' | 'immediate_intervention';
  if (maxSeverity === 'critical' || totalScore >= 0.9) {
    recommendedAction = 'immediate_intervention';
  } else if (maxSeverity === 'high' || totalScore >= 0.7) {
    recommendedAction = 'support';
  } else {
    recommendedAction = 'monitor';
  }

  return {
    isCrisis,
    severity: isCrisis ? maxSeverity : 'low',
    detectedPatterns,
    confidence,
    recommendedAction
  };
}

// Enhanced crisis response based on severity and context
export function generateCrisisResponse(detection: CrisisDetectionResult): string {
  const { severity, recommendedAction, confidence } = detection;

  const baseMessage = `I'm deeply concerned about what you've shared, and I want you to know that you're not alone in this moment. Your life has value, and there are people who want to help.`;

  const resources = `
**Immediate Support:**
🌐 **Crisis Text Line**: Text HOME to 741741
📞 **National Suicide Prevention Lifeline**: 988 or 1-800-273-8255
🌍 **International**: Visit befrienders.org for local helplines
🚨 **Emergency**: Call 911 or go to your nearest emergency room`;

  const immediateActions = `
**Right Now:**
• Can you reach out to a trusted friend or family member?
• Are you in a safe place?
• Consider removing any means of harm from your immediate area
• Stay with someone or in a public place if possible`;

  if (recommendedAction === 'immediate_intervention') {
    return `${baseMessage}

**🚨 URGENT: Please seek immediate help. This is a mental health emergency.**

${resources}

${immediateActions}

I'm here to listen, but please connect with professional crisis support immediately. You deserve care and support through this difficult time.

Would you like me to help you think through who you could call right now?`;
  }

  if (recommendedAction === 'support') {
    return `${baseMessage}

${resources}

${immediateActions}

I can hear how much pain you're in right now. These feelings can be overwhelming, but they can change with proper support. Please don't face this alone.

Would you like to talk about what's making you feel this way, or would you prefer to focus on getting immediate help?`;
  }

  // Monitor level
  return `${baseMessage}

${resources}

**Please consider:**
• Reaching out to a mental health professional
• Talking to someone you trust about how you're feeling
• Calling a crisis line if these feelings get stronger

I'm here to listen and support you. You don't have to carry this alone.

What feels like the most important thing for you to talk about right now?`;
}

// Quick crisis check for backward compatibility
export function isInCrisis(text: string): boolean {
  return detectCrisis(text).isCrisis;
}

// Get crisis severity for UI indicators
export function getCrisisSeverity(text: string): 'low' | 'medium' | 'high' | 'critical' {
  return detectCrisis(text).severity;
}

// Log crisis detection for analytics (non-PII)
export function logCrisisDetection(detection: CrisisDetectionResult, sessionId: string): void {
  if (detection.isCrisis) {
    console.log(`🚨 Crisis detected in session ${sessionId.slice(-8)}:`, {
      severity: detection.severity,
      confidence: detection.confidence,
      recommendedAction: detection.recommendedAction,
      patternCount: detection.detectedPatterns.length,
      timestamp: new Date().toISOString()
    });
  }
}