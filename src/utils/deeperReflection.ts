import { detectCrisis, generateCrisisResponse } from './crisisDetection';

interface DeepReflectionResponse {
  message: string;
  followUpQuestion: string;
  isCrisis?: boolean;
}

// Enhanced deeper reflection using sophisticated therapeutic principles
export async function generateDeeperReflection(
  originalFeeling: string,
  originalResponse: string,
  userFollowUp: string,
  reflectionDepth: number = 2
): Promise<DeepReflectionResponse> {
  // Use enhanced fallback deeper reflection
  return generateEnhancedDeeperReflection(originalFeeling, originalResponse, userFollowUp, reflectionDepth);
}

function generateEnhancedDeeperReflection(
  originalFeeling: string,
  originalResponse: string,
  userFollowUp: string,
  reflectionDepth: number = 2
): DeepReflectionResponse {
  
  // Check for crisis in follow-up
  const crisisDetection = detectCrisis(userFollowUp);
  if (crisisDetection.isCrisis) {
    const crisisResponse = generateCrisisResponse(crisisDetection);
    return {
      message: crisisResponse,
      followUpQuestion: "Your safety is the most important thing right now. Can you reach out for immediate support?",
      isCrisis: true
    };
  }

  // Check for empty or emoji-only input
  if (isEmojiOnlyInput(userFollowUp)) {
    return {
      message: "I notice you sent an emoji. While emojis can express feelings, I'd love to hear more about what's going on for you in words.",
      followUpQuestion: "Could you tell me more about the emotions or thoughts you're experiencing right now?"
    };
  }

  const followUpLower = userFollowUp.toLowerCase();
  
  // Enhanced therapeutic pattern recognition with barrier-breaking responses
  if (followUpLower.includes('family') || followUpLower.includes('parent') || followUpLower.includes('mother') || followUpLower.includes('father')) {
    return {
      message: `I can feel how deep these family wounds go, and I want you to know you can say anything about them here - even the things you feel guilty thinking. Family relationships can be the most complicated because we're supposed to love them, but sometimes they hurt us the most. You don't have to protect them or make excuses for them. You can just tell me the raw truth about how they make you feel.`,
      followUpQuestion: reflectionDepth >= 3 
        ? "What would you say to your family if you knew there would be no consequences? What truth have you been holding back?"
        : "What's the hardest thing about your family that you don't usually talk about? I want to hear the real story."
    };
  }

  if (followUpLower.includes('work') || followUpLower.includes('job') || followUpLower.includes('career') || followUpLower.includes('boss')) {
    return {
      message: `Work can feel like it's consuming your soul sometimes, and I can hear how much this is draining you. You don't have to be grateful for having a job or look on the bright side. You can hate every minute of it, you can be furious about how you're treated, and you can dream of walking out. Your feelings about work are completely valid, even the angry ones.`,
      followUpQuestion: reflectionDepth >= 3
        ? "If you could say exactly what you think to everyone at work without any consequences, what would you tell them?"
        : "What's the worst part about your work situation that you usually keep to yourself?"
    };
  }

  if (followUpLower.includes('relationship') || followUpLower.includes('partner') || followUpLower.includes('boyfriend') || followUpLower.includes('girlfriend') || followUpLower.includes('spouse')) {
    return {
      message: `Relationships can break our hearts in ways we never expected, and I can feel how much pain this is causing you. You don't have to be fair or balanced or see both sides right now. You can be as hurt, as angry, as disappointed as you are. You can admit the things about them that drive you crazy, the ways they've let you down, the love that feels complicated or painful.`,
      followUpQuestion: reflectionDepth >= 3
        ? "What do you wish you could change about this person or this relationship? What would make your heart feel safe again?"
        : "What's the most painful thing about this relationship that you haven't been able to say out loud?"
    };
  }

  if (followUpLower.includes('past') || followUpLower.includes('childhood') || followUpLower.includes('memory') || followUpLower.includes('remember')) {
    return {
      message: `Our past can feel like it's still happening inside us sometimes, and I can sense how much these memories are affecting you right now. You don't have to minimize what happened or focus on how it made you stronger. You can feel as hurt, as angry, as cheated as you need to about what you went through. Your past experiences deserve to be honored, especially the painful ones.`,
      followUpQuestion: reflectionDepth >= 3
        ? "What do you wish someone had said to you back then? What did that younger version of you need to hear?"
        : "What's the hardest part about these memories that still hurts today?"
    };
  }

  if (followUpLower.includes('fear') || followUpLower.includes('scared') || followUpLower.includes('afraid') || followUpLower.includes('worry')) {
    return {
      message: `Fear can feel like it's taking over everything, making it hard to breathe or think clearly. I want you to know you can share every terrifying thought, every worst-case scenario that's playing in your mind. You don't have to be brave or positive or rational right now. Sometimes our fears are trying to protect us from something real, and sometimes they're just overwhelming us. Either way, they deserve to be heard.`,
      followUpQuestion: reflectionDepth >= 3
        ? "What would you do if you knew you couldn't fail or get hurt? What would your life look like without this fear?"
        : "What's the scariest thought that keeps running through your mind? The one you try not to think about?"
    };
  }

  if (followUpLower.includes('alone') || followUpLower.includes('lonely') || followUpLower.includes('isolated') || followUpLower.includes('nobody')) {
    return {
      message: `Loneliness can feel like it's eating you alive from the inside, and I can feel how isolated and disconnected you're feeling right now. You don't have to pretend you're fine being alone or that you're independent and don't need anyone. You can admit how much you're hurting, how much you need connection, how tired you are of feeling invisible or forgotten.`,
      followUpQuestion: reflectionDepth >= 3
        ? "What kind of connection are you most hungry for? What would it feel like to be truly seen and understood?"
        : "What's the loneliest moment you've had recently? When did you feel most invisible or forgotten?"
    };
  }

  if (followUpLower.includes('angry') || followUpLower.includes('mad') || followUpLower.includes('furious') || followUpLower.includes('rage')) {
    return {
      message: `I can feel the fire of your anger, and I want you to know you're completely safe to let it burn as hot as it needs to here. You don't have to calm down or be reasonable or see the other side. Your anger is telling you something important - maybe that your boundaries have been crossed, that you've been treated unfairly, that something precious to you has been threatened. Let it all out.`,
      followUpQuestion: reflectionDepth >= 3
        ? "If your anger could speak, what would it say? What is it trying to protect or defend in you?"
        : "What's making you angriest right now? What feels most unfair or wrong about this situation?"
    };
  }

  // Default deeper reflection based on depth with enhanced barrier-breaking responses
  if (reflectionDepth >= 4) {
    return {
      message: `You've been so brave in sharing the depths of what you're experiencing, and I'm honored that you've trusted me with these vulnerable parts of yourself. I can feel how much courage it's taken to go this deep, to be this honest about what's really going on inside you. There's something powerful happening in this space we've created together - a kind of truth-telling that can be both painful and healing.`,
      followUpQuestion: "As we've been talking, what truth about yourself or your situation has become clearer? What do you know now that you didn't know when we started?"
    };
  } else if (reflectionDepth === 3) {
    return {
      message: `I can feel how much you're trusting me with these deeper layers of your experience, and I want you to know that everything you're sharing matters. You don't have to have it all figured out or make perfect sense. You can be as confused, as contradictory, as messy as you are. Sometimes the most important truths are the ones that are hardest to say.`,
      followUpQuestion: "What's the thing you're thinking but haven't said yet? What's sitting just under the surface waiting to be spoken?"
    };
  } else {
    return {
      message: `Thank you for sharing more of what's really going on. I can sense there are deeper currents running underneath what you've told me, and I want you to know you're completely safe to dive as deep as you need to. You don't have to protect me from the intensity of what you're feeling or thinking. I can handle all of it.`,
      followUpQuestion: "What else is churning inside you about this? What haven't you said yet that feels important or scary to share?"
    };
  }
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

// Session summary with therapeutic insights
export function generateTherapeuticSessionSummary(sessionEntries: any[]): string {
  const totalEntries = sessionEntries.length;
  const reflectionDepth = Math.max(...sessionEntries.map(entry => entry.reflection_depth || 1));
  
  const insights = [];
  
  if (reflectionDepth >= 4) {
    insights.push("Demonstrated exceptional emotional courage and self-reflection");
  } else if (reflectionDepth >= 3) {
    insights.push("Engaged in meaningful therapeutic exploration");
  } else if (reflectionDepth >= 2) {
    insights.push("Showed willingness to explore feelings more deeply");
  }
  
  if (totalEntries >= 6) {
    insights.push("Sustained therapeutic engagement throughout session");
  }
  
  return `Therapeutic Session Summary: ${totalEntries} interactions with reflection depth of ${reflectionDepth}. ${insights.join('. ')}. This demonstrates meaningful therapeutic work and emotional growth.`;
}