import React from 'react';
import { UserPlus, Lock, Heart, Star, Sparkles, CheckCheck } from 'lucide-react';

interface SignupPromptProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SignupPrompt({ isVisible, onClose }: SignupPromptProps) {
  if (!isVisible) return null;

  const handleSignup = () => {
    // Dispatch event to open auth modal
    const event = new CustomEvent('navigate', { detail: { page: 'signin' } });
    window.dispatchEvent(event);
    onClose();
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-therapy-gray-700 mb-2">Continue Your Therapeutic Journey</h3>
        <p className="text-therapy-gray-600 max-w-md mx-auto">
          Sign up to continue your conversation and access all of Bloom's features
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Benefits */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 rounded-xl border border-soft-blue-200">
            <div className="w-8 h-8 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-therapy-gray-700 mb-1">Continue Your Conversation</h4>
              <p className="text-sm text-therapy-gray-600">
                Pick up right where you left off and continue exploring your feelings
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-therapy-gray-700 mb-1">Private & Secure</h4>
              <p className="text-sm text-therapy-gray-600">
                Your conversations are encrypted and stored securely in your account
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-therapy-gray-700 mb-1">Deeper Insights</h4>
              <p className="text-sm text-therapy-gray-600">
                Unlock deeper reflection levels and personalized therapeutic insights
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCheck size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-therapy-gray-700 mb-1">Track Your Progress</h4>
              <p className="text-sm text-therapy-gray-600">
                See your emotional growth and patterns over time with personalized analytics
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSignup}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm"
        >
          <UserPlus size={20} />
          Sign Up to Continue
        </button>

        {/* Reassurance */}
        <div className="text-center">
          <p className="text-sm text-therapy-gray-500">
            It's free and takes less than a minute
          </p>
        </div>

        {/* Skip option */}
        <div className="text-center pt-4 border-t border-therapy-gray-200">
          <button
            onClick={onClose}
            className="text-sm text-therapy-gray-500 hover:text-therapy-gray-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}