import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Globe, 
  Download, 
  Save, 
  X, 
  BookmarkCheck, 
  MessageCircle, 
  AlertTriangle,
  HelpCircle,
  FileText,
  Bell,
  BellOff,
  Check,
  Info
} from 'lucide-react';
import { authService, UserProfile } from '../utils/authService';
import { supabase } from '../utils/supabaseClient';
import { fetchUserBookmarks } from '../utils/bookmarkService';
import { getRecentMoodLogs } from '../utils/supabaseClient';

interface AccountSectionProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export default function AccountSection({ onClose, onNavigate }: AccountSectionProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'support' | 'settings'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('english');
  const [appVersion, setAppVersion] = useState('2.0.1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    
    // Load theme preference
    const savedTheme = localStorage.getItem('bloom_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    
    // Load notification preference
    const savedNotifications = localStorage.getItem('bloom_notifications');
    if (savedNotifications === 'disabled') {
      setNotificationsEnabled(false);
    }
    
    // Load language preference
    const savedLanguage = localStorage.getItem('bloom_language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
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
        
        // Load bookmarks count
        const bookmarkIds = await fetchUserBookmarks();
        setBookmarksCount(bookmarkIds.length);
        
        // Load sessions count
        const logs = await getRecentMoodLogs(100);
        setSessionsCount(logs.length);
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
    setSaveSuccess(false);
    
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
        setSaveSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
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
      onClose();
      onNavigate('home');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  const handleToggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('bloom_theme', newTheme);
    // In a real implementation, this would apply the theme to the app
  };

  const handleToggleNotifications = () => {
    const newSetting = notificationsEnabled ? 'disabled' : 'enabled';
    setNotificationsEnabled(!notificationsEnabled);
    localStorage.setItem('bloom_notifications', newSetting);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    localStorage.setItem('bloom_language', e.target.value);
  };

  const handleExportData = () => {
    // In a real implementation, this would fetch all user data and create a downloadable file
    const dummyData = {
      profile: profile,
      bookmarks: bookmarksCount,
      sessions: sessionsCount,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dummyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bloom-user-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmergencyCall = () => {
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      window.location.href = 'tel:911';
    } else {
      alert('For immediate emergency assistance, please call 911 or your local emergency number.');
    }
  };

  const handleCrisisLine = () => {
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      window.location.href = 'tel:988';
    } else {
      alert('Crisis Lifeline: Call or text 988\n\nThis will connect you with trained crisis counselors who can provide immediate support.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-therapy-gray-700">Account</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-soft-blue-200 border-t-soft-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-therapy-gray-600">Loading account information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-therapy-gray-700">Account</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-therapy-gray-700 mb-2">Authentication Error</h3>
            <p className="text-therapy-gray-600 mb-6">
              {error || 'You need to be signed in to access your account'}
            </p>
            <button
              onClick={() => {
                onClose();
                onNavigate('signin');
              }}
              className="px-6 py-3 bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-therapy-gray-700">Account</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-therapy-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200
              ${activeTab === 'profile' 
                ? 'text-soft-blue-600 border-b-2 border-soft-blue-600' 
                : 'text-therapy-gray-600 hover:text-soft-blue-600'
              }
            `}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200
              ${activeTab === 'support' 
                ? 'text-soft-blue-600 border-b-2 border-soft-blue-600' 
                : 'text-therapy-gray-600 hover:text-soft-blue-600'
              }
            `}
          >
            <HelpCircle size={18} />
            Support
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200
              ${activeTab === 'settings' 
                ? 'text-soft-blue-600 border-b-2 border-soft-blue-600' 
                : 'text-therapy-gray-600 hover:text-soft-blue-600'
              }
            `}
          >
            <Settings size={18} />
            Settings
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 rounded-2xl p-6 border border-soft-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || 'User'} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {editMode ? (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-therapy-gray-700 mb-2">
                          Display Name
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="flex-1 px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 text-black"
                            placeholder="Your display name"
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
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-therapy-gray-700">
                          {profile.full_name || 'User'}
                        </h3>
                        <button
                          onClick={() => setEditMode(true)}
                          className="p-2 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600 rounded-xl transition-colors"
                          title="Edit profile"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    )}
                    
                    <div className="text-therapy-gray-600">
                      {profile.email}
                    </div>
                    
                    {saveSuccess && (
                      <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                        <Check size={16} />
                        Profile updated successfully
                      </div>
                    )}
                  </div>
                </div>
                
                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 p-4 rounded-xl border border-soft-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-blue-100 rounded-xl flex items-center justify-center">
                        <BookmarkCheck size={20} className="text-soft-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-soft-blue-600">{bookmarksCount}</div>
                        <div className="text-sm text-therapy-gray-600">Bookmarks Saved</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 p-4 rounded-xl border border-soft-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-blue-100 rounded-xl flex items-center justify-center">
                        <MessageCircle size={20} className="text-soft-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-soft-blue-600">{sessionsCount}</div>
                        <div className="text-sm text-therapy-gray-600">Mood Sessions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="bg-white p-4 rounded-xl border border-therapy-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-therapy-gray-600">
                    <Info size={16} />
                    <span>Member since</span>
                  </div>
                  <div className="text-therapy-gray-700 font-medium">
                    {new Date(profile.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
              </div>
              
              {/* Legal Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-therapy-gray-700">Legal</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/privacy-policy', '_blank')}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-therapy-gray-50 rounded-xl border border-therapy-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-therapy-gray-500" />
                      <span className="text-therapy-gray-700">Privacy Policy</span>
                    </div>
                    <span className="text-therapy-gray-400 text-sm">View</span>
                  </button>
                  
                  <button
                    onClick={() => window.open('/terms-of-service', '_blank')}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-therapy-gray-50 rounded-xl border border-therapy-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-therapy-gray-500" />
                      <span className="text-therapy-gray-700">Terms of Service</span>
                    </div>
                    <span className="text-therapy-gray-400 text-sm">View</span>
                  </button>
                </div>
              </div>
              
              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-all duration-200"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
          
          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 rounded-2xl p-6 border border-soft-blue-200">
                <h3 className="text-lg font-semibold text-therapy-gray-700 mb-4">Contact Support</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-soft-blue-100 rounded-xl flex items-center justify-center">
                      <Mail size={20} className="text-soft-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-therapy-gray-600">Email Support</div>
                      <a 
                        href="mailto:support@bloom.ai" 
                        className="text-soft-blue-600 hover:text-soft-blue-700 font-medium"
                      >
                        support@bloom.ai
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-soft-blue-100 rounded-xl flex items-center justify-center">
                      <HelpCircle size={20} className="text-soft-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-therapy-gray-600">Help Center</div>
                      <button
                        onClick={() => onNavigate('support')}
                        className="text-soft-blue-600 hover:text-soft-blue-700 font-medium"
                      >
                        Visit Help Center
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Report an Issue */}
              <div className="bg-white rounded-2xl p-6 border border-therapy-gray-200">
                <h3 className="text-lg font-semibold text-therapy-gray-700 mb-4">Report an Issue</h3>
                <p className="text-therapy-gray-600 mb-4">
                  Found a bug or having technical difficulties? Let us know and we'll fix it as soon as possible.
                </p>
                <button
                  onClick={() => window.open('mailto:bugs@bloom.ai?subject=Bug%20Report&body=Please%20describe%20the%20issue%20you%27re%20experiencing%3A%0A%0A', '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200"
                >
                  Report a Bug
                </button>
              </div>
              
              {/* Crisis Support */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Crisis Support
                </h3>
                <p className="text-red-700 mb-4">
                  If you're experiencing a mental health emergency, please reach out for immediate help:
                </p>
                <div className="space-y-3 mb-4">
                  <button
                    onClick={handleEmergencyCall}
                    className="w-full flex items-center gap-3 p-3 bg-white hover:bg-red-50 rounded-xl border border-red-200 transition-all duration-200"
                  >
                    <Phone size={18} className="text-red-600" />
                    <div className="text-left">
                      <div className="font-medium text-red-700">Emergency Services</div>
                      <div className="text-sm text-red-600">Call 911 (US) or local emergency</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleCrisisLine}
                    className="w-full flex items-center gap-3 p-3 bg-white hover:bg-blue-50 rounded-xl border border-blue-200 transition-all duration-200"
                  >
                    <Phone size={18} className="text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-blue-700">Crisis Lifeline</div>
                      <div className="text-sm text-blue-600">Call or text 988 (US)</div>
                    </div>
                  </button>
                </div>
                <p className="text-sm text-red-600">
                  Remember: You're not alone, and help is available 24/7.
                </p>
              </div>
              
              {/* FAQ Link */}
              <button
                onClick={() => onNavigate('support')}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-therapy-gray-50 rounded-xl border border-therapy-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-therapy-gray-500" />
                  <span className="text-therapy-gray-700">Frequently Asked Questions</span>
                </div>
                <span className="text-therapy-gray-400 text-sm">View All</span>
              </button>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="bg-white rounded-2xl p-6 border border-therapy-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      {isDarkMode ? (
                        <Moon size={20} className="text-indigo-600" />
                      ) : (
                        <Sun size={20} className="text-amber-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-therapy-gray-700">App Theme</div>
                      <div className="text-sm text-therapy-gray-500">
                        {isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleTheme}
                    className={`
                      relative w-14 h-8 rounded-full transition-all duration-300 ease-out
                      ${isDarkMode 
                        ? 'bg-indigo-500' 
                        : 'bg-therapy-gray-300'
                      }
                    `}
                  >
                    <div className={`
                      absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ease-out
                      ${isDarkMode ? 'left-7' : 'left-1'}
                    `} />
                  </button>
                </div>
              </div>
              
              {/* Notifications Toggle */}
              <div className="bg-white rounded-2xl p-6 border border-therapy-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                      {notificationsEnabled ? (
                        <Bell size={20} className="text-blue-600" />
                      ) : (
                        <BellOff size={20} className="text-therapy-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-therapy-gray-700">Notifications</div>
                      <div className="text-sm text-therapy-gray-500">
                        {notificationsEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleNotifications}
                    className={`
                      relative w-14 h-8 rounded-full transition-all duration-300 ease-out
                      ${notificationsEnabled 
                        ? 'bg-blue-500' 
                        : 'bg-therapy-gray-300'
                      }
                    `}
                  >
                    <div className={`
                      absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ease-out
                      ${notificationsEnabled ? 'left-7' : 'left-1'}
                    `} />
                  </button>
                </div>
              </div>
              
              {/* Language Selection */}
              <div className="bg-white rounded-2xl p-6 border border-therapy-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Globe size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium text-therapy-gray-700">Language</div>
                    <div className="text-sm text-therapy-gray-500">
                      Select your preferred language
                    </div>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full px-4 py-2 border border-therapy-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 text-black"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
              
              {/* Export Data */}
              <div className="bg-white rounded-2xl p-6 border border-therapy-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center">
                    <Download size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-therapy-gray-700">Export Your Data</div>
                    <div className="text-sm text-therapy-gray-500">
                      Download a copy of your data
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200"
                >
                  <Download size={18} />
                  Export Data
                </button>
              </div>
              
              {/* App Version */}
              <div className="bg-white rounded-2xl p-4 border border-therapy-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-therapy-gray-600">
                    <Info size={16} />
                    <span>App Version</span>
                  </div>
                  <div className="text-therapy-gray-700 font-medium">
                    {appVersion}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}