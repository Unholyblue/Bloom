import React, { useState } from 'react';
import { Heart, Shield, Clock, Users, X } from 'lucide-react';

interface WelcomeMessageProps {
  onClose: () => void;
}

export default function WelcomeMessage({ onClose }: WelcomeMessageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      icon: Heart,
      title: "Welcome to Bloom",
      content: (
        <div className="space-y-5">
          <p className="text-slate-700 leading-relaxed text-base">
            Hi, I'm Bloom — your AI companion here to listen and support you with kindness and care.
          </p>
          <p className="text-slate-700 leading-relaxed text-base">
            I'm not a substitute for a human therapist, but I'm here whenever you want to talk or reflect — any time of day.
          </p>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Your Safety Matters",
      content: (
        <div className="space-y-5">
          <p className="text-slate-700 leading-relaxed text-base">
            If you ever feel overwhelmed or in crisis, I'll gently guide you to trusted resources that can help.
          </p>
          <p className="text-slate-700 leading-relaxed text-base">
            Remember, reaching out to people you trust is important — Bloom is here to support, not replace, that connection.
          </p>
        </div>
      )
    },
    {
      icon: Clock,
      title: "Take Your Time",
      content: (
        <div className="space-y-5">
          <p className="text-slate-700 leading-relaxed text-base">
            Together, we'll create a safe space for you to explore your feelings at your own pace.
          </p>
          <p className="text-slate-700 leading-relaxed text-base">
            You can pause, reflect, or end our conversation anytime. This is your space.
          </p>
        </div>
      )
    },
    {
      icon: Users,
      title: "Ready to Begin?",
      content: (
        <div className="space-y-5">
          <p className="text-slate-700 leading-relaxed text-base">
            Your emotional wellbeing matters. Every feeling you share is valid and important.
          </p>
          <p className="text-slate-700 leading-relaxed text-base">
            When you're ready, I'm here to listen with patience and understanding.
          </p>
        </div>
      )
    }
  ];

  const currentStepData = welcomeSteps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-3xl p-8 max-w-lg w-full shadow-calm border border-white/30 animate-fade-in">
        <div className="flex justify-between items-start mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-sage-400 rounded-2xl flex items-center justify-center">
            <IconComponent size={28} className="text-white" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-medium text-slate-800 mb-6">
          {currentStepData.title}
        </h2>

        <div className="mb-10">
          {currentStepData.content}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {welcomeSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-blue-400 w-8' 
                    : index < currentStep 
                      ? 'bg-blue-300 w-2' 
                      : 'bg-slate-200 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="btn-secondary flex-1"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            className="btn-primary flex-1"
          >
            {currentStep === welcomeSteps.length - 1 ? "Let's Begin" : "Continue"}
          </button>
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
          >
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  );
}