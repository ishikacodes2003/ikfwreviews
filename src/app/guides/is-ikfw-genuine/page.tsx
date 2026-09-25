import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { absoluteUrl, breadcrumbSchema, cleanText, jsonLd, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Is India Kids Fashion Week Genuine? Parent Due Diligence Guide",
  description: cleanText(
    "Received an audition invite or shortlist call for India Kids Fashion Week? Learn whether IKFW is genuine, how the selection works, fee expectations, and safety tips for parents.",
    155
  ),
  alternates: { canonical: "/guides/is-ikfw-genuine" },
  openGraph: {
    title: "Is India Kids Fashion Week Genuine? Parent Due Diligence Guide",
    description:
      "A complete guide for parents: evaluating audition calls, fee transparency, grooming sessions, and verifying official IKFW communications.",
    url: absoluteUrl("/guides/is-ikfw-genuine"),
    type: "article",
    images: [{ url: "/kids-fashion-reference.png", width: 1200, height: 630, alt: "Is IKFW Genuine Parent Guide" }],
  },
};

const guideFaqs = [
  {
    question: "Is India Kids Fashion Week a legitimate platform?",
    answer:
      "Yes, India Kids Fashion Week (IKFW) is an established commercial runway event for children that has run across multiple seasons and major Indian cities since 2012. It provides runway training, designer showcases, and photography. However, parents should understand it is a paid commercial platform, not an agency hiring child models for paid acting gigs.",
  },
  {
    question: "Why did I receive an audition invitation or shortlist message?",
    answer:
      "IKFW marketing teams and talent scouts run campaigns on social media, Instagram, WhatsApp, and school circuits. Shortlisting for the preliminary audition round is broad and designed to invite many families to audition. Receiving an invitation does not mean your child has been awarded a free modeling contract.",
  },
  {
    question: "Are there charges to participate in IKFW?",
    answer:
      "While preliminary registration or basic auditions may have minimal or free entry in some promotional drives, participating in the final grooming, runway showcase, designer wear presentation, and portfolio collection involves a participation fee package. Always request an itemized invoice before paying.",
  },
  {
    question: "How do I verify that an audition coordinator is official?",
    answer:
      "Check that communications come from verified official domain emails or registered numbers listed on the official event handles. Never transfer funds to private individual bank accounts or personal UPI handles; official payments should go to registered company entities.",
  },
];

export default function IsIkfwGenuinePage() {
  const pageUrl = absoluteUrl("/guides/is-ikfw-genuine");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Is India Kids Fashion Week Genuine? Parent Due Diligence Guide",
        description:
          "Evaluating India Kids Fashion Week audition invites, fees, runway packages, and parent experiences.",
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
        mainEntity: guideFaqs.map((faq) => ({
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
          { name: "Is IKFW Genuine?" },
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
        <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: "Is IKFW Genuine?" }]} />

        <header className="mt-8 border-b border-zinc-200 pb-8">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
            Due Diligence &amp; Safety
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Is India Kids Fashion Week (IKFW) Genuine? What Parents Need to Know
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">
            If you recently received an audition call, social media invitation, or selection message for India Kids Fashion Week, you are likely asking: <em>Is this genuine, how does it work, and is it worth it for my child?</em> Here is an objective, practical breakdown.
          </p>
        </header>

        <section className="mt-8 space-y-8 leading-8 text-zinc-700">
          <div>
            <h2 className="text-2xl font-black text-black">1. What Exactly Is India Kids Fashion Week?</h2>
            <p className="mt-3">
              India Kids Fashion Week (often abbreviated as <strong>IKFW</strong>) is a high-visibility event platform that organizes seasonal fashion shows showcasing designer kids wear. It operates across multiple metropolitan hubs including Mumbai, Delhi, Bangalore, Hyderabad, Pune, and Ahmedabad.
            </p>
            <p className="mt-3">
              The event is real and has successfully concluded over a dozen seasons. Children walk on professional ramps in front of audiences, cameras, and invited guests, wearing outfits created by kidswear designers and brand partners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">2. Is It a Modeling Agency or a Talent Showcase?</h2>
            <p className="mt-3">
              A common misconception among first-time parents is confusing a <strong>fashion week event</strong> with an <strong>exclusive talent agency</strong>.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>An agency</strong> signs a child model and seeks commercial client work, taking a commission from earnings.
              </li>
              <li>
                <strong>IKFW</strong> is an experiential showcase platform where parents enroll their children to gain runway confidence, professional stage exposure, ramp walk grooming, and high-resolution portfolio photos.
              </li>
            </ul>
            <p className="mt-3">
              Understanding this distinction eliminates unmet expectations: you are investing in an event experience, stage grooming, and photo portfolio, rather than an automatic career placement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">3. How the Audition &amp; Selection Funnel Works</h2>
            <p className="mt-3">
              Parents often receive direct messages or calls stating that their child&apos;s photo was &ldquo;shortlisted&rdquo; for an audition round. Here is how that process typically functions:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li><strong>Broad Outreach:</strong> Coordinators reach out to thousands of parents whose children have social media presence or whose details were shared via partner school campaigns.</li>
              <li><strong>Audition / Screening Round:</strong> Children participate in an introductory audition where coordinators assess stage presence and comfort before cameras.</li>
              <li><strong>Runway Package Enrollment:</strong> Selected participants are invited to enroll in the grooming workshop and runway show, which involves a package fee covering choreography sessions, designer outfit fittings, and media coverage.</li>
            </ol>
          </div>

          <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
            <h3 className="text-lg font-bold text-amber-950">Parent Due Diligence Checklist Before Paying</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
              <li>&bull; <strong>Ask for written deliverables:</strong> Exactly how many grooming sessions, stage appearances, and edited photos/videos are included?</li>
              <li>&bull; <strong>Verify payment recipients:</strong> Ensure payments are made to official company accounts, never personal accounts.</li>
              <li>&bull; <strong>Check refund and cancellation policies:</strong> Inquire what happens if the event date is rescheduled or if your child falls ill.</li>
              <li>&bull; <strong>Read local parent feedback:</strong> Check ratings and reviews from previous seasons in your specific city.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">Frequently Asked Questions</h2>
            <div className="mt-5 space-y-4">
              {guideFaqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-zinc-200 p-5">
                  <h3 className="font-extrabold text-black">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">Compare Real Parent Experiences</h2>
            <p className="mt-3">
              The best way to decide if India Kids Fashion Week aligns with your expectations is to read authentic feedback from parents who participated in past seasons.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/reviews"
                className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Read All Parent Reviews
              </Link>
              <Link
                href="/cities"
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-800 transition-colors hover:bg-zinc-100"
              >
                Browse Reviews by City
              </Link>
              <Link
                href="/seasons"
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-800 transition-colors hover:bg-zinc-100"
              >
                Browse Reviews by Season
              </Link>
            </div>
          </div>
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
