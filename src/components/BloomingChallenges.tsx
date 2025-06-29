import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle, 
  Circle, 
  Calendar,
  Star,
  Trophy,
  Lightbulb,
  Heart,
  Brain,
  Sparkles,
  Plus,
  RotateCcw
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'reflection' | 'mindfulness' | 'growth' | 'relationships';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  completed: boolean;
  completedAt?: Date;
  userResponse?: string;
}

interface BloomingChallengesProps {
  onBackToWelcome: () => void;
}

export default function BloomingChallenges({ onBackToWelcome }: BloomingChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [showResponseForm, setShowResponseForm] = useState(false);

  const categories = [
    { id: 'reflection', label: 'Self-Reflection', icon: Brain, color: 'purple' },
    { id: 'mindfulness', label: 'Mindfulness', icon: Sparkles, color: 'blue' },
    { id: 'growth', label: 'Personal Growth', icon: Star, color: 'yellow' },
    { id: 'relationships', label: 'Relationships', icon: Heart, color: 'pink' }
  ];

  // Initialize challenges
  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    try {
      const saved = localStorage.getItem('bloom_challenges');
      if (saved) {
        const parsed = JSON.parse(saved);
        const challengesWithDates = parsed.map((challenge: any) => ({
          ...challenge,
          completedAt: challenge.completedAt ? new Date(challenge.completedAt) : undefined
        }));
        setChallenges(challengesWithDates);
      } else {
        initializeChallenges();
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      initializeChallenges();
    }
  };

  const initializeChallenges = () => {
    const defaultChallenges: Challenge[] = [
      {
        id: '1',
        title: 'The Uncomfortable Truth',
        description: 'Explore a situation you\'ve been avoiding',
        prompt: 'Write about a time when you avoided something uncomfortable. What did it cost you? What would have happened if you had faced it directly?',
        category: 'reflection',
        difficulty: 'intermediate',
        estimatedTime: '15-20 minutes',
        completed: false
      },
      {
        id: '2',
        title: 'Emotion Detective',
        description: 'Track and understand your emotional patterns',
        prompt: 'For the next week, notice one recurring thought or emotion. Each time it appears, write down: What triggered it? What story am I telling myself? What would I tell a friend experiencing this?',
        category: 'mindfulness',
        difficulty: 'beginner',
        estimatedTime: '5 minutes daily',
        completed: false
      },
      {
        id: '3',
        title: 'The Inner Critic\'s Voice',
        description: 'Identify and challenge your inner critic',
        prompt: 'Write down the harshest thing your inner critic says to you. Now, write a compassionate response as if you were talking to your best friend. What would change if you spoke to yourself this way?',
        category: 'growth',
        difficulty: 'intermediate',
        estimatedTime: '10-15 minutes',
        completed: false
      },
      {
        id: '4',
        title: 'Boundary Mapping',
        description: 'Explore your relationship boundaries',
        prompt: 'Think of a relationship that drains your energy. What boundaries are missing? What would you need to say or do to protect your well-being? Write the conversation you need to have.',
        category: 'relationships',
        difficulty: 'advanced',
        estimatedTime: '20-25 minutes',
        completed: false
      },
      {
        id: '5',
        title: 'Gratitude Archaeology',
        description: 'Dig deeper into appreciation',
        prompt: 'Instead of listing what you\'re grateful for, write about WHY you\'re grateful for one specific thing. How has it shaped you? What would be different without it?',
        category: 'mindfulness',
        difficulty: 'beginner',
        estimatedTime: '10 minutes',
        completed: false
      },
      {
        id: '6',
        title: 'The Growth Edge',
        description: 'Identify your next level of growth',
        prompt: 'What\'s one area where you feel stuck or resistant to change? What would your life look like if you grew in this area? What\'s the smallest step you could take today?',
        category: 'growth',
        difficulty: 'advanced',
        estimatedTime: '15-20 minutes',
        completed: false
      }
    ];

    setChallenges(defaultChallenges);
    localStorage.setItem('bloom_challenges', JSON.stringify(defaultChallenges));
  };

  const saveChallenges = (updatedChallenges: Challenge[]) => {
    setChallenges(updatedChallenges);
    localStorage.setItem('bloom_challenges', JSON.stringify(updatedChallenges));
  };

  const handleCompleteChallenge = (challengeId: string, response: string) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          completed: true,
          completedAt: new Date(),
          userResponse: response
        };
      }
      return challenge;
    });
    
    saveChallenges(updatedChallenges);
    setShowResponseForm(false);
    setUserResponse('');
    setSelectedChallenge(null);
  };

  const handleResetChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          completed: false,
          completedAt: undefined,
          userResponse: undefined
        };
      }
      return challenge;
    });
    
    saveChallenges(updatedChallenges);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-therapy-gray-600 bg-therapy-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(c => c.id === category);
    return categoryInfo?.icon || Brain;
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount = challenges.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Blooming Challenges
        </h1>
        <p className="text-therapy-gray-600 mb-6">
          Growth-oriented reflection exercises to deepen self-awareness
        </p>
        
        {/* Progress */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-2xl border border-indigo-200">
          <Trophy size={20} className="text-indigo-600" />
          <span className="text-indigo-700 font-medium">
            {completedCount} of {totalCount} challenges completed
          </span>
          <div className="w-24 h-2 bg-indigo-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => {
          const IconComponent = getCategoryIcon(challenge.category);
          const categoryInfo = categories.find(c => c.id === challenge.category);
          
          return (
            <div
              key={challenge.id}
              className={`
                p-6 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer
                ${challenge.completed 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-gentle' 
                  : 'bg-therapeutic-pearl border-therapy-gray-200 hover:shadow-gentle hover:border-indigo-300'
                }
              `}
              onClick={() => {
                setSelectedChallenge(challenge);
                if (!challenge.completed) {
                  setShowResponseForm(true);
                }
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-xl flex items-center justify-center
                    ${challenge.category === 'reflection' ? 'bg-purple-100 text-purple-600' :
                      challenge.category === 'mindfulness' ? 'bg-blue-100 text-blue-600' :
                      challenge.category === 'growth' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-pink-100 text-pink-600'
                    }
                  `}>
                    <IconComponent size={16} />
                  </div>
                  <span className="text-xs font-medium text-therapy-gray-600">
                    {categoryInfo?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {challenge.completed ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Circle size={20} className="text-therapy-gray-400" />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-therapy-gray-700 mb-2">
                {challenge.title}
              </h3>
              
              <p className="text-therapy-gray-600 leading-relaxed mb-4 line-clamp-2">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-therapy-gray-500">
                  {challenge.estimatedTime}
                </span>
              </div>

              {challenge.completed && challenge.completedAt && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600">
                      Completed {challenge.completedAt.toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetChallenge(challenge.id);
                      }}
                      className="text-xs text-therapy-gray-500 hover:text-therapy-gray-700 flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Challenge Response Modal */}
      {showResponseForm && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-therapy-gray-700 mb-2">
                {selectedChallenge.title}
              </h2>
              <p className="text-therapy-gray-600 mb-4">
                {selectedChallenge.description}
              </p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                <p className="text-therapy-gray-700 leading-relaxed">
                  {selectedChallenge.prompt}
                </p>
              </div>
            </div>

            {selectedChallenge.completed ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-therapy-gray-700">Your Response:</h3>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-therapy-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedChallenge.userResponse}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSelectedChallenge(null);
                      setShowResponseForm(false);
                    }}
                    className="flex-1 px-6 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleResetChallenge(selectedChallenge.id)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    Redo Challenge
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Take your time to reflect deeply on this prompt. There are no right or wrong answers—only your authentic thoughts and insights."
                  rows={12}
                  className="w-full px-4 py-3 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none text-black leading-relaxed"
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSelectedChallenge(null);
                      setShowResponseForm(false);
                      setUserResponse('');
                    }}
                    className="flex-1 px-6 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCompleteChallenge(selectedChallenge.id, userResponse)}
                    disabled={!userResponse.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Challenge
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}