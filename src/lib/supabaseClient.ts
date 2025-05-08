
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cciioosucdrcdnebohag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaWlvb3N1Y2RyY2RuZWJvaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTcxOTAsImV4cCI6MjA2MjEzMzE5MH0.kX3PjRewRjbiDyjfr_x5RtbuIufv-0oUuxxQkUWwgiA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
