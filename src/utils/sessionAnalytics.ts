// Session analytics for mood and reflection tracking
export interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  totalInteractions: number;
  maxReflectionDepth: number;
  initialMood: string;
  finalMood?: string;
  moodProgression: MoodDataPoint[];
  crisisDetected: boolean;
  crisisSeverity?: 'low' | 'medium' | 'high' | 'critical';
  therapeuticMilestones: TherapeuticMilestone[];
  engagementScore: number; // 0-100
  insights: SessionInsight[];
}

export interface MoodDataPoint {
  timestamp: Date;
  mood: string;
  reflectionDepth: number;
  sentiment: 'negative' | 'neutral' | 'positive';
  intensity: number; // 1-10
}

export interface TherapeuticMilestone {
  type: 'breakthrough' | 'insight' | 'coping_strategy' | 'goal_setting' | 'emotional_regulation';
  description: string;
  timestamp: Date;
  reflectionDepth: number;
}

export interface SessionInsight {
  category: 'emotional_pattern' | 'coping_mechanism' | 'trigger_identification' | 'progress_indicator';
  insight: string;
  confidence: number; // 0-1
  supportingEvidence: string[];
}

export interface MoodTrend {
  period: 'daily' | 'weekly' | 'monthly';
  averageMood: number; // -5 to +5 scale
  moodVariability: number;
  commonMoods: string[];
  reflectionTrends: {
    averageDepth: number;
    maxDepth: number;
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
  };
  therapeuticProgress: {
    milestonesAchieved: number;
    insightsGenerated: number;
    copingStrategiesIdentified: number;
  };
}

class SessionAnalytics {
  private static instance: SessionAnalytics;
  private currentSession: SessionMetrics | null = null;
  private sessionHistory: SessionMetrics[] = [];

  private constructor() {
    this.loadSessionHistory();
  }

  static getInstance(): SessionAnalytics {
    if (!SessionAnalytics.instance) {
      SessionAnalytics.instance = new SessionAnalytics();
    }
    return SessionAnalytics.instance;
  }

  // Start a new session
  startSession(sessionId: string, initialMood: string): SessionMetrics {
    this.currentSession = {
      sessionId,
      startTime: new Date(),
      totalInteractions: 0,
      maxReflectionDepth: 1,
      initialMood,
      moodProgression: [{
        timestamp: new Date(),
        mood: initialMood,
        reflectionDepth: 1,
        sentiment: this.analyzeSentiment(initialMood),
        intensity: this.analyzeMoodIntensity(initialMood)
      }],
      crisisDetected: false,
      therapeuticMilestones: [],
      engagementScore: 0,
      insights: []
    };

    return this.currentSession;
  }

  // Record an interaction
  recordInteraction(
    userInput: string, 
    aiResponse: string, 
    reflectionDepth: number,
    crisisDetection?: { isCrisis: boolean; severity?: string }
  ): void {
    if (!this.currentSession) return;

    this.currentSession.totalInteractions++;
    this.currentSession.maxReflectionDepth = Math.max(
      this.currentSession.maxReflectionDepth, 
      reflectionDepth
    );

    // Add mood data point
    const moodPoint: MoodDataPoint = {
      timestamp: new Date(),
      mood: this.extractMoodFromText(userInput),
      reflectionDepth,
      sentiment: this.analyzeSentiment(userInput),
      intensity: this.analyzeMoodIntensity(userInput)
    };
    this.currentSession.moodProgression.push(moodPoint);

    // Handle crisis detection
    if (crisisDetection?.isCrisis) {
      this.currentSession.crisisDetected = true;
      this.currentSession.crisisSeverity = crisisDetection.severity as any;
    }

    // Detect therapeutic milestones
    this.detectTherapeuticMilestones(userInput, aiResponse, reflectionDepth);

    // Generate insights
    this.generateSessionInsights(userInput, aiResponse);

    // Update engagement score
    this.updateEngagementScore();
  }

  // End current session
  endSession(): SessionMetrics | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = new Date();
    this.currentSession.duration = Math.round(
      (this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()) / (1000 * 60)
    );

    // Set final mood if available
    const lastMoodPoint = this.currentSession.moodProgression[this.currentSession.moodProgression.length - 1];
    this.currentSession.finalMood = lastMoodPoint?.mood;

    // Final engagement score calculation
    this.calculateFinalEngagementScore();

    // Save to history
    this.sessionHistory.push({ ...this.currentSession });
    this.saveSessionHistory();

