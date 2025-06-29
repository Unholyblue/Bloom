import React, { useState, useEffect } from 'react';

interface BloomingFlowerLogoProps {
  size?: number;
  className?: string;
  autoStart?: boolean;
}

export default function BloomingFlowerLogo({ size = 40, className = "", autoStart = true }: BloomingFlowerLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoStart) {
      // Start animation in just 1 second
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000); // Animation duration
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  // Scale up the entire flower based on size prop
  const scale = size / 40; // Base size is 40

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      {/* Enhanced glow effect */}
      <div 
        className={`
          absolute inset-0 rounded-full
          transition-all duration-800 ease-out
          ${isAnimating ? 'scale-150 opacity-0' : 'scale-100 opacity-30'}
          bg-gradient-to-r from-soft-blue-300 to-muted-teal-300 blur-xl
        `}
      />

      {/* Outer glow ring */}
      <div 
        className={`
          absolute inset-0 rounded-full
          transition-all duration-1000 ease-out
          ${isAnimating ? 'scale-200 opacity-0' : 'scale-110 opacity-20'}
          bg-gradient-to-r from-purple-300 to-pink-300 blur-2xl
        `}
        style={{ transitionDelay: isAnimating ? '0ms' : '100ms' }}
      />

      {/* Stem - Enhanced */}
      <div 
        className={`
          absolute bottom-0 left-1/2 transform -translate-x-1/2
          bg-gradient-to-t from-green-700 via-green-600 to-green-500 rounded-full
          transition-all duration-600 ease-out shadow-sm
          ${isAnimating ? 'h-0 scale-y-0' : `scale-y-100`}
        `}
        style={{ 
          width: `${3 * scale}px`,
          height: `${12 * scale}px`,
          transformOrigin: 'bottom',
          transitionDelay: isAnimating ? '0ms' : '150ms'
        }}
      />

      {/* Enhanced Leaves */}
      <div 
        className={`
          absolute left-1/2 transform -translate-x-1/2
          transition-all duration-500 ease-out
          ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        style={{ 
          bottom: `${3 * scale}px`,
          transitionDelay: isAnimating ? '0ms' : '200ms' 
        }}
      >
        <div 
          className="absolute bg-gradient-to-br from-green-400 to-green-600 rounded-full transform -rotate-45 opacity-90 shadow-sm" 
          style={{
            left: `${-4 * scale}px`,
            width: `${6 * scale}px`,
            height: `${4 * scale}px`
          }}
        />
        <div 
          className="absolute bg-gradient-to-br from-green-400 to-green-600 rounded-full transform rotate-45 opacity-90 shadow-sm" 
          style={{
            right: `${-4 * scale}px`,
            width: `${6 * scale}px`,
            height: `${4 * scale}px`
          }}
        />
      </div>

      {/* Flower Center - Enhanced */}
      <div 
        className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-full shadow-sm
          transition-all duration-400 ease-out
          ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        style={{ 
          width: `${6 * scale}px`,
          height: `${6 * scale}px`,
          transitionDelay: isAnimating ? '0ms' : '300ms' 
        }}
      />

      {/* Inner center highlight */}
      <div 
        className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full
          transition-all duration-400 ease-out
          ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-80'}
        `}
        style={{ 
          width: `${3 * scale}px`,
          height: `${3 * scale}px`,
          transitionDelay: isAnimating ? '0ms' : '350ms' 
        }}
      />

      {/* Enhanced Petals - More and bigger */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <div
          key={`petal-${index}`}
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            bg-gradient-to-t from-soft-blue-500 via-soft-blue-300 to-soft-blue-100
            rounded-full transition-all duration-600 ease-out shadow-sm
            ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-95'}
          `}
          style={{
            width: `${8 * scale}px`,
            height: `${12 * scale}px`,
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -50%) rotate(${index * 45}deg) ${isAnimating ? 'scale(0)' : 'scale(1)'}`,
            transitionDelay: isAnimating ? '0ms' : `${400 + index * 40}ms`
          }}
        />
      ))}

      {/* Outer petals for fuller look */}
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={`outer-petal-${index}`}
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            bg-gradient-to-t from-muted-teal-400 via-muted-teal-200 to-white
            rounded-full transition-all duration-700 ease-out shadow-sm
            ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-80'}
          `}
          style={{
            width: `${6 * scale}px`,
            height: `${10 * scale}px`,
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -50%) rotate(${index * 72 + 36}deg) ${isAnimating ? 'scale(0)' : 'scale(1)'}`,
            transitionDelay: isAnimating ? '0ms' : `${700 + index * 50}ms`
          }}
        />
      ))}

      {/* Enhanced sparkles */}
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div
          key={`sparkle-${index}`}
          className={`
            absolute bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-sm
            transition-all duration-500 ease-out
            ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-90'}
          `}
          style={{
            width: `${2 * scale}px`,
            height: `${2 * scale}px`,
            top: `${35 + Math.sin(index * 60 * Math.PI / 180) * 25}%`,
            left: `${50 + Math.cos(index * 60 * Math.PI / 180) * 25}%`,
            transitionDelay: isAnimating ? '0ms' : `${900 + index * 60}ms`
          }}
        />
      ))}

      {/* Magical dust particles */}
      {[0, 1, 2, 3].map((index) => (
        <div
          key={`dust-${index}`}
          className={`
            absolute bg-gradient-to-br from-purple-300 to-pink-300 rounded-full
            transition-all duration-600 ease-out
            ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-60'}
          `}
          style={{
            width: `${1 * scale}px`,
            height: `${1 * scale}px`,
            top: `${25 + Math.sin(index * 90 * Math.PI / 180) * 35}%`,
            left: `${50 + Math.cos(index * 90 * Math.PI / 180) * 35}%`,
            transitionDelay: isAnimating ? '0ms' : `${1000 + index * 75}ms`
          }}
        />
      ))}
    </div>
  );
}