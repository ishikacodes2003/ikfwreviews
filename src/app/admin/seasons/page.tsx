"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Layers,
  Pencil,
  Plus,
  Power,
  Trash2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SeasonFormModal } from "@/components/admin/SeasonFormModal";
import { getAdminReviewRepository } from "@/lib/reviews";
import { getAdminSeasonRepository } from "@/lib/seasons";
import type { Review, Season } from "@/lib/reviews/types";

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [deleteConfirmSeason, setDeleteConfirmSeason] = useState<Season | null>(null);
  const [blockedDeleteSeason, setBlockedDeleteSeason] = useState<{ season: Season; count: number } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const seasonRepo = getAdminSeasonRepository();
      const reviewRepo = getAdminReviewRepository();
      const [allSeasons, allReviews] = await Promise.all([
        seasonRepo.getSeasons(true),
        reviewRepo.getAllReviews(true),
      ]);
      setSeasons(allSeasons);
      setReviews(allReviews);
    } catch (err) {
      console.error("Failed to load seasons:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

  }, [loadData]);

  // Compute review count per season
  const reviewCountBySeason = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of reviews) {
      if (r.seasonId) {
        map.set(r.seasonId, (map.get(r.seasonId) || 0) + 1);
      }
    }
    return map;
  }, [reviews]);

  const handleToggleActive = async (season: Season) => {
    const seasonRepo = getAdminSeasonRepository();
    await seasonRepo.updateSeason(season.id, { active: !season.active });
    await loadData();
  };

  const handleSaveSeason = async (seasonData: Season) => {
    const seasonRepo = getAdminSeasonRepository();
    if (editingSeason) {
      await seasonRepo.updateSeason(seasonData.id, seasonData);
    } else {
      await seasonRepo.createSeason(seasonData);
    }
    await loadData();
  };

  const handleDeleteRequest = (season: Season) => {
    const count = reviewCountBySeason.get(season.id) || 0;
    if (count > 0) {
      setBlockedDeleteSeason({ season, count });
    } else {
      setDeleteConfirmSeason(season);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmSeason) return;
    const seasonRepo = getAdminSeasonRepository();
    await seasonRepo.deleteSeason(deleteConfirmSeason.id);
    setDeleteConfirmSeason(null);
    await loadData();
  };

  const openAddModal = () => {
    setEditingSeason(null);
    setFormModalOpen(true);
  };

  const openEditModal = (season: Season) => {
    setEditingSeason(season);
    setFormModalOpen(true);
  };

  const activeCount = seasons.filter((s) => s.active).length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            Seasons Management
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Total: <strong>{seasons.length}</strong> seasons ({activeCount} active, {seasons.length - activeCount} inactive)
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex h-9 items-center gap-1.5 rounded-md bg-black px-4 text-xs font-bold text-white hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Add Season
        </Button>
      </div>

      {/* Seasons Table / Card List */}
      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-500">
          Loading seasons...
        </div>
      ) : seasons.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-zinc-700">No seasons found.</p>
          <Button onClick={openAddModal} className="mt-4 bg-black text-white">
            Create First Season
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="border-b border-zinc-200 bg-zinc-50/80 font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Season Name</th>
                <th className="px-3 py-3">Short Name</th>
                <th className="px-3 py-3">Season ID</th>
                <th className="px-3 py-3">Reviews Attached</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {seasons.map((season) => {
                const count = reviewCountBySeason.get(season.id) || 0;

                return (
                  <tr
                    key={season.id}
                    className={`transition-colors hover:bg-zinc-50/80 ${
                      !season.active ? "bg-zinc-50/50 opacity-75" : ""
                    }`}
                  >
                    {/* Season Name */}
                    <td className="px-4 py-3 align-middle font-bold text-zinc-900">
                      {season.name}
                    </td>

                    {/* Short Name */}
                    <td className="px-3 py-3 align-middle font-medium text-zinc-700">
                      {season.shortName || "—"}
                    </td>

                    {/* Season ID */}
                    <td className="px-3 py-3 align-middle font-mono text-zinc-500">
                      {season.id}
                    </td>

                    {/* Attached Reviews */}
                    <td className="px-3 py-3 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          count > 0 ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        {count} review{count === 1 ? "" : "s"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          season.active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {season.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(season)}
                          className="rounded border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-100 hover:text-black"
                          title="Edit Season"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(season)}
                          className={`rounded border p-1.5 transition ${
                            season.active
                              ? "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-black"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          title={season.active ? "Disable Season (hide from Write Review)" : "Enable Season"}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(season)}
                          className="rounded border border-zinc-200 bg-white p-1.5 text-red-600 hover:border-red-200 hover:bg-red-50"
                          title="Delete Season"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Season Add/Edit Modal */}
      <SeasonFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveSeason}
        seasonToEdit={editingSeason}
        existingSeasonsCount={seasons.length}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmSeason}
        title="Delete Season?"
        description={`Are you sure you want to delete "${deleteConfirmSeason?.name}" (${deleteConfirmSeason?.id})? This season currently has 0 reviews attached.`}
        confirmLabel="Delete Season"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmSeason(null)}
      />

      {/* Blocked Delete Alert Dialog */}
      <ConfirmDialog
        isOpen={!!blockedDeleteSeason}
        title="Cannot Delete Season"
        description={`"${blockedDeleteSeason?.season.name}" is currently referenced by ${blockedDeleteSeason?.count} review(s). To preserve data integrity, disable the season instead or reassign those reviews before deleting.`}
        confirmLabel="Got It"
        cancelLabel="Close"
        isDestructive={false}
        onConfirm={() => setBlockedDeleteSeason(null)}
        onCancel={() => setBlockedDeleteSeason(null)}
      />
    </div>
  );
}
