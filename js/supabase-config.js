// ===== Supabase Configuration =====

const SUPABASE_URL = "https://dekgzmoqbwkumtmrejzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1uF6804PiR2wNTILP4RHzg_r9qloaQA";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
