import React, { useState, useEffect, useRef } from 'react';
import { Heart, Volume2, VolumeX, Loader2, AlertTriangle } from 'lucide-react';
import { voiceService } from '../utils/voiceService';
import CrisisSupport from './CrisisSupport';

interface AIResponseProps {
  message: string;
  followUpQuestion: string;
  isVisible: boolean;
  isCrisis?: boolean;
  onCrisisContinue?: () => void;
  onCrisisEndSession?: () => void;
  autoPlayVoice?: boolean;
}

export default function AIResponse({ 
  message, 
  followUpQuestion, 
  isVisible, 
  isCrisis = false,
  onCrisisContinue,
  onCrisisEndSession,
  autoPlayVoice = false
}: AIResponseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const autoPlayAttempted = useRef(false);

  useEffect(() => {
    // Auto-play voice if enabled and not already attempted for this response
    if (isVisible && autoPlayVoice && message && !isPlaying && !isLoading && !autoPlayAttempted.current) {
      // Add a small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        handlePlayVoice();
        autoPlayAttempted.current = true;
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoPlayVoice, message, isPlaying, isLoading]);

  // Reset auto-play attempt flag when message changes
  useEffect(() => {
    autoPlayAttempted.current = false;
  }, [message]);

  if (!isVisible) return null;

  // Show crisis support interface if crisis is detected
  if (isCrisis) {
    return (
      <div className="animate-fade-in space-y-6">
        <CrisisSupport 
          onContinue={onCrisisContinue}
          onEndSession={onCrisisEndSession}
        />
        <div className="card-gentle border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-red-700 mb-3">Bloom's Response</div>
              <p className="text-black leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlayVoice = async () => {
    if (isPlaying) {
      voiceService.stopCurrentAudio();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);
      setPlaybackError(null);
      const fullText = `${message} ${followUpQuestion}`;
      
      setIsPlaying(true);
      await voiceService.playText(fullText);
      setIsPlaying(false);
    } catch (error) {
      setPlaybackError("Voice playback failed. Please try again later.");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl">
      <div className="card-gentle bg-gradient-to-br from-soft-blue-50 to-muted-teal-50 border-soft-blue-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center">
            <Heart size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-soft-blue-600">Bloom</div>
              <button
                onClick={handlePlayVoice}
                disabled={isLoading}
                className="
                  flex items-center gap-2 px-3 py-1.5 rounded-xl
                  bg-white/70 hover:bg-white/90
                  border border-soft-blue-200 hover:border-soft-blue-300
                  text-soft-blue-600 hover:text-soft-blue-700
                  transition-all duration-300 ease-out
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-xs font-medium
                  hover:scale-105
                "
                title={isPlaying ? "Stop voice" : "Listen to response"}
                aria-label={isPlaying ? "Stop voice" : "Listen to response"}
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isPlaying ? (
                  <VolumeX size={14} />
                ) : (
                  <Volume2 size={14} />
                )}
                {isLoading ? 'Loading...' : isPlaying ? 'Stop' : 'Listen'}
              </button>
            </div>
            <p className="text-black leading-relaxed mb-5 text-base">
              {message}
            </p>
            <p className="text-black leading-relaxed italic text-base">
              {followUpQuestion}
            </p>
            
            {/* Error message for voice playback */}
            {playbackError && (
              <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                {playbackError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}