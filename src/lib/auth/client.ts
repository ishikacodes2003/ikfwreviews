"use client";

import { useCallback, useEffect, useState } from "react";

export type ClientUser = { id: string; name: string; email: string; emailVerified: boolean; image: string | null };

async function request(action: string, body?: Record<string, unknown>) {
  const response = await fetch("/api/auth", { method: body ? "POST" : "GET", headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify({ action, ...body }) : undefined, credentials: "include", cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export const authClient = {
  async signIn(email: string, password: string) { return request("sign-in", { email, password }); },
  async signUp(email: string, password: string, name: string) { return request("sign-up", { email, password, name }); },
  async signOut() { return request("sign-out"); },
  async session() { return request("session"); },
};

export function useAuthSession() {
  const [data, setData] = useState<{ user: ClientUser | null } | null>(null);
  const [isPending, setPending] = useState(true);
  const refresh = useCallback(async () => {
    setPending(true);
    try { const { data } = await authClient.session(); setData(data); } finally { setPending(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { data, isPending, refresh };
}