    const completedSession = this.currentSession;
    this.currentSession = null;
    return completedSession;
  }

  // Get current session metrics
  getCurrentSession(): SessionMetrics | null {
    return this.currentSession;
  }

  // Get session history
  getSessionHistory(): SessionMetrics[] {
    return [...this.sessionHistory];
  }

  // Get mood trends over time
  getMoodTrends(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): MoodTrend {
    const relevantSessions = this.getSessionsInPeriod(period);
    
    if (relevantSessions.length === 0) {
      return this.getEmptyMoodTrend(period);
    }

    // Calculate average mood
    const allMoodPoints = relevantSessions.flatMap(s => s.moodProgression);
    const averageMood = allMoodPoints.reduce((sum, point) => {
      return sum + this.moodToNumeric(point.sentiment, point.intensity);
    }, 0) / allMoodPoints.length;

    // Calculate mood variability
    const moodValues = allMoodPoints.map(p => this.moodToNumeric(p.sentiment, p.intensity));
    const variance = moodValues.reduce((sum, val) => sum + Math.pow(val - averageMood, 2), 0) / moodValues.length;
    const moodVariability = Math.sqrt(variance);

    // Get common moods
    const moodCounts = allMoodPoints.reduce((counts, point) => {
      counts[point.mood] = (counts[point.mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    const commonMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([mood]) => mood);

    // Calculate reflection trends
    const avgDepth = relevantSessions.reduce((sum, s) => sum + s.maxReflectionDepth, 0) / relevantSessions.length;
    const maxDepth = Math.max(...relevantSessions.map(s => s.maxReflectionDepth));
    
    // Determine engagement trend
    const recentSessions = relevantSessions.slice(-5);
    const olderSessions = relevantSessions.slice(0, -5);
    const recentAvgEngagement = recentSessions.reduce((sum, s) => sum + s.engagementScore, 0) / recentSessions.length;
    const olderAvgEngagement = olderSessions.length > 0 
      ? olderSessions.reduce((sum, s) => sum + s.engagementScore, 0) / olderSessions.length 
      : recentAvgEngagement;
    
    let engagementTrend: 'increasing' | 'stable' | 'decreasing';
    if (recentAvgEngagement > olderAvgEngagement + 5) {
      engagementTrend = 'increasing';
    } else if (recentAvgEngagement < olderAvgEngagement - 5) {
      engagementTrend = 'decreasing';
    } else {
      engagementTrend = 'stable';
    }

    // Calculate therapeutic progress
    const totalMilestones = relevantSessions.reduce((sum, s) => sum + s.therapeuticMilestones.length, 0);
    const totalInsights = relevantSessions.reduce((sum, s) => sum + s.insights.length, 0);
    const copingStrategies = relevantSessions.reduce((sum, s) => {
      return sum + s.therapeuticMilestones.filter(m => m.type === 'coping_strategy').length;
    }, 0);

    return {
      period,
      averageMood,
      moodVariability,
      commonMoods,
      reflectionTrends: {
        averageDepth: avgDepth,
        maxDepth,
        engagementTrend
      },
      therapeuticProgress: {
        milestonesAchieved: totalMilestones,
        insightsGenerated: totalInsights,
        copingStrategiesIdentified: copingStrategies
      }
    };
  }

  // Private helper methods
  private analyzeSentiment(text: string): 'negative' | 'neutral' | 'positive' {
    const positiveWords = ['happy', 'joy', 'good', 'great', 'wonderful', 'peaceful', 'content', 'grateful', 'hopeful'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'depressed', 'overwhelmed', 'hopeless', 'tired'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private analyzeMoodIntensity(text: string): number {
    const intensityWords = {
      'extremely': 10, 'incredibly': 9, 'very': 8, 'really': 7, 'quite': 6,
      'somewhat': 5, 'a bit': 4, 'slightly': 3, 'barely': 2, 'hardly': 1
    };
    
    const lowerText = text.toLowerCase();
    for (const [word, intensity] of Object.entries(intensityWords)) {
      if (lowerText.includes(word)) {
        return intensity;
      }
    }
    return 5; // Default moderate intensity
  }

  private extractMoodFromText(text: string): string {
    const moodKeywords = {
      'anxious': ['anxious', 'worried', 'nervous', 'stressed'],
      'sad': ['sad', 'depressed', 'down', 'blue', 'melancholy'],
      'angry': ['angry', 'mad', 'furious', 'irritated', 'frustrated'],
      'happy': ['happy', 'joyful', 'cheerful', 'glad', 'content'],
      'overwhelmed': ['overwhelmed', 'swamped', 'buried', 'drowning'],
      'tired': ['tired', 'exhausted', 'drained', 'weary', 'fatigued'],
      'confused': ['confused', 'lost', 'uncertain', 'unclear', 'puzzled'],
      'peaceful': ['peaceful', 'calm', 'serene', 'tranquil', 'relaxed']
    };

    const lowerText = text.toLowerCase();
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return mood;
      }
    }
    return 'neutral';
  }

  private detectTherapeuticMilestones(userInput: string, aiResponse: string, reflectionDepth: number): void {
    if (!this.currentSession) return;

    const lowerInput = userInput.toLowerCase();
    
    // Detect insights
    if (lowerInput.includes('i realize') || lowerInput.includes('i understand') || lowerInput.includes('it makes sense')) {
      this.currentSession.therapeuticMilestones.push({
        type: 'insight',
        description: 'User expressed a moment of self-understanding',
        timestamp: new Date(),
        reflectionDepth
      });
    }

    // Detect coping strategies
    if (lowerInput.includes('i could try') || lowerInput.includes('maybe i should') || lowerInput.includes('i can')) {
      this.currentSession.therapeuticMilestones.push({
        type: 'coping_strategy',
        description: 'User identified potential coping mechanism',
        timestamp: new Date(),
        reflectionDepth
      });
    }

    // Detect emotional regulation
    if (lowerInput.includes('feeling better') || lowerInput.includes('calmer now') || lowerInput.includes('less anxious')) {
      this.currentSession.therapeuticMilestones.push({
        type: 'emotional_regulation',
        description: 'User reported improved emotional state',
        timestamp: new Date(),
        reflectionDepth
      });
    }
  }

  private generateSessionInsights(userInput: string, aiResponse: string): void {
    if (!this.currentSession) return;

    // Pattern recognition for emotional patterns
    if (this.currentSession.moodProgression.length >= 3) {
      const recentMoods = this.currentSession.moodProgression.slice(-3);
      const moodPattern = recentMoods.map(m => m.sentiment).join('-');
      
      if (moodPattern === 'negative-negative-positive') {
        this.currentSession.insights.push({
          category: 'emotional_pattern',
          insight: 'User shows resilience - able to move from negative to positive emotions through reflection',
          confidence: 0.8,
          supportingEvidence: ['Mood progression pattern', 'Sustained engagement']
        });
      }
    }
  }

  private updateEngagementScore(): void {
    if (!this.currentSession) return;

    let score = 0;
    
    // Base score from interactions
    score += Math.min(this.currentSession.totalInteractions * 10, 40);
    
    // Reflection depth bonus
    score += this.currentSession.maxReflectionDepth * 15;
    
    // Milestone bonus
    score += this.currentSession.therapeuticMilestones.length * 10;
    
    // Insight bonus
    score += this.currentSession.insights.length * 5;
    
    this.currentSession.engagementScore = Math.min(score, 100);
  }

  private calculateFinalEngagementScore(): void {
    if (!this.currentSession) return;

    // Add duration bonus
    if (this.currentSession.duration) {
      if (this.currentSession.duration >= 10) {
        this.currentSession.engagementScore += 10;
      } else if (this.currentSession.duration >= 5) {
        this.currentSession.engagementScore += 5;
      }
    }

    this.currentSession.engagementScore = Math.min(this.currentSession.engagementScore, 100);
  }

  private moodToNumeric(sentiment: 'negative' | 'neutral' | 'positive', intensity: number): number {
    const baseValue = sentiment === 'positive' ? 1 : sentiment === 'negative' ? -1 : 0;
    return baseValue * (intensity / 10) * 5; // Scale to -5 to +5
  }

  private getSessionsInPeriod(period: 'daily' | 'weekly' | 'monthly'): SessionMetrics[] {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (period) {
      case 'daily':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
    }

    return this.sessionHistory.filter(session => session.startTime >= cutoffDate);
  }

  private getEmptyMoodTrend(period: 'daily' | 'weekly' | 'monthly'): MoodTrend {
    return {
      period,
      averageMood: 0,
      moodVariability: 0,
      commonMoods: [],
      reflectionTrends: {
        averageDepth: 0,
        maxDepth: 0,
        engagementTrend: 'stable'
      },
      therapeuticProgress: {
        milestonesAchieved: 0,
        insightsGenerated: 0,
        copingStrategiesIdentified: 0
      }
    };
  }

  private loadSessionHistory(): void {
    try {
      const stored = localStorage.getItem('bloom_session_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.sessionHistory = parsed.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
          moodProgression: session.moodProgression.map((point: any) => ({
            ...point,
            timestamp: new Date(point.timestamp)
          })),
          therapeuticMilestones: session.therapeuticMilestones.map((milestone: any) => ({
            ...milestone,
            timestamp: new Date(milestone.timestamp)
          }))
        }));
      }
    } catch (error) {
      this.sessionHistory = [];
    }
  }

  private saveSessionHistory(): void {
    try {
      localStorage.setItem('bloom_session_history', JSON.stringify(this.sessionHistory));
    } catch (error) {
      // Silently handle error
    }
  }
}

export const sessionAnalytics = SessionAnalytics.getInstance();