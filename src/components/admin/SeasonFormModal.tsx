"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Season } from "@/lib/reviews/types";

interface SeasonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seasonData: Season) => Promise<void> | void;
  seasonToEdit?: Season | null;
  existingSeasonsCount?: number;
}

export function SeasonFormModal({
  isOpen,
  onClose,
  onSave,
  seasonToEdit,
  existingSeasonsCount = 13,
}: SeasonFormModalProps) {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [id, setId] = useState("");
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(14);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (seasonToEdit) {
      setName(seasonToEdit.name);
      setShortName(seasonToEdit.shortName || "");
      setId(seasonToEdit.id);
      setActive(seasonToEdit.active);
      setSortOrder(seasonToEdit.sortOrder ?? 0);
    } else {
      const nextNum = existingSeasonsCount + 1;
      setName(`India Kids Fashion Week - Season ${nextNum}`);
      setShortName(`Season ${nextNum}`);
      setId(`season-${nextNum}`);
      setActive(true);
      setSortOrder(nextNum);
    }
  }, [seasonToEdit, isOpen, existingSeasonsCount]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!seasonToEdit) {
      const match = val.match(/Season\s*(\d+)/i);
      if (match) {
        setShortName(`Season ${match[1]}`);
        setId(`season-${match[1]}`);
        setSortOrder(parseInt(match[1], 10));
      } else {
        const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        if (slug) setId(slug);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !id.trim()) return;

    setIsSaving(true);
    try {
      const seasonPayload: Season = {
        id: id.trim(),
        name: name.trim(),
        shortName: shortName.trim() || name.trim(),
        active,
        sortOrder: Number(sortOrder) || 0,
      };

      await onSave(seasonPayload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-lg font-bold text-zinc-900">
            {seasonToEdit ? "Edit Season" : "+ Add New Season"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-semibold text-zinc-800">
          <div>
            <label className="block text-zinc-700">
              Season Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. India Kids Fashion Week - Season 14"
              className="mt-1 h-9 w-full rounded border border-zinc-200 px-3 text-xs font-normal outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700">Short Name</label>
              <input
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. Season 14"
                className="mt-1 h-9 w-full rounded border border-zinc-200 px-3 text-xs font-normal outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-zinc-700">Season ID</label>
              <input
                required
                disabled={!!seasonToEdit}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. season-14"
                className="mt-1 h-9 w-full rounded border border-zinc-200 px-3 font-mono text-xs font-normal outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-700">Sort Order (Higher displays first)</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="mt-1 h-9 w-full rounded border border-zinc-200 px-3 text-xs font-normal outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active-checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
            />
            <label htmlFor="active-checkbox" className="cursor-pointer text-xs font-semibold text-zinc-800">
              Active (Visible in Write Review & Filters)
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-black text-white hover:bg-zinc-800"
            >
              {isSaving ? "Saving..." : seasonToEdit ? "Update Season" : "Create Season"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
