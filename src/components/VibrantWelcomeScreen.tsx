import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Bot, 
  Shield, 
  Globe, 
  Heart, 
  Sparkles, 
  MessageCircle,
  Star,
  Lock,
  ArrowRight,
  Zap,
  Lightbulb,
  BookOpen,
  Target
} from 'lucide-react';
import BloomingFlowerLogo from './BloomingFlowerLogo';

interface VibrantWelcomeScreenProps {
  onStartConversation: () => void;
}

export default function VibrantWelcomeScreen({ onStartConversation }: VibrantWelcomeScreenProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Cognitive Lens Detection",
      description: "Identifies thinking patterns that may be affecting your perspective",
      gradient: "from-soft-blue-400 to-soft-blue-600",
      bgGradient: "from-therapeutic-mint to-soft-blue-50",
      emoji: "🧠"
    },
    {
      icon: Bot,
      title: "Reflection Depth Tracking",
      description: "Guides you to deeper levels of self-understanding and awareness",
      gradient: "from-primary-cta to-muted-teal-500",
      bgGradient: "from-therapeutic-pearl to-muted-teal-50",
      emoji: "🤖"
    },
    {
      icon: Lock,
      title: "Secure & Confidential",
      description: "End-to-end encryption ensures your emotional journey stays yours",
      gradient: "from-muted-teal-400 to-muted-teal-600",
      bgGradient: "from-therapeutic-sage to-muted-teal-100",
      emoji: "🔒"
    },
    {
      icon: Globe,
      title: "Community Wisdom",
      description: "Learn from shared insights and contribute your own discoveries",
      gradient: "from-accent-primary to-accent-dark",
      bgGradient: "from-therapeutic-cloud to-accent-light",
      emoji: "🌍"
    }
  ];

  // Reduced floating elements for better performance
  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 6,
    color: ['#A8DADC', '#77BFA3', '#FAD4C0', '#B3CDE0'][Math.floor(Math.random() * 4)]
  }));

  const handleNavigate = (page: string) => {
    const event = new CustomEvent('navigate', { detail: { page } });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-therapeutic-gradient">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full opacity-15 animate-float"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.x}%`,
              top: `${element.y}%`,
              backgroundColor: element.color,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Therapeutic Gradient Orbs - Updated colors */}
      <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-br from-primary-cta/20 to-muted-teal-200/20 rounded-full blur-2xl opacity-60" />
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-accent-primary/15 to-accent-light/15 rounded-full blur-2xl opacity-60" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo and Title Section */}
          <div className="mb-12">
            <div className="mb-8 flex justify-center">
              <BloomingFlowerLogo size={100} />
            </div>
            
            <h1 className="text-headline text-6xl lg:text-7xl font-semibold mb-6 bg-gradient-to-r from-primary-cta via-muted-teal-500 to-accent-primary bg-clip-text text-transparent">
              Welcome to Bloom
            </h1>
            
            <p className="text-body text-responsive-xl text-text-secondary mb-4 leading-relaxed max-w-3xl mx-auto">
              Your AI companion for deeper self-understanding and emotional growth
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Heart className="text-accent-primary" size={20} />
              <span className="text-body text-text-secondary">
                Discover patterns, gain insights, and grow through guided reflection
              </span>
              <Heart className="text-accent-primary" size={20} />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isHovered = hoveredFeature === index;
              
              return (
                <div
                  key={index}
                  className={`
                    card-modern relative cursor-pointer
                    ${isHovered ? 'scale-105 shadow-calm' : 'scale-100 shadow-gentle'}
                    bg-gradient-to-br ${feature.bgGradient} border border-primary-cta/20
                    hover:border-primary-cta/40 backdrop-blur-sm
                  `}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with emoji */}
                    <div className="flex items-center justify-center mb-4 lg:mb-6">
                      <div className={`
                        relative w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center
                        bg-gradient-to-br ${feature.gradient} shadow-gentle
                        ${isHovered ? 'scale-110' : 'scale-100'}
                        transition-all duration-300
                      `}>
                        <IconComponent size={24} className="text-white lg:w-7 lg:h-7" />
                        
                        {/* Floating emoji */}
                        <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 text-lg lg:text-2xl">
                          {feature.emoji}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-headline text-lg lg:text-xl font-semibold text-text-primary mb-3 lg:mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-body text-text-secondary leading-relaxed text-sm">
                      {feature.description}
                    </p>
                    
                    {/* Sparkle indicator */}
                    {isHovered && (
                      <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
                        <Sparkles size={14} className="text-accent-primary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Call to Action */}
          <div className="space-y-8">
            {/* Main CTA Button - Super Highlighted */}
            <div className="relative">
              {/* Glowing background effect */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-primary-cta via-muted-teal-400 to-accent-primary 
                rounded-3xl blur-xl opacity-30 scale-110
                ${buttonHovered ? 'opacity-50 scale-125' : 'opacity-30 scale-110'}
                transition-all duration-500 ease-out
              `} />
              
              {/* Animated ring */}
              <div className={`
                absolute inset-0 rounded-3xl border-2 border-primary-cta/40
                ${buttonHovered ? 'scale-110 opacity-60' : 'scale-105 opacity-40'}
                transition-all duration-300 ease-out animate-pulse
              `} />
              
              <button
                onClick={onStartConversation}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                className={`
                  relative px-12 py-6 text-xl lg:text-2xl font-bold
                  bg-gradient-to-r from-primary-cta via-muted-teal-400 to-accent-primary
                  hover:from-primary-cta-hover hover:via-muted-teal-500 hover:to-accent-dark
                  text-white rounded-3xl
                  shadow-peaceful hover:shadow-serene
                  transform transition-all duration-300 ease-out
                  ${buttonHovered ? 'scale-110 -translate-y-2' : 'scale-100'}
                  group overflow-hidden
                  border-2 border-white/20 hover:border-white/40
                `}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-4">
                  <MessageCircle size={28} className="lg:w-8 lg:h-8" />
                  <span className="font-headline">Start Your Journey</span>
                  <ArrowRight size={28} className={`lg:w-8 lg:h-8 transition-transform duration-300 ${buttonHovered ? 'translate-x-2' : ''}`} />
                </div>
                
                {/* Sparkle effects */}
                <div className="absolute top-2 right-4">
                  <Sparkles size={16} className="text-accent-light animate-pulse" />
                </div>
                <div className="absolute bottom-2 left-4">
                  <Star size={14} className="text-accent-light animate-bounce" />
                </div>
              </button>
            </div>
            
            {/* Additional Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleNavigate('insights')}
                className="p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-gentle hover:shadow-calm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Lightbulb size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Community Insights</div>
                    <div className="text-sm text-white/80">Shared wisdom</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigate('sources')}
                className="p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-gentle hover:shadow-calm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Resource Library</div>
                    <div className="text-sm text-white/80">Curated content</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigate('challenges')}
                className="p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-gentle hover:shadow-calm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Growth Challenges</div>
                    <div className="text-sm text-white/80">Guided exercises</div>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Supporting text with emphasis */}
            <div className="space-y-4">
              <p className="text-body text-text-secondary text-lg lg:text-xl font-medium">
                ✨ Begin exploring your mind with evidence-based therapeutic approaches ✨
              </p>
              
              {/* Encouraging subtext */}
              <div className="flex items-center justify-center gap-3 text-text-secondary">
                <Zap size={18} className="text-primary-cta" />
                <span className="text-base font-medium">
                  Understand your thinking patterns and grow through reflection
                </span>
                <Zap size={18} className="text-primary-cta" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}