import React, { useState, useEffect, useRef } from 'react';
import { Flower2, Plus, Menu, X, MessageCircle, ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon, Lightbulb, BookOpen, Heart, Bookmark, HelpCircle, UserCircle } from 'lucide-react';
import ChatSidebar from './components/ChatSidebar';
import EnhancedChatInterface from './components/EnhancedChatInterface';
import WelcomeMessage from './components/WelcomeMessage';
import InteractiveBackground from './components/InteractiveBackground';
import VibrantWelcomeScreen from './components/VibrantWelcomeScreen';
import AuthenticatedWelcomeScreen from './components/AuthenticatedWelcomeScreen';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import InsightsPage from './components/InsightsPage';
import SourcesPage from './components/SourcesPage';
import BookmarksPage from './components/BookmarksPage';
import SupportPage from './components/SupportPage';
import UserProfilePage from './components/UserProfilePage';
import PersonalizationPanel from './components/PersonalizationPanel';
import ModalOverlay from './components/ModalOverlay';
import ConfirmationDialog from './components/ConfirmationDialog';
import { SlidingTabMenu } from './components/SlidingTabMenu';
import AccountSection from './components/AccountSection';
import { ConversationEntry } from './components/ConversationHistory';
import { sessionAnalytics } from './utils/sessionAnalytics';
import { voiceService } from './utils/voiceService';
import { authService, AuthState } from './utils/authService';

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
  lastMessage: string;
  conversation: ConversationEntry[];
  originalFeeling: string;
  reflectionDepth: number;
  isActive: boolean;
}

