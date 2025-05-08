import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for development if environment variables are not available
// In a production environment, these should be properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cciioosucdrcdnebohag.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaWlvb3N1Y2RyY2RuZWJvaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTcxOTAsImV4cCI6MjA2MjEzMzE5MH0.kX3PjRewRjbiDyjfr_x5RtbuIufv-0oUuxxQkUWwgiA';

// Initialize the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Database setup function (keeping existing functionality)
export const setupDatabase = async () => {
  // For mock data in development, this function doesn't need to run
  console.log('Using mock data for development');
};

// Don't call setupDatabase in development when using mock data
// setupDatabase();
