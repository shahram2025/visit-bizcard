// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Configuration validation
const validateConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const errorMessage = `
      Missing Supabase configuration!
      Please ensure you have the following in your .env file:
      VITE_SUPABASE_URL=your-project-url
      VITE_SUPABASE_ANON_KEY=your-anon-key
      
      Current values:
      VITE_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}
      VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅' : '❌'}
    `;
    console.error(errorMessage);
    throw new Error('Supabase configuration is missing');
  }

  return { supabaseUrl, supabaseKey };
};

// Initialize Supabase client
const initSupabase = () => {
  try {
    const { supabaseUrl, supabaseKey } = validateConfig();
    
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined,
      },
      global: {
        headers: { 'x-application-name': 'visit-app' }
      }
    };

    const supabase = createClient(supabaseUrl, supabaseKey, options);

    // Test connection
    if (typeof window !== 'undefined') {
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          console.debug('Supabase initialized:', session ? '✅ User logged in' : '✅ No active session');
        })
        .catch((error) => {
          console.error('Supabase connection test failed:', error.message);
        });
    }

    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error.message);
    // Return a mock client in development to prevent crashes
    if (import.meta.env.DEV) {
      console.warn('Returning mock Supabase client for development');
      return {
        auth: {
          signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
          signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
          signOut: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        }
      };
    }
    throw error;
  }
};

export const supabase = initSupabase();

// Helper types for TypeScript (optional)
/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient} SupabaseClient
 * @typedef {import('@supabase/supabase-js').Session} Session
 * @typedef {import('@supabase/supabase-js').User} User
 */

export default supabase;