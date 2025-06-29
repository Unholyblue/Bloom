import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  BookmarkCheck, 
  MessageCircle, 
  Lightbulb, 
  Edit3, 
  Save, 
  LogOut, 
  Calendar, 
  Clock, 
  Heart, 
  Brain, 
  Bookmark, 
  Pencil,
  CheckCircle,
  X
} from 'lucide-react';
import { authService, UserProfile } from '../utils/authService';
import { fetchUserBookmarks } from '../utils/bookmarkService';
import { getRecentMoodLogs } from '../utils/supabaseClient';
import { supabase } from '../utils/supabaseClient';

interface UserProfilePageProps {
  onBackToWelcome: () => void;
}

export default function UserProfilePage({ onBackToWelcome }: UserProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'mood-logs' | 'insights'>('bookmarks');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current auth state
      const authState = authService.getAuthState();
      
      if (authState.user && authState.profile) {
        setProfile(authState.profile);
        setEditedName(authState.profile.full_name || '');
        
        // Load bookmarks
        const bookmarkIds = await fetchUserBookmarks();
        
        // In a real implementation, we would fetch the actual resources
        // For now, we'll just show the IDs
        setBookmarks(bookmarkIds.map(id => ({ id })));
        
        // Load mood logs
        const logs = await getRecentMoodLogs(10);
        setMoodLogs(logs);
        
        // Load user's community insights
        const { data: userInsights, error: insightsError } = await supabase
          .from('community_insights')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (insightsError) {
          console.error('Error fetching user insights:', insightsError);
        } else {
          setInsights(userInsights || []);
        }
      } else {
        setError('User not authenticated');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSavingProfile(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          full_name: editedName,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } else {
        // Update local profile state
        setProfile(prev => prev ? { ...prev, full_name: editedName } : null);
        setEditMode(false);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      onBackToWelcome();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-therapeutic-gradient">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-soft-blue-200 border-t-soft-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-therapy-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-therapeutic-gradient">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-gentle">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-therapy-gray-700 mb-2">Authentication Error</h2>
          <p className="text-therapy-gray-600 mb-4">
            {error || 'You need to be signed in to view your profile'}
          </p>
          <button
            onClick={onBackToWelcome}
            className="px-6 py-3 bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-therapeutic-gradient">
      {/* Header */}
      <div className="border-b border-soft-blue-200/50 p-6 bg-therapeutic-pearl backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToWelcome}
                className="p-2 rounded-xl bg-soft-blue-100 hover:bg-soft-blue-200 text-soft-blue-600 transition-all duration-200 hover:scale-105"
                title="Back to welcome"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-light bg-gradient-to-r from-soft-blue-600 to-muted-teal-600 bg-clip-text text-transparent">
                  Your Profile
                </h1>
                <p className="text-therapy-gray-600 mt-1">
                  Manage your account and view your activity
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-therapy-gray-50 border border-therapy-gray-300 hover:border-therapy-gray-400 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-gentle overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 p-6">
                  <div className="flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-gentle">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.full_name || 'User'} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={40} className="text-soft-blue-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {editMode ? (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-therapy-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="flex-1 px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 text-black"
                        />
                        <button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="p-2 bg-soft-blue-100 hover:bg-soft-blue-200 text-soft-blue-600 rounded-xl transition-colors"
                        >
                          {savingProfile ? (
                            <div className="w-5 h-5 border-2 border-soft-blue-300 border-t-soft-blue-600 rounded-full animate-spin"></div>
                          ) : (
                            <Save size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setEditedName(profile.full_name || '');
                          }}
                          className="p-2 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600 rounded-xl transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-therapy-gray-700">
                        {profile.full_name || 'User'}
                      </h2>
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-2 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600 rounded-xl transition-colors"
                        title="Edit profile"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-therapy-gray-500 mb-1">Email</div>
                      <div className="text-therapy-gray-700">{profile.email}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-therapy-gray-500 mb-1">Member Since</div>
                      <div className="text-therapy-gray-700">{formatDate(profile.created_at)}</div>
                    </div>
                    
                    <div className="pt-4 border-t border-therapy-gray-200">
                      <div className="text-sm text-therapy-gray-500 mb-2">Account Status</div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity Stats */}
              <div className="bg-white rounded-2xl shadow-gentle p-6">
                <h3 className="text-lg font-semibold text-therapy-gray-700 mb-4">Activity Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-blue-100 rounded-xl flex items-center justify-center">
                        <MessageCircle size={20} className="text-soft-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-therapy-gray-500">Conversations</div>
                        <div className="font-medium text-therapy-gray-700">{moodLogs.length}</div>
                      </div>
                    </div>
                    <div className="text-xs text-therapy-gray-500">
                      {moodLogs.length > 0 ? `Last active ${formatDate(moodLogs[0].created_at)}` : 'No activity yet'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Lightbulb size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-therapy-gray-500">Insights Shared</div>
                        <div className="font-medium text-therapy-gray-700">{insights.length}</div>
                      </div>
                    </div>
                    <div className="text-xs text-therapy-gray-500">
                      {insights.length > 0 ? `Last shared ${formatDate(insights[0].created_at)}` : 'No insights yet'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted-teal-100 rounded-xl flex items-center justify-center">
                        <BookmarkCheck size={20} className="text-muted-teal-600" />
                      </div>
                      <div>
                        <div className="text-sm text-therapy-gray-500">Bookmarks</div>
                        <div className="font-medium text-therapy-gray-700">{bookmarks.length}</div>
                      </div>
                    </div>
                    <div className="text-xs text-therapy-gray-500">
                      {bookmarks.length > 0 ? 'Resources saved' : 'No bookmarks yet'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Activity Tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-gentle overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-therapy-gray-200">
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`
                      flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200
                      ${activeTab === 'bookmarks' 
                        ? 'text-soft-blue-600 border-b-2 border-soft-blue-600' 
                        : 'text-therapy-gray-600 hover:text-soft-blue-600'
                      }
                    `}
                  >
                    <Bookmark size={18} />
                    Bookmarks
                  </button>
                  <button
                    onClick={() => setActiveTab('mood-logs')}
                    className={`
                      flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200
                      ${activeTab === 'mood-logs' 
                        ? 'text-soft-blue-600 border-b-2 border-soft-blue-600' 
                        : 'text-therapy-gray-600 hover:text-soft-blue-600'
                      }
                    `}
                  >
                    <Brain size={18} />
                    Mood Logs
                  </button>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`
                      flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200
                      ${activeTab === 'insights' 
                        ? 'text-soft-blue-600 border-b-2 border-soft-blue-600' 
                        : 'text-therapy-gray-600 hover:text-soft-blue-600'
                      }
                    `}
                  >
                    <Lightbulb size={18} />
                    Insights
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="p-6">
                  {/* Bookmarks Tab */}
                  {activeTab === 'bookmarks' && (
                    <div>
                      <h3 className="text-lg font-semibold text-therapy-gray-700 mb-4 flex items-center gap-2">
                        <BookmarkCheck size={20} className="text-soft-blue-600" />
                        Your Bookmarks
                      </h3>
                      
                      {bookmarks.length === 0 ? (
                        <div className="text-center py-8 bg-therapy-gray-50 rounded-xl">
                          <Bookmark size={32} className="mx-auto mb-3 text-therapy-gray-400" />
                          <p className="text-therapy-gray-600 mb-2">No bookmarks yet</p>
                          <p className="text-sm text-therapy-gray-500">
                            Save resources and insights for easy access later
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookmarks.map((bookmark, index) => (
                            <div key={index} className="p-4 bg-therapy-gray-50 rounded-xl border border-therapy-gray-200 hover:border-soft-blue-300 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <BookmarkCheck size={18} className="text-soft-blue-600" />
                                  <span className="text-therapy-gray-700 font-medium">
                                    Bookmarked Resource
                                  </span>
                                </div>
                                <span className="text-xs text-therapy-gray-500">
                                  ID: {bookmark.id.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Mood Logs Tab */}
                  {activeTab === 'mood-logs' && (
                    <div>
                      <h3 className="text-lg font-semibold text-therapy-gray-700 mb-4 flex items-center gap-2">
                        <Brain size={20} className="text-soft-blue-600" />
                        Your Mood Logs
                      </h3>
                      
                      {moodLogs.length === 0 ? (
                        <div className="text-center py-8 bg-therapy-gray-50 rounded-xl">
                          <MessageCircle size={32} className="mx-auto mb-3 text-therapy-gray-400" />
                          <p className="text-therapy-gray-600 mb-2">No mood logs yet</p>
                          <p className="text-sm text-therapy-gray-500">
                            Start a conversation to track your emotional journey
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {moodLogs.map((log, index) => (
                            <div key={index} className="p-4 bg-therapy-gray-50 rounded-xl border border-therapy-gray-200">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Heart size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-therapy-gray-700">
                                      {log.is_followup ? 'Follow-up Reflection' : 'Initial Feeling'}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs bg-soft-blue-100 text-soft-blue-600 px-2 py-0.5 rounded-full">
                                        Depth {log.reflection_depth || 1}
                                      </span>
                                      <span className="text-xs text-therapy-gray-500">
                                        {formatDate(log.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-therapy-gray-600 line-clamp-2">
                                    {log.feeling}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Insights Tab */}
                  {activeTab === 'insights' && (
                    <div>
                      <h3 className="text-lg font-semibold text-therapy-gray-700 mb-4 flex items-center gap-2">
                        <Lightbulb size={20} className="text-soft-blue-600" />
                        Your Shared Insights
                      </h3>
                      
                      {insights.length === 0 ? (
                        <div className="text-center py-8 bg-therapy-gray-50 rounded-xl">
                          <Lightbulb size={32} className="mx-auto mb-3 text-therapy-gray-400" />
                          <p className="text-therapy-gray-600 mb-2">No insights shared yet</p>
                          <p className="text-sm text-therapy-gray-500">
                            Share your wisdom with the community
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {insights.map((insight, index) => (
                            <div key={index} className="p-4 bg-therapy-gray-50 rounded-xl border border-therapy-gray-200">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Lightbulb size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-therapy-gray-700">
                                      Community Insight
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {insight.mood_tag && (
                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                          {insight.mood_tag}
                                        </span>
                                      )}
                                      <span className="text-xs text-therapy-gray-500">
                                        {formatDate(insight.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-therapy-gray-600">
                                    {insight.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}