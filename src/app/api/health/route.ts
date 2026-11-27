import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();

  const supabaseUrl =
    process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      status: "ok",
      supabase: {
        configured: false,
        connected: false,
      },
    });
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseKey,
      },
      cache: "no-store",
    });

    return NextResponse.json(
      {
        status: "ok",
        supabase: {
          configured: true,
          connected: res.ok,
          httpStatus: res.status,
        },
      },
      { status: res.ok ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        supabase: {
          configured: true,
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 503 },
    );
  }
}
