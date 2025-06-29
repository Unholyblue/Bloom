import React from 'react';
import { Brain, AlertCircle, HelpCircle, ArrowRight, X } from 'lucide-react';

interface CognitiveDistortionExplainerProps {
  distortionName: string;
  explanation: string;
  examples: string[];
  reframeQuestions: string[];
  onClose: () => void;
  isVisible: boolean;
}

export default function CognitiveDistortionExplainer({
  distortionName,
  explanation,
  examples,
  reframeQuestions,
  onClose,
  isVisible
}: CognitiveDistortionExplainerProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-calm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-amber-600" />
          <h3 className="font-medium text-amber-800">Understanding {distortionName}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* What is this pattern */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
            <HelpCircle size={16} />
            What is {distortionName}?
          </h4>
          <p className="text-amber-700 leading-relaxed">
            {explanation}
          </p>
        </div>
        
        {/* Examples */}
        <div>
          <h4 className="font-medium text-therapy-gray-700 mb-3">How it might sound:</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-1" />
                <p className="text-therapy-gray-600">"{example}"</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reframe Questions */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-3">Questions to expand perspective:</h4>
          <div className="space-y-3">
            {reframeQuestions.map((question, index) => (
              <div key={index} className="flex items-start gap-2">
                <ArrowRight size={16} className="text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-blue-700">{question}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Why it matters */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Why recognizing this matters:</h4>
          <p className="text-green-700 leading-relaxed">
            When we can identify {distortionName.toLowerCase()}, we gain the freedom to choose how we respond rather than being trapped in automatic thought patterns. This isn't about "positive thinking"—it's about seeing reality more clearly.
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
        <p className="text-xs text-amber-700 text-center">
          Remember: These patterns are part of being human. Noticing them is a sign of growing self-awareness.
        </p>
      </div>
    </div>
  );
}