type AppView = 'welcome' | 'chat' | 'insights' | 'sources' | 'bookmarks' | 'support' | 'profile';

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [showAccountSection, setShowAccountSection] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
      
      // If user just signed in, close auth modal
      if (state.user && showAuthModal) {
        setShowAuthModal(false);
      }
    });

    return unsubscribe;
  }, [showAuthModal]);

  // Listen for navigation events from welcome screen buttons
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { page } = event.detail;
      if (page === 'insights') {
        handleInsightsClick();
      } else if (page === 'sources') {
        handleSourcesClick();
      } else if (page === 'bookmarks') {
        handleBookmarksClick();
      } else if (page === 'support') {
        handleSupportClick();
      } else if (page === 'chat') {
        createNewSession();
      } else if (page === 'profile') {
        handleProfileClick();
      } else if (page === 'account') {
        setShowAccountSection(true);
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  // Listen for settings modal events
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowSettings(true);
    };

    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key to close modals
      if (event.key === 'Escape') {
        if (showConfirmDialog) {
          setShowConfirmDialog(false);
          setConfirmDialogConfig(null);
        } else if (showSettings) {
          setShowSettings(false);
        } else if (showAuthModal) {
          setShowAuthModal(false);
        } else if (showAccountSection) {
          setShowAccountSection(false);
        } else if (isPanelOpen) {
          setIsPanelOpen(false);
        }
      }
      
      // Ctrl/Cmd + N for new conversation
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        createNewSession();
      }
      
      // Ctrl/Cmd + / to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        setIsPanelOpen(!isPanelOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmDialog, showSettings, showAuthModal, showAccountSection, isPanelOpen]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when resizing to desktop
      if (!mobile && isPanelOpen) {
        setIsPanelOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPanelOpen]);

  // Check if user is new (first time visiting) - only for non-authenticated users
  useEffect(() => {
    if (!authState.loading && !authState.user) {
      const hasVisited = localStorage.getItem('bloom_has_visited');
      if (!hasVisited) {
        setShowWelcome(true);
        localStorage.setItem('bloom_has_visited', 'true');
      }
    }
    
    // Load user preferences
    const savedPrefs = localStorage.getItem('bloom_preferences');
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }

    // Load auto-play voice preference
    const savedAutoPlayVoice = localStorage.getItem('bloom_auto_play_voice');
    if (savedAutoPlayVoice) {
      setAutoPlayVoice(savedAutoPlayVoice === 'true');
    }

    // Load saved sessions
    loadSessions();
  }, [authState.loading, authState.user]);

  const loadSessions = () => {
    try {
      const savedSessions = localStorage.getItem('bloom_chat_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          date: new Date(session.date),
          conversation: session.conversation.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const saveSessions = (updatedSessions: ChatSession[]) => {
    try {
      localStorage.setItem('bloom_chat_sessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const createNewSession = () => {
    // Check if user is authenticated before creating a new session
    if (!authState.user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Creating new conversation...');

    // Simulate loading for better UX
    setTimeout(() => {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newSession: ChatSession = {
        id: newSessionId,
        title: 'New conversation',
        date: new Date(),
        lastMessage: '',
        conversation: [],
        originalFeeling: '',
        reflectionDepth: 1,
        isActive: true
      };

      // Mark all other sessions as inactive
      const updatedSessions = sessions.map(session => ({ ...session, isActive: false }));
      updatedSessions.unshift(newSession);
      
      setSessions(updatedSessions);
      setCurrentSessionId(newSessionId);
      setCurrentView('chat');
      saveSessions(updatedSessions);

      // Mark first conversation created if this is their first and they're authenticated
      if (authState.profile && !authState.profile.has_created_conversation) {
        authService.markFirstConversationCreated();
      }
      
      setIsLoading(false);
      setLoadingMessage('');
    }, 800);
  };

  const selectSession = (sessionId: string) => {
    setIsLoading(true);
    setLoadingMessage('Loading conversation...');

    // Simulate loading for better UX
    setTimeout(() => {
      const updatedSessions = sessions.map(session => ({
        ...session,
        isActive: session.id === sessionId
      }));
      setSessions(updatedSessions);
      setCurrentSessionId(sessionId);
      setCurrentView('chat');
      saveSessions(updatedSessions);
      setIsLoading(false);
      setLoadingMessage('');
    }, 400);
  };

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    );
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
  };

  const deleteSession = (sessionId: string) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    setConfirmDialogConfig({
      title: 'Delete Conversation',
      message: `Are you sure you want to delete "${sessionToDelete.title}"? This action cannot be undone and all conversation history will be permanently lost.`,
      confirmText: 'Delete Conversation',
      variant: 'danger',
      onConfirm: () => {
        const updatedSessions = sessions.filter(session => session.id !== sessionId);
        setSessions(updatedSessions);
        saveSessions(updatedSessions);
        
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
          setCurrentView('welcome');
        }
        
        setShowConfirmDialog(false);
        setConfirmDialogConfig(null);
      }
    });
    setShowConfirmDialog(true);
  };

  const getCurrentSession = (): ChatSession | null => {
    return sessions.find(session => session.id === currentSessionId) || null;
  };

  const getPersonalizedGreeting = () => {
    if (authState.profile?.full_name) {
      const firstName = authState.profile.full_name.split(' ')[0];
      return `How are you feeling today, ${firstName}?`;
    }
    if (userPreferences?.nickname) {
      return `How are you feeling today, ${userPreferences.nickname}?`;
    }
    return "How are you feeling today?";
  };

  const handleInsightsClick = () => {
    setCurrentView('insights');
    setCurrentSessionId(null);
  };

  const handleSourcesClick = () => {
    setCurrentView('sources');
    setCurrentSessionId(null);
  };

  const handleBookmarksClick = () => {
    setCurrentView('bookmarks');
    setCurrentSessionId(null);
  };

  const handleSupportClick = () => {
    setCurrentView('support');
    setCurrentSessionId(null);
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
    setCurrentSessionId(null);
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setCurrentSessionId(null);
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home':
        handleBackToWelcome();
        break;
      case 'session':
        createNewSession();
        break;
      case 'insights':
        handleInsightsClick();
        break;
      case 'resources':
        handleSourcesClick();
        break;
      case 'profile':
        handleProfileClick();
        break;
      case 'support':
        handleSupportClick();
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'signin':
        setShowAuthModal(true);
        break;
      case 'account':
        setShowAccountSection(true);
        break;
      default:
        handleBackToWelcome();
    }
  };

  // Show loading state while auth is initializing
  if (authState.loading) {
    return (
      <InteractiveBackground>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-soft-blue-200 border-t-soft-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-therapy-gray-600">Loading Bloom...</p>
          </div>
        </div>
      </InteractiveBackground>
    );
  }

  // Render the sidebar content
  const renderSidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/20 flex-shrink-0 mt-8">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Flower2 className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-medium text-white truncate">
            Bloom
          </h1>
        </div>
        
        {/* New Conversation Button */}
        <button
          onClick={createNewSession}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 ease-out hover:scale-105 mb-6 shadow-gentle hover:shadow-calm disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Start a new conversation"
        >
          <Plus size={18} className="flex-shrink-0" />
          <span className="truncate">
            {isLoading ? 'Creating...' : 'New conversation'}
          </span>
        </button>

        {/* Main Navigation Items */}
        <nav role="navigation" aria-label="Main navigation">
          <div className="space-y-2">
            {/* Conversations Header */}
            <button
              onClick={() => setConversationsOpen(!conversationsOpen)}
              className="w-full flex items-center justify-between pl-0 pr-2 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-expanded={conversationsOpen}
              aria-controls="conversations-list"
              aria-label={`${conversationsOpen ? 'Hide' : 'Show'} conversations list`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MessageCircle size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium truncate">Conversations</span>
                {sessions.length > 0 && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                    {sessions.length}
                  </span>
                )}
              </div>
              {conversationsOpen ? (
                <ChevronDown size={16} className="transition-transform duration-200 flex-shrink-0" />
              ) : (
                <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
              )}
            </button>

            {/* Daily Insights */}
            <button
              onClick={handleInsightsClick}
              className={`
                w-full flex items-center justify-between pl-0 pr-2 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                ${currentView === 'insights' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
              aria-label="View daily insights from the community"
              aria-current={currentView === 'insights' ? 'page' : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Lightbulb size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium truncate">Daily Insights</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                  Community
                </span>
              </div>
              <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
            </button>

            {/* Sources */}
            <button
              onClick={handleSourcesClick}
              className={`
                w-full flex items-center justify-between pl-0 pr-2 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                ${currentView === 'sources' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
              aria-label="Browse mental health resources and sources"
              aria-current={currentView === 'sources' ? 'page' : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium truncate">Sources</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                  Library
                </span>
              </div>
              <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
            </button>

            {/* Bookmarks */}
            <button
              onClick={handleBookmarksClick}
              className={`
                w-full flex items-center justify-between pl-0 pr-2 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                ${currentView === 'bookmarks' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
              aria-label="View your saved bookmarks"
              aria-current={currentView === 'bookmarks' ? 'page' : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Bookmark size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium truncate">Bookmarks</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                  Saved
                </span>
              </div>
              <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
            </button>

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className={`
                w-full flex items-center justify-between pl-0 pr-2 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                ${currentView === 'profile' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
              aria-label="View and manage your profile"
              aria-current={currentView === 'profile' ? 'page' : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <UserCircle size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium truncate">Profile</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
                  Account
                </span>
              </div>
              <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
            </button>
          </div>
        </nav>
      </div>

      {/* Collapsible Chat Sessions List */}
      <div 
        id="conversations-list"
        className={`
          overflow-hidden transition-all duration-300 ease-out flex-1
          ${conversationsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
        aria-hidden={!conversationsOpen}
      >
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
        />
      </div>

      {/* Empty state when conversations are closed */}
      {!conversationsOpen && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="text-white/60 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle size={24} className="opacity-50" />
              <Heart size={20} className="opacity-30" />
              <Lightbulb size={24} className="opacity-50" />
              <BookOpen size={24} className="opacity-50" />
              <Bookmark size={20} className="opacity-40" />
            </div>
            <div>
              <p className="text-sm leading-tight mb-2">Explore conversations, insights & resources</p>
              <p className="text-xs opacity-75">Click sections above to get started</p>
            </div>
          </div>
        </div>
      )}

      {/* Support & Settings Section - Always at bottom */}
      <div className="border-t border-white/20 p-4 mt-auto space-y-2">
        {/* Support Button */}
        <button
          onClick={handleSupportClick}
          className={`
            w-full flex items-center justify-between pl-0 pr-2 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
            ${currentView === 'support' 
              ? 'bg-white/20 text-white' 
              : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          `}
          aria-label="Get help and support"
          aria-current={currentView === 'support' ? 'page' : undefined}
        >
          <div className="flex items-center gap-3 min-w-0">
            <HelpCircle size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium truncate">Support</span>
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
              Help
            </span>
          </div>
          <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center justify-between pl-0 pr-2 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Open settings and preferences"
        >
          <div className="flex items-center gap-3 min-w-0">
            <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium truncate">Settings</span>
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">
              Prefs
            </span>
          </div>
          <ChevronRight size={16} className="transition-transform duration-200 flex-shrink-0" />
        </button>
      </div>
    </>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <EnhancedChatInterface
            session={getCurrentSession()}
            onUpdateSession={updateSession}
            personalizedGreeting={getPersonalizedGreeting()}
            autoPlayVoice={autoPlayVoice}
          />
        );
      case 'insights':
        return (
          <InsightsPage onBackToWelcome={handleBackToWelcome} />
        );
      case 'sources':
        return (
          <SourcesPage onBackToWelcome={handleBackToWelcome} />
        );
      case 'bookmarks':
        return (
          <BookmarksPage onBackToWelcome={handleBackToWelcome} />
        );
      case 'support':
        return (
          <SupportPage onBackToWelcome={handleBackToWelcome} />
        );
      case 'profile':
        return (
          <UserProfilePage onBackToWelcome={handleBackToWelcome} />
        );
      default:
        // Show different welcome screens based on auth state
        if (authState.user && authState.profile) {
          return (
            <AuthenticatedWelcomeScreen 
              onStartConversation={createNewSession}
              profile={authState.profile}
            />
          );
        } else {
          return (
            <VibrantWelcomeScreen onStartConversation={createNewSession} />
          );
        }
    }
  };

  return (
    <InteractiveBackground>
      <div className="h-screen bg-transparent flex overflow-hidden relative">
        {/* Skip to content link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Welcome Message for New Users - only show for non-authenticated users */}
        {showWelcome && !authState.user && (
          <WelcomeMessage onClose={() => setShowWelcome(false)} />
        )}

        {/* Sign In Button - Top Right */}
        <div className="fixed top-6 right-6 z-30">
          {!authState.user && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm focus:outline-none focus:ring-2 focus:ring-soft-blue-300"
              aria-label="Sign in to your account"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-calm border border-soft-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-soft-blue-300 border-t-soft-blue-600 rounded-full animate-spin"></div>
                <span className="text-therapy-gray-700 font-medium">{loadingMessage}</span>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop for Sidebar Overlay */}
        {isPanelOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsPanelOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Overlay */}
        <aside 
          ref={sidebarRef}
          className={`
            fixed top-0 left-0 z-50 h-full w-80
            bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95
            backdrop-blur-xl shadow-xl
            flex flex-col
            transform transition-transform duration-300 ease-out
            ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Main navigation sidebar"
          aria-hidden={!isPanelOpen}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsPanelOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
          
          {renderSidebarContent()}
        </aside>

        {/* Panel Toggle Button */}
        <button
          onClick={togglePanel}
          className="fixed top-6 left-6 z-30 p-3 bg-white/80 hover:bg-white/90 border border-white/20 hover:border-white/40 rounded-full shadow-gentle hover:shadow-calm flex items-center justify-center text-therapy-gray-600 hover:text-soft-blue-600 hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-soft-blue-300"
          title={isPanelOpen ? 'Close navigation panel (Ctrl+/)' : 'Open navigation panel (Ctrl+/)'}
          aria-label={isPanelOpen ? 'Close navigation panel' : 'Open navigation panel'}
          aria-expanded={isPanelOpen}
          aria-controls="navigation-sidebar"
        >
          <Menu size={20} />
          <span className="sr-only">
            {isPanelOpen ? 'Close' : 'Open'} navigation menu
          </span>
        </button>

        {/* Main Content Area */}
        <main 
          id="main-content" 
          className="flex-1 flex flex-col min-w-0 h-full" 
          role="main"
          tabIndex={-1}
        >
          {/* Content wrapper that allows scrolling */}
          <div className="flex-1 overflow-y-auto">
            {renderMainContent()}
          </div>
        </main>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        {/* Settings Modal */}
        <ModalOverlay 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)}
          title="Personalize Your Experience"
          size="md"
        >
          <PersonalizationPanel 
            isVisible={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </ModalOverlay>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setConfirmDialogConfig(null);
          }}
          title={confirmDialogConfig?.title || ''}
          message={confirmDialogConfig?.message || ''}
          confirmText={confirmDialogConfig?.confirmText || 'Confirm'}
          onConfirm={confirmDialogConfig?.onConfirm || (() => {})}
          variant={confirmDialogConfig?.variant || 'info'}
        />

        {/* Account Section Modal */}
        {showAccountSection && (
          <AccountSection 
            onClose={() => setShowAccountSection(false)}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </InteractiveBackground>
  );
}

export default App;