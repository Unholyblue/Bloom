import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Heart, 
  Plus, 
  Star, 
  Calendar,
  ThumbsUp,
  Eye,
  Send,
  X,
  Sparkles,
  Quote,
  RefreshCw,
  Filter
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface CommunityInsight {
  id: string | number;
  content: string;
  mood_tag?: string;
  author?: string;
  likes?: number;
  views?: number;
  featured?: boolean;
  created_at: string | Date;
}

interface CommunityInsightsProps {
  onBackToWelcome: () => void;
}

export default function CommunityInsights({ onBackToWelcome }: CommunityInsightsProps) {
  const [insights, setInsights] = useState<CommunityInsight[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newInsight, setNewInsight] = useState('');
  const [selectedMoodTag, setSelectedMoodTag] = useState<string>('mindfulness');
  const [insightOfTheDay, setInsightOfTheDay] = useState<CommunityInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterMood, setFilterMood] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const moodTags = [
    { id: 'mindfulness', label: 'Mindfulness', icon: Sparkles, color: 'purple' },
    { id: 'coping', label: 'Coping', icon: Heart, color: 'pink' },
    { id: 'growth', label: 'Growth', icon: Star, color: 'yellow' },
    { id: 'relationships', label: 'Relationships', icon: ThumbsUp, color: 'blue' },
    { id: 'self-care', label: 'Self-Care', icon: Lightbulb, color: 'green' },
    { id: 'anxiety', label: 'Anxiety', icon: Eye, color: 'red' },
    { id: 'sadness', label: 'Sadness', icon: Calendar, color: 'indigo' }
  ] as const;

  // Load insights from Supabase
  useEffect(() => {
    loadInsights();

    // Listen for the openInsightForm event
    const handleOpenForm = () => {
      setShowSubmitForm(true);
    };
    window.addEventListener('openInsightForm', handleOpenForm);
    
    return () => {
      window.removeEventListener('openInsightForm', handleOpenForm);
    };
  }, [refreshKey, filterMood]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('community_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      // Apply mood filter if not "all"
      if (filterMood !== 'all') {
        query = query.eq('mood_tag', filterMood);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching insights:', error);
        setError('Failed to load community insights. Please try again later.');
        // Fall back to local data
        loadFromLocalStorage();
      } else if (data) {
        console.log('Loaded insights from Supabase:', data.length);
        setInsights(data);
        
        // Set insight of the day (most recent featured or random)
        const featured = data.filter((i: CommunityInsight) => i.featured);
        if (featured.length > 0) {
          setInsightOfTheDay(featured[0]);
        } else if (data.length > 0) {
          setInsightOfTheDay(data[Math.floor(Math.random() * data.length)]);
        }
      }
    } catch (err) {
      console.error('Error in loadInsights:', err);
      setError('An unexpected error occurred. Please try again later.');
      // Fall back to local data
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('bloom_community_insights');
      if (saved) {
        const parsed = JSON.parse(saved);
        const insightsWithDates = parsed.map((insight: any) => ({
          ...insight,
          created_at: new Date(insight.created_at)
        }));
        setInsights(insightsWithDates);
        
        // Set insight of the day
        const featured = insightsWithDates.filter((i: CommunityInsight) => i.featured);
        if (featured.length > 0) {
          setInsightOfTheDay(featured[0]);
        } else if (insightsWithDates.length > 0) {
          setInsightOfTheDay(insightsWithDates[Math.floor(Math.random() * insightsWithDates.length)]);
        }
      } else {
        // Initialize with sample insights
        initializeSampleInsights();
      }
    } catch (error) {
      console.error('Error loading insights from localStorage:', error);
      initializeSampleInsights();
    }
  };

  const initializeSampleInsights = () => {
    const sampleInsights: CommunityInsight[] = [
      {
        id: '1',
        content: "When I feel overwhelmed, I name each emotion out loud. It takes away their power and helps me see them as temporary visitors, not permanent residents.",
        mood_tag: 'coping',
        author: "Anonymous",
        likes: 24,
        views: 156,
        featured: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        content: "I learned that self-compassion isn't selfish—it's necessary. I started asking myself: 'What would I tell a friend in this situation?' It changed everything.",
        mood_tag: 'growth',
        author: "Anonymous",
        likes: 31,
        views: 203,
        featured: false,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        content: "My morning ritual: three deep breaths, three things I'm grateful for, and one intention for the day. Simple but transformative.",
        mood_tag: 'mindfulness',
        author: "Anonymous",
        likes: 18,
        views: 127,
        featured: false,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        content: "Boundaries aren't walls—they're gates with you as the gatekeeper. You decide what energy gets in and what stays out.",
        mood_tag: 'relationships',
        author: "Anonymous",
        likes: 42,
        views: 289,
        featured: true,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        content: "I schedule 'worry time'—15 minutes daily to feel all my anxieties fully. Outside that time, I gently redirect: 'Not now, we'll talk at 3 PM.'",
        mood_tag: 'anxiety',
        author: "Anonymous",
        likes: 27,
        views: 178,
        featured: false,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
    
    setInsights(sampleInsights);
    setInsightOfTheDay(sampleInsights[3]); // The boundaries insight
    localStorage.setItem('bloom_community_insights', JSON.stringify(sampleInsights));
  };

  const handleSubmitInsight = async () => {
    if (!newInsight.trim()) return;
    
    setSubmitting(true);
    setError(null);

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('community_insights')
        .insert([
          { 
            content: newInsight.trim(),
            mood_tag: selectedMoodTag
          }
        ])
        .select();
      
      if (error) {
        console.error('Error submitting insight:', error);
        setError('Failed to share your insight. Please try again.');
      } else if (data) {
        console.log('Insight shared successfully:', data);
        // Add to local state
        setInsights(prevInsights => [data[0], ...prevInsights]);
        // Show success message
        alert('Insight shared 💬 Thanks for contributing.');
        // Reset form
        setNewInsight('');
        setShowSubmitForm(false);
        // Refresh the list
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error in handleSubmitInsight:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (insightId: string | number) => {
    // In a real implementation, this would update the likes count in the database
    // For now, we'll just update the local state
    setInsights(prevInsights => 
      prevInsights.map(insight => 
        insight.id === insightId 
          ? { ...insight, likes: (insight.likes || 0) + 1 } 
          : insight
      )
    );
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) return 'Today';
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Community Wisdom
        </h1>
        <p className="text-therapy-gray-600 mb-6">
          Shared insights from our community of growth-minded individuals
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setShowSubmitForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Plus size={20} />
            Share Your Insight
          </button>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-purple-200 hover:border-purple-300 text-purple-600 font-medium rounded-xl transition-all duration-200 hover:scale-105"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Mood Filter */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setFilterMood('all')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${filterMood === 'all' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-gentle' 
                : 'bg-white hover:bg-purple-50 text-therapy-gray-600 border border-purple-200'
              }
            `}
          >
            <Filter size={16} />
            All Moods
          </button>
          
          {moodTags.map(mood => {
            const IconComponent = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => setFilterMood(mood.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${filterMood === mood.id 
                    ? `bg-${mood.color}-500 text-white shadow-gentle` 
                    : `bg-white hover:bg-${mood.color}-50 text-therapy-gray-600 border border-${mood.color}-200`
                  }
                `}
              >
                <IconComponent size={16} />
                {mood.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <p>{error}</p>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Insight of the Day */}
      {!loading && insightOfTheDay && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-yellow-500" />
            <h2 className="text-lg font-semibold text-purple-700">Insight of the Day</h2>
          </div>
          <div className="relative">
            <Quote size={24} className="absolute -top-2 -left-2 text-purple-300" />
            <p className="text-therapy-gray-700 leading-relaxed text-lg pl-6 italic">
              {insightOfTheDay.content}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-purple-600">
              — {insightOfTheDay.author || 'Community Member'}
            </span>
            <div className="flex items-center gap-4">
              {insightOfTheDay.likes !== undefined && (
                <div className="flex items-center gap-1 text-sm text-purple-600">
                  <ThumbsUp size={14} />
                  {insightOfTheDay.likes}
                </div>
              )}
              {insightOfTheDay.views !== undefined && (
                <div className="flex items-center gap-1 text-sm text-purple-600">
                  <Eye size={14} />
                  {insightOfTheDay.views}
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-purple-600">
                <Calendar size={14} />
                {formatDate(insightOfTheDay.created_at)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Feed */}
      {!loading && insights.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-therapy-gray-700">Recent Insights</h2>
          <div className="grid gap-6">
            {insights.map(insight => {
              const moodInfo = moodTags.find(m => m.id === insight.mood_tag) || moodTags[0];
              const IconComponent = moodInfo.icon;
              
              return (
                <div
                  key={insight.id}
                  className="bg-white border border-therapy-gray-200 rounded-2xl p-6 hover:shadow-gentle transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-xl flex items-center justify-center
                        bg-${moodInfo.color}-100 text-${moodInfo.color}-600
                      `}>
                        <IconComponent size={16} />
                      </div>
                      <span className="text-sm font-medium text-therapy-gray-600 capitalize">
                        {moodInfo.label}
                      </span>
                    </div>
                    <span className="text-xs text-therapy-gray-400">
                      {formatDate(insight.created_at)}
                    </span>
                  </div>

                  <p className="text-therapy-gray-700 leading-relaxed mb-4">
                    {insight.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-therapy-gray-500">
                      — {insight.author || 'Community Member'}
                    </span>
                    <div className="flex items-center gap-4">
                      {insight.likes !== undefined && (
                        <button
                          onClick={() => handleLike(insight.id)}
                          className="flex items-center gap-1 text-sm text-therapy-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ThumbsUp size={14} />
                          {insight.likes}
                        </button>
                      )}
                      {insight.views !== undefined && (
                        <div className="flex items-center gap-1 text-sm text-therapy-gray-400">
                          <Eye size={14} />
                          {insight.views}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && insights.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb size={48} className="mx-auto mb-4 text-therapy-gray-400" />
          <h3 className="text-xl font-semibold text-therapy-gray-600 mb-2">No insights yet</h3>
          <p className="text-therapy-gray-500 mb-6">
            Be the first to share your wisdom with the community
          </p>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
          >
            Share Your Insight
          </button>
        </div>
      )}

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-therapy-gray-700">Share Your Insight</h3>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <textarea
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="Share a powerful insight, realization, or wisdom that has helped you on your journey..."
                rows={6}
                className="w-full px-4 py-3 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none text-black"
              />

              <div>
                <label className="block text-sm font-medium text-therapy-gray-700 mb-2">
                  Mood Tag
                </label>
                <select
                  value={selectedMoodTag}
                  onChange={(e) => setSelectedMoodTag(e.target.value)}
                  className="w-full px-4 py-3 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
                >
                  {moodTags.map(mood => (
                    <option key={mood.id} value={mood.id}>
                      {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 px-6 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitInsight}
                  disabled={!newInsight.trim() || submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Share Insight
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}