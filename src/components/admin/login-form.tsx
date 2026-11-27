"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to sign in.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="admin-email">Email address</label>
      <input
        autoComplete="username"
        id="admin-email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="admin@example.com"
        required
        type="email"
        value={email}
      />
      <label htmlFor="admin-password">Password</label>
      <input
        autoComplete="current-password"
        id="admin-password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Your password"
        required
        type="password"
        value={password}
      />
      {error ? <p className="admin-form-error" role="alert">{error}</p> : null}
      <button disabled={submitting} type="submit">
        {submitting ? "Signing in..." : "Sign in"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
