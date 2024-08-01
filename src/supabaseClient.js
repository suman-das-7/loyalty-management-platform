import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uwsydrozcthkhruoxocm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3c3lkcm96Y3Roa2hydW94b2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDQ2NzYsImV4cCI6MjAzNjAyMDY3Nn0.Ixx55ZjjOEvoGHBxP6VBjUcJy9GfxpXXUkghtRgM3S4";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
