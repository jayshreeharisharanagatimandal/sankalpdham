import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { isSupabasePublicConfigConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabasePublicConfigConfigured()) {
    return NextResponse.json({ error: "Local Supabase is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    typeof body !== "object" || body === null ||
    !("email" in body) || !("password" in body) ||
    typeof body.email !== "string" || typeof body.password !== "string" ||
    !body.email.trim() || !body.password
  ) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: body.email.trim(),
    password: body.password,
  });
  if (error) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  const session = await getAdminSession();
  if (!session?.permissions.includes("dashboard.view")) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    return NextResponse.json({ error: "This account does not have admin access." }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
