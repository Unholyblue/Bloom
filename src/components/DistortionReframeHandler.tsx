import React, { useState, useEffect } from 'react';
import { detectDistortions } from '../utils/distortionDetector';
import { routeDistortionResult, prepareReframePrompt, shouldRouteToReframe } from '../utils/distortionRouter';
import { generateDistortionReframe, formatDistortionReframe } from '../utils/distortionReframe';

interface DistortionReframeHandlerProps {
  userInput: string;
  onReframeGenerated: (reframe: string) => void;
  onNormalResponse: () => void;
}

export default function DistortionReframeHandler({
  userInput,
  onReframeGenerated,
  onNormalResponse
}: DistortionReframeHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    processUserInput();
  }, [userInput]);

  const processUserInput = async () => {
    setIsProcessing(true);
    
    try {
      // Step 1: Detect cognitive distortions
      const detectionResult = detectDistortions(userInput);
      
      // Step 2: Determine if we should route to reframe
      if (shouldRouteToReframe(detectionResult)) {
        // Step 3: Get routing information
        const routerResult = routeDistortionResult(detectionResult);
        
        // Step 4: Generate the reframe response
        if (detectionResult.distortions.length > 0) {
          const primaryDistortion = detectionResult.distortions[0];
          
          const reframeResponse = await generateDistortionReframe({
            userInput,
            distortionName: primaryDistortion.name,
            distortionExplanation: primaryDistortion.explanation
          });
          
          // Format the response
          const formattedResponse = formatDistortionReframe(reframeResponse);
          
          // Step 5: Return the reframe to the parent component
          onReframeGenerated(formattedResponse);
        } else {
          // No specific distortion to reframe, continue with normal flow
          onNormalResponse();
        }
      } else {
        // No distortions detected or confidence too low, continue with normal flow
        onNormalResponse();
      }
    } catch (error) {
      console.error('Error in distortion reframe handler:', error);
      // Fall back to normal response on error
      onNormalResponse();
    } finally {
      setIsProcessing(false);
    }
  };

  // This component doesn't render anything visible
  // It just processes the input and calls the appropriate callback
  return null;
}