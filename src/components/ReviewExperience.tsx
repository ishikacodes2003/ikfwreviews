"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CityFilter } from "@/components/CityFilter";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewFilters } from "@/components/ReviewFilters";
import { Pagination } from "@/components/Pagination";
import { ReviewPolicy } from "@/components/ReviewPolicy";
import type { CityStat, Review, Season } from "@/lib/reviews/types";
import {
  calculateCityDistribution,
  filterAndSortReviews,
  paginateReviews,
} from "@/lib/reviews/stats";
import { getReviewRepository } from "@/lib/reviews";
import { getSeasonRepository } from "@/lib/seasons";

interface ReviewExperienceProps {
  initialReviews: Review[];
  initialCities?: CityStat[];
  initialSeasons?: Season[];
}

export function ReviewExperience({
  initialReviews,
  initialCities,
  initialSeasons,
}: ReviewExperienceProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons || []);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSeason, setSelectedSeason] = useState("All Seasons");
  const [rating, setRating] = useState("All Ratings");
  const [sort, setSort] = useState("Most Recent");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const syncWithClientRepos = async () => {
      try {
        const reviewRepo = getReviewRepository();
        const seasonRepo = getSeasonRepository();
        const [liveReviews, liveSeasons] = await Promise.all([
          reviewRepo.getAllReviews(false), // only published reviews for public page
          seasonRepo.getSeasons(false), // active seasons
        ]);
        setReviews(liveReviews);
        setSeasons(liveSeasons);
      } catch (err) {
        console.error("Failed to sync reviews/seasons on client:", err);
      }
    };

    syncWithClientRepos();
  }, []);

  // City counts dynamically derived from published reviews
  const cityStats = useMemo(() => {
    return calculateCityDistribution(reviews, false);
  }, [reviews]);

  // Filtered and sorted reviews (always published only)
  const visibleReviews = useMemo(() => {
    return filterAndSortReviews(reviews, {
      city: selectedCity,
      season: selectedSeason,
      rating,
      sort,
      verifiedOnly,
      status: "published",
    });
  }, [reviews, selectedCity, selectedSeason, rating, sort, verifiedOnly]);

  // Paginated chunk
  const paginatedResult = useMemo(() => {
    return paginateReviews(visibleReviews, currentPage, pageSize);
  }, [visibleReviews, currentPage, pageSize]);

  const resetToFirstPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <>
      <CityFilter
        selectedCity={selectedCity}
        onSelectCity={resetToFirstPage(setSelectedCity)}
        cities={cityStats}
        selectedSeason={selectedSeason}
        onSelectSeason={resetToFirstPage(setSelectedSeason)}
        seasons={seasons}
      />
      <ReviewPolicy />
      <ReviewFilters
        rating={rating}
        sort={sort}
        verifiedOnly={verifiedOnly}
        onRatingChange={resetToFirstPage(setRating)}
        onSortChange={resetToFirstPage(setSort)}
        onVerifiedChange={resetToFirstPage(setVerifiedOnly)}
      />
      <section
        id="reviews"
        className="mx-auto mt-5 w-[calc(100%-64px)] max-w-[1120px] rounded-[2px] border border-zinc-200 bg-white max-sm:mx-5 max-sm:mt-3 max-sm:w-auto"
      >
        <AnimatePresence mode="popLayout">
          {paginatedResult.items.map((review) => (
            <motion.div key={review.id} layout>
              <ReviewCard review={review} seasons={seasons} />
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleReviews.length === 0 ? (
          <div className="px-4 py-8 text-center text-[14px] font-semibold text-zinc-600 max-sm:text-[12px]">
            No reviews match these filters.
          </div>
        ) : null}
      </section>
      <Pagination
        currentPage={paginatedResult.page}
        pageSize={pageSize}
        totalCount={paginatedResult.totalCount}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
