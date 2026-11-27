import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { hasAdminPermission } from "@/lib/auth/admin";

export const instant = false;

export default async function AdminPage() {
  await connection();
  const session = await hasAdminPermission("dashboard.view");
  if (!session) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <span>S</span><strong>Sankalpdham</strong>
        </Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          <Link className="selected" href="/admin"><span>◫</span> Overview</Link>
          <span className="disabled"><span>♙</span> Users <small>SOON</small></span>
          <span className="disabled"><span>◇</span> Roles &amp; permissions <small>SOON</small></span>
          <span className="disabled"><span>◷</span> Activity logs <small>SOON</small></span>
        </nav>
        <form action="/api/admin/auth/logout" className="admin-logout" method="post">
          <button type="submit">↗ &nbsp; Sign out</button>
        </form>
      </aside>
      <main className="admin-content">
        <header className="admin-topbar">
          <span>Workspace <span className="slash">/</span> <strong>Overview</strong></span>
          <div className="admin-user">
            <span><strong>{session.email}</strong><small>{session.roleName}</small></span>
            <b>{session.email.slice(0, 1).toUpperCase() || "A"}</b>
          </div>
        </header>
        <div className="admin-dashboard">
          <div className="admin-heading">
            <div>
              <p className="admin-eyebrow">YOUR WORKSPACE</p>
              <h1>Admin overview</h1>
              <p>Welcome back. Here&apos;s your workspace at a glance.</p>
            </div>
            <span className="admin-date">
              {new Intl.DateTimeFormat("en", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
              }).format(new Date())}
            </span>
          </div>
          <section className="admin-summary">
            <article>
              <span className="summary-icon purple">♙</span>
              <small>USER MANAGEMENT</small>
              <h2>Coming soon</h2>
              <p>The user directory will be available here.</p>
            </article>
            <article>
              <span className="summary-icon green">◇</span>
              <small>YOUR ACCESS</small>
              <h2>{session.roleName}</h2>
              <p>Your role determines the tools available to you.</p>
            </article>
            <article>
              <span className="summary-icon orange">✦</span>
              <small>PERMISSIONS</small>
              <h2>{session.permissions.length} enabled</h2>
              <p>Capabilities assigned to your admin role.</p>
            </article>
          </section>
          <section className="admin-panels">
            <article className="admin-welcome-panel">
              <small>GETTING STARTED</small>
              <h2>Your local admin workspace is ready.</h2>
              <p>
                You are connected to local Supabase as {session.roleName}.
                User management can be added here next.
              </p>
              <a href="http://127.0.0.1:54323" rel="noreferrer" target="_blank">
                Open Supabase Studio <span aria-hidden="true">↗</span>
              </a>
            </article>
            <article className="admin-account-panel">
              <h2>Account details</h2>
              <p>Your current admin identity</p>
              <dl>
                <div><dt>Email address</dt><dd>{session.email}</dd></div>
                <div><dt>Assigned role</dt><dd>{session.roleName}</dd></div>
                <div><dt>Account status</dt><dd className="account-active">● Active</dd></div>
              </dl>
            </article>
          </section>
          <footer className="admin-footer">
            <span>Sankalpdham Admin</span><span>Local Supabase · Role-based access</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
