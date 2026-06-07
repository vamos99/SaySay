import { createClient } from '@supabase/supabase-js';
import { getRequiredPublicEnv } from '@/utils/env';

const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
