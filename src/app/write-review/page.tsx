"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, ChevronDown, CheckCircle2, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PREDEFINED_CITIES } from "@/lib/reviews/stats";
import { getSeasonRepository } from "@/lib/seasons";
import { getReviewRepository } from "@/lib/reviews";
import { initialSeasons } from "@/data/seasons";
import type { RatingValue, Review, Season } from "@/lib/reviews/types";
import { WebsiteFooter } from "@/components/WebsiteFooter";

export default function WriteReviewPage() {
  const [rating, setRating] = useState<RatingValue>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [parentName, setParentName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [highlight, setHighlight] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons.filter((s) => s.active));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<{
    parentName: string;
    city: string;
    season: string;
    rating: number;
    highlight: string;
    reviewText: string;
  } | null>(null);

  useEffect(() => {
    async function fetchActiveSeasons() {
      try {
        const seasonRepo = getSeasonRepository();
        const activeSeasons = await seasonRepo.getSeasons(false);
        setSeasons(activeSeasons);
        if (activeSeasons.length > 0 && !selectedSeasonId) {
          setSelectedSeasonId(activeSeasons[0].id);
        }
      } catch (err) {
        console.error("Failed to load seasons:", err);
      }
    }
    fetchActiveSeasons();
  }, [selectedSeasonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !reviewText.trim() || !selectedSeasonId) return;

    setIsSubmitting(true);
    try {
      const selectedSeasonObj = seasons.find((s) => s.id === selectedSeasonId);
      const resolvedSeasonName = selectedSeasonObj?.name || "India Kids Fashion Week - Season 13";

      const newReview: Review = {
        id: `rev-${Date.now()}`,
        parentName: parentName.trim(),
        name: parentName.trim(),
        city: selectedCity,
        seasonId: selectedSeasonId,
        season: resolvedSeasonName,
        rating,
        childExperienceHighlight: highlight.trim() || null,
        reviewText: reviewText.trim(),
        text: reviewText.trim(),
        createdAt: new Date().toISOString(),
        verified: true,
        helpfulCount: 0,
        images: [],
        status: "published",
        eventName: "India Kids Fashion Week",
        initial: parentName.trim().charAt(0).toUpperCase(),
      };

      const reviewRepo = getReviewRepository();
      await reviewRepo.createReview(newReview);

      setSubmittedReview({
        parentName: newReview.parentName,
        city: selectedCity,
        season: resolvedSeasonName,
        rating,
        highlight,
        reviewText,
      });
    } catch (err) {
      console.error("Failed to submit review:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("sign in")) {
        window.location.href = "/login?next=/write-review";
        return;
      }
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedReview(null);
    setParentName("");
    setSelectedCity("");
    setSelectedSeasonId(seasons[0]?.id || "");
    setHighlight("");
    setReviewText("");
    setRating(5);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <div className="mx-auto min-h-screen max-w-[1080px] border-x border-zinc-100 bg-white">
        <header className="sticky top-0 z-40 flex h-[68px] items-center gap-4 border-b border-zinc-200 bg-white px-8 max-sm:h-[54px] max-sm:px-4">
          <Link aria-label="Back to reviews" href="/">
            <ArrowLeft className="h-5 w-5 text-zinc-700 transition hover:text-black" />
          </Link>
          <h1 className="text-[26px] font-black uppercase tracking-tight max-sm:text-[18px]">Write a Review</h1>
        </header>
        <section className="px-8 py-8 max-sm:px-5 max-sm:py-5">
          <div className="rounded-[4px] border border-zinc-200 bg-white p-7 shadow-soft max-sm:p-4">
            <p className="text-[15px] font-bold text-zinc-700 max-sm:text-[12px]">India Kids Fashion Week</p>
            <h2 className="mt-1 text-[30px] font-black tracking-tight max-sm:text-[20px]">Share your parent review</h2>
            
            {submittedReview ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-[6px] border border-emerald-200 bg-emerald-50/60 p-8 text-center max-sm:p-5">
                <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-600" />
                <h3 className="text-[20px] font-bold text-emerald-950 max-sm:text-[16px]">Review Submitted Successfully!</h3>
                <p className="mt-1 text-[13px] text-emerald-700">
                  Your parent review has been attached to{" "}
                  <strong className="font-bold text-emerald-900">{submittedReview.season}</strong>.
                </p>

                <div className="mt-5 w-full max-w-md rounded-[4px] border border-emerald-200/80 bg-white p-4 text-left shadow-sm text-[12px] space-y-2">
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500 font-semibold">Parent Name:</span>
                    <span className="font-bold text-zinc-900">{submittedReview.parentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500 font-semibold">City:</span>
                    <span className="font-bold text-zinc-900">{submittedReview.city}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500 font-semibold">Season Attached:</span>
                    <span className="font-bold text-[#233653]">{submittedReview.season}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500 font-semibold">Rating:</span>
                    <span className="font-bold text-gold flex items-center gap-1">
                      {submittedReview.rating} ★★★★★
                    </span>
                  </div>
                  {submittedReview.highlight ? (
                    <div className="border-b border-zinc-100 pb-2">
                      <span className="text-zinc-500 font-semibold block">Highlight:</span>
                      <span className="font-medium text-zinc-800">{submittedReview.highlight}</span>
                    </div>
                  ) : null}
                  <div>
                    <span className="text-zinc-500 font-semibold block">Review:</span>
                    <p className="italic text-zinc-700 mt-1 line-clamp-3">&quot;{submittedReview.reviewText}&quot;</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 max-sm:flex-col max-sm:w-full">
                  <Link href="/" className="max-sm:w-full">
                    <Button className="h-10 w-full rounded-[3px] bg-black text-white hover:bg-zinc-900">
                      Return to Reviews
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    className="h-10 rounded-[3px] border-zinc-200 max-sm:w-full"
                    onClick={handleReset}
                  >
                    Write Another Review
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-4 flex items-center gap-1.5">
                  <div className="flex gap-1 text-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star as RatingValue)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            (hoverRating !== null ? star <= hoverRating : star <= rating)
                              ? "fill-current text-gold"
                              : "text-zinc-200"
                          }`}
                          strokeWidth={0}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="ml-2 text-[13px] font-bold text-zinc-600">
                    {rating} out of 5 stars
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                  <label className="grid gap-1.5 text-[12px] font-bold text-zinc-800">
                    Parent Name
                    <input
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="h-10 rounded-[3px] border border-zinc-200 px-3 text-[13px] font-medium outline-none transition focus:border-black"
                    />
                  </label>

                  <label className="grid gap-1.5 text-[12px] font-bold text-zinc-800">
                    City
                    <div className="relative">
                      <select
                        required
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className={`h-10 w-full appearance-none rounded-[3px] border border-zinc-200 bg-white px-3 pr-10 text-[13px] font-medium outline-none transition focus:border-black cursor-pointer ${
                          !selectedCity ? "text-zinc-400" : "text-zinc-900"
                        }`}
                      >
                        <option value="" disabled>
                          Select City
                        </option>
                        {PREDEFINED_CITIES.map((city) => (
                          <option key={city} value={city} className="text-zinc-900 font-medium">
                            {city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </label>

                  <label className="grid gap-1.5 text-[12px] font-bold text-zinc-800">
                    Season Attended
                    <div className="relative">
                      <select
                        required
                        value={selectedSeasonId}
                        onChange={(e) => setSelectedSeasonId(e.target.value)}
                        className={`h-10 w-full appearance-none rounded-[3px] border border-zinc-200 bg-white px-3 pr-10 text-[13px] font-medium outline-none transition focus:border-black cursor-pointer ${
                          !selectedSeasonId ? "text-zinc-400" : "text-zinc-900"
                        }`}
                      >
                        <option value="" disabled>
                          Select Season
                        </option>
                        {seasons.map((season) => (
                          <option key={season.id} value={season.id} className="text-zinc-900 font-medium">
                            {season.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    </div>
                  </label>

                  <label className="grid gap-1.5 text-[12px] font-bold text-zinc-800">
                    Child&apos;s Experience Highlight
                    <input
                      value={highlight}
                      onChange={(e) => setHighlight(e.target.value)}
                      placeholder="e.g. Confidence boost & ramp choreography"
                      className="h-10 rounded-[3px] border border-zinc-200 px-3 text-[13px] font-medium outline-none transition focus:border-black"
                    />
                  </label>

                  <label className="grid gap-1.5 text-[12px] font-bold text-zinc-800">
                    Review
                    <textarea
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell other parents about the backstage organization, mentor guidance, photoshoot, safety, and overall experience..."
                      className="min-h-28 rounded-[3px] border border-zinc-200 p-3 text-[13px] font-medium outline-none transition focus:border-black"
                    />
                  </label>

                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-[3px] border border-dashed border-zinc-300 bg-zinc-50/50 text-[12px] font-bold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                  >
                    <Camera className="h-4 w-4" />
                    Add Photos
                  </button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-[3px] bg-black text-white hover:bg-zinc-900"
                  >
                    <Send className="mr-1.5 h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>
        <WebsiteFooter />
      </div>
    </main>
  );
}
