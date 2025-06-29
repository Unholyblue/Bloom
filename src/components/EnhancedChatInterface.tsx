import React, { useState, useEffect, useRef } from 'react';
import { Send, Wind, RefreshCw, LifeBuoy, Brain, Lightbulb, Target, BookOpen, AlertTriangle } from 'lucide-react';
import { ChatSession } from '../App';
import { ConversationEntry } from './ConversationHistory';
import EmotionButtons from './EmotionButtons';
import CustomInput from './CustomInput';
import AIResponse from './AIResponse';
import ReflectMoreButtons from './ReflectMoreButtons';
import ReflectionInput from './ReflectionInput';
import BreathingExercise from './BreathingExercise';
import VoiceSelector, { VoiceOption } from './VoiceSelector';
import ModalOverlay from './ModalOverlay';
import CrisisSupport from './CrisisSupport';
import CommunityInsights from './CommunityInsights';
import ResourceLibrary from './ResourceLibrary';
import BloomingChallenges from './BloomingChallenges';
import DistortionDetectorWidget from './DistortionDetectorWidget';
import SignupPrompt from './SignupPrompt';
import { generateEnhancedAIResponse } from '../utils/enhancedAIResponses';
import { generateDeeperReflection } from '../utils/deeperReflection';
import { voiceService } from '../utils/voiceService';
import { logMoodEntry } from '../utils/supabaseClient';
import { sessionAnalytics } from '../utils/sessionAnalytics';
import { detectDistortions } from '../utils/distortionDetector';
import { shouldRouteToReframe } from '../utils/distortionRouter';
import { authService } from '../utils/authService';

type AppState = 'initial' | 'responded' | 'reflecting' | 'crisis-detected' | 'signup-required';
type ViewMode = 'chat' | 'insights' | 'resources' | 'challenges';

interface ChatInterfaceProps {
  session: ChatSession | null;
  onUpdateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  personalizedGreeting: string;
  autoPlayVoice?: boolean;
}

interface CognitiveDistortionAlert {
  detected: boolean;
  explanation?: string;
  suggestions?: string[];
}

interface ReflectionDepthIndicator {
  depth: number;
  qualityIndicators: string[];
  readyForSummary: boolean;
}

