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
  Settings,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Calendar,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import BloomingFlowerLogo from './BloomingFlowerLogo';
import { UserProfile } from '../utils/authService';

interface AuthenticatedWelcomeScreenProps {
  onStartConversation: () => void;
  profile: UserProfile;
}

export default function AuthenticatedWelcomeScreen({ onStartConversation, profile }: AuthenticatedWelcomeScreenProps) {
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
      icon: TrendingUp,
      title: "Track Your Growth",
      description: "See your emotional patterns and celebrate your progress over time",
      gradient: "from-muted-teal-400 to-muted-teal-600",
      bgGradient: "from-therapeutic-sage to-muted-teal-100",
      emoji: "📈"
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

  const quickActions = [
    {
      icon: MessageCircle,
      title: profile.has_created_conversation ? "Continue Your Journey" : "Start Your Journey",
      description: profile.has_created_conversation ? "Continue your emotional wellness journey" : "Begin your first conversation",
      action: onStartConversation,
      gradient: "from-primary-cta to-muted-teal-500"
    },
    {
      icon: BookOpen,
      title: "Browse Resources",
      description: "Explore mental health content",
      action: () => {
        // Navigate to sources page
        const event = new CustomEvent('navigate', { detail: { page: 'sources' } });
        window.dispatchEvent(event);
      },
      gradient: "from-muted-teal-500 to-muted-teal-600"
    },
    {
      icon: Lightbulb,
      title: "Community Insights",
      description: "Read community wisdom",
      action: () => {
        // Navigate to insights page
        const event = new CustomEvent('navigate', { detail: { page: 'insights' } });
        window.dispatchEvent(event);
      },
      gradient: "from-accent-primary to-accent-dark"
    },
    {
      icon: Target,
      title: "Growth Challenges",
      description: "Guided reflection exercises",
      action: () => {
        // Navigate to challenges
        const event = new CustomEvent('navigate', { detail: { page: 'challenges' } });
        window.dispatchEvent(event);
      },
      gradient: "from-indigo-500 to-blue-500"
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile.full_name?.split(' ')[0] || profile.email.split('@')[0];
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
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

      {/* Therapeutic Gradient Orbs */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-primary-cta/15 to-muted-teal-200/15 rounded-full blur-2xl opacity-60" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-accent-primary/10 to-accent-light/10 rounded-full blur-2xl opacity-60" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo and Greeting Section */}
          <div className="mb-12">
            <div className="mb-8 flex justify-center">
              <BloomingFlowerLogo size={80} />
            </div>
            
            <h1 className="text-headline text-5xl lg:text-6xl font-semibold mb-4 bg-gradient-to-r from-primary-cta via-muted-teal-500 to-accent-primary bg-clip-text text-transparent">
              {getGreeting()}
            </h1>
            
            <p className="text-body text-lg lg:text-xl text-text-secondary mb-6 leading-relaxed">
              Welcome to Bloom - your journey of emotional growth and self-discovery
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Calendar className="text-primary-cta" size={18} />
              <span className="text-body text-text-secondary text-sm">
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Enhanced Quick Actions with Highlighted Main CTA */}
          <div className="mb-12">
            {/* Main conversation button - highlighted */}
            <div className="mb-8">
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
                    <span className="font-headline">
                      {profile.has_created_conversation ? "Continue Your Journey" : "Start Your First Conversation"}
                    </span>
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
              
              {/* Supporting text */}
              <div className="mt-6 flex items-center justify-center gap-3 text-text-secondary">
                <Zap size={18} className="text-primary-cta" />
                <span className="text-base font-medium">
                  {profile.has_created_conversation 
                    ? "Continue building emotional awareness and insight" 
                    : "Begin your journey of self-discovery and growth"
                  }
                </span>
                <Zap size={18} className="text-primary-cta" />
              </div>
            </div>

            {/* Secondary actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.slice(1).map((action, index) => {
                const IconComponent = action.icon;
                
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`
                      card-modern p-6 transition-all duration-300 ease-out hover:scale-105
                      bg-gradient-to-br ${action.gradient} text-white shadow-gentle hover:shadow-calm
                    `}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-headline text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-body text-white/80 text-sm">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`
                        relative w-12 h-12 rounded-xl flex items-center justify-center
                        bg-gradient-to-br ${feature.gradient} shadow-gentle
                        ${isHovered ? 'scale-110' : 'scale-100'}
                        transition-all duration-300
                      `}>
                        <IconComponent size={20} className="text-white" />
                        
                        <div className="absolute -top-1 -right-1 text-lg">
                          {feature.emoji}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-headline text-lg font-semibold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-body text-text-secondary leading-relaxed text-sm">
                      {feature.description}
                    </p>
                    
                    {isHovered && (
                      <div className="absolute top-3 right-3">
                        <Sparkles size={14} className="text-accent-primary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational Message */}
          <div className="card-modern bg-gradient-to-r from-primary-cta/10 to-accent-primary/10 border border-primary-cta/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="text-accent-primary" size={20} />
              <span className="text-headline text-text-primary font-medium">
                Your journey of self-discovery continues
              </span>
              <Heart className="text-accent-primary" size={20} />
            </div>
            <p className="text-body text-text-secondary text-sm">
              Every reflection brings new insight. Every pattern you recognize creates freedom.
              You're building emotional intelligence and self-awareness one conversation at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}