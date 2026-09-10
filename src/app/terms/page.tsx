import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { SITE_NAME, SITE_URL, absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the Terms and Conditions for using IKFW Reviews, submitting parent reviews, content moderation, and platform policies.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms and Conditions | IKFW Reviews",
    description: "Terms and conditions for using the IKFW Reviews independent parent review platform.",
    url: absoluteUrl("/terms"),
    type: "website",
  },
};

export default function TermsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms and Conditions | IKFW Reviews",
    url: absoluteUrl("/terms"),
    description: "Terms and Conditions for using the IKFW Reviews platform.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-3xl bg-white px-6 py-12 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Terms & Conditions" }]} />
        <h1 className="mt-8 text-4xl font-black tracking-tight">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: August 2026</p>

        <p className="mt-5 text-lg leading-8 text-zinc-700">
          Welcome to IKFW Reviews. By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully before using the platform or submitting content.
        </p>

        <section className="mt-8 space-y-8 text-zinc-700">
          <div>
            <h2 className="text-2xl font-black text-black">1. Independent Community Platform</h2>
            <p className="mt-3 leading-7">
              IKFW Reviews is an independent community review platform created to share firsthand experiences and feedback from parents regarding India Kids Fashion Week events. IKFW Reviews is not affiliated with, endorsed by, operated by, or connected to India Kids Fashion Week, its organizers, or parent companies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">2. User Submissions & Review Guidelines</h2>
            <p className="mt-3 leading-7">
              When submitting a review, rating, commentary, or other content on IKFW Reviews, you agree to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
              <li>Provide accurate, truthful, and genuine feedback based on your direct firsthand experience as a parent or legal guardian.</li>
              <li>Refrain from posting defamatory, harassing, abusive, hateful, obscene, or unlawful statements.</li>
              <li>Avoid submitting spam, commercial advertisements, promotional solicitations, or automated entries.</li>
              <li>Ensure that you have the right to submit the content and that it does not infringe upon any third-party privacy or intellectual property rights.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">3. License to Submitted Content</h2>
            <p className="mt-3 leading-7">
              By submitting a review or testimonial to IKFW Reviews, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to display, publish, format, distribute, and index your submitted content on our website and associated channels.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">4. Content Moderation & Removal</h2>
            <p className="mt-3 leading-7">
              We reserve the right, but do not assume the obligation, to monitor, review, reject, edit metadata for clarity, or remove any review or user content at our sole discretion. Content that violates our community standards, review policy, or applicable laws may be removed without prior notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">5. Intellectual Property</h2>
            <p className="mt-3 leading-7">
              All website design, text, graphics, layouts, and software code on IKFW Reviews (excluding individual user-submitted review texts) are the property of IKFW Reviews and are protected by applicable copyright and intellectual property laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">6. Disclaimers & Limitation of Liability</h2>
            <p className="mt-3 leading-7">
              The information and reviews published on this website are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for general informational purposes only. Reviews reflect the subjective opinions of individual parents and do not represent the views of IKFW Reviews. We make no representations or warranties regarding the accuracy, completeness, or reliability of any user review or event outcome.
            </p>
            <p className="mt-3 leading-7">
              In no event shall IKFW Reviews or its operators be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or reliance on information provided on this platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">7. Third-Party Links</h2>
            <p className="mt-3 leading-7">
              This website may contain links to external third-party websites or services. We do not control or endorse the content, policies, or practices of third-party platforms and assume no responsibility for them.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">8. Changes to These Terms</h2>
            <p className="mt-3 leading-7">
              We may update or revise these Terms and Conditions from time to time. Any modifications will be posted on this page with an updated revision date. Your continued use of the website following any changes signifies your acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">9. Contact Us</h2>
            <p className="mt-3 leading-7">
              If you have questions, concerns, or requests regarding these Terms and Conditions or our review policies, please reach out through our community support channels.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/reviews" className="rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-zinc-800">Browse IKFW Reviews</Link>
          <Link href="/review-policy" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Review Policy</Link>
          <Link href="/privacy" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Privacy Policy</Link>
        </div>
      </article>
      <WebsiteFooter />
    </main>
  );
}
