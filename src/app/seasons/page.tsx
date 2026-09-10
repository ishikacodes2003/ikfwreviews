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
  title: "IKFW Reviews by Season – India Kids Fashion Week",
  description: "Browse IKFW Reviews by India Kids Fashion Week season and compare parent ratings and experiences from each season.",
  alternates: { canonical: "/seasons" },
  openGraph: { title: "IKFW Reviews by Season", description: "Browse India Kids Fashion Week reviews by season.", url: absoluteUrl("/seasons"), type: "website" },
};

export default async function SeasonsPage() {
  const seasonRepository = new DrizzleSeasonRepository();
  const reviewRepository = new DrizzleReviewRepository();
  const [seasons, reviews] = await Promise.all([seasonRepository.getSeasons(false), reviewRepository.getAllReviews(false)]);
  const counts = new Map(seasons.map((season) => [season.id, 0]));
  for (const review of reviews) counts.set(review.seasonId, (counts.get(review.seasonId) ?? 0) + 1);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "IKFW Reviews by Season",
    url: absoluteUrl("/seasons"),
    mainEntity: { "@type": "ItemList", itemListElement: seasons.map((season, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/seasons/${encodeURIComponent(season.id)}`), name: `${season.name} Reviews` })) },
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-5xl bg-white px-6 py-10 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Seasons" }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">India Kids Fashion Week Reviews</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">IKFW Reviews by Season</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">Explore parent-submitted IKFW Reviews by India Kids Fashion Week season. Open a season to compare ratings and individual experiences.</p>
        </header>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seasons.map((season) => (
            <Link key={season.id} href={`/seasons/${encodeURIComponent(season.id)}`} className="rounded-xl border border-zinc-200 p-5 transition-all hover:border-black hover:shadow-sm">
              <h2 className="font-black">{season.name} Reviews</h2>
              <p className="mt-2 text-sm text-zinc-600">{counts.get(season.id) ?? 0} published IKFW reviews</p>
            </Link>
          ))}
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
