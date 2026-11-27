import { redirect } from "next/navigation";
import { connection } from "next/server";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/auth/admin";
import { isSupabasePublicConfigConfigured } from "@/lib/supabase/config";

export const instant = false;

export default async function AdminLoginPage() {
  await connection();

  if (!isSupabasePublicConfigConfigured()) {
    return (
      <main className="admin-auth-page">
        <section className="admin-auth-card">
          <div className="admin-brand"><span>S</span><strong>Sankalpdham</strong></div>
          <p className="admin-eyebrow">LOCAL SETUP REQUIRED</p>
          <h1>Connect to local Supabase</h1>
          <p className="admin-auth-copy">
            Add the local Supabase API URL and publishable key to{" "}
            <code>.env.local</code>, then restart the app.
          </p>
        </section>
      </main>
    );
  }

  const session = await getAdminSession();
  if (session?.permissions.includes("dashboard.view")) redirect("/admin");

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <div className="admin-brand"><span>S</span><strong>Sankalpdham</strong></div>
        <p className="admin-eyebrow">ADMINISTRATION</p>
        <h1>Welcome back</h1>
        <p className="admin-auth-copy">Sign in with your local admin account.</p>
        <LoginForm />
        <p className="admin-auth-footnote">Authorized administrators only.</p>
      </section>
    </main>
  );
}
