const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_35b4e46185852f3d08ea104237401c8e4ca627dee82e2749';

// Voice IDs for different voices
const VOICES = {
  rachel: 'EXAVITQu4vr4xnSDxMaL', // Rachel - calm, empathetic female voice
  adam: 'pNInz6obpgDQGcFmaJgB'    // Adam - soft, soothing male voice
} as const;

export type VoiceOption = keyof typeof VOICES;

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export class VoiceService {
  private static instance: VoiceService;
  private currentAudio: HTMLAudioElement | null = null;
  private selectedVoice: VoiceOption = 'rachel';
  private isGenerating: boolean = false;

  private constructor() {}

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  setVoice(voice: VoiceOption): void {
    this.selectedVoice = voice;
  }

  getVoice(): VoiceOption {
    return this.selectedVoice;
  }

  private getVoiceSettings(voice: VoiceOption): VoiceSettings {
    // Optimized settings for each voice
    const voiceSettings: Record<VoiceOption, VoiceSettings> = {
      rachel: {
        stability: 0.6,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true
      },
      adam: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.15,
        use_speaker_boost: true
      }
    };

    return voiceSettings[voice];
  }

  async generateSpeech(text: string, voiceOverride?: VoiceOption): Promise<string> {
    if (this.isGenerating) {
      throw new Error('Speech generation already in progress');
    }
    
    this.isGenerating = true;
    
    try {
      const voice = voiceOverride || this.selectedVoice;
      const voiceId = VOICES[voice];
      const settings = this.getVoiceSettings(voice);

      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Speech generation timed out')), 10000);
      });

      const fetchPromise = fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_settings: settings,
          model_id: 'eleven_monolingual_v1'
        }),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      throw error;
    } finally {
      this.isGenerating = false;
    }
  }

  async playText(text: string, voiceOverride?: VoiceOption): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Set a timeout for the entire operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Voice playback timed out')), 15000);
      });

      const playPromise = (async () => {
        const audioUrl = await this.generateSpeech(text, voiceOverride);
        
        return new Promise<void>((resolve, reject) => {
          this.currentAudio = new Audio(audioUrl);
          
          this.currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            this.currentAudio = null;
            resolve();
          };
          
          this.currentAudio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            this.currentAudio = null;
            reject(new Error('Audio playback failed'));
          };
          
          this.currentAudio.play().catch(reject);
        });
      })();

      await Promise.race([playPromise, timeoutPromise]);
    } catch (error) {
      this.stopCurrentAudio();
      throw error;
    }
  }

  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }
}

export const voiceService = VoiceService.getInstance();