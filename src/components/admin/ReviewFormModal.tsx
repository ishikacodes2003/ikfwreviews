"use client";

import { useEffect, useState } from "react";
import { Plus, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PREDEFINED_CITIES } from "@/lib/reviews/stats";
import type { RatingValue, Review, ReviewStatus, Season } from "@/lib/reviews/types";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reviewData: Review) => Promise<void> | void;
  reviewToEdit?: Review | null;
  seasons: Season[];
}

export function ReviewFormModal({
  isOpen,
  onClose,
  onSave,
  reviewToEdit,
  seasons,
}: ReviewFormModalProps) {
  const [parentName, setParentName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [customCity, setCustomCity] = useState("");
  const [rating, setRating] = useState<RatingValue>(5);
  const [seasonId, setSeasonId] = useState("");
  const [childExperienceHighlight, setChildExperienceHighlight] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [verified, setVerified] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [status, setStatus] = useState<ReviewStatus>("published");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (reviewToEdit) {
      setParentName(reviewToEdit.parentName || reviewToEdit.name || "");
      const isPredefined = PREDEFINED_CITIES.includes(reviewToEdit.city as any);
      if (isPredefined) {
        setCity(reviewToEdit.city || "Mumbai");
        setCustomCity("");
      } else {
        setCity("Custom");
        setCustomCity(reviewToEdit.city || "");
      }
      setRating(reviewToEdit.rating || 5);
      setSeasonId(reviewToEdit.seasonId || (seasons[0]?.id ?? "season-13"));
      setChildExperienceHighlight(reviewToEdit.childExperienceHighlight || "");
      setReviewText(reviewToEdit.reviewText || reviewToEdit.text || "");
      setCreatedAt(
        reviewToEdit.createdAt
          ? new Date(reviewToEdit.createdAt).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setVerified(reviewToEdit.verified ?? true);
      setHelpfulCount(reviewToEdit.helpfulCount ?? 0);
      setImages(Array.isArray(reviewToEdit.images) ? [...reviewToEdit.images] : []);
      setStatus(reviewToEdit.status || "published");
    } else {
      // Defaults for new review
      setParentName("");
      setCity("Mumbai");
      setCustomCity("");
      setRating(5);
      setSeasonId(seasons[0]?.id ?? "season-13");
      setChildExperienceHighlight("");
      setReviewText("");
      setCreatedAt(new Date().toISOString().slice(0, 16));
      setVerified(true);
      setHelpfulCount(0);
      setImages([]);
      setStatus("published");
    }
  }, [reviewToEdit, isOpen, seasons]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !reviewText.trim()) return;

    setIsSaving(true);
    try {
      const finalCity = city === "Custom" ? customCity.trim() || "Mumbai" : city;
      const finalCreatedAt = createdAt
        ? new Date(createdAt).toISOString()
        : new Date().toISOString();

      const id = reviewToEdit ? reviewToEdit.id : `rev-${Date.now()}`;
      const selectedSeasonObj = seasons.find((s) => s.id === seasonId);
      const resolvedSeasonName = selectedSeasonObj ? selectedSeasonObj.name : seasonId;

      const reviewPayload: Review = {
        id,
        parentName: parentName.trim(),
        name: parentName.trim(),
        city: finalCity,
        rating,
        seasonId,
        season: resolvedSeasonName,
        childExperienceHighlight: childExperienceHighlight.trim() || null,
        reviewText: reviewText.trim(),
        text: reviewText.trim(),
        createdAt: finalCreatedAt,
        verified,
        helpfulCount: Number(helpfulCount) || 0,
        images,
        status,
        eventName: "India Kids Fashion Week",
        initial: parentName.trim().charAt(0).toUpperCase(),
      };

      await onSave(reviewPayload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-lg font-bold text-zinc-900">
            {reviewToEdit ? "Edit Review" : "+ Add New Review"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Parent Name */}
            <div>
              <label className="block text-zinc-700">
                Parent Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="mt-1 h-9 w-full rounded border border-zinc-200 px-3 text-xs font-normal outline-none focus:border-black"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-zinc-700">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 h-9 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-normal outline-none focus:border-black"
              >
                {PREDEFINED_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Custom">Custom City...</option>
              </select>
              {city === "Custom" ? (
                <input
                  type="text"
                  placeholder="Enter custom city"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="mt-1.5 h-8 w-full rounded border border-zinc-200 px-2 text-xs font-normal outline-none focus:border-black"
                />
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Rating */}
            <div>
              <label className="block text-zinc-700">Rating (1–5 Stars)</label>
              <div className="mt-1.5 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star as RatingValue)}
                    className="p-0.5 text-gold hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "fill-current text-gold" : "text-zinc-200"
                      }`}
                      strokeWidth={0}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-zinc-700">{rating} ★</span>
              </div>
            </div>

            {/* Season */}
            <div>
              <label className="block text-zinc-700">
                Season <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value)}
                className="mt-1 h-9 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-normal outline-none focus:border-black"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {!s.active ? "(Inactive)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Child Highlight */}
          <div>
            <label className="block text-zinc-700">Child&apos;s Experience Highlight (Optional)</label>
            <input
              value={childExperienceHighlight}
              onChange={(e) => setChildExperienceHighlight(e.target.value)}
              placeholder="e.g. Ramp choreography & photoshoot confidence"
              className="mt-1 h-9 w-full rounded border border-zinc-200 px-3 text-xs font-normal outline-none focus:border-black"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-zinc-700">
              Review Text <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write the parent's feedback..."
              className="mt-1 w-full rounded border border-zinc-200 p-2.5 text-xs font-normal outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Created Date */}
            <div>
              <label className="block text-zinc-700">Date & Time</label>
              <input
                type="datetime-local"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className="mt-1 h-9 w-full rounded border border-zinc-200 px-2 text-xs font-normal outline-none focus:border-black"
              />
            </div>

            {/* Helpful Count */}
            <div>
              <label className="block text-zinc-700">Helpful Count</label>
              <input
                type="number"
                min={0}
                value={helpfulCount}
                onChange={(e) => setHelpfulCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="mt-1 h-9 w-full rounded border border-zinc-200 px-2 text-xs font-normal outline-none focus:border-black"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-zinc-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                className="mt-1 h-9 w-full rounded border border-zinc-200 bg-white px-2 text-xs font-normal outline-none focus:border-black"
              >
                <option value="published">Published (Visible Publicly)</option>
                <option value="hidden">Hidden (Admin Only)</option>
              </select>
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="verified-checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
            />
            <label htmlFor="verified-checkbox" className="cursor-pointer text-xs font-semibold text-zinc-800">
              Verified Parent Badge
            </label>
          </div>

          {/* Images Management */}
          <div className="border-t border-zinc-100 pt-3">
            <label className="block text-zinc-700">Images (URLs or Static Paths)</label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                placeholder="/kids-fashion-reference.png or image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="h-8 flex-1 rounded border border-zinc-200 px-2 text-xs font-normal outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="flex items-center gap-1 rounded bg-zinc-100 px-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-200"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {images.length > 0 ? (
              <div className="mt-2 space-y-1.5">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700"
                  >
                    <span className="truncate pr-2 font-mono">{img}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Actions */}
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
              {isSaving ? "Saving..." : reviewToEdit ? "Update Review" : "Create Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
