import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { calculateReviewStats } from "@/lib/reviews/stats";
import { absoluteUrl, breadcrumbSchema, citySlug, cleanText, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function getCityData(cityParam: string) {
  const repository = new DrizzleReviewRepository();
  const reviews = await repository.getAllReviews(false);
  const normalized = cityParam.toLowerCase().replace(/-/g, " ");
  const match = reviews.find((review) => review.city && citySlug(review.city) === cityParam.toLowerCase())?.city;
  const displayCity = match || reviews.find((review) => review.city?.toLowerCase() === normalized)?.city;
  if (!displayCity) return null;
  const cityReviews = reviews.filter((review) => review.city?.toLowerCase() === displayCity.toLowerCase());
  return { city: displayCity, reviews: cityReviews, stats: calculateReviewStats(cityReviews) };
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const data = await getCityData(decodeURIComponent(city));
  if (!data) return { title: "City Reviews Not Found", robots: { index: false, follow: false } };
  const canonical = `/cities/${citySlug(data.city)}`;
  return {
    title: `IKFW Reviews in ${data.city}`,
    description: cleanText(`Read parent-submitted IKFW Reviews in ${data.city}, including India Kids Fashion Week ratings, season experiences, and firsthand feedback.`, 155),
    alternates: { canonical },
    openGraph: {
      title: `IKFW Reviews in ${data.city}`,
      description: `Parent-submitted India Kids Fashion Week reviews from ${data.city}.`,
      url: absoluteUrl(canonical),
      type: "website",
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const data = await getCityData(decodeURIComponent(city));
  if (!data) notFound();
  const { city: displayCity, reviews, stats } = data;
  const pageUrl = absoluteUrl(`/cities/${citySlug(displayCity)}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: `IKFW Reviews in ${displayCity}`,
        url: pageUrl,
        description: `Parent-submitted India Kids Fashion Week reviews from ${displayCity}.`,
        mainEntity: { "@id": `${pageUrl}#reviews` },
        about: { "@id": `${pageUrl}#event` },
      },
      {
        "@type": "Event",
        "@id": `${pageUrl}#event`,
        name: `India Kids Fashion Week - ${displayCity}`,
        url: pageUrl,
        location: {
          "@type": "Place",
          name: displayCity,
          address: {
            "@type": "PostalAddress",
            addressLocality: displayCity,
            addressCountry: "IN",
          },
        },
        description: `Parent-submitted India Kids Fashion Week reviews from ${displayCity}.`,
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
        name: `IKFW Reviews in ${displayCity}`,
        numberOfItems: reviews.length,
        itemListElement: reviews.slice(0, 50).map((review, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/reviews/${encodeURIComponent(review.id)}`),
          name: `${review.rating}/5 IKFW Review by ${review.parentName}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `What do parents in ${displayCity} say about India Kids Fashion Week?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Parents in ${displayCity} report an average rating of ${stats.averageRating.toFixed(1)}/5 based on ${reviews.length} published reviews on our independent platform.`,
            },
          },
          {
            "@type": "Question",
            name: `Where are IKFW events held in ${displayCity}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `IKFW auditions and shows in ${displayCity} are typically organized in luxury hotel ballrooms or designated convention centers. Always check the official event notice for exact venue details.`,
            },
          },
        ],
      },
      { ...breadcrumbSchema([{ name: "Cities", path: "/cities" }, { name: displayCity }]) },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-4xl bg-white px-6 py-10 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Cities", href: "/cities" }, { name: displayCity }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">Parent Reviews by City</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">IKFW Reviews in {displayCity}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">Explore {reviews.length} published India Kids Fashion Week reviews from parents in {displayCity}. The current community rating is {stats.averageRating.toFixed(1)}/5 across {stats.totalReviews} submissions.</p>
        </header>

        <section className="mt-8 space-y-4" aria-labelledby="city-reviews">
          <h2 id="city-reviews" className="text-xl font-bold tracking-tight text-zinc-900">
            Parent Feedback from {displayCity}
          </h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-black">{review.rating}/5 — {review.parentName}</h3>
                  <span className="text-sm font-semibold text-zinc-500">{review.season || "India Kids Fashion Week"}</span>
                </div>
                <p className="mt-3 leading-7 text-zinc-800">{review.reviewText}</p>
                <Link href={`/reviews/${encodeURIComponent(review.id)}`} className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Read full IKFW review</Link>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-zinc-600">
              <p>No published reviews found for {displayCity} yet.</p>
              <Link href="/write-review" className="mt-3 inline-block font-bold text-black underline underline-offset-4">
                Be the first parent to review {displayCity}
              </Link>
            </div>
          )}
        </section>

        {/* Local Parent FAQ & Insights */}
        <section className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-zinc-900">Tips for Parents in {displayCity}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-700">
            <div>
              <h3 className="font-bold text-black">1. Check Audition Schedule &amp; Timings</h3>
              <p className="mt-1">
                Auditions in {displayCity} often have staggered time slots to prevent long waiting times for young children. Arrive 15 minutes before your scheduled slot with water and light snacks.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black">2. Request Written Deliverables</h3>
              <p className="mt-1">
                Ensure your event coordinator in {displayCity} provides clear written confirmation of the number of grooming classes, fitted outfits, stage passes, and photoshoot deliverables.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black">3. Compare Across Seasons</h3>
              <p className="mt-1">
                Looking for broader context? Compare {displayCity} reviews with feedback from other metropolitan audition centers across India.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Other Major Cities</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <Link href="/cities/mumbai" className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 hover:border-black">
                Mumbai
              </Link>
              <Link href="/cities/delhi" className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 hover:border-black">
                Delhi NCR
              </Link>
              <Link href="/cities/bangalore" className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 hover:border-black">
                Bangalore
              </Link>
              <Link href="/cities/hyderabad" className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 hover:border-black">
                Hyderabad
              </Link>
              <Link href="/cities/pune" className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 hover:border-black">
                Pune
              </Link>
              <Link href="/cities/ahmedabad" className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 hover:border-black">
                Ahmedabad
              </Link>
              <Link href="/cities" className="rounded-md bg-black px-2.5 py-1 text-white hover:bg-zinc-800">
                All Cities &rarr;
              </Link>
            </div>
          </div>
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
