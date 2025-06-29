import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Lightbulb, 
  Heart, 
  Share, 
  Plus, 
  Star, 
  MessageCircle, 
  Calendar,
  BookOpen,
  Sparkles,
  ThumbsUp,
  Eye,
  Send,
  X,
  Edit3,
  Save,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  Users,
  Award,
  Clock,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import CommunityInsights from './CommunityInsights';

interface InsightsPageProps {
  onBackToWelcome: () => void;
}

export default function InsightsPage({ onBackToWelcome }: InsightsPageProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-therapeutic-gradient">
      {/* Header */}
      <div className="border-b border-purple-200/50 p-6 bg-therapeutic-pearl backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToWelcome}
                className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 transition-all duration-200 hover:scale-105"
                title="Back to welcome"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-light bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Daily Insights
                </h1>
                <p className="text-therapy-gray-600 mt-1">
                  Share your journey, discover wisdom from others
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Open the insight submission form in CommunityInsights
                const event = new CustomEvent('openInsightForm');
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm"
            >
              <Plus size={20} />
              Share Your Insight
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">24</div>
                  <div className="text-sm text-purple-600">Total Insights</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-4 rounded-xl border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                  <ThumbsUp size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-700">156</div>
                  <div className="text-sm text-pink-600">Community Likes</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-muted-teal-100 to-muted-teal-200 p-4 rounded-xl border border-muted-teal-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted-teal-500 rounded-xl flex items-center justify-center">
                  <Eye size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-teal-700">892</div>
                  <div className="text-sm text-muted-teal-600">Total Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <CommunityInsights onBackToWelcome={onBackToWelcome} />
      </div>
    </div>
  );
}