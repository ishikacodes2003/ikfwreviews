import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { RatingSummary } from "@/components/RatingSummary";
import { ParentTestimonials } from "@/components/ParentTestimonials";
import { ReviewExperience } from "@/components/ReviewExperience";
import { SeoIntro } from "@/components/SeoIntro";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { SeoFaq } from "@/components/SeoFaq";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { DrizzleSeasonRepository } from "@/lib/seasons/drizzleSeasonRepository";
import { absoluteUrl, jsonLd, SITE_DESCRIPTION } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IKFW Reviews – India Kids Fashion Week Reviews",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "IKFW Reviews – India Kids Fashion Week Reviews",
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    type: "website",
  },
};

export default async function Home() {
  const reviewRepository = new DrizzleReviewRepository();
  const seasonRepository = new DrizzleSeasonRepository();
  const [stats, allReviews, cities, seasons] = await Promise.all([
    reviewRepository.getStats(),
    reviewRepository.getAllReviews(false),
    reviewRepository.getCities(),
    seasonRepository.getSeasons(false),
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "IKFW Reviews – India Kids Fashion Week Reviews",
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@type": "Thing", name: "IKFW Reviews" },
  };

  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <SiteJsonLd />
      <div className="min-h-screen w-full overflow-hidden bg-white">
        <Header />
        <HeroBanner />
        <RatingSummary stats={stats} />
        <ParentTestimonials reviews={allReviews} />
        <SeoIntro stats={stats} />
        <ReviewExperience initialReviews={allReviews} initialCities={cities} initialSeasons={seasons} />
        <section className="mx-auto mt-8 w-[calc(100%-64px)] max-w-[1120px] rounded border border-zinc-200 bg-zinc-50 px-7 py-7 max-sm:mx-5 max-sm:w-auto max-sm:px-4">
          <h2 className="text-2xl font-black">How to Use IKFW Reviews</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-700">For a better picture, read several reviews, compare the written experience with the rating, and check whether the review relates to the same season or city you are researching.</p>
          <Link href="/guides/how-to-read-ikfw-reviews" className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Read the guide to comparing IKFW Reviews</Link>
        </section>
        <SeoFaq />
        <WebsiteFooter />
      </div>
    </main>
  );
}
