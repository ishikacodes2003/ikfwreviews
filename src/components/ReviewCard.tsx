"use client";

import { motion } from "framer-motion";
import { MessageSquare, MoreVertical, ShieldCheck, Share2, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Review, Season } from "@/lib/reviews/types";
import { formatRelativeDate, resolveSeasonName } from "@/lib/reviews/stats";
import { ReviewGallery } from "@/components/ReviewGallery";

export function ReviewCard({
  review,
  seasons,
}: {
  review: Review;
  seasons?: Season[];
}) {
  const [isHelpful, setIsHelpful] = useState(false);
  const helpfulCount = (review.helpfulCount || 0) + (isHelpful ? 1 : 0);
  const displayName = review.parentName || review.name || "Parent";
  const initial = review.initial || displayName.charAt(0).toUpperCase();
  const timeFormatted = formatRelativeDate(review.createdAt);
  const seasonDisplay = review.season || resolveSeasonName(review.seasonId, seasons);
  const reviewContent = review.reviewText || review.text;

  const toggleHelpful = () => {
    setIsHelpful((prev) => !prev);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="border-b border-zinc-200 bg-white px-5 py-5 last:border-b-0 max-sm:px-3 max-sm:py-3"
    >
      <div className="flex items-start gap-4 max-sm:gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[22px] font-medium max-sm:h-8 max-sm:w-8 max-sm:text-[18px]">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[16px] font-extrabold leading-none max-sm:text-[13px]">{displayName}</h3>
                {review.verified ? <ShieldCheck className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5 text-emerald-600" /> : null}
              </div>
              <p className="mt-1.5 text-[12px] font-semibold text-zinc-700 max-sm:mt-1 max-sm:text-[10.5px]">
                {review.city || "India"}
                <span className="px-1">-</span>
                {timeFormatted}
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#233653] max-sm:mt-0.5 max-sm:text-[10.5px]">{seasonDisplay}</p>
            </div>
            <div className="flex items-start gap-5">
              <div className="flex pt-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 max-sm:h-3.5 max-sm:w-3.5 ${
                      index < review.rating ? "fill-current" : "fill-zinc-200 text-zinc-200"
                    }`}
                    strokeWidth={0}
                  />
                ))}
              </div>
              <button aria-label="Review options">
                <MoreVertical className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
              </button>
            </div>
          </div>
          {review.childExperienceHighlight ? (
            <p className="mt-2 text-[13px] font-bold text-zinc-800 max-sm:text-[11px]">
              ✨ {review.childExperienceHighlight}
            </p>
          ) : null}
          <p className="mt-2.5 max-w-[720px] whitespace-pre-line text-[14px] font-medium leading-[1.45] text-black max-sm:mt-2 max-sm:max-w-[500px] max-sm:text-[11.5px] max-sm:leading-[1.35]">
            {reviewContent}
          </p>
          <Link
            href={`/reviews/${review.id}`}
            className="mt-2 inline-block text-[12px] font-bold text-[#19294a] underline underline-offset-4 max-sm:text-[10px]"
          >
            Read full IKFW review
          </Link>
          {review.images && review.images.length > 0 ? <ReviewGallery images={review.images} /> : null}
          <div className="mt-4 flex items-center gap-8 text-[12px] font-semibold text-zinc-700 max-sm:mt-3 max-sm:gap-7 max-sm:text-[10.5px]">
            <button
              onClick={toggleHelpful}
              className={`flex items-center gap-1.5 transition-colors ${isHelpful ? "font-bold text-[#19294a]" : ""}`}
            >
              <ThumbsUp className={`h-4 w-4 max-sm:h-3.5 max-sm:w-3.5 ${isHelpful ? "fill-[#19294a]" : ""}`} />
              Helpful ({helpfulCount})
            </button>
            <button className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5" />
              Reply
            </button>
            <button className="flex items-center gap-1.5">
              <Share2 className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
