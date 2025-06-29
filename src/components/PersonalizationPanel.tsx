import React, { useState, useEffect } from 'react';
import { User, Palette, Settings, Check, Heart, Monitor, Eye, EyeOff, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface PersonalizationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface UserPreferences {
  nickname: string;
  theme: 'soft' | 'warm' | 'cool' | 'nature';
  reminderFrequency: 'none' | 'daily' | 'weekly';
  preferredSessionLength: 'short' | 'medium' | 'long';
  panelSide: 'left' | 'right';
  showConversations: boolean;
  panelCollapsed: boolean;
  autoPlayVoice: boolean;
}

const themes = {
  soft: {
    name: 'Soft Blues',
    description: 'Calming blues and gentle grays',
    gradient: 'from-soft-blue-50 to-soft-blue-100',
    accent: 'soft-blue'
  },
  warm: {
    name: 'Warm Embrace',
    description: 'Soft oranges and warm beiges',
    gradient: 'from-orange-50 to-amber-50',
    accent: 'orange'
  },
  cool: {
    name: 'Cool Mint',
    description: 'Fresh greens and cool teals',
    gradient: 'from-muted-teal-50 to-muted-teal-100',
    accent: 'muted-teal'
  },
  nature: {
    name: 'Nature\'s Peace',
    description: 'Earth tones and forest greens',
    gradient: 'from-emerald-50 to-green-50',
    accent: 'emerald'
  }
};

export default function PersonalizationPanel({ isVisible, onClose }: PersonalizationPanelProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    nickname: '',
    theme: 'soft',
    reminderFrequency: 'none',
    preferredSessionLength: 'medium',
    panelSide: 'left',
    showConversations: true,
    panelCollapsed: false,
    autoPlayVoice: false
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedPrefs = localStorage.getItem('bloom_preferences');
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      setPreferences(prev => ({ ...prev, ...parsed }));
    }

    // Load panel side preference separately for backward compatibility
    const savedPanelSide = localStorage.getItem('bloom_panel_side');
    if (savedPanelSide === 'right' || savedPanelSide === 'left') {
      setPreferences(prev => ({ ...prev, panelSide: savedPanelSide }));
    }

    // Load conversation visibility preference
    const savedShowConversations = localStorage.getItem('bloom_show_conversations');
    if (savedShowConversations !== null) {
      setPreferences(prev => ({ ...prev, showConversations: savedShowConversations === 'true' }));
    }

    // Load panel collapsed state
    const savedCollapsed = localStorage.getItem('bloom_panel_collapsed');
    if (savedCollapsed !== null) {
      setPreferences(prev => ({ ...prev, panelCollapsed: savedCollapsed === 'true' }));
    }
    
    // Load auto play voice preference
    const savedAutoPlayVoice = localStorage.getItem('bloom_auto_play_voice');
    if (savedAutoPlayVoice !== null) {
      setPreferences(prev => ({ ...prev, autoPlayVoice: savedAutoPlayVoice === 'true' }));
    }
  }, []);

  const handleSave = () => {
    // Save all preferences including panel side, conversation visibility, and collapsed state
    localStorage.setItem('bloom_preferences', JSON.stringify(preferences));
    localStorage.setItem('bloom_panel_side', preferences.panelSide);
    localStorage.setItem('bloom_show_conversations', preferences.showConversations.toString());
    localStorage.setItem('bloom_panel_collapsed', preferences.panelCollapsed.toString());
    localStorage.setItem('bloom_auto_play_voice', preferences.autoPlayVoice.toString());
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    // Trigger a page reload to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePanelSideChange = (side: 'left' | 'right') => {
    setPreferences(prev => ({ ...prev, panelSide: side }));
  };

  const handleConversationVisibilityChange = (show: boolean) => {
    setPreferences(prev => ({ ...prev, showConversations: show }));
  };

  const handlePanelCollapsedChange = (collapsed: boolean) => {
    setPreferences(prev => ({ ...prev, panelCollapsed: collapsed }));
  };
  
  const handleAutoPlayVoiceChange = (autoPlay: boolean) => {
    setPreferences(prev => ({ ...prev, autoPlayVoice: autoPlay }));
  };

  if (!isVisible) return null;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-light text-therapy-gray-700 mb-2">Personalize Bloom</h3>
        <p className="text-therapy-gray-600">Make this space feel like yours</p>
      </div>

      <div className="space-y-8 max-w-md mx-auto">
        {/* Nickname */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-therapy-gray-700 mb-3">
            <User size={16} />
            What would you like me to call you?
          </label>
          <input
            type="text"
            value={preferences.nickname}
            onChange={(e) => setPreferences(prev => ({ ...prev, nickname: e.target.value }))}
            placeholder="Your preferred name (optional)"
            className="
              w-full px-4 py-3 
              bg-white/70 backdrop-blur-sm border border-soft-blue-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-soft-blue-400 focus:ring-opacity-50
              transition-all duration-200 hover:bg-white/90
            "
          />
        </div>

        {/* Voice Playback Settings */}
        <div className="space-y-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
          <div className="text-center">
            <h4 className="text-lg font-medium text-therapy-gray-700 mb-2">
              Voice Playback
            </h4>
            <p className="text-sm text-therapy-gray-600">
              Customize how Bloom speaks to you
            </p>
          </div>

          {/* Auto-Play Voice Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-purple-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  {preferences.autoPlayVoice ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white" />}
                </div>
                <div>
                  <div className="font-medium text-therapy-gray-700">
                    Auto-Play Voice
                  </div>
                  <div className="text-sm text-therapy-gray-500">
                    {preferences.autoPlayVoice ? 'Automatically play responses' : 'Manual voice playback'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAutoPlayVoiceChange(!preferences.autoPlayVoice)}
                className={`
                  relative w-14 h-8 rounded-full transition-all duration-300 ease-out
                  ${preferences.autoPlayVoice 
                    ? 'bg-gradient-to-r from-purple-400 to-indigo-500' 
                    : 'bg-therapy-gray-300'
                  }
                `}
              >
                <div className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ease-out
                  ${preferences.autoPlayVoice ? 'left-7' : 'left-1'}
                `} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAutoPlayVoiceChange(true)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                  ${preferences.autoPlayVoice 
                    ? 'border-purple-400 bg-purple-50 shadow-gentle' 
                    : 'border-therapy-gray-200 hover:border-purple-300 bg-white/50'
                  }
                `}
              >
                <div className="flex items-center justify-center mb-2">
                  <Volume2 size={20} className="text-purple-600" />
                </div>
                <div className="text-sm font-medium text-therapy-gray-700 mb-1">Auto-Play</div>
                <div className="text-xs text-therapy-gray-500">Responses read aloud</div>
              </button>
              
              <button
                onClick={() => handleAutoPlayVoiceChange(false)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                  ${!preferences.autoPlayVoice 
                    ? 'border-purple-400 bg-purple-50 shadow-gentle' 
                    : 'border-therapy-gray-200 hover:border-purple-300 bg-white/50'
                  }
                `}
              >
                <div className="flex items-center justify-center mb-2">
                  <VolumeX size={20} className="text-therapy-gray-600" />
                </div>
                <div className="text-sm font-medium text-therapy-gray-700 mb-1">Manual Play</div>
                <div className="text-xs text-therapy-gray-500">Click to hear responses</div>
              </button>
            </div>
          </div>
        </div>

        {/* Conversation Panel Settings */}
        <div className="space-y-6 p-6 bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 rounded-2xl border border-soft-blue-200">
          <div className="text-center">
            <h4 className="text-lg font-medium text-therapy-gray-700 mb-2">
              Interface Layout
            </h4>
            <p className="text-sm text-therapy-gray-600">
              Customize how your conversation history appears
            </p>
          </div>

          {/* Show/Hide Conversations Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-soft-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-soft-blue-400 to-soft-blue-500 rounded-xl flex items-center justify-center">
                  {preferences.showConversations ? <Eye size={20} className="text-white" /> : <EyeOff size={20} className="text-white" />}
                </div>
                <div>
                  <div className="font-medium text-therapy-gray-700">
                    Conversation History
                  </div>
                  <div className="text-sm text-therapy-gray-500">
                    {preferences.showConversations ? 'Panel is visible' : 'Panel is hidden'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleConversationVisibilityChange(!preferences.showConversations)}
                className={`
                  relative w-14 h-8 rounded-full transition-all duration-300 ease-out
                  ${preferences.showConversations 
                    ? 'bg-gradient-to-r from-soft-blue-400 to-soft-blue-500' 
                    : 'bg-therapy-gray-300'
                  }
                `}
              >
                <div className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ease-out
                  ${preferences.showConversations ? 'left-7' : 'left-1'}
                `} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleConversationVisibilityChange(true)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                  ${preferences.showConversations 
                    ? 'border-soft-blue-400 bg-soft-blue-50 shadow-gentle' 
                    : 'border-therapy-gray-200 hover:border-soft-blue-300 bg-white/50'
                  }
                `}
              >
                <div className="flex items-center justify-center mb-2">
                  <Eye size={20} className="text-soft-blue-600" />
                </div>
                <div className="text-sm font-medium text-therapy-gray-700 mb-1">Show Panel</div>
                <div className="text-xs text-therapy-gray-500">Access conversation history</div>
              </button>
              
              <button
                onClick={() => handleConversationVisibilityChange(false)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                  ${!preferences.showConversations 
                    ? 'border-soft-blue-400 bg-soft-blue-50 shadow-gentle' 
                    : 'border-therapy-gray-200 hover:border-soft-blue-300 bg-white/50'
                  }
                `}
              >
                <div className="flex items-center justify-center mb-2">
                  <EyeOff size={20} className="text-therapy-gray-600" />
                </div>
                <div className="text-sm font-medium text-therapy-gray-700 mb-1">Hide Panel</div>
                <div className="text-xs text-therapy-gray-500">Clean, minimal interface</div>
              </button>
            </div>
          </div>

          {/* Panel Controls - Only show if conversations are visible */}
          {preferences.showConversations && (
            <>
              {/* Panel Side Preference */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-soft-blue-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-muted-teal-400 to-muted-teal-500 rounded-xl flex items-center justify-center">
                      <Monitor size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-therapy-gray-700">
                        Panel Position
                      </div>
                      <div className="text-sm text-therapy-gray-500">
                        Currently on the {preferences.panelSide}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-therapy-gray-600 capitalize">
                    {preferences.panelSide} Side
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePanelSideChange('left')}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${preferences.panelSide === 'left' 
                        ? 'border-soft-blue-400 bg-soft-blue-50 shadow-gentle' 
                        : 'border-therapy-gray-200 hover:border-soft-blue-300 bg-white/50'
                      }
                    `}
                  >
                    <div className="text-sm font-medium text-therapy-gray-700 mb-2">Left Side</div>
                    <div className="text-xs text-therapy-gray-500 mb-3">Traditional layout</div>
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-6 bg-soft-blue-200 rounded-sm mr-1"></div>
                      <div className="w-12 h-6 bg-therapy-gray-200 rounded-sm"></div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handlePanelSideChange('right')}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${preferences.panelSide === 'right' 
                        ? 'border-soft-blue-400 bg-soft-blue-50 shadow-gentle' 
                        : 'border-therapy-gray-200 hover:border-soft-blue-300 bg-white/50'
                      }
                    `}
                  >
                    <div className="text-sm font-medium text-therapy-gray-700 mb-2">Right Side</div>
                    <div className="text-xs text-therapy-gray-500 mb-3">Modern layout</div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-6 bg-therapy-gray-200 rounded-sm mr-1"></div>
                      <div className="w-8 h-6 bg-soft-blue-200 rounded-sm"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Panel Collapsed State */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-soft-blue-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                      {preferences.panelCollapsed ? <ChevronRight size={20} className="text-white" /> : <ChevronLeft size={20} className="text-white" />}
                    </div>
                    <div>
                      <div className="font-medium text-therapy-gray-700">
                        Panel State
                      </div>
                      <div className="text-sm text-therapy-gray-500">
                        {preferences.panelCollapsed ? 'Panel starts collapsed' : 'Panel starts open'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePanelCollapsedChange(!preferences.panelCollapsed)}
                    className={`
                      relative w-14 h-8 rounded-full transition-all duration-300 ease-out
                      ${preferences.panelCollapsed 
                        ? 'bg-therapy-gray-300' 
                        : 'bg-gradient-to-r from-purple-400 to-purple-500'
                      }
                    `}
                  >
                    <div className={`
                      absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ease-out
                      ${preferences.panelCollapsed ? 'left-1' : 'left-7'}
                    `} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePanelCollapsedChange(false)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${!preferences.panelCollapsed 
                        ? 'border-purple-400 bg-purple-50 shadow-gentle' 
                        : 'border-therapy-gray-200 hover:border-purple-300 bg-white/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <ChevronLeft size={20} className="text-purple-600" />
                    </div>
                    <div className="text-sm font-medium text-therapy-gray-700 mb-1">Start Open</div>
                    <div className="text-xs text-therapy-gray-500">Panel visible by default</div>
                  </button>
                  
                  <button
                    onClick={() => handlePanelCollapsedChange(true)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${preferences.panelCollapsed 
                        ? 'border-purple-400 bg-purple-50 shadow-gentle' 
                        : 'border-therapy-gray-200 hover:border-purple-300 bg-white/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <ChevronRight size={20} className="text-therapy-gray-600" />
                    </div>
                    <div className="text-sm font-medium text-therapy-gray-700 mb-1">Start Collapsed</div>
                    <div className="text-xs text-therapy-gray-500">Panel hidden by default</div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-therapy-gray-700 mb-4">
            <Palette size={16} />
            Choose your theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setPreferences(prev => ({ ...prev, theme: key as any }))}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                  ${preferences.theme === key 
                    ? 'border-soft-blue-400 bg-soft-blue-50 shadow-gentle' 
                    : 'border-therapy-gray-200 hover:border-soft-blue-300 bg-white/50'
                  }
                `}
              >
                <div className={`w-full h-6 rounded bg-gradient-to-r ${theme.gradient} mb-3`} />
                <div className="text-sm font-medium text-therapy-gray-700">{theme.name}</div>
                <div className="text-xs text-therapy-gray-500 mt-1">{theme.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Session Length Preference */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-therapy-gray-700 mb-4">
            <Heart size={16} />
            Preferred session length
          </label>
          <div className="space-y-3">
            {[
              { key: 'short', label: 'Short & Sweet', desc: '5-10 minutes of focused reflection' },
              { key: 'medium', label: 'Balanced', desc: '10-20 minutes for deeper exploration' },
              { key: 'long', label: 'Deep Dive', desc: '20+ minutes for comprehensive reflection' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setPreferences(prev => ({ ...prev, preferredSessionLength: option.key as any }))}
                className={`
                  w-full p-4 text-left rounded-xl border transition-all duration-200 hover:scale-105
                  ${preferences.preferredSessionLength === option.key
                    ? 'border-soft-blue-400 bg-soft-blue-50 shadow-gentle'
                    : 'border-therapy-gray-200 hover:border-soft-blue-300 bg-white/50'
                  }
                `}
              >
                <div className="font-medium text-therapy-gray-700">{option.label}</div>
                <div className="text-sm text-therapy-gray-500 mt-1">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`
            w-full flex items-center justify-center gap-3 px-6 py-4
            font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-gentle hover:shadow-calm
            ${saved 
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
              : 'bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white'
            }
          `}
        >
          {saved ? (
            <>
              <Check size={20} />
              Saved Successfully!
            </>
          ) : (
            'Save Preferences'
          )}
        </button>

        {/* Change notification */}
        {(preferences.panelSide !== (localStorage.getItem('bloom_panel_side') || 'left') || 
          preferences.showConversations !== (localStorage.getItem('bloom_show_conversations') !== 'false') ||
          preferences.panelCollapsed !== (localStorage.getItem('bloom_panel_collapsed') === 'true') ||
          preferences.autoPlayVoice !== (localStorage.getItem('bloom_auto_play_voice') === 'true')) && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
              <span className="text-lg">⚡</span>
              <span className="text-xs text-amber-700">
                Interface changes will apply after saving
              </span>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 rounded-xl border border-soft-blue-200">
            <span className="text-lg">💝</span>
            <span className="text-xs text-therapy-gray-600">
              Your preferences are saved locally and never shared
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}