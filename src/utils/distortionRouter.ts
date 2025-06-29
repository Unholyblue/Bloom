// Distortion Router - Logic to handle cognitive distortion detection results

interface DistortionDetectionResult {
  detected: boolean;
  distortions: {
    type: string;
    name: string;
    description: string;
    explanation: string;
    reframeQuestions: string[];
  }[];
  confidence: number;
  suggestions: string[];
}

interface RouterResult {
  shouldReframe: boolean;
  distortionNames: string[];
  distortionTypes: string[];
  confidence: number;
  explanation: string;
}

/**
 * Analyzes the output from the Distortion Detector and determines if it should
 * be routed to the Distortion Reframe GPT block
 */
export function routeDistortionResult(result: DistortionDetectionResult): RouterResult {
  // Default response
  const defaultResult: RouterResult = {
    shouldReframe: false,
    distortionNames: [],
    distortionTypes: [],
    confidence: 0,
    explanation: ""
  };
  
  // If no distortions detected, continue with normal flow
  if (!result.detected || result.distortions.length === 0) {
    return defaultResult;
  }
  
  // Extract distortion names and types
  const distortionNames = result.distortions.map(d => d.name);
  const distortionTypes = result.distortions.map(d => d.type);
  
  // Generate explanation for reframing
  let explanation = "";
  if (result.distortions.length === 1) {
    explanation = result.distortions[0].explanation;
  } else {
    explanation = `I noticed some patterns in your thinking that might be ${distortionNames.join(' and ')}. These thinking patterns can sometimes make situations feel more overwhelming than they need to be.`;
  }
  
  // Only route to reframe if confidence is high enough
  const shouldReframe = result.confidence >= 0.5;
  
  return {
    shouldReframe,
    distortionNames,
    distortionTypes,
    confidence: result.confidence,
    explanation
  };
}

/**
 * Prepares the prompt for the Distortion Reframe GPT block
 */
export function prepareReframePrompt(
  userInput: string, 
  routerResult: RouterResult
): string {
  const distortionsList = routerResult.distortionNames.join(', ');
  
  return `
The user's message contains cognitive distortion patterns identified as: ${distortionsList}.
Confidence level: ${routerResult.confidence * 10}/10

Original user message: "${userInput}"

Please provide a gentle, therapeutic response that:
1. Acknowledges their feelings with empathy
2. Gently points out the potential thinking pattern(s) without judgment
3. Offers 1-2 alternative perspectives or reframing questions
4. Validates that these patterns are normal and human
5. Ends with an open-ended question that encourages reflection

Important: Be warm and conversational, not clinical or educational. Focus on helping them see alternative perspectives rather than "fixing" their thinking.
`;
}

/**
 * Determines if the distortion detection result contains a distortion
 * and should be routed to the Distortion Reframe GPT block
 */
export function shouldRouteToReframe(result: DistortionDetectionResult): boolean {
  return routeDistortionResult(result).shouldReframe;
}

/**
 * Checks the output from the Distortion Detector GPT block
 * and determines if it should be routed to the Distortion Reframe GPT block
 */
export function checkDistortionDetectorOutput(output: string): boolean {
  // If output contains "None detected", route to normal response
  if (output.includes("None detected")) {
    return false;
  }
  
  // Check for distortion names
  const distortionNames = [
    "Catastrophizing",
    "Black-and-white thinking",
    "Mind reading",
    "Overgeneralization",
    "Personalization",
    "Emotional reasoning",
    "Fortune-telling",
    "Filtering"
  ];
  
  // If any distortion name is found, route to Distortion Reframe
  for (const name of distortionNames) {
    if (output.includes(name)) {
      return true;
    }
  }
  
  // Default to normal response if no distortions found
  return false;
}