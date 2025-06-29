import { createClient } from '@supabase/supabase-js';

// Updated Supabase project configuration
const supabaseUrl = 'https://kyztjfejpbbknclwqwvj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5enRqZmVqcGJia25jbHdxd3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDc5NjAsImV4cCI6MjA2NTk4Mzk2MH0.mT3jNPdFmC-ZFW5sUqahdhuFTy8xHKMR2seu-JrEClw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface MoodLog {
  id?: number;
  feeling: string;
  response_text: string;
  created_at?: string;
  is_followup?: boolean;
  session_id?: string;
  reflection_depth?: number;
}

// Function to log mood and AI response
export async function logMoodEntry(
  feeling: string, 
  responseText: string, 
  isFollowup: boolean = false,
  sessionId?: string,
  reflectionDepth: number = 1
): Promise<MoodLog | null> {
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .insert([
        {
          feeling: feeling,
          response_text: responseText,
          is_followup: isFollowup,
          session_id: sessionId,
          reflection_depth: reflectionDepth
        }
      ])
      .select()
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

// Function to get recent mood logs (for future analytics features)
export async function getRecentMoodLogs(limit: number = 10): Promise<MoodLog[]> {
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

// Function to get session logs
export async function getSessionLogs(sessionId: string): Promise<MoodLog[]> {
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

// Enhanced connection test function
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('mood_logs')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Function to get table info for debugging
export async function getTableInfo(): Promise<void> {
  try {
    // Try to get some sample data
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .limit(5);

    if (error) {
      // Silently handle error
    }
  } catch (error) {
    // Silently handle error
  }
}