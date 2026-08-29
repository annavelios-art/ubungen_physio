import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabaseUrl || !supabasePublishableKey) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabasePublishableKey },
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}