export default function EnhancedChatInterface({ session, onUpdateSession, personalizedGreeting, autoPlayVoice = false }: ChatInterfaceProps) {
  const [currentResponse, setCurrentResponse] = useState<{
    message: string;
    followUpQuestion: string;
    isCrisis?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appState, setAppState] = useState<AppState>('initial');
  const [inputValue, setInputValue] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('rachel');
  const [showBreathing, setShowBreathing] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  
  // Enhanced features state
  const [cognitiveDistortionAlert, setCognitiveDistortionAlert] = useState<CognitiveDistortionAlert>({ detected: false });
  const [reflectionDepthIndicator, setReflectionDepthIndicator] = useState<ReflectionDepthIndicator>({ 
    depth: 1, 
    qualityIndicators: [], 
    readyForSummary: false 
  });
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [showDistortionExplanation, setShowDistortionExplanation] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [showDistortionDetector, setShowDistortionDetector] = useState(false);
  const [lastUserInput, setLastUserInput] = useState('');
  const [responseError, setResponseError] = useState<string | null>(null);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRateLimitMs = 1000; // 1 second between messages

  // Scroll to bottom when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [session?.conversation]);

  // Reset state when session changes or is cleared
  useEffect(() => {
    if (session && session.conversation.length === 0) {
      setAppState('initial');
      setCurrentResponse(null);
      setReflectionDepthIndicator({ depth: 1, qualityIndicators: [], readyForSummary: false });
      setCognitiveDistortionAlert({ detected: false });
      setSessionSummary(null);
      setMessageCount(0);
      setHasInteracted(false);
    } else if (session && session.conversation.length > 0) {
      setAppState('responded');
      setMessageCount(session.conversation.length);
      setHasInteracted(session.conversation.length > 0);
    }
  }, [session]);

  // Process message queue
  useEffect(() => {
    const processQueue = async () => {
      if (messageQueue.length > 0 && !isProcessingQueue && !isLoading) {
        setIsProcessingQueue(true);
        const message = messageQueue[0];
        const newQueue = messageQueue.slice(1);
        setMessageQueue(newQueue);
        
        // Process the message
        await processUserMessage(message);
        setIsProcessingQueue(false);
      }
    };
    
    processQueue();
  }, [messageQueue, isProcessingQueue, isLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  // Smooth scroll to bottom of conversation
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle voice selection
  const handleVoiceChange = (voice: VoiceOption) => {
    setSelectedVoice(voice);
    voiceService.setVoice(voice);
  };

  // Update session title based on initial feeling
  const updateSessionTitle = (feeling: string) => {
    if (session && session.title === 'New conversation') {
      onUpdateSession(session.id, {
        title: `Exploring ${feeling.toLowerCase().replace(/^i'm feeling /i, '')}`,
        originalFeeling: feeling
      });
    }
  };

  // Crisis support functions
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

  // Check if input is emoji-only
  const isEmojiOnlyInput = (text: string): boolean => {
    // Remove whitespace
    const trimmed = text.trim();
    
    // Check if empty after trimming
    if (!trimmed) return false;
    
    // Regex to match emoji characters
    const emojiRegex = /[\p{Emoji}]/gu;
    
    // Remove all emoji characters
    const withoutEmoji = trimmed.replace(emojiRegex, '');
    
    // If nothing remains after removing emojis and whitespace, it was emoji-only
    return withoutEmoji.trim().length === 0;
  };

  // Convert emoji-only input to text
  const convertEmojiToText = (text: string): string => {
    if (!isEmojiOnlyInput(text)) return text;
    
    // Common emoji to text mappings
    const emojiMap: Record<string, string> = {
      '😊': "I'm feeling happy",
      '😃': "I'm feeling joyful",
      '😄': "I'm feeling cheerful",
      '😢': "I'm feeling sad",
      '😭': "I'm feeling very sad",
      '😞': "I'm feeling disappointed",
      '😔': "I'm feeling down",
      '😟': "I'm feeling worried",
      '😰': "I'm feeling anxious",
      '😨': "I'm feeling scared",
      '😱': "I'm feeling terrified",
      '😠': "I'm feeling angry",
      '😡': "I'm feeling furious",
      '😤': "I'm feeling frustrated",
      '😌': "I'm feeling relieved",
      '😴': "I'm feeling tired",
      '😫': "I'm feeling exhausted",
      '🤔': "I'm feeling confused",
      '😕': "I'm feeling puzzled",
      '😐': "I'm feeling neutral",
      '😶': "I'm not sure how I'm feeling",
      '🙂': "I'm feeling okay",
      '🥰': "I'm feeling loved",
      '😍': "I'm feeling adoration",
      '🤗': "I'm feeling comforted",
      '🥺': "I'm feeling vulnerable",
      '😳': "I'm feeling embarrassed",
      '😖': "I'm feeling overwhelmed",
      '😩': "I'm feeling distressed",
      '🤯': "I'm feeling overwhelmed",
      '😵': "I'm feeling confused and overwhelmed",
      '🥴': "I'm feeling disoriented",
      '🤢': "I'm feeling sick",
      '🤮': "I'm feeling very sick",
      '🥱': "I'm feeling sleepy",
      '🤒': "I'm feeling sick",
      '🤕': "I'm feeling hurt",
      '🥳': "I'm feeling celebratory",
      '🤩': "I'm feeling excited",
      '🥲': "I'm feeling happy but sad",
      '🤨': "I'm feeling skeptical",
      '🧐': "I'm feeling curious",
      '🤪': "I'm feeling silly",
      '😜': "I'm feeling playful",
      '🤓': "I'm feeling nerdy",
      '😎': "I'm feeling cool",
      '🥸': "I'm feeling like I'm pretending",
      '🤥': "I'm feeling like I'm not being honest",
      '🤫': "I'm feeling secretive",
      '🤭': "I'm feeling amused",
      '🥶': "I'm feeling cold",
      '🥵': "I'm feeling hot",
      '😇': "I'm feeling innocent",
      '🤠': "I'm feeling adventurous",
      '🤡': "I'm feeling silly",
      '👻': "I'm feeling ghosted",
      '👽': "I'm feeling alienated",
      '👾': "I'm feeling playful",
      '🤖': "I'm feeling robotic",
      '💩': "I'm feeling crappy",
      '💀': "I'm feeling dead inside",
      '👍': "I'm feeling good",
      '👎': "I'm feeling bad",
      '❤️': "I'm feeling love",
      '💔': "I'm feeling heartbroken",
      '💯': "I'm feeling perfect",
      '🔥': "I'm feeling on fire",
      '🌈': "I'm feeling hopeful",
      '☀️': "I'm feeling bright",
      '⛈️': "I'm feeling stormy",
      '🌧️': "I'm feeling gloomy",
      '🌨️': "I'm feeling cold",
      '🌪️': "I'm feeling chaotic",
      '🌊': "I'm feeling overwhelmed",
    };
    
    // Try to match the emoji
    for (const [emoji, meaning] of Object.entries(emojiMap)) {
      if (text.includes(emoji)) {
        return meaning;
      }
    }
    
    // Default response if no specific emoji is matched
    return "I'm having some feelings that are hard to put into words";
  };

  // Process user message with rate limiting and queue
  const processUserMessage = async (userInput: string) => {
    if (!session) return;
    
    // Check if this is the second message and user is not authenticated
    if (hasInteracted && !authService.getAuthState().user) {
      setShowSignupPrompt(true);
      return;
    }
    
    // Clear any existing timeout
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }
    
    setIsLoading(true);
    setLastUserInput(userInput);
    setResponseError(null);
    
    // Set a timeout to prevent infinite loading
    responseTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setResponseError("I'm sorry, but I'm having trouble processing your message right now. Please try again.");
      setCurrentResponse({
        message: "I apologize, but I'm having trouble processing your message right now. Please try again, and if the problem persists, you can refresh the page.",
        followUpQuestion: "Would you like to try sharing your thoughts again?"
      });
      setAppState('responded');
    }, 15000); // 15 second timeout
    
    try {
      // Check if this is the first message in the conversation
      const isFirstMessage = session.conversation.length === 0;
      
      if (isFirstMessage) {
        updateSessionTitle(userInput);
        sessionAnalytics.startSession(session.id, userInput);
      }
      
      // Add user input to conversation
      const userEntry: ConversationEntry = {
        id: Date.now().toString(),
        type: 'user',
        content: userInput,
        timestamp: new Date()
      };
      
      const updatedConversation = [...session.conversation, userEntry];
      onUpdateSession(session.id, { 
        conversation: updatedConversation,
        lastMessage: userEntry.content
      });
      
      // Check for cognitive distortions
      const detectionResult = detectDistortions(userInput);
      
      // If distortions detected with high confidence, show the detector widget
      if (detectionResult.detected && detectionResult.confidence >= 0.7) {
        setShowDistortionDetector(true);
      }
      
      // Update cognitive distortion alert
      setCognitiveDistortionAlert({
        detected: detectionResult.detected,
        explanation: detectionResult.distortions.length > 0 ? detectionResult.distortions[0].explanation : undefined,
        suggestions: detectionResult.suggestions
      });
      
      // Generate AI response with timeout protection
      const sessionHistory = session.conversation.map(entry => entry.content);
      const enhancedResponse = await generateEnhancedAIResponse(userInput, {
        sessionHistory,
        previousDepth: session.reflectionDepth || 1,
        conversationCount: session.conversation.length
      });
      
      // Clear timeout since we got a response
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      
      setCurrentResponse({
        message: enhancedResponse.message,
        followUpQuestion: enhancedResponse.followUpQuestion,
        isCrisis: enhancedResponse.isCrisis
      });
      
      // Update reflection depth indicator
      if (enhancedResponse.reflectionAnalysis) {
        setReflectionDepthIndicator(enhancedResponse.reflectionAnalysis);
        
        // Update session reflection depth
        onUpdateSession(session.id, {
          reflectionDepth: enhancedResponse.reflectionAnalysis.depth
        });
      }
      
      // Handle session summary
      if (enhancedResponse.sessionSummary) {
        setSessionSummary(enhancedResponse.sessionSummary);
      }
      
      // Handle crisis detection
      if (enhancedResponse.isCrisis) {
        setAppState('crisis-detected');
      } else {
        setAppState('responded');
      }
      
      // Combine AI response for logging
      const fullAiResponse = `${enhancedResponse.message}\n\n${enhancedResponse.followUpQuestion}`;
      
      // Record interaction in analytics
      sessionAnalytics.recordInteraction(
        userInput, 
        fullAiResponse, 
        enhancedResponse.reflectionAnalysis?.depth || 1,
        { isCrisis: enhancedResponse.isCrisis || false }
      );
      
      // Log to Supabase
      await logMoodEntry(
        userInput, 
        fullAiResponse, 
        !isFirstMessage, 
        session.id, 
        enhancedResponse.reflectionAnalysis?.depth || 1
      );
      
      // Add AI response to conversation
      const aiEntry: ConversationEntry = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fullAiResponse,
        timestamp: new Date()
      };
      
      const finalConversation = [...updatedConversation, aiEntry];
      onUpdateSession(session.id, { 
        conversation: finalConversation,
        lastMessage: aiEntry.content
      });
      
      // Increment message count
      setMessageCount(prev => prev + 2); // +2 for user message and AI response
      
      // Mark that user has interacted
      setHasInteracted(true);
      
      // Scroll to bottom after a short delay to ensure rendering is complete
      setTimeout(scrollToBottom, 100);
      
    } catch (error) {
      // Clear timeout
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      
      setResponseError("I'm sorry, I encountered an issue while processing your message. Please try again.");
      setCurrentResponse({
        message: "I'm sorry, I encountered an issue while processing your message. Please try again.",
        followUpQuestion: "Would you like to share your thoughts again?"
      });
      setAppState('responded');
    } finally {
      setIsLoading(false);
      
      // Record the time of this message for rate limiting
      setLastMessageTime(Date.now());
    }
  };

  // Handle emotion selection from buttons
  const handleEmotionSelect = (emotion: string) => {
    if (isLoading) return; // Prevent multiple submissions while loading
    
    // Check rate limiting
    const now = Date.now();
    if (now - lastMessageTime < messageRateLimitMs) {
      // Add to queue instead of processing immediately
      setMessageQueue(prev => [...prev, emotion]);
      return;
    }
    
    processUserMessage(emotion);
  };

  // Handle custom text input
  const handleCustomInput = (feeling: string) => {
    if (isLoading) return; // Prevent multiple submissions while loading
    
    // Check if input is emoji-only and convert if needed
    const processedInput = isEmojiOnlyInput(feeling) ? convertEmojiToText(feeling) : feeling;
    
    // Check rate limiting
    const now = Date.now();
    if (now - lastMessageTime < messageRateLimitMs) {
      // Add to queue instead of processing immediately
      setMessageQueue(prev => [...prev, processedInput]);
      return;
    }
    
    processUserMessage(processedInput);
  };

  // Handle text submission from input field
  const handleTextSubmit = (text: string) => {
    if (!session || !text.trim() || isLoading) return;
    
    // Check if this is the second message and user is not authenticated
    if (hasInteracted && !authService.getAuthState().user) {
      setShowSignupPrompt(true);
      return;
    }
    
    setInputValue('');
    
    // Check if input is emoji-only and convert if needed
    const processedInput = isEmojiOnlyInput(text) ? convertEmojiToText(text) : text;
    
    // Check rate limiting
    const now = Date.now();
    if (now - lastMessageTime < messageRateLimitMs) {
      // Add to queue instead of processing immediately
      setMessageQueue(prev => [...prev, processedInput]);
      return;
    }
    
    processUserMessage(processedInput);
  };

  // Handle deeper reflection request
  const handleReflectMore = () => {
    // Check if user is authenticated for deeper reflection
    if (!authService.getAuthState().user) {
      setShowSignupPrompt(true);
      return;
    }
    
    setAppState('reflecting');
  };

  // Process reflection submission
  const handleReflectionSubmit = async (reflectionText: string) => {
    if (!session || isLoading) return;
    
    // Check if user is authenticated
    if (!authService.getAuthState().user) {
      setShowSignupPrompt(true);
      return;
    }
    
    // Check if input is empty or whitespace-only
    if (!reflectionText.trim()) return;
    
    // Check if input is emoji-only
    if (isEmojiOnlyInput(reflectionText)) {
      setResponseError("I notice you sent an emoji. For deeper reflection, could you share your thoughts in words?");
      return;
    }
    
    setIsLoading(true);
    setResponseError(null);
    
    // Clear any existing timeout
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }
    
    // Set timeout for reflection response
    responseTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setResponseError("I'm having trouble processing your reflection right now. Please try again.");
      setCurrentResponse({
        message: "I'm having trouble processing your reflection right now. Please try again.",
        followUpQuestion: "Would you like to share more about what you're experiencing?"
      });
      setAppState('responded');
    }, 15000);
    
    const newDepth = (session.reflectionDepth || 1) + 1;
    
    try {
      // Add user reflection to conversation
      const userEntry: ConversationEntry = {
        id: Date.now().toString(),
        type: 'user',
        content: reflectionText,
        timestamp: new Date()
      };
      
      const updatedConversation = [...session.conversation, userEntry];
      onUpdateSession(session.id, { 
        conversation: updatedConversation,
        lastMessage: userEntry.content,
        reflectionDepth: newDepth
      });
      
      // Generate deeper reflection
      const deeperResponse = await generateDeeperReflection(
        session.originalFeeling,
        currentResponse?.message || '',
        reflectionText,
        newDepth
      );
      
      // Clear timeout
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      
      setCurrentResponse(deeperResponse);
      setAppState('responded');
      
      // Combine AI response for logging
      const fullAiResponse = `${deeperResponse.message}\n\n${deeperResponse.followUpQuestion}`;
      
      // Log follow-up to Supabase
      await logMoodEntry(reflectionText, fullAiResponse, true, session.id, newDepth);
      
      // Add AI response to conversation
      const aiEntry: ConversationEntry = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fullAiResponse,
        timestamp: new Date()
      };
      
      const finalConversation = [...updatedConversation, aiEntry];
      onUpdateSession(session.id, { 
        conversation: finalConversation,
        lastMessage: aiEntry.content
      });
      
      // Increment message count
      setMessageCount(prev => prev + 2); // +2 for user message and AI response
      
      // Scroll to bottom after a short delay to ensure rendering is complete
      setTimeout(scrollToBottom, 100);
      
    } catch (error) {
      // Clear timeout
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = null;
      }
      
      setResponseError("I'm sorry, I had trouble processing your reflection. Please try sharing again.");
      setCurrentResponse({
        message: "I'm sorry, I had trouble processing your reflection. Please try sharing again.",
        followUpQuestion: "What would you like to explore further?"
      });
      setAppState('responded');
    } finally {
      setIsLoading(false);
      
      // Record the time of this message for rate limiting
      setLastMessageTime(Date.now());
    }
  };

  // Handle crisis continuation
  const handleCrisisContinue = () => {
    // Check if user is authenticated
    if (!authService.getAuthState().user) {
      setShowSignupPrompt(true);
      return;
    }
    
    setAppState('responded');
  };

  // Handle crisis end session
  const handleCrisisEndSession = () => {
    sessionAnalytics.endSession();
    setAppState('initial');
    setCurrentResponse(null);
    setHasInteracted(false);
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      handleTextSubmit(inputValue.trim());
    }
  };

  // Check if session context should be refreshed
  const shouldRefreshContext = messageCount >= 16; // Refresh after 8 exchanges (16 messages)

  // Render different views based on mode
  if (viewMode === 'insights') {
    return <CommunityInsights onBackToWelcome={() => setViewMode('chat')} />;
  }
  
  if (viewMode === 'resources') {
    return <ResourceLibrary onBackToWelcome={() => setViewMode('chat')} />;
  }
  
  if (viewMode === 'challenges') {
    return <BloomingChallenges onBackToWelcome={() => setViewMode('chat')} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Enhanced Header with Navigation */}
      <div className="border-b border-soft-blue-200/50 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-therapy-gray-700">
              {session?.title}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              {session?.conversation.length > 0 && (
                <p className="text-sm text-therapy-gray-500">
                  {session.conversation.length} messages
                </p>
              )}
              
              {/* Reflection Depth Indicator */}
              {reflectionDepthIndicator.depth > 1 && (
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-purple-500" />
                  <span className="text-sm text-purple-600 font-medium">
                    Depth {reflectionDepthIndicator.depth}/5
                  </span>
                  {reflectionDepthIndicator.readyForSummary && (
                    <button
                      onClick={() => setShowSessionSummary(true)}
                      className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Summary Ready
                    </button>
                  )}
                </div>
              )}
              
              {/* Quality Indicators */}
              {reflectionDepthIndicator.qualityIndicators.length > 0 && (
                <div className="flex items-center gap-1">
                  {reflectionDepthIndicator.qualityIndicators.slice(0, 2).map((indicator, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full"
                      title={indicator}
                    >
                      ✓
                    </span>
                  ))}
                </div>
              )}
              
              {/* Context Refresh Warning */}
              {shouldRefreshContext && (
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <RefreshCw size={10} className="animate-spin" />
                    Context Refresh Needed
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation Buttons */}
            <button
              onClick={() => setViewMode('insights')}
              className="p-2 text-therapy-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Community Insights"
            >
              <Lightbulb size={18} />
            </button>
            <button
              onClick={() => setViewMode('resources')}
              className="p-2 text-therapy-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Resource Library"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => setViewMode('challenges')}
              className="p-2 text-therapy-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Growth Challenges"
            >
              <Target size={18} />
            </button>
            
            {/* Existing buttons */}
            <button
              onClick={() => setShowBreathing(true)}
              className="p-2 text-therapy-gray-500 hover:text-muted-teal-600 hover:bg-muted-teal-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Breathing Exercise"
            >
              <Wind size={18} />
            </button>
            <button
              onClick={() => setShowCrisisSupport(true)}
              className="p-2 text-therapy-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Crisis Support Resources"
            >
              <LifeBuoy size={18} />
            </button>
            <button
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
              className="p-2 text-therapy-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Voice Settings"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Voice Selector */}
        {showVoiceSelector && (
          <VoiceSelector 
            selectedVoice={selectedVoice}
            onVoiceChange={handleVoiceChange}
          />
        )}

        {/* Cognitive Distortion Alert */}
        {cognitiveDistortionAlert.detected && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Brain size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-2">Thinking Pattern Detected</h4>
                <p className="text-amber-700 text-sm leading-relaxed mb-3">
                  {cognitiveDistortionAlert.explanation}
                </p>
                <button
                  onClick={() => setShowDistortionExplanation(true)}
                  className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Context Refresh Warning - Full Banner */}
        {shouldRefreshContext && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-2">Conversation Getting Long</h4>
                <p className="text-amber-700 text-sm leading-relaxed mb-3">
                  This conversation is getting quite long. For the best experience, consider starting a new conversation to refresh the context.
                </p>
                <button
                  onClick={() => {
                    sessionAnalytics.endSession();
                    setAppState('initial');
                    setCurrentResponse(null);
                    setHasInteracted(false);
                    if (session) {
                      onUpdateSession(session.id, {
                        conversation: [],
                        lastMessage: '',
                        reflectionDepth: 1
                      });
                    }
                  }}
                  className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Initial Welcome State - Emotion Selection */}
        {session?.conversation.length === 0 && appState === 'initial' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-light text-therapy-gray-700 mb-4">
                {personalizedGreeting}
              </h3>
              <p className="text-lg text-therapy-gray-600 leading-relaxed">
                Let's explore your inner world together with curiosity and compassion.
              </p>
            </div>
            
            <div className="space-y-10">
              <div className="card-gentle bg-gradient-to-br from-soft-blue-50 to-muted-teal-50 border-soft-blue-200">
                <h4 className="text-xl font-medium text-therapy-gray-700 mb-6 text-center">
                  How are you feeling right now?
                </h4>
                <EmotionButtons 
                  onEmotionSelect={handleEmotionSelect} 
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-therapy-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-therapy-gray-50 text-therapy-gray-500 font-medium">
                    or describe it in your own words
                  </span>
                </div>
              </div>

              <div className="card-gentle">
                <CustomInput 
                  onSubmit={handleCustomInput} 
                  disabled={isLoading}
                />
              </div>

              <div className="card-gentle bg-gradient-to-r from-soft-blue-50 to-muted-teal-50 border-soft-blue-200">
                <p className="text-sm text-soft-blue-700 leading-relaxed text-center">
                  💙 <strong>Remember:</strong> This is your safe space for authentic self-exploration. 
                  I'm here to help you understand your mind and grow through reflection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message Queue Indicator */}
        {messageQueue.length > 0 && (
          <div className="bg-white/90 border border-soft-blue-200 rounded-xl p-3 text-center max-w-2xl mx-auto">
            <p className="text-sm text-therapy-gray-600">
              <RefreshCw size={14} className="inline-block mr-2 animate-spin" />
              {messageQueue.length} message{messageQueue.length > 1 ? 's' : ''} queued
            </p>
          </div>
        )}

        {/* Conversation Messages */}
        <div className="flex flex-col items-center space-y-6">
          {session?.conversation.map((entry) => (
            <div
              key={entry.id}
              className={`flex w-full max-w-2xl ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-full px-6 py-4 rounded-2xl shadow-gentle
                  ${entry.type === 'user' 
                    ? 'bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 text-black' 
                    : 'bg-white/90 backdrop-blur-sm border border-soft-blue-200'
                  }
                `}
              >
                <p className={`whitespace-pre-wrap leading-relaxed ${entry.type === 'ai' ? 'text-black' : ''}`}>
                  {entry.content}
                </p>
                <div className={`text-xs mt-2 ${entry.type === 'user' ? 'text-black/70' : 'text-therapy-gray-500'}`}>
                  {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="bg-white/90 backdrop-blur-sm border border-soft-blue-200 rounded-2xl px-6 py-4 max-w-2xl shadow-gentle">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-breathing"></div>
                </div>
                <span className="text-sm text-soft-blue-600">
                  Bloom is thinking...
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-therapy-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-therapy-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {responseError && !isLoading && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 max-w-2xl shadow-gentle">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-red-700">
                  Connection Issue
                </span>
              </div>
              <p className="text-red-700 mb-3">
                {responseError}
              </p>
              <button
                onClick={() => setResponseError(null)}
                className="text-sm bg-white text-red-600 px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Current AI Response */}
        {currentResponse && !isLoading && (
          <div className="flex justify-center">
            <AIResponse
              message={currentResponse.message}
              followUpQuestion={currentResponse.followUpQuestion}
              isVisible={true}
              isCrisis={currentResponse.isCrisis}
              onCrisisContinue={handleCrisisContinue}
              onCrisisEndSession={handleCrisisEndSession}
              autoPlayVoice={autoPlayVoice}
            />
          </div>
        )}

        {/* Action Buttons */}
        {appState === 'responded' && !isLoading && (
          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <ReflectMoreButtons
                onReflectMore={handleReflectMore}
                onEndSession={handleCrisisEndSession}
                onStartNew={() => {
                  sessionAnalytics.endSession();
                  setAppState('initial');
                  setCurrentResponse(null);
                  setHasInteracted(false);
                  if (session) {
                    onUpdateSession(session.id, {
                      conversation: [],
                      lastMessage: '',
                      reflectionDepth: 1
                    });
                  }
                }}
                disabled={isLoading}
                reflectionDepth={session?.reflectionDepth || 1}
              />
            </div>
          </div>
        )}

        {/* Reflection Input */}
        {appState === 'reflecting' && (
          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <ReflectionInput
                onSubmit={handleReflectionSubmit}
                disabled={isLoading}
                reflectionDepth={session?.reflectionDepth || 1}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Only show when conversation has started */}
      {session?.conversation.length > 0 && (
        <div className="border-t border-soft-blue-200/50 p-4 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Continue exploring your thoughts..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-soft-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm text-black"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-3 bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white rounded-xl transition-all duration-300 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-gentle hover:shadow-calm"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Overlays */}
      <ModalOverlay 
        isOpen={showBreathing} 
        onClose={() => setShowBreathing(false)}
        title="Breathing Exercise"
        size="md"
      >
        <BreathingExercise 
          isVisible={showBreathing}
          onClose={() => setShowBreathing(false)}
        />
      </ModalOverlay>

      <ModalOverlay 
        isOpen={showCrisisSupport} 
        onClose={() => setShowCrisisSupport(false)}
        title="Crisis Support Resources"
        size="md"
      >
        <div className="p-6">
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-2xl border border-red-200">
              <p className="text-red-800 font-medium mb-2">If you're in immediate danger:</p>
              <button
                onClick={handleEmergencyCall}
                className="text-red-700 text-sm underline hover:no-underline font-medium"
              >
                Call 911 or go to your nearest emergency room
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCrisisLine}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-gentle transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <LifeBuoy size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-blue-800">Crisis Lifeline</div>
                  <div className="text-sm text-blue-700">Call or text 988 (US)</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
                    window.location.href = 'sms:741741?body=HOME';
                  } else {
                    alert('Crisis Text Line: Text HOME to 741741\n\nThis will connect you with a trained crisis counselor via text message.');
                  }
                }}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-gentle transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <LifeBuoy size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-green-800">Crisis Text Line</div>
                  <div className="text-sm text-green-700">Text HOME to 741741</div>
                </div>
              </button>
              
              <button
                onClick={() => window.open('https://www.befrienders.org', '_blank')}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-gentle transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <LifeBuoy size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-purple-800">International Support</div>
                  <div className="text-sm text-purple-700">befrienders.org</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-2xl mb-6 border border-amber-200">
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Remember:</strong> You're not alone. These feelings can change. 
              Professional help is available, and your life has value.
            </p>
          </div>
        </div>
      </ModalOverlay>

      {/* Cognitive Distortion Explanation Modal */}
      <ModalOverlay 
        isOpen={showDistortionExplanation} 
        onClose={() => setShowDistortionExplanation(false)}
        title="Understanding Thinking Patterns"
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">What are Cognitive Distortions?</h3>
              <p className="text-amber-700 leading-relaxed">
                Cognitive distortions are patterns of thinking that can make situations seem worse than they are. 
                They're common and human, but recognizing them can help you think more clearly and feel better.
              </p>
            </div>
            
            {cognitiveDistortionAlert.explanation && (
              <div className="bg-white p-5 rounded-2xl border border-therapy-gray-200">
                <h4 className="font-medium text-therapy-gray-800 mb-3">What I noticed:</h4>
                <p className="text-therapy-gray-700 leading-relaxed">
                  {cognitiveDistortionAlert.explanation}
                </p>
              </div>
            )}
            
            {cognitiveDistortionAlert.suggestions && cognitiveDistortionAlert.suggestions.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">Gentle reframes to consider:</h4>
                <ul className="space-y-2">
                  {cognitiveDistortionAlert.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-blue-700 leading-relaxed">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200">
              <p className="text-green-700 leading-relaxed">
                <strong>Remember:</strong> Noticing these patterns is a sign of growing self-awareness. 
                You're developing the skill to observe your thoughts with curiosity rather than judgment.
              </p>
            </div>
          </div>
        </div>
      </ModalOverlay>

      {/* Distortion Detector Modal */}
      <ModalOverlay
        isOpen={showDistortionDetector}
        onClose={() => setShowDistortionDetector(false)}
        title="Thinking Pattern Analysis"
        size="lg"
      >
        <DistortionDetectorWidget
          userInput={lastUserInput}
          isVisible={showDistortionDetector}
          onClose={() => setShowDistortionDetector(false)}
        />
      </ModalOverlay>

      {/* Signup Prompt Modal */}
      <ModalOverlay
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        title="Continue Your Journey"
        size="md"
      >
        <SignupPrompt
          isVisible={showSignupPrompt}
          onClose={() => setShowSignupPrompt(false)}
        />
      </ModalOverlay>
    </div>
  );
}