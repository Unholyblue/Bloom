import { detectCognitiveDistortions, generateDistortionExplanation } from './cognitiveDistortions';
import { analyzeReflectionDepth, generateReflectionSummary } from './reflectionTracker';
import { detectCrisis, generateCrisisResponse } from './crisisDetection';

interface EnhancedAIResponse {
  message: string;
  followUpQuestion: string;
  cognitiveDistortions?: {
    detected: boolean;
    explanation?: string;
    suggestions?: string[];
  };
  reflectionAnalysis?: {
    depth: number;
    qualityIndicators: string[];
    readyForSummary: boolean;
  };
  isCrisis?: boolean;
  sessionSummary?: string;
}

export async function generateEnhancedAIResponse(
  userInput: string,
  context: {
    sessionHistory?: string[];
    previousDepth?: number;
    conversationCount?: number;
  } = {}
): Promise<EnhancedAIResponse> {
  
  // Validate input to prevent emoji-only messages
  if (isEmojiOnlyInput(userInput)) {
    return {
      message: "I notice you sent an emoji. Could you tell me more about how you're feeling?",
      followUpQuestion: "What emotions or thoughts are you experiencing right now?",
      reflectionAnalysis: {
        depth: context.previousDepth || 1,
        qualityIndicators: [],
        readyForSummary: false
      }
    };
  }
  
  // Crisis detection first
  const crisisDetection = detectCrisis(userInput);
  if (crisisDetection.isCrisis) {
    const crisisResponse = generateCrisisResponse(crisisDetection);
    return {
      message: crisisResponse,
      followUpQuestion: "Please prioritize your safety right now. Are you able to reach out for immediate support?",
      isCrisis: true
    };
  }

  // Cognitive distortion detection
  const distortionAnalysis = detectCognitiveDistortions(userInput);
  
  // Reflection depth analysis
  const reflectionAnalysis = analyzeReflectionDepth(
    userInput, 
    context.previousDepth || 1,
    context.sessionHistory || []
  );

  // Generate base therapeutic response
  const baseResponse = await generateTherapeuticResponse(userInput, reflectionAnalysis.currentDepth);
  
  // Enhance response with distortion awareness
  let enhancedMessage = baseResponse.message;
  let enhancedFollowUp = baseResponse.followUpQuestion;
  
  if (distortionAnalysis.detected && distortionAnalysis.distortions.length > 0) {
    const distortionExplanation = generateDistortionExplanation(distortionAnalysis.distortions);
    enhancedMessage += `\n\n${distortionExplanation} Would you like to explore this pattern together?`;
  }

  // Generate session summary if ready
  let sessionSummary;
  if (reflectionAnalysis.readyForSummary && context.sessionHistory) {
    sessionSummary = generateReflectionSummary(
      context.sessionHistory,
      reflectionAnalysis.currentDepth,
      reflectionAnalysis.qualityIndicators
    );
  }

  return {
    message: enhancedMessage,
    followUpQuestion: enhancedFollowUp,
    cognitiveDistortions: distortionAnalysis.detected ? {
      detected: true,
      explanation: generateDistortionExplanation(distortionAnalysis.distortions),
      suggestions: distortionAnalysis.suggestions
    } : { detected: false },
    reflectionAnalysis: {
      depth: reflectionAnalysis.currentDepth,
      qualityIndicators: reflectionAnalysis.qualityIndicators,
      readyForSummary: reflectionAnalysis.readyForSummary
    },
    sessionSummary
  };
}

// Helper function to detect emoji-only input
function isEmojiOnlyInput(text: string): boolean {
  // Remove whitespace
  const trimmed = text.trim();
  
  // Check if empty after trimming
  if (!trimmed) return false;
  
  // Regex to match emoji characters
  const emojiRegex = /[\p{Emoji}]/gu;
  
  // Remove all emoji characters
  const withoutEmoji = trimmed.replace(emojiRegex, '');
  
  // If nothing remains after removing emojis and whitespace, it was emoji-only
  return withoutEmoji.trim().length === 0;
}

async function generateTherapeuticResponse(userInput: string, depth: number): Promise<{message: string, followUpQuestion: string}> {
  const feeling = userInput.toLowerCase();
  
  // Depth-aware responses
  if (depth >= 4) {
    return {
      message: `You've reached a profound level of self-reflection today. I can sense the wisdom and insight you're developing about yourself. This kind of deep exploration takes real courage and shows your commitment to growth and healing.`,
      followUpQuestion: `As you reflect on this journey we've taken together, what feels most significant or transformative about what you've discovered?`
    };
  } else if (depth === 3) {
    return {
      message: `I notice you're connecting deeper patterns and insights about yourself. This level of self-awareness is where real transformation begins to happen. You're not just experiencing emotions—you're understanding them.`,
      followUpQuestion: `What patterns or connections are becoming clearer to you as we explore this together?`
    };
  } else if (depth === 2) {
    return {
      message: `You're beginning to explore the layers beneath your initial feelings, which shows real emotional intelligence. This willingness to look deeper is how we move from just experiencing emotions to understanding and learning from them.`,
      followUpQuestion: `What do you think might be at the root of these feelings? What experiences or thoughts might be contributing to this emotional state?`
    };
  }

  // Emotion-specific responses for initial depth
  const emotionResponses: Record<string, {message: string, followUpQuestion: string}> = {
    overwhelmed: {
      message: "I can sense the weight you're carrying right now. Feeling overwhelmed often happens when we're facing more than our current capacity can handle, and that's completely human and understandable.",
      followUpQuestion: "What feels like the heaviest part of what you're carrying right now?"
    },
    anxious: {
      message: "Anxiety can feel like your mind is racing ahead to all the things that could go wrong. It's your brain's way of trying to prepare for threats, even when those threats might not be real or immediate.",
      followUpQuestion: "When you notice this anxiety, what thoughts tend to run through your mind?"
    },
    sad: {
      message: "Sadness often carries important information about what matters to us. It can signal loss, disappointment, or unmet needs. Your sadness is valid and deserves to be acknowledged.",
      followUpQuestion: "What do you think your sadness might be trying to tell you about what you need or what you've lost?"
    },
    angry: {
      message: "Anger often shows up when our boundaries have been crossed or our values have been violated. It's an emotion that can contain important information about what matters to you.",
      followUpQuestion: "What feels like it's been violated or crossed that's stirring up this anger?"
    },
    confused: {
      message: "Confusion can be uncomfortable, but it often signals that you're in a space of growth and change. Sometimes our old ways of understanding don't fit new situations.",
      followUpQuestion: "What aspects of your situation feel most unclear or conflicting right now?"
    }
  };

  // Check for emotion matches
  for (const [emotion, response] of Object.entries(emotionResponses)) {
    if (feeling.includes(emotion)) {
      return response;
    }
  }

  // Default therapeutic response
  return {
    message: `I hear you sharing something important about your inner experience. Every emotion and thought you bring here matters and deserves attention. You're taking a meaningful step by exploring what's happening inside you.`,
    followUpQuestion: `What feels most important for you to understand about what you're experiencing right now?`
  };
}