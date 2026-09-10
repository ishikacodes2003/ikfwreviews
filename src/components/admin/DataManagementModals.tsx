"use client";

import { useState } from "react";
import { Download, Upload, RefreshCw, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "./ConfirmDialog";
import { requestJson } from "@/lib/api/client";
import type { Review, Season } from "@/lib/reviews/types";

interface DataManagementProps {
  onDataChanged?: () => void;
}

export function exportLocalData(reviews: Review[], seasons: Season[]): void {
  const exportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    totalReviews: reviews.length,
    totalSeasons: seasons.length,
    reviews,
    seasons,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ikfw-admin-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ImportDataModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmPending, setConfirmPending] = useState(false);
  const [parsedData, setParsedData] = useState<{ reviews: Review[]; seasons: Season[] } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        validateAndParse(text);
      } catch (err) {
        setError("Could not read file: " + (err instanceof Error ? err.message : String(err)));
      }
    };
    reader.readAsText(file);
  };

  const validateAndParse = (rawText: string) => {
    setError(null);
    try {
      const data = JSON.parse(rawText);
      if (!data || typeof data !== "object") {
        throw new Error("Invalid JSON root: Expected an object.");
      }

      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      const seasons = Array.isArray(data.seasons) ? data.seasons : [];

      if (reviews.length === 0 && seasons.length === 0) {
        throw new Error("JSON must contain at least one 'reviews' array or 'seasons' array.");
      }

      setParsedData({ reviews, seasons });
      return { reviews, seasons };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
      setParsedData(null);
      return null;
    }
  };

  const handleApplyImport = async () => {
    if (!parsedData) {
      const parsed = validateAndParse(jsonText);
      if (!parsed) return;
      setConfirmPending(true);
      return;
    }
    setConfirmPending(true);
  };

  const executeImport = async () => {
    if (!parsedData) return;

    try {
      await requestJson("/api/admin/import", {
        method: "POST",
        body: JSON.stringify(parsedData),
      });

      setConfirmPending(false);
      onClose();
      if (onSuccess) onSuccess();
      window.location.reload();
    } catch (err) {
      setError("Import failed: " + (err instanceof Error ? err.message : String(err)));
      setConfirmPending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Import Data (JSON)</h3>
              <p className="mt-1 text-xs text-zinc-500">
                Upload a JSON file or paste exported data to replace the database contents.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700">Upload JSON File</label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="mt-1 block w-full text-xs text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-zinc-800 hover:file:bg-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700">Or Paste JSON Data</label>
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  validateAndParse(e.target.value);
                }}
                placeholder='{"reviews": [...], "seasons": [...]}'
                className="mt-1 h-36 w-full rounded border border-zinc-200 p-2 font-mono text-xs outline-none focus:border-black"
              />
            </div>

            {error ? (
              <div className="flex items-center gap-2 rounded bg-red-50 p-2 text-xs font-medium text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {parsedData ? (
              <div className="rounded bg-emerald-50 p-2 text-xs font-medium text-emerald-800">
                ✓ Validated: Ready to import {parsedData.reviews.length} reviews and {parsedData.seasons.length} seasons.
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <Button
              type="button"
              disabled={!parsedData || !!error}
              onClick={handleApplyImport}
              className="bg-black text-white hover:bg-zinc-800"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Import Data
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmPending}
        title="Confirm Data Import"
        description={`Importing will overwrite the current database reviews (${parsedData?.reviews.length || 0} items) and seasons (${parsedData?.seasons.length || 0} items). Are you sure you want to proceed?`}
        confirmLabel="Overwrite & Import"
        isDestructive={true}
        onConfirm={executeImport}
        onCancel={() => setConfirmPending(false)}
      />
    </>
  );
}

export function ResetSeedDataButton({ onResetComplete }: { onResetComplete?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = async () => {
    await requestJson("/api/admin/reset", { method: "POST", body: "{}" });
    setIsOpen(false);
    if (onResetComplete) onResetComplete();
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        title="Reset the database and restore original reviews and seasons"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Reset to Seed Data
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title="Reset to Seed Data?"
        description="This will clear all database additions, edits, and deletions, restoring the initial 25 reviews and default seasons. This action cannot be undone."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={handleReset}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
