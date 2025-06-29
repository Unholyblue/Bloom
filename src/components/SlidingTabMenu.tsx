import React from 'react';
import { 
  X, User, MessageCircle, Lightbulb, BookOpen, 
  HelpCircle, Settings, LogOut, Home, Menu
} from 'lucide-react';
import AccountSection from './AccountSection';

interface SlidingTabMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export const SlidingTabMenu: React.FC<SlidingTabMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  isAuthenticated,
  onSignOut
}) => {
  const [showAccountSection, setShowAccountSection] = React.useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-cyan-400' },
    { id: 'session', label: 'Start Session', icon: MessageCircle, color: 'from-purple-500 to-pink-400' },
    { id: 'insights', label: 'Community Insights', icon: Lightbulb, color: 'from-emerald-500 to-teal-400' },
    { id: 'resources', label: 'Resource Library', icon: BookOpen, color: 'from-orange-500 to-red-400' },
  ];

  const accountItems = [
    { id: 'support', label: 'Support', icon: HelpCircle, color: 'from-gray-500 to-gray-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-slate-600' },
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'session') {
      onNavigate('chat');
    } else if (itemId === 'profile') {
      setShowAccountSection(true);
    } else {
      onNavigate(itemId);
    }
    onClose();
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  return (
    <>
      {/* Overlay with blur effect */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Menu */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 
                   backdrop-blur-xl z-50 shadow-xl
                   transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-white font-semibold text-lg">Bloom</h2>
            <p className="text-white/60 text-sm">Therapeutic AI</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
          {/* Main Navigation */}
          <div className="flex-1 p-4">
            <div className="space-y-2 mb-6">
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider px-3 mb-3">
                Navigation
              </h3>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="w-full flex items-center gap-3 p-3 text-white/80 hover:text-white 
                             hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center 
                                   group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Account Section */}
            <div className="space-y-2">
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider px-3 mb-3">
                Account
              </h3>
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="w-full flex items-center gap-3 p-3 text-white/80 hover:text-white 
                             hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center 
                                   group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {isAuthenticated && (
                <button
                  onClick={() => handleItemClick('profile')}
                  className="w-full flex items-center gap-3 p-3 text-white/80 hover:text-white 
                           hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center 
                                 group-hover:scale-110 transition-transform duration-200">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Profile</span>
                </button>
              )}
            </div>
            
            {/* Profile Section - Only for authenticated users */}
            {isAuthenticated && (
              <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">User Name</h3>
                    <p className="text-white/70 text-sm">user@example.com</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Member since 2025</span>
                  <button 
                    onClick={() => handleItemClick('profile')}
                    className="text-white/80 hover:text-white underline"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 text-red-300 hover:text-red-200 
                         hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center 
                               group-hover:scale-110 transition-transform duration-200">
                  <LogOut className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleItemClick('signin')}
                  className="w-full p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleItemClick('signup')}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl 
                           hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Section Modal */}
      {showAccountSection && (
        <AccountSection 
          onClose={() => setShowAccountSection(false)}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
};