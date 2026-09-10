import type { ReviewStats } from "@/lib/reviews/types";

export function SeoIntro({
  stats,
}: {
  stats: ReviewStats;
}) {
  return (
    <section aria-labelledby="ikfw-reviews-overview" className="mx-auto mt-8 w-[calc(100%-64px)] max-w-[1120px] rounded-[4px] border border-zinc-200 bg-white px-7 py-7 max-sm:mx-5 max-sm:w-auto max-sm:px-4 max-sm:py-5">
      <h2 id="ikfw-reviews-overview" className="text-[24px] font-black tracking-tight max-sm:text-[18px]">
        IKFW Reviews: What Parents Say About India Kids Fashion Week
      </h2>
      <p className="mt-3 max-w-[900px] text-[15px] leading-7 text-zinc-700 max-sm:text-[12px] max-sm:leading-6">
        Looking for <strong>IKFW reviews</strong> before registering your child? This independent review platform brings together parent-submitted experiences of India Kids Fashion Week. Compare ratings, read firsthand feedback, and explore reviews by season and city so you can make a more informed decision.
      </p>
      <p className="mt-3 max-w-[900px] text-[15px] leading-7 text-zinc-700 max-sm:text-[12px] max-sm:leading-6">
        The current collection contains {stats.totalReviews} published reviews with an average rating of {stats.averageRating.toFixed(1)} out of 5. Reviews are displayed with the season and city information supplied with each submission.
      </p>
    </section>
  );
}
