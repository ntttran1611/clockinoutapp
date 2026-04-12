import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase Environment Variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function test() {
  const { data, error } = await supabase.from("staff").select("*");
  console.log("data:", data);
  console.log("error:", error);
}
