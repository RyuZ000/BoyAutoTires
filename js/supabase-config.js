/* ============================================================
   Supabase Configuration
   ------------------------------------------------------------
   1. Go to https://supabase.com -> create a free project
   2. Project Settings -> API
   3. Copy "Project URL" and "anon / public" key below
   4. This file is safe to be public (the anon key is meant to
      be used in the browser). Real security comes from the
      Row Level Security policies in supabase-schema.sql
   ============================================================ */

const SUPABASE_URL = "https://bseywzhzmeiqwpdpdfei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bqtnkrjt0Do78-7k06NY5Q_NPiaJ8Em";

// Shared Supabase client used by every page (auth.js, products.js, admin.html)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
