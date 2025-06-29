import { supabase } from './supabaseClient';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  has_created_conversation: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  };
  private listeners: ((state: AuthState) => void)[] = [];

  private constructor() {
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize authentication state
  private async initializeAuth() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        this.updateAuthState({ error: error.message, loading: false });
        return;
      }

      if (session?.user) {
        await this.handleUserSession(session);
      } else {
        this.updateAuthState({ loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await this.handleUserSession(session);
        } else {
          this.updateAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null
          });
        }
      });

    } catch (error) {
      this.updateAuthState({ 
        error: 'Failed to initialize authentication', 
        loading: false 
      });
    }
  }

  // Handle user session and load profile
  private async handleUserSession(session: Session) {
    try {
      const profile = await this.loadUserProfile(session.user.id);
      
      this.updateAuthState({
        user: session.user,
        profile,
        session,
        loading: false,
        error: null
      });

    } catch (error) {
      this.updateAuthState({
        user: session.user,
        profile: null,
        session,
        loading: false,
        error: 'Failed to load user profile'
      });
    }
  }

  // Load or create user profile
  private async loadUserProfile(userId: string): Promise<UserProfile> {
    try {
      // Try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile && !fetchError) {
        return existingProfile;
      }

      // Create new profile if it doesn't exist
      const { data: user } = await supabase.auth.getUser();
      const newProfile = {
        id: userId,
        email: user.user?.email || '',
        full_name: user.user?.user_metadata?.full_name || user.user?.user_metadata?.name || null,
        avatar_url: user.user?.user_metadata?.avatar_url || null,
        has_created_conversation: false
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return createdProfile;

    } catch (error) {
      throw error;
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.updateAuthState({ loading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        this.updateAuthState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Note: User will need to confirm email before they can sign in
      this.updateAuthState({ loading: false });
      return { success: true };

    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign up';
      this.updateAuthState({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.updateAuthState({ loading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.updateAuthState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Auth state will be updated via the onAuthStateChange listener
      return { success: true };

    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign in';
      this.updateAuthState({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      this.updateAuthState({ loading: true, error: null });

      const { error } = await supabase.auth.signOut();

      if (error) {
        this.updateAuthState({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }

      // Clear local storage
      localStorage.removeItem('bloom_chat_sessions');
      localStorage.removeItem('bloom_session_history');
      
      return { success: true };

    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign out';
      this.updateAuthState({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  // Mark that user has created their first conversation
  async markFirstConversationCreated(): Promise<void> {
    if (!this.authState.user || !this.authState.profile) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          has_created_conversation: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.authState.user.id);

      if (error) {
        return;
      }

      // Update local state
      if (this.authState.profile) {
        this.updateAuthState({
          profile: {
            ...this.authState.profile,
            has_created_conversation: true
          }
        });
      }

    } catch (error) {
      // Silently handle error
    }
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Update auth state and notify listeners
  private updateAuthState(updates: Partial<AuthState>) {
    this.authState = { ...this.authState, ...updates };
    this.listeners.forEach(listener => listener(this.authState));
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}

export const authService = AuthService.getInstance();