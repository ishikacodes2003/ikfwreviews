import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "IKFW Reviews Policy & Moderation",
  description: "Learn how IKFW Reviews handles parent-submitted reviews, moderation, ratings, and review authenticity for India Kids Fashion Week content.",
  alternates: { canonical: "/review-policy" },
  openGraph: { title: "IKFW Reviews Policy & Moderation", description: "How IKFW Reviews handles submissions and moderation.", url: absoluteUrl("/review-policy"), type: "website" },
};

export default function ReviewPolicyPage() {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "IKFW Reviews Policy & Moderation", url: absoluteUrl("/review-policy") };
  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-3xl bg-white px-6 py-12 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Review Policy" }]} />
        <h1 className="mt-8 text-4xl font-black tracking-tight">IKFW Reviews Policy</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-700">Our review policy explains how parent-submitted experiences are presented and moderated on IKFW Reviews.</p>
        <h2 className="mt-10 text-2xl font-black">What we publish</h2>
        <p className="mt-4 leading-7 text-zinc-700">Reviews should describe a real experience with India Kids Fashion Week and provide useful information for other parents. Ratings should match the reviewer&apos;s stated experience.</p>
        <h2 className="mt-10 text-2xl font-black">Moderation</h2>
        <p className="mt-4 leading-7 text-zinc-700">Reviews may be hidden or removed when they contain spam, abusive material, irrelevant content, or other material that does not belong on a parent review platform. We do not present moderation as proof that a review is factually true; readers should evaluate the details of each review themselves.</p>
        <h2 className="mt-10 text-2xl font-black">Why multiple reviews matter</h2>
        <p className="mt-4 leading-7 text-zinc-700">A single review cannot represent every family&apos;s experience. We recommend reading several IKFW reviews, comparing experiences across seasons and cities, and considering both positive and negative feedback before making a decision.</p>
        <Link href="/reviews" className="mt-8 inline-flex rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800">Browse IKFW Reviews</Link>
      </article>
      <WebsiteFooter />
    </main>
  );
}
