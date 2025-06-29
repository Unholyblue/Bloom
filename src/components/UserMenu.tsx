import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { authService, UserProfile } from '../utils/authService';

interface UserMenuProps {
  profile: UserProfile;
}

export default function UserMenu({ profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleSettings = () => {
    setIsOpen(false);
    // Trigger settings modal
    const event = new CustomEvent('openSettings');
    window.dispatchEvent(event);
  };

  const handleAccount = () => {
    setIsOpen(false);
    // Trigger account section
    const event = new CustomEvent('navigate', { detail: { page: 'account' } });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl bg-white/80 hover:bg-white border border-soft-blue-200 hover:border-soft-blue-300 transition-all duration-200 hover:scale-105"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>
        <span className="text-sm font-medium text-therapy-gray-700 hidden sm:block">
          {profile.full_name || profile.email.split('@')[0]}
        </span>
        <ChevronDown size={14} className="text-therapy-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-lg border border-soft-blue-200 rounded-2xl shadow-calm z-20 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-soft-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || 'User'} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-therapy-gray-700 truncate">
                    {profile.full_name || 'User'}
                  </p>
                  <p className="text-xs text-therapy-gray-500 truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={handleAccount}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-therapy-gray-700 hover:bg-soft-blue-50 rounded-xl transition-colors"
              >
                <User size={16} />
                <span className="text-sm">Account</span>
              </button>
              
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-therapy-gray-700 hover:bg-soft-blue-50 rounded-xl transition-colors"
              >
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </button>
              
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                <span className="text-sm">
                  {loading ? 'Signing out...' : 'Sign out'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}