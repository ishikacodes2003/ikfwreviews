"use client";

import { motion } from "framer-motion";
import { Pencil, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReviewStats } from "@/lib/reviews/types";
import { getReviewRepository } from "@/lib/reviews";
import { Button } from "@/components/ui/button";

interface RatingSummaryProps {
  stats: ReviewStats;
}

export function RatingSummary({ stats: initialStats }: RatingSummaryProps) {
  const [stats, setStats] = useState<ReviewStats>(initialStats);

  useEffect(() => {
    // Sync with client repository on mount
    const updateStatsFromRepo = async () => {
      try {
        const repo = getReviewRepository();
        const liveStats = await repo.getStats();
        setStats(liveStats);
      } catch (e) {
        console.error("Failed to refresh rating stats:", e);
      }
    };

    updateStatsFromRepo();

  }, []);

  const averageFormatted = stats.averageRating.toFixed(1);
  const roundedRating = Math.round(stats.averageRating);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 mx-auto -mt-[80px] w-[calc(100%-64px)] max-w-[1120px] rounded-[8px] border border-zinc-200 bg-white px-12 pb-8 pt-7 shadow-[0_12px_30px_rgba(0,0,0,0.12)] max-sm:mx-[17px] max-sm:-mt-[20px] max-sm:w-auto max-sm:px-5 max-sm:pb-4 max-sm:pt-3"
    >
      <div className="grid grid-cols-[300px_1fr] gap-16 max-sm:grid-cols-[150px_1fr] max-sm:gap-3">
        <div>
          <p className="text-[14px] font-semibold text-zinc-700 max-sm:text-[8px]">Overall Rating</p>
          <div className="mt-2 text-[92px] font-black leading-[0.9] tracking-[0px] max-sm:mt-1 max-sm:text-[47px]">
            {averageFormatted}
          </div>
          <div className="mt-5 flex gap-1 text-gold max-sm:mt-3 max-sm:gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-7 w-7 max-sm:h-[14px] max-sm:w-[14px] ${
                  index < roundedRating ? "fill-current" : "fill-zinc-200 text-zinc-200"
                }`}
                strokeWidth={0}
              />
            ))}
          </div>
          <p className="mt-3 text-[15px] font-semibold text-zinc-700 max-sm:mt-1.5 max-sm:text-[9px]">
            Based on {stats.totalReviews} reviews
          </p>
          <p className="mt-4 flex items-center gap-2 text-[14px] font-semibold text-zinc-800 max-sm:mt-2 max-sm:gap-1.5 max-sm:text-[8px]">
            <ShieldCheck className="h-5 w-5 fill-black text-white max-sm:h-3.5 max-sm:w-3.5" strokeWidth={2.4} />
            Verified Parent Reviews
          </p>
        </div>
        <div className="space-y-[22px] pt-1 max-sm:space-y-[11px] max-sm:pt-0.5">
          {stats.distribution.map((item) => (
            <div
              key={item.stars}
              className="grid grid-cols-[22px_18px_1fr_36px] items-center gap-4 text-[15px] font-semibold max-sm:grid-cols-[14px_11px_1fr_22px] max-sm:gap-2 max-sm:text-[9px]"
            >
              <span>{item.stars}</span>
              <Star className="h-4.5 w-4.5 fill-black text-black max-sm:h-3 max-sm:w-3" strokeWidth={0} />
              <div className="h-[7px] overflow-hidden rounded-full bg-zinc-200 max-sm:h-[4px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ delay: 0.15, duration: 0.65 }}
                  className="h-full rounded-full bg-gold"
                />
              </div>
              <span className="text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
      <Button asChild className="mt-8 h-[48px] w-full rounded-[3px] border-zinc-900 text-[16px] max-sm:mt-4 max-sm:h-[30px] max-sm:text-[10px]">
        <Link href="/write-review">
          <Pencil className="h-5 w-5 max-sm:h-3.5 max-sm:w-3.5" />
          Write a Review
        </Link>
      </Button>
    </motion.section>
  );
}
