import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BreathingExercise({ isVisible, onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  const phases = {
    inhale: { duration: 4000, text: 'Breathe in slowly...', color: 'from-soft-blue-400 to-soft-blue-600' },
    hold: { duration: 2000, text: 'Hold gently...', color: 'from-purple-400 to-purple-600' },
    exhale: { duration: 6000, text: 'Breathe out slowly...', color: 'from-muted-teal-400 to-muted-teal-600' },
    pause: { duration: 1000, text: 'Rest...', color: 'from-therapy-gray-400 to-therapy-gray-600' }
  };

  useEffect(() => {
    if (!isActive) return;

    const currentPhase = phases[phase];
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          // Move to next phase
          const phaseOrder: Array<keyof typeof phases> = ['inhale', 'hold', 'exhale', 'pause'];
          const currentIndex = phaseOrder.indexOf(phase);
          const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
          
          setPhase(nextPhase);
          
          if (nextPhase === 'inhale') {
            setCycle(prev => prev + 1);
          }
          
          return Math.ceil(phases[nextPhase].duration / 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  if (!isVisible) return null;

  const currentPhaseData = phases[phase];

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-soft-blue-400 to-muted-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wind size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-light text-therapy-gray-700 mb-2">Breathing Exercise</h3>
        <p className="text-therapy-gray-600">4-2-6-1 breathing pattern for relaxation</p>
      </div>

      {/* Breathing Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-48 h-48 mb-6">
          <div 
            className={`
              w-full h-full rounded-full bg-gradient-to-br ${currentPhaseData.color}
              transition-all duration-1000 ease-in-out shadow-gentle
              ${isActive ? 'scale-110 opacity-90' : 'scale-100 opacity-70'}
            `}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white font-light text-4xl">
              {count}
            </div>
          </div>
          
          {/* Pulse rings */}
          <div className={`
            absolute inset-0 rounded-full border-2 border-white/30
            transition-all duration-1000 ease-in-out
            ${isActive ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}
          `} />
          <div className={`
            absolute inset-0 rounded-full border border-white/20
            transition-all duration-1000 ease-in-out delay-200
            ${isActive ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
          `} />
        </div>

        <div className="text-center mb-6">
          <p className="text-xl font-medium text-therapy-gray-700 mb-2">
            {currentPhaseData.text}
          </p>
          <p className="text-therapy-gray-500">
            Cycle {cycle + 1}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="
              flex items-center gap-3 px-6 py-3
              bg-gradient-to-r from-soft-blue-400 to-soft-blue-500 hover:from-soft-blue-500 hover:to-soft-blue-600
              text-white font-medium rounded-xl
              transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm
            "
          >
            <Play size={20} />
            Start Breathing
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="
              flex items-center gap-3 px-6 py-3
              bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
              text-white font-medium rounded-xl
              transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm
            "
          >
            <Pause size={20} />
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="
            flex items-center gap-3 px-6 py-3
            bg-gradient-to-r from-therapy-gray-400 to-therapy-gray-500 hover:from-therapy-gray-500 hover:to-therapy-gray-600
            text-white font-medium rounded-xl
            transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm
          "
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 rounded-xl border border-soft-blue-200">
          <span className="text-2xl">💡</span>
          <span className="text-sm text-therapy-gray-600">
            Focus on the rhythm and let your body relax with each breath
          </span>
        </div>
      </div>
    </div>
  );
}