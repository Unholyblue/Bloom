import { CognitiveDistortion } from './distortionDetector';

interface DistortionReframeRequest {
  userInput: string;
  distortionName: string;
  distortionExplanation?: string;
}

interface DistortionReframeResponse {
  message: string;
  followUpQuestion: string;
}

/**
 * Generates a therapeutic response that gently explains a cognitive distortion
 * and invites the user to reflect on it without judgment.
 */
export async function generateDistortionReframe(
  request: DistortionReframeRequest
): Promise<DistortionReframeResponse> {
  const { userInput, distortionName, distortionExplanation } = request;
  
  // In a real implementation, this would call the GPT API
  // For now, we'll use pre-defined responses based on distortion type
  
  // Get a simulated response based on the distortion type
  const reframeResponse = getDistortionReframeResponse(distortionName, userInput);
  
  return reframeResponse;
}

/**
 * Provides pre-defined therapeutic responses for different cognitive distortions
 */
function getDistortionReframeResponse(
  distortionName: string, 
  userInput: string
): DistortionReframeResponse {
  // Normalize distortion name for matching
  const normalizedName = distortionName.toLowerCase().replace(/[-\s]/g, '_');
  
  // Extract a short snippet from user input for personalization
  const userSnippet = userInput.length > 50 
    ? userInput.substring(0, 50) + '...' 
    : userInput;
  
  // Map of distortion types to therapeutic responses
  const responses: Record<string, DistortionReframeResponse> = {
    'catastrophizing': {
      message: `I notice your mind may be predicting the worst possible outcomes. When you shared "${userSnippet}", you're focusing on extreme negative possibilities. This pattern is called catastrophizing.`,
      followUpQuestion: "Would you like to explore what feels most likely to happen rather than the worst case scenario?"
    },
    
    'black_and_white_thinking': {
      message: `I notice you may be seeing this situation in all-or-nothing terms. When you said "${userSnippet}", you're using absolute language that doesn't leave room for middle ground. This is called black-and-white thinking.`,
      followUpQuestion: "What might a more nuanced perspective look like here?"
    },
    
    'mind_reading': {
      message: `I notice you're making assumptions about what others are thinking. When you shared "${userSnippet}", you're drawing conclusions about others' thoughts without direct evidence. This pattern is called mind reading.`,
      followUpQuestion: "What evidence do you actually have about what they're thinking?"
    },
    
    'overgeneralization': {
      message: `I notice you may be taking a single negative event and applying it broadly. When you said "${userSnippet}", you're extending one experience to many situations. This pattern is called overgeneralization.`,
      followUpQuestion: "Are there any exceptions to this pattern you're describing?"
    },
    
    'personalization': {
      message: `I notice you may be taking excessive responsibility for something not entirely in your control. When you shared "${userSnippet}", you're attributing external events to yourself. This pattern is called personalization.`,
      followUpQuestion: "What factors beyond your control might have contributed to this situation?"
    },
    
    'emotional_reasoning': {
      message: `I notice you may be treating your feelings as evidence for what's true. When you said "${userSnippet}", you're using emotions to determine reality. This pattern is called emotional reasoning.`,
      followUpQuestion: "What factual evidence exists beyond how you feel about this situation?"
    },
    
    'fortune_telling': {
      message: `I notice your mind may be predicting negative outcomes with certainty. When you shared "${userSnippet}", you're speaking of future events as if they're already determined. This pattern is called fortune-telling.`,
      followUpQuestion: "What other outcomes might be possible that your mind hasn't considered?"
    },
    
    'filtering': {
      message: `I notice you may be focusing exclusively on negative aspects while filtering out positives. When you said "${userSnippet}", you're seeing only the disappointing elements. This pattern is called mental filtering.`,
      followUpQuestion: "What positive or neutral aspects of this situation might you be overlooking?"
    }
  };
  
  // Return the matching response or a default if not found
  return responses[normalizedName] || {
    message: `I notice a thinking pattern that might be influencing your perspective. When you shared "${userSnippet}", your mind seems to be focusing in a way that might make this situation feel more overwhelming than it needs to be.`,
    followUpQuestion: "Would you like to explore different ways of looking at this situation?"
  };
}

/**
 * Formats the distortion reframe response for display
 */
export function formatDistortionReframe(
  response: DistortionReframeResponse
): string {
  return `${response.message}\n\n${response.followUpQuestion}`;
}