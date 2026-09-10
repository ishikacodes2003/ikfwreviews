import type { MetadataRoute } from "next";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";
import { absoluteUrl, citySlug } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const reviewRepository = new DrizzleReviewRepository();
  const seasonRepository = new DrizzleSeasonRepository();
  const [reviews, seasons] = await Promise.all([reviewRepository.getAllReviews(false), seasonRepository.getSeasons(false)]);
  const latestReviewDate = reviews.reduce<Date | undefined>((latest, review) => {
    const date = new Date(review.createdAt);
    if (Number.isNaN(date.getTime())) return latest;
    return !latest || date > latest ? date : latest;
  }, undefined);

  const cityDates = new Map<string, Date>();
  const seasonDates = new Map<string, Date>();
  for (const review of reviews) {
    const date = new Date(review.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    if (review.city) {
      const key = citySlug(review.city);
      const previous = cityDates.get(key);
      if (!previous || date > previous) cityDates.set(key, date);
    }
    const previousSeason = seasonDates.get(review.seasonId);
    if (!previousSeason || date > previousSeason) seasonDates.set(review.seasonId, date);
  }

  return [
    { url: absoluteUrl("/"), lastModified: latestReviewDate, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/reviews"), lastModified: latestReviewDate, changeFrequency: "daily", priority: 0.95 },
    { url: absoluteUrl("/seasons"), lastModified: latestReviewDate, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/cities"), lastModified: latestReviewDate, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/review-policy"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/terms"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/privacy"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/guides/how-to-read-ikfw-reviews"), changeFrequency: "monthly", priority: 0.75 },
    ...seasons.map((season) => ({ url: absoluteUrl(`/seasons/${encodeURIComponent(season.id)}`), lastModified: seasonDates.get(season.id), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...[...cityDates.entries()].map(([city, lastModified]) => ({ url: absoluteUrl(`/cities/${city}`), lastModified, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...reviews.map((review) => ({ url: absoluteUrl(`/reviews/${encodeURIComponent(review.id)}`), lastModified: new Date(review.createdAt), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
