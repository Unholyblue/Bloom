import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Info, X, ChevronDown, ChevronUp } from 'lucide-react';
import { detectDistortions, getDistortionByName } from '../utils/distortionDetector';
import CognitiveDistortionExplainer from './CognitiveDistortionExplainer';

interface DistortionDetectorWidgetProps {
  userInput: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function DistortionDetectorWidget({ 
  userInput, 
  isVisible, 
  onClose 
}: DistortionDetectorWidgetProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showExplainer, setShowExplainer] = useState(false);
  const [selectedDistortion, setSelectedDistortion] = useState<any>(null);

  useEffect(() => {
    if (isVisible && userInput) {
      analyzeInput();
    }
  }, [isVisible, userInput]);

  const analyzeInput = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate a brief delay for analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Perform distortion detection
      const detectionResult = detectDistortions(userInput);
      setResult(detectionResult);
    } catch (error) {
      console.error('Error analyzing input:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLearnMore = (distortion: any) => {
    setSelectedDistortion(distortion);
    setShowExplainer(true);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-gentle overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-amber-600" />
          <h3 className="font-medium text-amber-800">Thinking Pattern Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin mr-3"></div>
              <span className="text-amber-700">Analyzing thinking patterns...</span>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {result.detected ? (
                <>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <p className="text-amber-700 leading-relaxed">
                      I noticed some thinking patterns that might be influencing your perspective. 
                      Recognizing these patterns can help you respond with more clarity and flexibility.
                    </p>
                  </div>
                  
                  {result.distortions.map((distortion: any, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-therapy-gray-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-therapy-gray-800 mb-1">{distortion.name}</h4>
                          <p className="text-sm text-therapy-gray-600 mb-3">{distortion.explanation}</p>
                          <button
                            onClick={() => handleLearnMore(distortion)}
                            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-lg transition-colors"
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {result.suggestions.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <Info size={16} />
                        Questions to consider:
                      </h4>
                      <ul className="space-y-2">
                        {result.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle size={20} className="text-green-500" />
                  <div>
                    <h4 className="font-medium text-green-700">No cognitive distortions detected</h4>
                    <p className="text-sm text-green-600">
                      Your thinking appears balanced and flexible in this message.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-therapy-gray-50 rounded-xl border border-therapy-gray-200">
              <Info size={20} className="text-therapy-gray-500" />
              <p className="text-therapy-gray-600">
                No analysis available. Try sharing more of your thoughts.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
        <p className="text-xs text-amber-700 text-center">
          This analysis is meant to promote self-awareness, not to diagnose or label.
        </p>
      </div>
      
      {/* Explainer Modal */}
      {showExplainer && selectedDistortion && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <CognitiveDistortionExplainer
              distortionName={selectedDistortion.name}
              explanation={selectedDistortion.description}
              examples={selectedDistortion.examples}
              reframeQuestions={selectedDistortion.reframeQuestions}
              onClose={() => setShowExplainer(false)}
              isVisible={showExplainer}
            />
          </div>
        </div>
      )}
    </div>
  );
}