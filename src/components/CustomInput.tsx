import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface CustomInputProps {
  onSubmit: (feeling: string) => void;
  disabled?: boolean;
}

export default function CustomInput({ onSubmit, disabled }: CustomInputProps) {
  const [feeling, setFeeling] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent empty submissions or submissions while disabled
    if (!feeling.trim() || disabled || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      onSubmit(feeling.trim());
      setFeeling('');
    } finally {
      // Reset submitting state after a short delay to prevent rapid submissions
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="Describe how you're feeling in your own words..."
          disabled={disabled || isSubmitting}
          className="input-gentle pr-16 text-base py-4 text-black w-full rounded-xl border border-soft-blue-300 focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:border-transparent"
          aria-label="Describe your feelings"
        />
        <button
          type="submit"
          disabled={disabled || isSubmitting || !feeling.trim()}
          className="
            absolute right-3 top-1/2 transform -translate-y-1/2
            p-3 rounded-xl
            bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 text-white
            hover:from-soft-blue-500 hover:to-muted-teal-500
            focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300 ease-out
            hover:scale-105
          "
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
      
      {/* Character counter - only show when approaching limit */}
      {feeling.length > 200 && (
        <div className={`text-xs mt-1 text-right ${feeling.length > 500 ? 'text-red-500' : 'text-therapy-gray-500'}`}>
          {feeling.length}/500 characters
        </div>
      )}
    </form>
  );
}