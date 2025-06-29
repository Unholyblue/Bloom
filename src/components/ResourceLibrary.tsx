import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Heart, 
  Star, 
  ExternalLink,
  Clock,
  User,
  Filter,
  Search,
  Bookmark,
  BookmarkCheck,
  X,
  Plus,
  Send
} from 'lucide-react';
import { 
  fetchUserBookmarks, 
  toggleBookmark, 
  syncLocalBookmarksToSupabase,
  testBookmarkDatabaseConnection
} from '../utils/bookmarkService';

interface Resource {
  id: string;
  title: string;
  author: string;
  description: string;
  type: 'book' | 'audio' | 'story';
  category: 'anxiety' | 'depression' | 'mindfulness' | 'relationships' | 'growth' | 'stress' | 'sleep';
  rating: number;
  duration?: string;
  url?: string;
  featured: boolean;
  isBookmarked?: boolean;
}

interface ResourceLibraryProps {
  onBackToWelcome: () => void;
}

export default function ResourceLibrary({ onBackToWelcome }: ResourceLibraryProps) {
  const [selectedTab, setSelectedTab] = useState<'books' | 'audios' | 'stories'>('books');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());
  const [showAddResourceForm, setShowAddResourceForm] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'book',
    category: 'mindfulness',
    rating: 4.5,
    featured: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [resources, setResources] = useState<Resource[]>([
    // Books
    {
      id: '1',
      title: 'The Anxiety and Phobia Workbook',
      author: 'Edmund J. Bourne',
      description: 'A practical guide to understanding and managing anxiety.',
      type: 'book',
      category: 'anxiety',
      rating: 4.7,
      duration: '8-10 hours',
      url: 'https://www.goodreads.com/book/show/46781.The_Anxiety_and_Phobia_Workbook',
      featured: true,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Mindfulness in Plain English',
      author: 'Bhante Henepola Gunaratana',
      description: 'Simple mindfulness techniques for everyday calm.',
      type: 'book',
      category: 'mindfulness',
      rating: 4.8,
      duration: '4-6 hours',
      url: 'https://www.goodreads.com/book/show/64369.Mindfulness_in_Plain_English',
      featured: false,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Feeling Good',
      author: 'David D. Burns',
      description: 'Cognitive behavioral therapy principles to improve mood.',
      type: 'book',
      category: 'depression',
      rating: 4.6,
      duration: '10-12 hours',
      url: 'https://www.goodreads.com/book/show/46674.Feeling_Good',
      featured: true,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'The Body Keeps the Score',
      author: 'Bessel van der Kolk',
      description: 'Groundbreaking exploration of trauma and its effects on the body and mind.',
      type: 'book',
      category: 'anxiety',
      rating: 4.9,
      duration: '12-15 hours',
      url: 'https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score',
      featured: false,
      isBookmarked: false
    },
    {
      id: '5',
      title: 'Why We Sleep',
      author: 'Matthew Walker',
      description: 'The science of sleep and its profound impact on our mental health.',
      type: 'book',
      category: 'sleep',
      rating: 4.7,
      duration: '8-10 hours',
      url: 'https://www.goodreads.com/book/show/34466963-why-we-sleep',
      featured: false,
      isBookmarked: false
    },
    // Audios
    {
      id: '6',
      title: '5-Minute Guided Breathing Exercise',
      author: 'Mindfulness Coach',
      description: 'A quick practice to ease stress and anxiety.',
      type: 'audio',
      category: 'stress',
      rating: 4.5,
      duration: '5 minutes',
      url: 'https://www.youtube.com/watch?v=SEfs5TJZ6Nk',
      featured: true,
      isBookmarked: false
    },
    {
      id: '7',
      title: 'Sleep Sounds: Ocean Waves',
      author: 'Nature Sounds',
      description: 'Relaxing sounds for better sleep and relaxation.',
      type: 'audio',
      category: 'sleep',
      rating: 4.8,
      duration: '60 minutes',
      url: 'https://www.youtube.com/watch?v=bn9F19Hi1Lk',
      featured: false,
      isBookmarked: false
    },
    {
      id: '8',
      title: 'Anxiety Relief Meditation',
      author: 'Calm Mind',
      description: 'Guided meditation specifically designed to reduce anxiety.',
      type: 'audio',
      category: 'anxiety',
      rating: 4.7,
      duration: '15 minutes',
      url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
      featured: false,
      isBookmarked: false
    },
    {
      id: '9',
      title: 'Positive Affirmations for Depression',
      author: 'Healing Voice',
      description: 'Gentle affirmations to help shift negative thought patterns.',
      type: 'audio',
      category: 'depression',
      rating: 4.6,
      duration: '10 minutes',
      url: 'https://www.youtube.com/watch?v=6tZz6gr1h9g',
      featured: false,
      isBookmarked: false
    },
    {
      id: '10',
      title: 'Mindful Body Scan',
      author: 'Mindfulness Teacher',
      description: 'A guided practice to connect with your body and release tension.',
      type: 'audio',
      category: 'mindfulness',
      rating: 4.9,
      duration: '20 minutes',
      url: 'https://www.youtube.com/watch?v=QS2yDmWk0vs',
      featured: true,
      isBookmarked: false
    },
    // Stories
    {
      id: '11',
      title: 'A Journey Through Darkness',
      author: 'Anonymous',
      description: 'A personal story of overcoming depression and finding hope.',
      type: 'story',
      category: 'depression',
      rating: 4.9,
      duration: '10 minutes',
      featured: true,
      isBookmarked: false
    },
    {
      id: '12',
      title: 'Finding Light',
      author: 'Hope Seeker',
      description: 'Short motivational story about resilience and inner strength.',
      type: 'story',
      category: 'growth',
      rating: 4.7,
      duration: '5 minutes',
      featured: false,
      isBookmarked: false
    },
    {
      id: '13',
      title: 'The Anxiety Monster',
      author: 'Healing Writer',
      description: 'A metaphorical tale about befriending anxiety instead of fighting it.',
      type: 'story',
      category: 'anxiety',
      rating: 4.8,
      duration: '7 minutes',
      featured: false,
      isBookmarked: false
    },
    {
      id: '14',
      title: 'The Mindful Moment',
      author: 'Present Mind',
      description: 'A story about finding peace in the midst of chaos through mindfulness.',
      type: 'story',
      category: 'mindfulness',
      rating: 4.6,
      duration: '6 minutes',
      featured: false,
      isBookmarked: false
    },
    {
      id: '15',
      title: 'Rebuilding Bridges',
      author: 'Connection Seeker',
      description: 'A touching story about healing relationships and finding forgiveness.',
      type: 'story',
      category: 'relationships',
      rating: 4.8,
      duration: '8 minutes',
      featured: true,
      isBookmarked: false
    }
  ]);

  const moods = [
    { id: 'all', label: 'All Moods' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'stress', label: 'Stress' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'growth', label: 'Personal Growth' }
  ];

  const tabs = [
    { id: 'books', label: 'Books', icon: BookOpen, count: resources.filter(r => r.type === 'book').length },
    { id: 'audios', label: 'Audios', icon: Headphones, count: resources.filter(r => r.type === 'audio').length },
    { id: 'stories', label: 'Stories', icon: Heart, count: resources.filter(r => r.type === 'story').length }
  ] as const;

  // Load bookmarks on component mount
  useEffect(() => {
    loadBookmarks();
    
    // Listen for the openResourceForm event
    const handleOpenForm = () => {
      setShowAddResourceForm(true);
    };
    window.addEventListener('openResourceForm', handleOpenForm);
    
    return () => {
      window.removeEventListener('openResourceForm', handleOpenForm);
    };
  }, []);

  // Load bookmarks from Supabase or localStorage
  const loadBookmarks = async () => {
    setIsLoading(true);
    
    try {
      // Test database connection
      const connected = await testBookmarkDatabaseConnection();
      setDbConnected(connected);
      
      if (connected) {
        // Try to sync any local bookmarks to Supabase
        await syncLocalBookmarksToSupabase();
      }
      
      // Fetch bookmarks
      const bookmarks = await fetchUserBookmarks();
      setBookmarkedResources(new Set(bookmarks));
      
      // Update resources with bookmark status
      setResources(prevResources => 
        prevResources.map(resource => ({
          ...resource,
          isBookmarked: bookmarks.includes(resource.id)
        }))
      );
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bookmark toggling
  const handleToggleBookmark = async (id: string) => {
    try {
      // Toggle in Supabase/localStorage
      const isBookmarked = await toggleBookmark(id);
      
      // Update local state
      setBookmarkedResources(prev => {
        const newSet = new Set(prev);
        if (isBookmarked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
      
      // Update resources
      setResources(prevResources => 
        prevResources.map(resource => 
          resource.id === id 
            ? { ...resource, isBookmarked } 
            : resource
        )
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Add a new resource
  const handleAddResource = () => {
    if (!newResource.title || !newResource.author || !newResource.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    const id = `resource_${Date.now()}`;
    const resource: Resource = {
      id,
      title: newResource.title || '',
      author: newResource.author || '',
      description: newResource.description || '',
      type: newResource.type as 'book' | 'audio' | 'story',
      category: newResource.category as any,
      rating: newResource.rating || 4.5,
      duration: newResource.duration,
      url: newResource.url,
      featured: newResource.featured || false,
      isBookmarked: false
    };
    
    setResources(prev => [...prev, resource]);
    setShowAddResourceForm(false);
    setNewResource({
      type: 'book',
      category: 'mindfulness',
      rating: 4.5,
      featured: false
    });
  };

  const filteredResources = resources.filter(resource => {
    const matchesTab = resource.type === selectedTab;
    const matchesMood = selectedMood === 'all' || resource.category === selectedMood;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesMood && matchesSearch;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Resource Library
        </h1>
        <p className="text-therapy-gray-600 mb-6">
          Curated mental health resources to support your journey
          {!dbConnected && (
            <span className="ml-2 text-amber-600 text-sm">(Local storage mode)</span>
          )}
        </p>
      </div>

      {/* Mood Filter */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105
                ${selectedMood === mood.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-gentle' 
                  : 'bg-therapeutic-pearl hover:bg-white text-therapy-gray-600 border border-emerald-200'
                }
              `}
            >
              {mood.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-therapeutic-pearl backdrop-blur-sm text-black"
            />
          </div>
          <button
            onClick={() => setShowAddResourceForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Plus size={16} />
            Add Resource
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-therapy-gray-200">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200
                ${selectedTab === tab.id 
                  ? 'text-emerald-600 border-b-2 border-emerald-600' 
                  : 'text-therapy-gray-600 hover:text-emerald-600'
                }
              `}
            >
              <IconComponent size={18} />
              {tab.label}
              <span className="bg-therapy-gray-100 text-therapy-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookmarks Stats */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <BookmarkCheck size={20} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-medium text-emerald-700">Your Bookmarks</div>
              <div className="text-sm text-emerald-600">
                {bookmarkedResources.size} resources saved
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-emerald-600">
              {bookmarkedResources.size} of {resources.length} resources
            </span>
            <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${(bookmarkedResources.size / resources.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-therapy-gray-700 flex items-center gap-2">
            <Star size={20} className="text-yellow-500" />
            Featured {selectedTab}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map(resource => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                featured 
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-therapy-gray-700">
          All {selectedTab}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto mb-4 text-therapy-gray-400" />
          <h3 className="text-xl font-semibold text-therapy-gray-600 mb-2">No resources found</h3>
          <p className="text-therapy-gray-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-therapy-gray-700">Add New Resource</h3>
              <button
                onClick={() => setShowAddResourceForm(false)}
                className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    value={newResource.title || ''}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                    placeholder="Resource title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    Author*
                  </label>
                  <input
                    type="text"
                    value={newResource.author || ''}
                    onChange={(e) => setNewResource({...newResource, author: e.target.value})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                    placeholder="Author name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  value={newResource.description || ''}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none text-black"
                  placeholder="Brief description"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newResource.type || 'book'}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                  >
                    <option value="book">Book</option>
                    <option value="audio">Audio</option>
                    <option value="story">Story</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newResource.category || 'mindfulness'}
                    onChange={(e) => setNewResource({...newResource, category: e.target.value as any})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                  >
                    <option value="anxiety">Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="stress">Stress</option>
                    <option value="sleep">Sleep</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="relationships">Relationships</option>
                    <option value="growth">Personal Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={newResource.rating || 4.5}
                    onChange={(e) => setNewResource({...newResource, rating: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    Duration/Length
                  </label>
                  <input
                    type="text"
                    value={newResource.duration || ''}
                    onChange={(e) => setNewResource({...newResource, duration: e.target.value})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                    placeholder="e.g., 10 minutes, 5-6 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-therapy-gray-700 mb-1">
                    URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newResource.url || ''}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-black"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newResource.featured || false}
                  onChange={(e) => setNewResource({...newResource, featured: e.target.checked})}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-therapy-gray-700">
                  Featured resource
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddResourceForm(false)}
                  className="flex-1 px-6 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResource}
                  disabled={!newResource.title || !newResource.author || !newResource.description}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
  onToggleBookmark: (id: string) => void;
}

function ResourceCard({ resource, featured = false, onToggleBookmark }: ResourceCardProps) {
  const getTypeIcon = () => {
    switch (resource.type) {
      case 'book': return BookOpen;
      case 'audio': return Headphones;
      case 'story': return Heart;
      default: return BookOpen;
    }
  };

  const IconComponent = getTypeIcon();

  return (
    <div className={`
      p-6 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer
      ${featured 
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-gentle' 
        : 'bg-therapeutic-pearl border-therapy-gray-200 hover:shadow-gentle'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`
            w-8 h-8 rounded-xl flex items-center justify-center
            ${resource.type === 'book' ? 'bg-blue-100 text-blue-600' :
              resource.type === 'audio' ? 'bg-green-100 text-green-600' :
              'bg-pink-100 text-pink-600'
            }
          `}>
            <IconComponent size={16} />
          </div>
          {featured && (
            <Star size={16} className="text-yellow-500 fill-current" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-therapy-gray-700">{resource.rating}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(resource.id);
            }}
            className={`
              text-therapy-gray-400 hover:text-emerald-500 transition-colors
              ${resource.isBookmarked ? 'text-emerald-500' : ''}
            `}
            title={resource.isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
          >
            {resource.isBookmarked ? (
              <BookmarkCheck size={18} className="fill-emerald-500 text-emerald-500" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-therapy-gray-700 mb-2 line-clamp-2">
        {resource.title}
      </h3>
      
      <div className="flex items-center gap-1 mb-3">
        <User size={14} className="text-therapy-gray-400" />
        <span className="text-sm text-therapy-gray-600">{resource.author}</span>
      </div>

      <p className="text-therapy-gray-600 leading-relaxed mb-4 line-clamp-3">
        {resource.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-therapy-gray-500">
          <Clock size={14} />
          {resource.duration}
        </div>
        {resource.url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(resource.url, '_blank');
            }}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="text-sm font-medium">View</span>
          </button>
        )}
      </div>
    </div>
  );
}