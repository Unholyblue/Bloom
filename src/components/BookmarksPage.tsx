import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Heart,
  Lightbulb,
  BookOpen,
  Star,
  Sparkles,
  Play,
  Headphones,
  FileText,
  Eye,
  ThumbsUp,
  ExternalLink,
  Clock,
  Search,
  Filter,
  Trash2,
  Calendar
} from 'lucide-react';
import { 
  fetchUserBookmarks, 
  removeBookmark,
  testBookmarkDatabaseConnection
} from '../utils/bookmarkService';

interface BookmarksPageProps {
  onBackToWelcome: () => void;
}

type BookmarkType = 'all' | 'sources' | 'insights';

interface BookmarkedItem {
  id: string;
  title: string;
  description: string;
  type: 'source' | 'insight';
  category: string;
  author: string;
  date: Date;
  likes?: number;
  views?: number;
  url?: string;
  duration?: string;
  rating?: number;
}

export default function BookmarksPage({ onBackToWelcome }: BookmarksPageProps) {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [selectedType, setSelectedType] = useState<BookmarkType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    // Load bookmarks from Supabase or localStorage
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    
    try {
      // Test database connection
      const connected = await testBookmarkDatabaseConnection();
      setDbConnected(connected);
      
      // Fetch bookmarked resource IDs
      const bookmarkIds = await fetchUserBookmarks();
      
      // For a real implementation, we would fetch the actual resources from the database
      // For now, we'll simulate with sample data
      const items: BookmarkedItem[] = [
        {
          id: '1',
          title: 'The Body Keeps the Score',
          description: 'Groundbreaking exploration of trauma and its effects on the body and mind.',
          type: 'source',
          category: 'book',
          author: 'Bessel van der Kolk',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          likes: 89,
          views: 1247,
          url: 'https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score',
          duration: '12-15 hours',
          rating: 4.9
        },
        {
          id: '2',
          title: 'Finding Peace in Morning Routines',
          description: 'I discovered that starting my day with 5 minutes of deep breathing and gratitude journaling has transformed my anxiety levels.',
          type: 'insight',
          category: 'tip',
          author: 'Anonymous',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          likes: 42,
          views: 156
        },
        {
          id: '6',
          title: '5-Minute Guided Breathing Exercise',
          description: 'A quick practice to ease stress and anxiety.',
          type: 'source',
          category: 'audio',
          author: 'Mindfulness Coach',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          likes: 67,
          views: 423,
          url: 'https://www.youtube.com/watch?v=SEfs5TJZ6Nk',
          duration: '5 minutes',
          rating: 4.5
        },
        {
          id: '11',
          title: 'A Journey Through Darkness',
          description: 'A personal story of overcoming depression and finding hope.',
          type: 'source',
          category: 'story',
          author: 'Anonymous',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          likes: 124,
          views: 789,
          duration: '10 minutes',
          rating: 4.9
        }
      ];
      
      // Filter to only include items that are in bookmarkIds
      // In a real implementation, we would fetch only the bookmarked items
      const filteredItems = items.filter(item => bookmarkIds.includes(item.id));
      
      setBookmarkedItems(filteredItems);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      // Fallback to sample data
      setBookmarkedItems([
        {
          id: '1',
          title: 'The Body Keeps the Score',
          description: 'Groundbreaking exploration of trauma and its effects on the body and mind.',
          type: 'source',
          category: 'book',
          author: 'Bessel van der Kolk',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          likes: 89,
          views: 1247
        },
        {
          id: '2',
          title: 'Finding Peace in Morning Routines',
          description: 'I discovered that starting my day with 5 minutes of deep breathing and gratitude journaling has transformed my anxiety levels.',
          type: 'insight',
          category: 'tip',
          author: 'Anonymous',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          likes: 42,
          views: 156
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (id: string) => {
    try {
      // Remove from Supabase/localStorage
      await removeBookmark(id);
      
      // Update local state
      setBookmarkedItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  // Filter items based on search and type
  const filteredItems = bookmarkedItems.filter(item => {
    const matchesType = selectedType === 'all' || 
      (selectedType === 'sources' && item.type === 'source') ||
      (selectedType === 'insights' && item.type === 'insight');
    
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const sourcesCount = bookmarkedItems.filter(item => item.type === 'source').length;
  const insightsCount = bookmarkedItems.filter(item => item.type === 'insight').length;
  const totalBookmarks = bookmarkedItems.length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'book': return BookOpen;
      case 'story': return Heart;
      case 'article': return FileText;
      case 'podcast': return Headphones;
      case 'audio': return Headphones;
      case 'video': return Play;
      case 'guide': return Star;
      case 'tip': return Lightbulb;
      case 'reflection': return Sparkles;
      case 'coping': return Star;
      default: return BookOpen;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-therapeutic-gradient">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cta border-t-muted-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-therapy-gray-600">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

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
                  Your Bookmarks
                </h1>
                <p className="text-therapy-gray-600 mt-1">
                  Your saved insights and resources for easy access
                  {!dbConnected && (
                    <span className="ml-2 text-amber-600 text-sm">(Local storage mode)</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookmarkCheck size={24} className="text-primary-cta" />
              <span className="text-2xl font-bold text-primary-cta">{totalBookmarks}</span>
              <span className="text-sm text-therapy-gray-500">saved</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-primary-cta/10 to-primary-cta/20 p-4 rounded-xl border border-primary-cta/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-cta rounded-xl flex items-center justify-center">
                  <BookmarkCheck size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-cta">{totalBookmarks}</div>
                  <div className="text-sm text-primary-cta/80">Total Bookmarks</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-muted-teal-100/50 to-muted-teal-200/50 p-4 rounded-xl border border-muted-teal-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted-teal-500 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-teal-700">{sourcesCount}</div>
                  <div className="text-sm text-muted-teal-600">Resources</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-accent-primary/20 to-accent-light/30 p-4 rounded-xl border border-accent-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-primary rounded-xl flex items-center justify-center">
                  <Lightbulb size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-dark">{insightsCount}</div>
                  <div className="text-sm text-accent-dark/80">Insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105
                    ${selectedType === 'all' 
                      ? 'bg-gradient-to-r from-primary-cta to-muted-teal-500 text-white shadow-gentle' 
                      : 'bg-therapeutic-pearl hover:bg-white text-therapy-gray-600 border border-primary-cta/20'
                    }
                  `}
                >
                  <BookmarkCheck size={16} />
                  All Bookmarks
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${selectedType === 'all' ? 'bg-white/20 text-white' : 'bg-primary-cta/10 text-primary-cta'}
                  `}>
                    {totalBookmarks}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedType('sources')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105
                    ${selectedType === 'sources' 
                      ? 'bg-gradient-to-r from-muted-teal-500 to-muted-teal-600 text-white shadow-gentle' 
                      : 'bg-therapeutic-pearl hover:bg-white text-therapy-gray-600 border border-muted-teal-200/50'
                    }
                  `}
                >
                  <BookOpen size={16} />
                  Resources
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${selectedType === 'sources' ? 'bg-white/20 text-white' : 'bg-muted-teal-100 text-muted-teal-600'}
                  `}>
                    {sourcesCount}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedType('insights')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105
                    ${selectedType === 'insights' 
                      ? 'bg-gradient-to-r from-accent-primary to-accent-dark text-white shadow-gentle' 
                      : 'bg-therapeutic-pearl hover:bg-white text-therapy-gray-600 border border-accent-primary/20'
                    }
                  `}
                >
                  <Lightbulb size={16} />
                  Insights
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${selectedType === 'insights' ? 'bg-white/20 text-white' : 'bg-accent-primary/10 text-accent-primary'}
                  `}>
                    {insightsCount}
                  </span>
                </button>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-primary-cta/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cta/30 bg-therapeutic-pearl backdrop-blur-sm text-black"
                />
              </div>
            </div>
          </div>

          {/* Empty State */}
          {totalBookmarks === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={48} className="mx-auto mb-4 text-therapy-gray-400" />
              <h3 className="text-xl font-semibold text-therapy-gray-600 mb-2">No bookmarks yet</h3>
              <p className="text-therapy-gray-500 mb-6">
                Start bookmarking insights and resources to save them for later
              </p>
              <button
                onClick={onBackToWelcome}
                className="px-6 py-3 bg-gradient-to-r from-primary-cta to-muted-teal-500 hover:from-primary-cta-hover hover:to-muted-teal-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                Explore Content
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Sources Section */}
              {(selectedType === 'all' || selectedType === 'sources') && 
                filteredItems.filter(item => item.type === 'source').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={20} className="text-muted-teal-500" />
                    <h2 className="text-xl font-semibold text-therapy-gray-700">Bookmarked Resources</h2>
                    <span className="text-sm text-therapy-gray-500">
                      ({filteredItems.filter(item => item.type === 'source').length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems
                      .filter(item => item.type === 'source')
                      .map(item => {
                        const IconComponent = getCategoryIcon(item.category);
                        
                        return (
                          <div
                            key={item.id}
                            className="p-6 bg-therapeutic-pearl backdrop-blur-sm border border-muted-teal-200/50 rounded-2xl hover:shadow-gentle transition-all duration-300 hover:scale-105 cursor-pointer hover:bg-white/90"
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className={`
                                  w-8 h-8 rounded-xl flex items-center justify-center
                                  ${item.category === 'book' ? 'bg-blue-100 text-blue-600' :
                                    item.category === 'story' ? 'bg-pink-100 text-pink-600' :
                                    item.category === 'article' ? 'bg-purple-100 text-purple-600' :
                                    item.category === 'podcast' || item.category === 'audio' ? 'bg-green-100 text-green-600' :
                                    item.category === 'video' ? 'bg-red-100 text-red-600' :
                                    'bg-yellow-100 text-yellow-600'
                                  }
                                `}>
                                  <IconComponent size={16} />
                                </div>
                                <span className="text-xs font-medium text-therapy-gray-600 capitalize">
                                  {item.category}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveBookmark(item.id);
                                }}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                title="Remove bookmark"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {/* Content */}
                            <h4 className="text-lg font-semibold text-therapy-gray-700 mb-2 line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-therapy-gray-600 mb-2">by {item.author}</p>
                            <p className="text-sm text-therapy-gray-600 leading-relaxed mb-4 line-clamp-3">
                              {item.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {item.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium text-therapy-gray-700">{item.rating}</span>
                                  </div>
                                )}
                                {item.views && (
                                  <div className="flex items-center gap-1 text-sm text-therapy-gray-400">
                                    <Eye size={14} />
                                    {item.views}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {item.duration && (
                                  <div className="flex items-center gap-1 text-xs text-therapy-gray-500">
                                    <Clock size={12} />
                                    {item.duration}
                                  </div>
                                )}
                                {item.url && (
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-muted-teal-500 hover:text-muted-teal-600 transition-colors"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Insights Section */}
              {(selectedType === 'all' || selectedType === 'insights') && 
                filteredItems.filter(item => item.type === 'insight').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={20} className="text-accent-primary" />
                    <h2 className="text-xl font-semibold text-therapy-gray-700">Bookmarked Insights</h2>
                    <span className="text-sm text-therapy-gray-500">
                      ({filteredItems.filter(item => item.type === 'insight').length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems
                      .filter(item => item.type === 'insight')
                      .map(item => {
                        const IconComponent = getCategoryIcon(item.category);
                        
                        return (
                          <div
                            key={item.id}
                            className="p-6 bg-therapeutic-pearl backdrop-blur-sm border border-accent-primary/20 rounded-2xl hover:shadow-gentle transition-all duration-300 hover:scale-105 cursor-pointer hover:bg-white/90"
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className={`
                                  w-8 h-8 rounded-xl flex items-center justify-center
                                  ${item.category === 'story' ? 'bg-pink-100 text-pink-600' :
                                    item.category === 'tip' ? 'bg-yellow-100 text-yellow-600' :
                                    item.category === 'reflection' ? 'bg-purple-100 text-purple-600' :
                                    'bg-green-100 text-green-600'
                                  }
                                `}>
                                  <IconComponent size={16} />
                                </div>
                                <span className="text-xs font-medium text-therapy-gray-600 capitalize">
                                  {item.category}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveBookmark(item.id);
                                }}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                title="Remove bookmark"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {/* Content */}
                            <h4 className="text-lg font-semibold text-therapy-gray-700 mb-3 line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-therapy-gray-600 leading-relaxed mb-4 line-clamp-4">
                              {item.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {item.likes && (
                                  <div className="flex items-center gap-1 text-sm text-therapy-gray-400">
                                    <ThumbsUp size={14} />
                                    {item.likes}
                                  </div>
                                )}
                                {item.views && (
                                  <div className="flex items-center gap-1 text-sm text-therapy-gray-400">
                                    <Eye size={14} />
                                    {item.views}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-therapy-gray-500">
                                by {item.author}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* No Results */}
              {((selectedType === 'sources' && filteredItems.filter(item => item.type === 'source').length === 0) ||
                (selectedType === 'insights' && filteredItems.filter(item => item.type === 'insight').length === 0) ||
                (selectedType === 'all' && filteredItems.length === 0)) && searchQuery && (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto mb-4 text-therapy-gray-400" />
                  <h3 className="text-xl font-semibold text-therapy-gray-600 mb-2">No results found</h3>
                  <p className="text-therapy-gray-500">
                    No bookmarks match "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}