export const SUPABASE_COOKIE_NAME = "sb-sankalpdham-auth-token";

export function isSupabasePublicConfigConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(url && anonKey);
}

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables.",
    );
  }

  return { url, anonKey };
}

export function getSupabaseServerConfig() {
  const { url: publicUrl, anonKey } = getSupabasePublicConfig();
  // Inside Docker containers, SUPABASE_INTERNAL_URL points to host.docker.internal:54321
  // while browsers continue using NEXT_PUBLIC_SUPABASE_URL (http://127.0.0.1:54321).
  const url = process.env.SUPABASE_INTERNAL_URL || publicUrl;

  return { url, anonKey };
}
