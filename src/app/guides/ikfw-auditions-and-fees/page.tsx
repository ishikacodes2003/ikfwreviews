import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { absoluteUrl, breadcrumbSchema, cleanText, jsonLd, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "IKFW Audition Process, Fees & Grooming: What Parents Need to Know",
  description: cleanText(
    "Explore the complete breakdown of India Kids Fashion Week auditions, participation fees, grooming workshops, designer outfits, and what parents receive.",
    155
  ),
  alternates: { canonical: "/guides/ikfw-auditions-and-fees" },
  openGraph: {
    title: "IKFW Audition Process, Fees & Grooming: What Parents Need to Know",
    description:
      "A complete guide for parents: audition expectations, fee structures, ramp training, and final event deliverables.",
    url: absoluteUrl("/guides/ikfw-auditions-and-fees"),
    type: "article",
    images: [{ url: "/kids-fashion-reference.png", width: 1200, height: 630, alt: "IKFW Auditions and Fees Guide" }],
  },
};

const auditionFaqs = [
  {
    question: "What happens during an IKFW audition?",
    answer:
      "Children are usually introduced in age groups. Coordinators evaluate the child's comfort level in front of the camera, their ability to follow basic walking cues, and their enthusiasm. Judges focus on natural charm, poise, and confidence rather than strict technical modeling standards.",
  },
  {
    question: "How much are the India Kids Fashion Week participation fees?",
    answer:
      "Fees vary depending on the season, city tier, and package tier selected. While preliminary registration is sometimes low-cost or complimentary during promotional drives, final runway packages typically cover grooming, designer attire fittings, backstage makeup, event entry passes, and digital portfolio photos.",
  },
  {
    question: "What is included in the IKFW grooming workshop?",
    answer:
      "Selected participants undergo professional runway grooming sessions prior to the main show. These workshops cover posture, ramp walk rhythm, camera posing, stage confidence, and group coordination to prepare young kids for the live audience experience.",
  },
  {
    question: "Do parents get to keep the designer clothes?",
    answer:
      "In most runway events, designer outfits are rented or showcased on loan for the runway segment and returned backstage after the show, unless an exclusive retail purchase arrangement is explicitly made with the designer brand.",
  },
];

export default function AuditionsAndFeesPage() {
  const pageUrl = absoluteUrl("/guides/ikfw-auditions-and-fees");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "IKFW Audition Process, Fees & Grooming: What Parents Need to Know",
        description:
          "Comprehensive parent guide to India Kids Fashion Week audition screening, grooming classes, fee breakdown, and event deliverables.",
        url: pageUrl,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          logo: absoluteUrl("/icon-512.png"),
        },
        mainEntityOfPage: pageUrl,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: auditionFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        ...breadcrumbSchema([
          { name: "Guides", path: "/guides" },
          { name: "Auditions & Fees" },
        ]),
        "@id": `${pageUrl}#breadcrumbs`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto my-6 max-w-4xl rounded-2xl border border-zinc-200 bg-white px-6 py-12 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: "Auditions & Fees" }]} />

        <header className="mt-8 border-b border-zinc-200 pb-8">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
            Event Preparation
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            IKFW Auditions, Fees &amp; Grooming: Everything Parents Need to Know
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">
            Planning to take your child to an India Kids Fashion Week audition? Here is a realistic overview of the audition screening, the schedule commitments, the fee structure, and the deliverables parents receive.
          </p>
        </header>

        <section className="mt-8 space-y-8 leading-8 text-zinc-700">
          <div>
            <h2 className="text-2xl font-black text-black">1. The Audition Screening Day</h2>
            <p className="mt-3">
              Audition rounds are held in major banquet halls or luxury hotel ballrooms in cities like Mumbai, Delhi, Bengaluru, Hyderabad, and Pune. Here is what typically happens:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Registration &amp; Chest Numbers:</strong> Parents register on arrival and receive a contestant number for their child.</li>
              <li><strong>Introductory Walk:</strong> Children walk a short runway or marker to evaluate stage comfort and responsiveness.</li>
              <li><strong>Short Interview:</strong> The panel asks simple questions (favorite hobbies, age, school) to help shy children relax.</li>
              <li><strong>Camera Snapshot:</strong> A quick test photo is taken to check how comfortably the child engages with the camera.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">2. Understanding the Fee Structure</h2>
            <p className="mt-3">
              One of the most frequently asked questions on IKFW Reviews is about fees. It is crucial to understand what is included:
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-xs font-bold uppercase tracking-wider text-zinc-700">
                  <tr>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Cost Type</th>
                    <th className="px-5 py-3">What It Covers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="px-5 py-3 font-semibold text-zinc-900">Audition Round</td>
                    <td className="px-5 py-3 text-zinc-600">Free / Nominal registration</td>
                    <td className="px-5 py-3 text-zinc-600">Entry, identification badge, judge screening</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-semibold text-zinc-900">Runway Package</td>
                    <td className="px-5 py-3 text-zinc-600">Participation Fee</td>
                    <td className="px-5 py-3 text-zinc-600">Grooming sessions, choreography, hair &amp; makeup, stage passes</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-semibold text-zinc-900">Media &amp; Portfolio</td>
                    <td className="px-5 py-3 text-zinc-600">Included or Optional Add-on</td>
                    <td className="px-5 py-3 text-zinc-600">High-resolution runway photography, show videos, certificate of participation</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Note: Exact package rates change with each season and city. Always request an official printed or emailed brochure before signing or making transfers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">3. What Value Does Your Child Gain?</h2>
            <p className="mt-3">
              According to hundreds of reviews submitted by parents on our platform, the primary benefits highlighted are:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Confidence Building:</strong> Overcoming stage fright and performing under spotlights in front of a live audience.</li>
              <li><strong>Social Skills:</strong> Interacting with peers of similar age groups during rehearsal sessions.</li>
              <li><strong>Professional Portfolio:</strong> Professional runway pictures that can be used for school events, personal memories, or future talent pursuits.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">Frequently Asked Questions</h2>
            <div className="mt-5 space-y-4">
              {auditionFaqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-zinc-200 p-5">
                  <h3 className="font-extrabold text-black">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="text-lg font-bold text-zinc-900">Explore Real Feedback from Your City</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Audition management and venue arrangements can vary significantly across cities. Read city-specific reviews from parents in your area:
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
              <Link href="/cities/mumbai" className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:border-black">
                Mumbai Reviews
              </Link>
              <Link href="/cities/delhi" className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:border-black">
                Delhi NCR Reviews
              </Link>
              <Link href="/cities/bangalore" className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:border-black">
                Bangalore Reviews
              </Link>
              <Link href="/cities/hyderabad" className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:border-black">
                Hyderabad Reviews
              </Link>
              <Link href="/cities/pune" className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:border-black">
                Pune Reviews
              </Link>
            </div>
          </div>
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
