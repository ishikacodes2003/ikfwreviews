import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";
import { calculateReviewStats } from "@/lib/reviews/stats";
import { absoluteUrl, breadcrumbSchema, cleanText, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function getSeasonData(id: string) {
  const seasonRepository = new DrizzleSeasonRepository();
  const reviewRepository = new DrizzleReviewRepository();
  const [season, allReviews] = await Promise.all([
    seasonRepository.getSeasonById(id),
    reviewRepository.getAllReviews(false),
  ]);
  if (!season) return null;
  const seasonReviews = allReviews.filter((review) => review.seasonId === id);
  return { season, reviews: seasonReviews, stats: calculateReviewStats(seasonReviews) };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getSeasonData(id);
  if (!data) return { title: "Season Reviews Not Found", robots: { index: false, follow: false } };
  const canonical = `/seasons/${encodeURIComponent(data.season.id)}`;
  return {
    title: `${data.season.name} Reviews – IKFW Reviews`,
    description: cleanText(`Read parent-submitted IKFW Reviews for ${data.season.name}. Compare ratings, attendee feedback, and overall impressions.`, 155),
    alternates: { canonical },
    openGraph: {
      title: `${data.season.name} Reviews – IKFW Reviews`,
      description: `Parent-submitted IKFW Reviews for ${data.season.name}.`,
      url: absoluteUrl(canonical),
      type: "website",
    },
  };
}

export default async function SeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSeasonData(id);
  if (!data) notFound();
  const { season, reviews, stats } = data;
  const pageUrl = absoluteUrl(`/seasons/${encodeURIComponent(season.id)}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: `${season.name} Reviews`,
        url: pageUrl,
        description: `Parent-submitted IKFW Reviews for ${season.name}.`,
        mainEntity: { "@id": `${pageUrl}#reviews` },
        about: { "@id": `${pageUrl}#event` },
      },
      {
        "@type": "Event",
        "@id": `${pageUrl}#event`,
        name: season.name,
        url: pageUrl,
        description: `Parent-submitted IKFW Reviews and ratings for ${season.name}.`,
        ...(stats.totalReviews > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: stats.averageRating.toFixed(1),
                reviewCount: stats.totalReviews,
                bestRating: "5",
                worstRating: "1",
              },
            }
          : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#reviews`,
        name: `${season.name} Reviews`,
        numberOfItems: reviews.length,
        itemListElement: reviews.slice(0, 50).map((review, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/reviews/${encodeURIComponent(review.id)}`),
          name: `${review.rating}/5 IKFW Review by ${review.parentName}`,
        })),
      },
      { ...breadcrumbSchema([{ name: "Seasons", path: "/seasons" }, { name: season.name }]) },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-4xl bg-white px-6 py-10 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Seasons", href: "/seasons" }, { name: season.name }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">India Kids Fashion Week Reviews</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{season.name} Reviews</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">Read parent-submitted IKFW reviews for {season.name}. Compare {stats.totalReviews} published reviews and an average rating of {stats.averageRating.toFixed(1)}/5.</p>
        </header>
        <section aria-label="Season review summary" className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <p className="text-3xl font-black">{stats.averageRating.toFixed(1)}/5</p>
          <p className="mt-1 text-sm font-semibold text-zinc-600">Based on {stats.totalReviews} published reviews</p>
        </section>
        <section className="mt-8 space-y-4" aria-labelledby="season-reviews">
          <h2 id="season-reviews" className="text-xl font-bold tracking-tight text-zinc-900">
            Parent Feedback for {season.name}
          </h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-black">{review.rating}/5 — {review.parentName}</h3>
                  <span className="text-sm font-semibold text-zinc-500">{review.city || "India"}</span>
                </div>
                <p className="mt-3 leading-7 text-zinc-800">{review.reviewText}</p>
                <Link href={`/reviews/${encodeURIComponent(review.id)}`} className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Read full IKFW review</Link>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-zinc-600">
              <p>No published reviews found for {season.name} yet.</p>
              <Link href="/write-review" className="mt-3 inline-block font-bold text-black underline underline-offset-4">
                Share your experience for {season.name}
              </Link>
            </div>
          )}
        </section>

        {/* Cross Season & City Discovery */}
        <section className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
          <h3 className="text-base font-bold text-zinc-900">Explore More IKFW Seasons &amp; Cities</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Compare how experiences differ across seasons and regional editions:
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <Link href="/seasons/season-13" className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:border-black">
              Season 13
            </Link>
            <Link href="/seasons/season-12" className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:border-black">
              Season 12
            </Link>
            <Link href="/seasons/season-11" className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:border-black">
              Season 11
            </Link>
            <Link href="/seasons/season-10" className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:border-black">
              Season 10
            </Link>
            <Link href="/seasons" className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-zinc-800">
              All Seasons &rarr;
            </Link>
            <Link href="/cities" className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 hover:border-black">
              Browse by City &rarr;
            </Link>
          </div>
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
