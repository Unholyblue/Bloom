import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  BookOpen, 
  Heart, 
  Star, 
  ExternalLink, 
  Download,
  Search,
  Filter,
  Clock,
  User,
  Award,
  Bookmark,
  BookmarkCheck,
  Play,
  Headphones,
  FileText,
  Globe,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  ThumbsUp,
  Calendar,
  Tag,
  Plus,
  X,
  Send
} from 'lucide-react';
import ResourceLibrary from './ResourceLibrary';

interface SourcesPageProps {
  onBackToWelcome: () => void;
}

export default function SourcesPage({ onBackToWelcome }: SourcesPageProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-therapeutic-gradient">
      {/* Header */}
      <div className="border-b border-primary-cta/20 p-6 bg-therapeutic-pearl backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToWelcome}
                className="p-2 rounded-xl bg-primary-cta/10 hover:bg-primary-cta/20 text-primary-cta transition-all duration-200 hover:scale-105"
                title="Back to welcome"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-light bg-gradient-to-r from-primary-cta via-muted-teal-500 to-accent-primary bg-clip-text text-transparent">
                  Mental Health Sources
                </h1>
                <p className="text-therapy-gray-600 mt-1">
                  Curated books, stories, and resources for your wellness journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-therapy-gray-500">
                  12 bookmarked
                </span>
                <Bookmark size={16} className="text-primary-cta" />
              </div>
              <button
                onClick={() => {
                  // Open resource submission form
                  const event = new CustomEvent('openResourceForm');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-cta to-muted-teal-500 hover:from-primary-cta-hover hover:to-muted-teal-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm"
              >
                <Plus size={20} />
                Add Resource
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-primary-cta/10 to-primary-cta/20 p-4 rounded-xl border border-primary-cta/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-cta rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-cta">36</div>
                  <div className="text-sm text-primary-cta/80">Total Resources</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-muted-teal-100/50 to-muted-teal-200/50 p-4 rounded-xl border border-muted-teal-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted-teal-500 rounded-xl flex items-center justify-center">
                  <Eye size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-teal-700">1,245</div>
                  <div className="text-sm text-muted-teal-600">Total Views</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-accent-primary/20 to-accent-light/30 p-4 rounded-xl border border-accent-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-primary rounded-xl flex items-center justify-center">
                  <ThumbsUp size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-dark">328</div>
                  <div className="text-sm text-accent-dark/80">Community Likes</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-100/50 to-yellow-200/50 p-4 rounded-xl border border-yellow-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-700">4.7</div>
                  <div className="text-sm text-yellow-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <ResourceLibrary onBackToWelcome={onBackToWelcome} />
      </div>
    </div>
  );
}