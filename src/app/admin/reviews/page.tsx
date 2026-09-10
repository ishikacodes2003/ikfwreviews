"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Filter,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReviewFormModal } from "@/components/admin/ReviewFormModal";
import { getAdminReviewRepository } from "@/lib/reviews";
import { getAdminSeasonRepository } from "@/lib/seasons";
import { filterAndSortReviews, formatRelativeDate, resolveSeasonName } from "@/lib/reviews/stats";
import type { Review, Season, ReviewSortOption } from "@/lib/reviews/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("all");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "hidden">("all");
  const [selectedVerified, setSelectedVerified] = useState<"all" | "verified" | "unverified">("all");
  const [sortOption, setSortOption] = useState<ReviewSortOption>("Most Recent");

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteConfirmReview, setDeleteConfirmReview] = useState<Review | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadData = useCallback(async () => {
    try {
      const reviewRepo = getAdminReviewRepository();
      const seasonRepo = getAdminSeasonRepository();
      const [allReviews, allSeasons] = await Promise.all([
        reviewRepo.getAllReviews(true),
        seasonRepo.getSeasons(true),
      ]);
      setReviews(allReviews);
      setSeasons(allSeasons);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

  }, [loadData]);

  // Filtered and Sorted reviews
  const filteredReviews = useMemo(() => {
    let list = filterAndSortReviews(reviews, {
      searchQuery,
      seasonId: selectedSeasonId,
      rating: selectedRating,
      sort: sortOption,
      status: selectedStatus,
      includeHidden: true,
      verifiedOnly: selectedVerified === "verified",
    });

    if (selectedVerified === "unverified") {
      list = list.filter((r) => !r.verified);
    }

    return list;
  }, [reviews, searchQuery, selectedSeasonId, selectedRating, sortOption, selectedStatus, selectedVerified]);

  // Paged reviews
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  // Actions
  const handleToggleStatus = async (review: Review) => {
    const newStatus = review.status === "published" ? "hidden" : "published";
    const reviewRepo = getAdminReviewRepository();
    await reviewRepo.updateReview(review.id, { status: newStatus });
    await loadData();
  };

  const handleSaveReview = async (reviewData: Review) => {
    const reviewRepo = getAdminReviewRepository();
    if (editingReview) {
      await reviewRepo.updateReview(reviewData.id, reviewData);
    } else {
      await reviewRepo.createReview(reviewData);
    }
    await loadData();
  };

  const handleDeleteReview = async () => {
    if (!deleteConfirmReview) return;
    const reviewRepo = getAdminReviewRepository();
    await reviewRepo.deleteReview(deleteConfirmReview.id);
    setDeleteConfirmReview(null);
    await loadData();
  };

  const openAddModal = () => {
    setEditingReview(null);
    setFormModalOpen(true);
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setFormModalOpen(true);
  };

  const publishedCount = reviews.filter((r) => r.status === "published").length;
  const hiddenCount = reviews.filter((r) => r.status === "hidden").length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            Reviews Management
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Total: <strong>{reviews.length}</strong> reviews ({publishedCount} published, {hiddenCount} hidden)
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex h-9 items-center gap-1.5 rounded-md bg-black px-4 text-xs font-bold text-white hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Add Review
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search parent, text, city..."
              className="h-8 w-full rounded border border-zinc-200 pl-8 pr-3 text-xs outline-none focus:border-black"
            />
          </div>

          {/* Season Filter */}
          <div>
            <select
              value={selectedSeasonId}
              onChange={(e) => {
                setSelectedSeasonId(e.target.value);
                setPage(1);
              }}
              className="h-8 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-medium outline-none focus:border-black"
            >
              <option value="all">All Seasons</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName || s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setPage(1);
              }}
              className="h-8 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-medium outline-none focus:border-black"
            >
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
              <option>2 Stars</option>
              <option>1 Star</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as any);
                setPage(1);
              }}
              className="h-8 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-medium outline-none focus:border-black"
            >
              <option value="all">All Status</option>
              <option value="published">Published Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as ReviewSortOption)}
              className="h-8 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-medium outline-none focus:border-black"
            >
              <option>Most Recent</option>
              <option>Oldest</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
              <option>Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Secondary filters info */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-700">Verified Filter:</span>
            <div className="flex gap-1.5">
              {(["all", "verified", "unverified"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSelectedVerified(mode);
                    setPage(1);
                  }}
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                    selectedVerified === mode
                      ? "bg-black text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {mode === "all" ? "All" : mode === "verified" ? "Verified" : "Unverified"}
                </button>
              ))}
            </div>
          </div>

          <div className="text-zinc-600">
            Showing <strong>{filteredReviews.length}</strong> matching reviews
          </div>
        </div>
      </div>

      {/* Reviews List / Table */}
      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-500">
          Loading reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-zinc-700">No reviews found matching current filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSeasonId("all");
              setSelectedRating("All Ratings");
              setSelectedStatus("all");
              setSelectedVerified("all");
            }}
            className="mt-3 text-xs font-bold text-black underline hover:text-zinc-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xs md:block">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Parent & Review</th>
                  <th className="px-3 py-3">Rating</th>
                  <th className="px-3 py-3">Season</th>
                  <th className="px-3 py-3">City</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {pagedReviews.map((review) => {
                  const seasonName = resolveSeasonName(review.seasonId, seasons);
                  const isPublished = review.status === "published";
                  const relativeDate = formatRelativeDate(review.createdAt);

                  return (
                    <tr
                      key={review.id}
                      className={`transition-colors hover:bg-zinc-50/80 ${
                        !isPublished ? "bg-zinc-50/40 opacity-75" : ""
                      }`}
                    >
                      {/* Parent & Review */}
                      <td className="max-w-[320px] px-4 py-3 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-900">{review.parentName || review.name}</span>
                          {review.verified ? (
                            <span title="Verified Parent">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            </span>
                          ) : null}
                        </div>
                        {review.childExperienceHighlight ? (
                          <p className="mt-0.5 text-[11px] font-semibold text-zinc-600">
                            ✨ {review.childExperienceHighlight}
                          </p>
                        ) : null}
                        <p className="mt-1 line-clamp-2 text-zinc-600 font-normal">
                          {review.reviewText || review.text}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-0.5">
                            <ThumbsUp className="h-2.5 w-2.5" /> {review.helpfulCount}
                          </span>
                          {review.images && review.images.length > 0 ? (
                            <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                              <ImageIcon className="h-2.5 w-2.5" /> {review.images.length} photo(s)
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-3 py-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-0.5 text-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating ? "fill-current text-gold" : "text-zinc-200"
                              }`}
                              strokeWidth={0}
                            />
                          ))}
                          <span className="ml-1 font-bold text-zinc-800">{review.rating}</span>
                        </div>
                      </td>

                      {/* Season */}
                      <td className="px-3 py-3 align-top whitespace-nowrap font-medium text-zinc-800">
                        {seasonName}
                      </td>

                      {/* City */}
                      <td className="px-3 py-3 align-top whitespace-nowrap text-zinc-700">
                        {review.city || "—"}
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3 align-top whitespace-nowrap text-zinc-500" title={review.createdAt}>
                        {relativeDate}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isPublished
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {isPublished ? "Published" : "Hidden"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 align-top whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(review)}
                            className="rounded border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-100 hover:text-black"
                            title="Edit Review"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(review)}
                            className={`rounded border p-1.5 transition ${
                              isPublished
                                ? "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-black"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                            title={isPublished ? "Hide from public site" : "Publish to public site"}
                          >
                            {isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmReview(review)}
                            className="rounded border border-zinc-200 bg-white p-1.5 text-red-600 hover:border-red-200 hover:bg-red-50"
                            title="Delete Review"
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

          {/* Mobile Card List View */}
          <div className="space-y-3 md:hidden">
            {pagedReviews.map((review) => {
              const seasonName = resolveSeasonName(review.seasonId, seasons);
              const isPublished = review.status === "published";
              const relativeDate = formatRelativeDate(review.createdAt);

              return (
                <div
                  key={review.id}
                  className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-xs ${
                    !isPublished ? "bg-zinc-50/50 opacity-80" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-zinc-900">{review.parentName || review.name}</span>
                        {review.verified ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        ) : null}
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {review.city} • {relativeDate}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {isPublished ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating ? "fill-current text-gold" : "text-zinc-200"
                          }`}
                          strokeWidth={0}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold text-zinc-800">{review.rating}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#233653]">{seasonName}</span>
                  </div>

                  {review.childExperienceHighlight ? (
                    <p className="mt-2 text-xs font-semibold text-zinc-700">
                      ✨ {review.childExperienceHighlight}
                    </p>
                  ) : null}

                  <p className="mt-1.5 text-xs text-zinc-600 font-normal">
                    {review.reviewText || review.text}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                    <span className="text-[11px] text-zinc-400">Helpful: {review.helpfulCount}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(review)}
                        className="rounded border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(review)}
                        className="rounded border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700"
                      >
                        {isPublished ? "Hide" : "Publish"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmReview(review)}
                        className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-3 rounded-lg shadow-xs text-xs text-zinc-600">
              <div>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredReviews.length} total reviews)
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-zinc-200 bg-white px-3 py-1 font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded border border-zinc-200 bg-white px-3 py-1 font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Review Add/Edit Modal */}
      <ReviewFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveReview}
        reviewToEdit={editingReview}
        seasons={seasons}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmReview}
        title="Delete this review?"
        description={`Are you sure you want to delete the review by "${deleteConfirmReview?.parentName || deleteConfirmReview?.name}"? This action will remove it from your local admin data and update public averages.`}
        confirmLabel="Delete Review"
        isDestructive={true}
        onConfirm={handleDeleteReview}
        onCancel={() => setDeleteConfirmReview(null)}
      />
    </div>
  );
}
