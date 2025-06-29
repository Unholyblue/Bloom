import React, { useState } from 'react';
import { User, Heart, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { voiceService } from '../utils/voiceService';

export interface ConversationEntry {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ConversationHistoryProps {
  entries: ConversationEntry[];
}

export default function ConversationHistory({ entries }: ConversationHistoryProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (entries.length === 0) return null;

  const handlePlayVoice = async (entry: ConversationEntry) => {
    if (entry.type === 'user') return; // Don't play user messages
    
    if (playingId === entry.id) {
      voiceService.stopCurrentAudio();
      setPlayingId(null);
      return;
    }

    try {
      setLoadingId(entry.id);
      setPlayingId(entry.id);
      
      await voiceService.playText(entry.content);
      setPlayingId(null);
    } catch (error) {
      setPlayingId(null);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Our Conversation</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex gap-3 ${entry.type === 'user' ? 'justify-end' : 'justify-start'} w-full`}
          >
            {entry.type === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
            )}
            <div
              className={`
                max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative group
                ${entry.type === 'user' 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-gray-700 border border-green-200/50' 
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-700 border border-blue-100/50'
                }
              `}
            >
              {entry.type === 'ai' && (
                <button
                  onClick={() => handlePlayVoice(entry)}
                  disabled={loadingId === entry.id}
                  className="
                    absolute top-2 right-2 opacity-0 group-hover:opacity-100
                    p-1.5 rounded-md
                    bg-white/70 hover:bg-white/90
                    border border-blue-200/50 hover:border-blue-300/50
                    text-blue-600 hover:text-blue-700
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  title="Listen to this message"
                >
                  {loadingId === entry.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : playingId === entry.id ? (
                    <VolumeX size={12} />
                  ) : (
                    <Volume2 size={12} />
                  )}
                </button>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap pr-8">
                {entry.content}
              </p>
              <div className="text-xs text-gray-500 mt-2">
                {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {entry.type === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}