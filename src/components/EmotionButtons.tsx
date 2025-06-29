import React from 'react';

interface EmotionButtonsProps {
  onEmotionSelect: (emotion: string) => void;
  disabled?: boolean;
}

const emotions = [
  { emoji: '😭', label: 'Overwhelmed', gradient: 'from-soft-blue-100 to-soft-blue-200 hover:from-soft-blue-200 hover:to-soft-blue-300', border: 'border-soft-blue-200 hover:border-soft-blue-300' },
  { emoji: '😰', label: 'Anxious', gradient: 'from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300', border: 'border-purple-200 hover:border-purple-300' },
  { emoji: '😢', label: 'Sad', gradient: 'from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300', border: 'border-indigo-200 hover:border-indigo-300' },
  { emoji: '😤', label: 'Frustrated', gradient: 'from-red-100 to-red-200 hover:from-red-200 hover:to-red-300', border: 'border-red-200 hover:border-red-300' },
  { emoji: '😴', label: 'Tired', gradient: 'from-therapy-gray-100 to-therapy-gray-200 hover:from-therapy-gray-200 hover:to-therapy-gray-300', border: 'border-therapy-gray-200 hover:border-therapy-gray-300' },
  { emoji: '🤔', label: 'Confused', gradient: 'from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300', border: 'border-yellow-200 hover:border-yellow-300' },
  { emoji: '😌', label: 'Peaceful', gradient: 'from-muted-teal-100 to-muted-teal-200 hover:from-muted-teal-200 hover:to-muted-teal-300', border: 'border-muted-teal-200 hover:border-muted-teal-300' },
  { emoji: '😊', label: 'Content', gradient: 'from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300', border: 'border-emerald-200 hover:border-emerald-300' },
];

export default function EmotionButtons({ onEmotionSelect, disabled }: EmotionButtonsProps) {
  // Convert emoji to text description
  const handleEmotionClick = (emotion: string) => {
    if (disabled) return;
    onEmotionSelect(`I'm feeling ${emotion.toLowerCase()}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {emotions.map((emotion, index) => (
        <button
          key={emotion.label}
          onClick={() => handleEmotionClick(emotion.label)}
          disabled={disabled}
          className={`
            relative p-6 rounded-2xl bg-gradient-to-br ${emotion.gradient}
            border ${emotion.border} backdrop-blur-sm
            transform transition-all duration-300 ease-out
            hover:scale-105 hover:shadow-gentle
            focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            group animate-fade-in min-h-[120px] 
            flex items-center justify-center
          `}
          style={{ animationDelay: `${index * 100}ms` }}
          aria-label={`I'm feeling ${emotion.label.toLowerCase()}`}
        >
          <div className="text-center flex flex-col items-center justify-center w-full h-full">
            <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-110">
              {emotion.emoji}
            </div>
            <div className="text-sm font-medium text-therapy-gray-700 leading-tight text-center">
              {emotion.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}