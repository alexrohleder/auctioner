import { createClient } from "@supabase/supabase-js";

const key =
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);

export default supabase;
