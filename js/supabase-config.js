// ===== Supabase Configuration =====
// 1. Go to https://supabase.com and create a free project
// 2. Go to Project Settings -> API
// 3. Copy "Project URL" and "anon public" key below

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"; // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
