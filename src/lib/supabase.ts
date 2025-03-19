import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = "https://iuybhwwjbaqcdkgwwuuz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eWJod3dqYmFxY2RrZ3d3dXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzODI4MDEsImV4cCI6MjA1Nzk1ODgwMX0.KQCfaG17MDl4S0ipADAAvg_gsH7eILaXy6c3ZycQWB4";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
