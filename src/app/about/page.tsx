import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { SITE_NAME, SITE_URL, absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About IKFW Reviews",
  description: "Learn what IKFW Reviews is, who the site is for, and how parent-submitted India Kids Fashion Week reviews are organized.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About IKFW Reviews", description: "Learn about the purpose and review approach of IKFW Reviews.", url: absoluteUrl("/about"), type: "website" },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About IKFW Reviews",
    url: absoluteUrl("/about"),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-3xl bg-white px-6 py-12 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "About" }]} />
        <h1 className="mt-8 text-4xl font-black tracking-tight">About IKFW Reviews</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-700">IKFW Reviews is an independent review platform focused on parent experiences with India Kids Fashion Week. The goal is simple: help parents find useful firsthand feedback before deciding whether an event is right for their child.</p>
        <h2 className="mt-10 text-2xl font-black">What you can find here</h2>
        <ul className="mt-4 space-y-3 text-zinc-700">
          <li>Parent-submitted IKFW reviews and ratings.</li>
          <li>Reviews organized by India Kids Fashion Week season.</li>
          <li>Reviews grouped by city when location information is provided.</li>
          <li>A place for parents to share their own experience.</li>
        </ul>
        <h2 className="mt-10 text-2xl font-black">Our approach</h2>
        <p className="mt-4 leading-7 text-zinc-700">We aim to make review information easier to compare and understand. Reviews can be moderated for spam, abuse, or relevance. We do not claim that every review represents every family&apos;s experience, so readers should consider multiple reviews and the details behind each rating.</p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/reviews" className="rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-zinc-800">Browse IKFW Reviews</Link>
          <Link href="/review-policy" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Review Policy</Link>
        </div>
      </article>
      <WebsiteFooter />
    </main>
  );
}
