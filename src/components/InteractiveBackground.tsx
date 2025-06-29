import React, { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  children: React.ReactNode;
}

export default function InteractiveBackground({ children }: InteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      animationFrame = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          setMousePosition({ x, y });
        }
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const gradientStyle = {
    background: `
      linear-gradient(
        135deg,
        #F8FAFA 0%,
        #F0FDFA 30%,
        #F6F9F7 70%,
        #F8F7FF 100%
      )
    `,
    transition: 'background 0.4s ease-out'
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={gradientStyle}
    >
      {/* Therapeutic Floating Particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-20 animate-float"
          style={{
            background: `linear-gradient(45deg, 
              ${i % 4 === 0 ? '#A8DADC' : 
                i % 4 === 1 ? '#77BFA3' : 
                i % 4 === 2 ? '#FAD4C0' : '#B3CDE0'}, 
              ${i % 4 === 0 ? '#B3CDE0' : 
                i % 4 === 1 ? '#81C3B0' : 
                i % 4 === 2 ? '#FCE4D6' : '#A8DADC'})`,
            left: `${15 + (i * 12) % 70}%`,
            top: `${20 + (i * 15) % 60}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${8 + (i % 3)}s`,
            transform: `translate(${mousePosition.x * 8 - 4}px, ${mousePosition.y * 8 - 4}px)`,
            transition: 'transform 0.3s ease-out',
            filter: 'blur(0.5px)'
          }}
        />
      ))}

      {/* Therapeutic Gradient Orbs */}
      <div className="absolute top-20 left-20 w-56 h-56 rounded-full blur-3xl opacity-30" 
           style={{
             background: 'linear-gradient(135deg, #A8DADC 0%, #77BFA3 50%, #FAD4C0 100%)',
             transform: `translate(${mousePosition.x * 20 - 10}px, ${mousePosition.y * 20 - 10}px)`,
             transition: 'transform 0.5s ease-out'
           }} />
      
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-25" 
           style={{
             background: 'linear-gradient(135deg, #B3CDE0 0%, #FCE4D6 50%, #F8F7FF 100%)',
             transform: `translate(${mousePosition.x * -15 + 7.5}px, ${mousePosition.y * -15 + 7.5}px)`,
             transition: 'transform 0.5s ease-out'
           }} />

      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full blur-2xl opacity-20" 
           style={{
             background: 'linear-gradient(135deg, #F0FDFA 0%, #F6F9F7 100%)',
             transform: `translate(${mousePosition.x * 10 - 5}px, ${mousePosition.y * 10 - 5}px)`,
             transition: 'transform 0.4s ease-out'
           }} />

      {children}
    </div>
  );
}