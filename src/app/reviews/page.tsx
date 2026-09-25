import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";
import { absoluteUrl, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IKFW Reviews – Parent Reviews & Ratings",
  description: "Browse parent-submitted IKFW Reviews and ratings for India Kids Fashion Week, with reviews organized by season and city.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "IKFW Reviews – Parent Reviews & Ratings",
    description: "Browse parent-submitted IKFW Reviews and ratings for India Kids Fashion Week.",
    url: absoluteUrl("/reviews"),
    type: "website",
  },
};

export default async function ReviewsIndexPage() {
  const reviewRepository = new DrizzleReviewRepository();
  const seasonRepository = new DrizzleSeasonRepository();
  const [reviews, seasons, cities] = await Promise.all([
    reviewRepository.getAllReviews(false),
    seasonRepository.getSeasons(false),
    reviewRepository.getCities(),
  ]);
  const latest = [...reviews].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 24);

  const stats = reviews.length > 0 ? {
    totalReviews: reviews.length,
    averageRating: Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)),
  } : null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "IKFW Reviews – Parent Reviews & Ratings",
        url: absoluteUrl("/reviews"),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: reviews.length,
          itemListElement: latest.map((review, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/reviews/${encodeURIComponent(review.id)}`),
            name: `${review.season || "India Kids Fashion Week"} review by ${review.parentName}`,
          })),
        },
      },
      ...(stats ? [{
        "@type": "Event",
        name: "India Kids Fashion Week",
        url: absoluteUrl("/"),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: stats.averageRating.toFixed(1),
          reviewCount: stats.totalReviews,
          bestRating: "5",
          worstRating: "1",
        },
      }] : []),
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-5xl bg-white px-6 py-10 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "All Reviews" }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">India Kids Fashion Week Reviews</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">IKFW Reviews – Parent Reviews & Ratings</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">
            Browse {reviews.length} published parent-submitted IKFW Reviews. Read individual experiences, compare ratings, and explore feedback by India Kids Fashion Week season and city.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="IKFW review directory">
          <Link href="/seasons" className="rounded-xl border border-zinc-200 p-5 transition-all hover:border-black hover:shadow-sm">
            <h2 className="font-black">Reviews by Season</h2>
            <p className="mt-2 text-sm text-zinc-600">Compare IKFW reviews across {seasons.length} seasons.</p>
          </Link>
          <Link href="/cities" className="rounded-xl border border-zinc-200 p-5 transition-all hover:border-black hover:shadow-sm">
            <h2 className="font-black">Reviews by City</h2>
            <p className="mt-2 text-sm text-zinc-600">Explore parent feedback from {cities.filter((city) => city.city !== "All Cities").length} cities.</p>
          </Link>
          <Link href="/write-review" className="rounded-xl border border-zinc-200 p-5 transition-all hover:border-black hover:shadow-sm">
            <h2 className="font-black">Share Your Experience</h2>
            <p className="mt-2 text-sm text-zinc-600">Submit an IKFW experience for other parents.</p>
          </Link>
        </section>

        <section className="mt-10" aria-labelledby="latest-ikfw-reviews">
          <h2 id="latest-ikfw-reviews" className="text-2xl font-black">Latest IKFW Reviews</h2>
          <div className="mt-5 space-y-4">
            {latest.map((review) => (
              <article key={review.id} className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black">{review.season || "India Kids Fashion Week"} – IKFW Review</h3>
                    <p className="mt-1 text-sm font-semibold text-zinc-500">{review.rating}/5 · {review.city || "India"} · {review.parentName}</p>
                  </div>
                  <time dateTime={review.createdAt} className="text-sm text-zinc-500">{new Date(review.createdAt).toLocaleDateString("en-IN")}</time>
                </div>
                <p className="mt-3 leading-7 text-zinc-700">{review.reviewText}</p>
                <Link href={`/reviews/${encodeURIComponent(review.id)}`} className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Read full IKFW review</Link>
              </article>
            ))}
          </div>
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
