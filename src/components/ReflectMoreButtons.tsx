import React from 'react';
import { Brain, BookOpen, RotateCcw } from 'lucide-react';

interface ReflectMoreButtonsProps {
  onReflectMore: () => void;
  onEndSession: () => void;
  onStartNew: () => void;
  disabled?: boolean;
  reflectionDepth: number;
}

export default function ReflectMoreButtons({ 
  onReflectMore, 
  onEndSession, 
  onStartNew, 
  disabled, 
  reflectionDepth 
}: ReflectMoreButtonsProps) {
  const maxReflections = 4;
  const canReflectMore = reflectionDepth < maxReflections;

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          What would you like to do next?
        </h3>
        <p className="text-sm text-gray-600">
          {canReflectMore 
            ? "You can explore this feeling deeper, or we can wrap up this session."
            : "You've done some beautiful deep reflection today. How would you like to continue?"
          }
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {canReflectMore && (
          <button
            onClick={onReflectMore}
            disabled={disabled}
            className="
              flex-1 flex items-center justify-center gap-3 px-6 py-4
              bg-gradient-to-r from-blue-500 to-indigo-600
              hover:from-blue-600 hover:to-indigo-700
              text-white font-medium rounded-xl
              transform transition-all duration-200 ease-out
              hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            "
            aria-label="Reflect more deeply"
          >
            <Brain size={20} />
            <div className="text-left">
              <div>Reflect More</div>
              <div className="text-xs opacity-90">Explore deeper</div>
            </div>
          </button>
        )}

        <button
          onClick={onEndSession}
          disabled={disabled}
          className="
            flex-1 flex items-center justify-center gap-3 px-6 py-4
            bg-gradient-to-r from-green-500 to-emerald-600
            hover:from-green-600 hover:to-emerald-700
            text-white font-medium rounded-xl
            transform transition-all duration-200 ease-out
            hover:scale-105 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          "
          aria-label="End this session"
        >
          <BookOpen size={20} />
          <div className="text-left">
            <div>End Session</div>
            <div className="text-xs opacity-90">Wrap up gently</div>
          </div>
        </button>

        <button
          onClick={onStartNew}
          disabled={disabled}
          className="
            flex items-center justify-center gap-2 px-4 py-4
            bg-white/70 hover:bg-white/90
            border border-gray-200 hover:border-gray-300
            text-gray-600 hover:text-gray-700
            font-medium rounded-xl
            transform transition-all duration-200 ease-out
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          "
          title="Start a completely new conversation"
          aria-label="Start a new conversation"
        >
          <RotateCcw size={18} />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>

      {reflectionDepth > 1 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
            <div className="flex gap-1">
              {Array.from({ length: Math.min(reflectionDepth, 4) }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < reflectionDepth ? 'bg-blue-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-blue-600 font-medium">
              Reflection depth: {reflectionDepth}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}