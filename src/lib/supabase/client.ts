import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig, SUPABASE_COOKIE_NAME } from "./config";

export function createClient() {
  const { url, anonKey } = getSupabasePublicConfig();

  return createBrowserClient(url, anonKey, {
    cookieOptions: {
      name: SUPABASE_COOKIE_NAME,
    },
  });
}
