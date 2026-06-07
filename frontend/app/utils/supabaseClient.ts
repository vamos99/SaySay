import { createClient } from '@supabase/supabase-js';
import { getPublicEnv } from './env';

const supabaseUrl = getPublicEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are not set!');
  console.error('Please create a .env.local file in the frontend directory with:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('NEXT_PUBLIC_BACKEND_URL=http://localhost:8000');
}

// Only create client if environment variables are properly set
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client that throws helpful errors
  supabase = {
    auth: {
      signInWithPassword: () => {
        throw new Error('Supabase not configured. Please set up your .env.local file with Supabase credentials.');
      },
      signUp: () => {
        throw new Error('Supabase not configured. Please set up your .env.local file with Supabase credentials.');
      },
      signOut: async () => {
        return { error: null };
      },
      getSession: async () => {
        return { data: { session: null }, error: null };
      },
      onAuthStateChange: () => {
        return {
          data: {
            subscription: {
              unsubscribe: () => undefined,
            },
          },
        };
      }
    },
    from: () => {
      throw new Error('Supabase not configured. Please set up your .env.local file with Supabase credentials.');
    }
  };
}

export { supabase }; 
