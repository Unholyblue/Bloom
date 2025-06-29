import React from 'react';
import { User, UserCheck } from 'lucide-react';

export type VoiceOption = 'rachel' | 'adam';

interface VoiceSelectorProps {
  selectedVoice: VoiceOption;
  onVoiceChange: (voice: VoiceOption) => void;
}

export default function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Bloom's Voice</h3>
      <div className="flex gap-2">
        <button
          onClick={() => onVoiceChange('rachel')}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${selectedVoice === 'rachel'
              ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border border-purple-200/50'
              : 'bg-white/70 text-gray-600 border border-gray-200/50 hover:bg-white/90'
            }
          `}
        >
          {selectedVoice === 'rachel' ? <UserCheck size={16} /> : <User size={16} />}
          Rachel
          <span className="text-xs opacity-75">(Female)</span>
        </button>
        
        <button
          onClick={() => onVoiceChange('adam')}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${selectedVoice === 'adam'
              ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border border-indigo-200/50'
              : 'bg-white/70 text-gray-600 border border-gray-200/50 hover:bg-white/90'
            }
          `}
        >
          {selectedVoice === 'adam' ? <UserCheck size={16} /> : <User size={16} />}
          Adam
          <span className="text-xs opacity-75">(Male)</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Choose the voice that feels most comfortable for your therapy sessions
      </p>
    </div>
  );
}