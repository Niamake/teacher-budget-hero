
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmixcdynzknxvbgpnthp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaXhjZHluemtueHZiZ3BudGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTk4MzEsImV4cCI6MjA1Nzk5NTgzMX0.WLhmtCONxifKvn4WCDc6ApBT1omu_eh-vQmSPJRvRks";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
