import { supabase } from './supabaseClient';

export async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
  }

  return session;
}
