import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Parent Guides & Due Diligence – IKFW Reviews",
  description:
    "Explore independent parent guides on India Kids Fashion Week (IKFW). Learn how to evaluate reviews, understand audition fees, verify legitimacy, and prepare your child.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Parent Guides & Due Diligence – IKFW Reviews",
    description:
      "Independent parent guides covering IKFW legitimacy, audition processes, participation costs, and review evaluation.",
    url: absoluteUrl("/guides"),
    type: "website",
  },
};

const guides = [
  {
    slug: "is-ikfw-genuine",
    title: "Is India Kids Fashion Week (IKFW) Genuine? Parent Due Diligence Guide",
    description:
      "A complete evaluation guide for parents who received audition invitations or shortlisted calls. Understand how the event works, verify genuine coordinators, and avoid misleading claims.",
    tag: "Trust & Safety",
    readTime: "6 min read",
  },
  {
    slug: "ikfw-auditions-and-fees",
    title: "IKFW Audition Process, Fees & Grooming: What Parents Need to Know",
    description:
      "Detailed breakdown of what to expect at an IKFW audition, participation costs, grooming workshops, designer runway outfits, and stage deliverables.",
    tag: "Event Guide",
    readTime: "5 min read",
  },
  {
    slug: "how-to-read-ikfw-reviews",
    title: "How to Read IKFW Reviews Before Registering",
    description:
      "A practical checklist on how to compare star ratings with written experiences, filter by season and city, and weigh positive and critical parent feedback.",
    tag: "Review Tips",
    readTime: "4 min read",
  },
];

export default function GuidesIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Parent Guides & Due Diligence – IKFW Reviews",
    url: absoluteUrl("/guides"),
    description:
      "Independent parent guides covering IKFW legitimacy, audition processes, participation costs, and review evaluation.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/guides/${guide.slug}`),
        name: guide.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto my-6 max-w-5xl rounded-2xl border border-zinc-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Guides" }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-600">Parent Resources</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Parent Guides &amp; Due Diligence
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">
            Researching India Kids Fashion Week for your child? These comprehensive, independent guides help you evaluate audition calls, understand fee structures, and compare firsthand parent reviews.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <div
              key={guide.slug}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 p-6 transition-all hover:border-black hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 border border-amber-200">
                    {guide.tag}
                  </span>
                  <span>{guide.readTime}</span>
                </div>
                <h2 className="mt-4 text-xl font-bold leading-snug tracking-tight text-zinc-900">
                  <Link href={`/guides/${guide.slug}`} className="hover:underline">
                    {guide.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{guide.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center text-sm font-black text-black hover:text-amber-600 transition-colors"
                >
                  Read full guide &rarr;
                </Link>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-12 rounded-xl bg-zinc-50 border border-zinc-200 p-6">
          <h3 className="text-lg font-bold text-zinc-900">Have a firsthand experience to share?</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Help other parents make informed choices by contributing an honest review of your child&apos;s participation in India Kids Fashion Week.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/write-review"
              className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800"
            >
              Submit a Review
            </Link>
            <Link
              href="/reviews"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-800 hover:bg-zinc-100"
            >
              Browse All Reviews
            </Link>
          </div>
        </div>
      </article>
      <WebsiteFooter />
    </main>
  );
}
