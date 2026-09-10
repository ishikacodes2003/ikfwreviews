import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser, getUserRole } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/reviews");

  const role = await getUserRole(user.id);
  if (role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-5">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-7 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Access denied</p>
          <h1 className="mt-2 text-2xl font-black">Admin role required</h1>
          <p className="mt-3 text-sm text-zinc-600">
            You are signed in as {user.email}, but this account is not an administrator.
          </p>
          <Link href="/" className="mt-6 inline-flex rounded bg-black px-4 py-2 text-sm font-bold text-white">
            Return to reviews
          </Link>
        </div>
      </main>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
