"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  Layers,
  MessageSquare,
  Download,
  Upload,
  LogOut,
} from "lucide-react";
import {
  ResetSeedDataButton,
  ImportDataModal,
  exportLocalData,
} from "@/components/admin/DataManagementModals";
import { getAdminReviewRepository } from "@/lib/reviews";
import { getAdminSeasonRepository } from "@/lib/seasons";
import type { Review, Season } from "@/lib/reviews/types";
import { authClient } from "@/lib/auth/client";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [importOpen, setImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const reviewRepo = getAdminReviewRepository();
      const seasonRepo = getAdminSeasonRepository();
      const [reviews, seasons] = await Promise.all([
        reviewRepo.getAllReviews(true),
        seasonRepo.getSeasons(true),
      ]);
      exportLocalData(reviews, seasons);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data: " + String(err));
    } finally {
      setIsExporting(false);
    }
  };

  const isReviewsActive = pathname === "/admin" || pathname.startsWith("/admin/reviews");
  const isSeasonsActive = pathname.startsWith("/admin/seasons");

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white shadow-xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-[13px] font-black text-white">
                IK
              </div>
              <span className="text-sm font-black tracking-tight uppercase">
                Admin Panel
              </span>
              <span className="hidden rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 sm:inline-block">
                Hostinger MySQL
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1">
              <Link
                href="/admin/reviews"
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  isReviewsActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Reviews
              </Link>
              <Link
                href="/admin/seasons"
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  isSeasonsActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Seasons
              </Link>
            </nav>
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="hidden items-center gap-1 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 sm:flex"
              title="Export reviews and seasons to JSON file"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>

            <button
              onClick={() => setImportOpen(true)}
              className="hidden items-center gap-1 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 sm:flex"
              title="Import reviews and seasons from JSON file"
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </button>

            <ResetSeedDataButton />

            <div className="h-4 w-px bg-zinc-200" />

            <button
              type="button"
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/login";
              }}
              className="flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-black"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-1.5 text-xs font-bold text-zinc-800 transition hover:bg-zinc-200"
            >
              Live Site
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6">{children}</main>

      <ImportDataModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </div>
  );
}
