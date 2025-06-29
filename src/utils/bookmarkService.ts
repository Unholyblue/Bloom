import { supabase } from './supabaseClient';

// Generate a unique user ID for the current session if not already exists
export function getUserId(): string {
  let userId = localStorage.getItem('bloom_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('bloom_user_id', userId);
  }
  return userId;
}

// Fetch all bookmarks for the current user
export async function fetchUserBookmarks(): Promise<string[]> {
  try {
    const userId = getUserId();
    
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('source_id')
      .eq('user_session', userId);
    
    if (error) {
      // Fall back to local storage
      return getLocalBookmarks();
    }
    
    // Return the resource IDs
    return data.map(item => item.source_id);
  } catch (error) {
    // Fall back to local storage
    return getLocalBookmarks();
  }
}

// Add a bookmark
export async function addBookmark(resourceId: string): Promise<boolean> {
  try {
    const userId = getUserId();
    
    // Try to add to Supabase
    const { error } = await supabase
      .from('user_bookmarks')
      .insert([
        { user_session: userId, source_id: resourceId }
      ]);
    
    if (error) {
      // If it's a duplicate error, that's okay
      if (error.code === '23505') {
        return true;
      }
      
      // Fall back to local storage
      return addLocalBookmark(resourceId);
    }
    
    return true;
  } catch (error) {
    // Fall back to local storage
    return addLocalBookmark(resourceId);
  }
}

// Remove a bookmark
export async function removeBookmark(resourceId: string): Promise<boolean> {
  try {
    const userId = getUserId();
    
    // Try to remove from Supabase
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_session', userId)
      .eq('source_id', resourceId);
    
    if (error) {
      // Fall back to local storage
      return removeLocalBookmark(resourceId);
    }
    
    return true;
  } catch (error) {
    // Fall back to local storage
    return removeLocalBookmark(resourceId);
  }
}

// Toggle a bookmark (add if not exists, remove if exists)
export async function toggleBookmark(resourceId: string): Promise<boolean> {
  try {
    const userId = getUserId();
    
    // Check if bookmark exists
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_session', userId)
      .eq('source_id', resourceId);
    
    if (error) {
      // Fall back to local storage
      return toggleLocalBookmark(resourceId);
    }
    
    // If bookmark exists, remove it
    if (data && data.length > 0) {
      return !(await removeBookmark(resourceId));
    }
    
    // Otherwise, add it
    return await addBookmark(resourceId);
  } catch (error) {
    // Fall back to local storage
    return toggleLocalBookmark(resourceId);
  }
}

// Check if a resource is bookmarked
export async function isBookmarked(resourceId: string): Promise<boolean> {
  try {
    const userId = getUserId();
    
    // Try to check in Supabase
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_session', userId)
      .eq('source_id', resourceId);
    
    if (error) {
      // Fall back to local storage
      return isLocalBookmarked(resourceId);
    }
    
    return data && data.length > 0;
  } catch (error) {
    // Fall back to local storage
    return isLocalBookmarked(resourceId);
  }
}

// Sync local bookmarks to Supabase
export async function syncLocalBookmarksToSupabase(): Promise<void> {
  try {
    const localBookmarks = getLocalBookmarks();
    const userId = getUserId();
    
    // Skip if no local bookmarks
    if (localBookmarks.length === 0) {
      return;
    }
    
    // Prepare the data for insertion
    const bookmarksToInsert = localBookmarks.map(resourceId => ({
      user_session: userId,
      source_id: resourceId
    }));
    
    // Insert all bookmarks
    const { error } = await supabase
      .from('user_bookmarks')
      .upsert(bookmarksToInsert, { 
        onConflict: 'user_session,source_id',
        ignoreDuplicates: true 
      });
    
    if (error) {
      return;
    }
    
    // Clear local bookmarks after successful sync
    localStorage.removeItem('bloom_bookmarks');
  } catch (error) {
    // Silently handle error
  }
}

// Local storage fallback functions
function getLocalBookmarks(): string[] {
  try {
    const bookmarks = localStorage.getItem('bloom_bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    return [];
  }
}

function addLocalBookmark(resourceId: string): boolean {
  try {
    const bookmarks = getLocalBookmarks();
    if (!bookmarks.includes(resourceId)) {
      bookmarks.push(resourceId);
      localStorage.setItem('bloom_bookmarks', JSON.stringify(bookmarks));
    }
    return true;
  } catch (error) {
    return false;
  }
}

function removeLocalBookmark(resourceId: string): boolean {
  try {
    const bookmarks = getLocalBookmarks();
    const updatedBookmarks = bookmarks.filter(id => id !== resourceId);
    localStorage.setItem('bloom_bookmarks', JSON.stringify(updatedBookmarks));
    return true;
  } catch (error) {
    return false;
  }
}

function toggleLocalBookmark(resourceId: string): boolean {
  try {
    const bookmarks = getLocalBookmarks();
    if (bookmarks.includes(resourceId)) {
      return removeLocalBookmark(resourceId);
    } else {
      return addLocalBookmark(resourceId);
    }
  } catch (error) {
    return false;
  }
}

function isLocalBookmarked(resourceId: string): boolean {
  try {
    const bookmarks = getLocalBookmarks();
    return bookmarks.includes(resourceId);
  } catch (error) {
    return false;
  }
}

// Test database connection
export async function testBookmarkDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}