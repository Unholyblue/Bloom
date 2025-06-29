import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface ReflectionInputProps {
  onSubmit: (reflection: string) => void;
  disabled?: boolean;
  reflectionDepth: number;
}

export default function ReflectionInput({ onSubmit, disabled, reflectionDepth }: ReflectionInputProps) {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent empty submissions or submissions while disabled
    if (!reflection.trim() || disabled || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      onSubmit(reflection.trim());
      setReflection('');
    } finally {
      // Reset submitting state after a short delay to prevent rapid submissions
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const placeholderTexts = {
    2: "What would you like to share more about this feeling?",
    3: "What else comes up for you when you think about this?",
    4: "As we go deeper, what feels most important to explore?"
  };

  const placeholder = placeholderTexts[reflectionDepth as keyof typeof placeholderTexts] || 
                    "What would you like to explore further?";

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
          <MessageCircle size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Let's explore this deeper
          </h3>
          <p className="text-sm text-gray-600">
            Take your time and share whatever feels right
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            rows={4}
            className="
              w-full px-4 py-3 pr-12 
              bg-white/70 backdrop-blur-sm
              border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50
              focus:border-transparent
              placeholder-gray-500
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              resize-none
              text-black
            "
            aria-label="Your deeper reflection"
          />
          <button
            type="submit"
            disabled={disabled || isSubmitting || !reflection.trim()}
            className="
              absolute right-2 bottom-2
              p-2 rounded-lg
              bg-purple-500 text-white
              hover:bg-purple-600
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
            aria-label="Send reflection"
          >
            <Send size={16} />
          </button>
        </div>
        
        {/* Character counter - only show when approaching limit */}
        {reflection.length > 200 && (
          <div className={`text-xs mt-1 text-right ${reflection.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
            {reflection.length}/1000 characters
          </div>
        )}
      </form>

      <div className="mt-3 text-xs text-gray-500">
        💡 This is a safe space to explore your thoughts and feelings without judgment
      </div>
    </div>
  );
}