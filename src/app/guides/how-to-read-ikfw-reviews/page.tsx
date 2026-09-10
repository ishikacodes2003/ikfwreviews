import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Read IKFW Reviews Before Registering",
  description: "A practical guide for parents on how to compare IKFW Reviews, ratings, seasons, cities, and individual experiences before registering.",
  alternates: { canonical: "/guides/how-to-read-ikfw-reviews" },
  openGraph: { title: "How to Read IKFW Reviews Before Registering", description: "A practical guide to comparing IKFW Reviews.", url: absoluteUrl("/guides/how-to-read-ikfw-reviews"), type: "article" },
};

export default function GuidePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Read IKFW Reviews Before Registering",
    description: "A practical guide for parents on comparing IKFW Reviews.",
    mainEntityOfPage: absoluteUrl("/guides/how-to-read-ikfw-reviews"),
    publisher: { "@type": "Organization", name: "IKFW Reviews", url: absoluteUrl("/") },
  };
  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-3xl bg-white px-6 py-12 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Guides" }, { name: "How to Read IKFW Reviews" }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">Parent Guide</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">How to Read IKFW Reviews Before Registering</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-700">IKFW Reviews are most useful when you compare several experiences rather than relying on one star rating. Use the following process to evaluate the information available on the site.</p>
        </header>
        <section className="mt-10 space-y-8">
          <div><h2 className="text-2xl font-black">1. Read more than one review</h2><p className="mt-3 leading-7 text-zinc-700">Look for patterns across several parent experiences. One review can describe a specific family situation; multiple reviews can show whether a point appears repeatedly.</p></div>
          <div><h2 className="text-2xl font-black">2. Compare the written experience with the rating</h2><p className="mt-3 leading-7 text-zinc-700">A 5-star or 2-star score gives you a quick signal, but the written explanation contains more context. Pay attention to what the reviewer actually experienced.</p></div>
          <div><h2 className="text-2xl font-black">3. Check the season</h2><p className="mt-3 leading-7 text-zinc-700">Experiences can vary between seasons. Use the season pages to compare reviews that relate to the same India Kids Fashion Week season.</p></div>
          <div><h2 className="text-2xl font-black">4. Check the city</h2><p className="mt-3 leading-7 text-zinc-700">If location matters to your decision, compare reviews from the relevant city and then read the individual experiences behind those ratings.</p></div>
          <div><h2 className="text-2xl font-black">5. Consider both positive and negative feedback</h2><p className="mt-3 leading-7 text-zinc-700">Balanced research means reading different experiences. The purpose of a review directory is to give parents information to consider, not to tell every family what decision to make.</p></div>
        </section>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/reviews" className="rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-zinc-800">Read IKFW Reviews</Link>
          <Link href="/seasons" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Browse by Season</Link>
          <Link href="/cities" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Browse by City</Link>
        </div>
      </article>
      <WebsiteFooter />
    </main>
  );
}
