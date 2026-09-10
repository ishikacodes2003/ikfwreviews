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
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">Explore {reviews.length} published India Kids Fashion Week reviews from parents in {displayCity}. The current average rating is {stats.averageRating.toFixed(1)}/5.</p>
        </header>
        <section className="mt-8 space-y-4" aria-labelledby="city-reviews">
          <h2 id="city-reviews" className="sr-only">IKFW parent reviews in {displayCity}</h2>
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-black">{review.rating}/5 — {review.parentName}</h3>
                <span className="text-sm font-semibold text-zinc-500">{review.season || "India Kids Fashion Week"}</span>
              </div>
              <p className="mt-3 leading-7 text-zinc-800">{review.reviewText}</p>
              <Link href={`/reviews/${encodeURIComponent(review.id)}`} className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Read full IKFW review</Link>
            </article>
          ))}
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
