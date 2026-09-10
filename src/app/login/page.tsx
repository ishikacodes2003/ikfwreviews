"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

type Mode = "sign-in" | "sign-up";
type Step = "auth" | "verify";

function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requestedNext = searchParams.get("next");
  const destination = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError(null);
    try {
      const result = mode === "sign-up" ? await authClient.signUp(email, password, name) : await authClient.signIn(email, password);
      if (!result.response.ok) { setError(result.data?.error || "Authentication failed. Please try again."); return; }
      window.location.assign(destination);
    } catch { setError("Unable to reach the authentication service. Please try again."); } finally { setSubmitting(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-5">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-7 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white"><LockKeyhole className="h-5 w-5" /></div>
        <h1 className="mt-5 text-2xl font-black tracking-tight">{mode === "sign-in" ? "Sign in" : "Create your account"}</h1>
        <p className="mt-1 text-xs text-zinc-500">Sign in to write a review or access your account.</p>
        <div className="mt-5 grid grid-cols-2 rounded bg-zinc-100 p-1 text-xs font-bold">
          <button type="button" onClick={() => { setMode("sign-in"); setError(null); }} className={`rounded px-3 py-2 ${mode === "sign-in" ? "bg-white shadow-sm" : "text-zinc-500"}`}>Sign in</button>
          <button type="button" onClick={() => { setMode("sign-up"); setError(null); }} className={`rounded px-3 py-2 ${mode === "sign-up" ? "bg-white shadow-sm" : "text-zinc-500"}`}>Sign up</button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {mode === "sign-up" ? <label className="block text-xs font-bold text-zinc-700">Name<input autoFocus required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-10 w-full rounded border border-zinc-300 px-3 text-sm outline-none focus:border-black" /></label> : null}
          <label className="block text-xs font-bold text-zinc-700">
            {mode === "sign-in" ? "Email or Username" : "Email"}
            <input
              autoFocus={mode === "sign-in"}
              required
              type={mode === "sign-in" ? "text" : "email"}
              autoComplete={mode === "sign-in" ? "username" : "email"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 h-10 w-full rounded border border-zinc-300 px-3 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="block text-xs font-bold text-zinc-700">
            Password
            <input
              required
              minLength={mode === "sign-up" ? 8 : undefined}
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 h-10 w-full rounded border border-zinc-300 px-3 text-sm outline-none focus:border-black"
            />
          </label>
          {error ? <p className="rounded bg-red-50 p-2 text-xs text-red-700">{error}</p> : null}
          <Button disabled={submitting} className="h-10 w-full bg-black text-white">{submitting ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}</Button>
        </form>
        <Link href="/" className="mt-5 block text-center text-xs font-semibold text-zinc-500 hover:text-black">Continue browsing reviews</Link>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-zinc-100" />}>
      <LoginForm />
    </Suspense>
  );
}
