import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { SITE_NAME, SITE_URL, absoluteUrl, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how IKFW Reviews collects, protects, and handles personal information and parent review submissions.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | IKFW Reviews",
    description: "Privacy policy and data protection practices of the IKFW Reviews platform.",
    url: absoluteUrl("/privacy"),
    type: "website",
  },
};

export default function PrivacyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy | IKFW Reviews",
    url: absoluteUrl("/privacy"),
    description: "Privacy Policy for IKFW Reviews.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-3xl bg-white px-6 py-12 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Privacy Policy" }]} />
        <h1 className="mt-8 text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: August 2026</p>

        <p className="mt-5 text-lg leading-8 text-zinc-700">
          At IKFW Reviews, we value your trust and are committed to protecting the privacy of parents, visitors, and reviewers who use our platform. This Privacy Policy outlines what information we collect, how it is used, and the choices you have regarding your data.
        </p>

        <section className="mt-8 space-y-8 text-zinc-700">
          <div>
            <h2 className="text-2xl font-black text-black">1. Information We Collect</h2>
            <p className="mt-3 leading-7">
              We collect information in the following ways when you interact with our website:
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-bold text-black">A. Information You Voluntarily Provide</h3>
                <ul className="mt-2 list-disc space-y-2 pl-6 leading-7">
                  <li><strong>Review Submissions:</strong> When you write a review, we collect the reviewer name or display name you provide, the review title, ratings, written feedback, child&apos;s age or participation details if shared, city, and season of the event.</li>
                  <li><strong>Account &amp; Sign-In Data:</strong> If you sign in or authenticate (such as via Google Sign-In or email authentication), we receive basic profile information including your name, verified email address, and profile photo provided by the identity service.</li>
                  <li><strong>Communication Data:</strong> If you contact our support or moderation team, we collect your email address and message contents to respond to your inquiry.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-black">B. Automatically Collected Information</h3>
                <p className="mt-2 leading-7">
                  When you browse our platform, standard technical information may be automatically logged, such as your browser type, device information, operating system, referring URL, pages viewed, and general geographical location (country/city level via IP address).
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">2. How We Use Your Information</h2>
            <p className="mt-3 leading-7">
              We use the collected information for the following legitimate purposes:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
              <li>To display, organize, and publish parent reviews, ratings, and feedback on the website.</li>
              <li>To authenticate reviewers, maintain account security, and verify genuine participation.</li>
              <li>To detect, investigate, and prevent spam, fraudulent entries, abuse, and violations of our review policies.</li>
              <li>To analyze site traffic, optimize user experience, and ensure fast, reliable performance.</li>
              <li>To respond to user inquiries, policy questions, or content moderation requests.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">3. Public Information vs. Private Data</h2>
            <p className="mt-3 leading-7">
              <strong>Public Display:</strong> The display name you choose, review title, rating score, written review commentary, city, and event season are published publicly so other parents can read your feedback.
            </p>
            <p className="mt-3 leading-7">
              <strong>Private Data:</strong> Your private email address, authentication tokens, and administrative data are never published or publicly disclosed on the website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">4. Cookies and Local Storage</h2>
            <p className="mt-3 leading-7">
              We use essential cookies and browser storage technologies to maintain secure user sessions, remember authentication state, and maintain platform security. You can adjust your browser settings to reject cookies; however, certain interactive features (such as signing in or writing reviews) may not function properly without session cookies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">5. Data Sharing and Third Parties</h2>
            <p className="mt-3 leading-7">
              <strong>We do not sell, rent, or trade your personal information.</strong> We only share data with trusted third-party service providers who assist us in operating our platform (such as cloud hosting, database management, and authentication services), strictly under confidentiality and data protection obligations.
            </p>
            <p className="mt-3 leading-7">
              We may also disclose information if required by law, subpoena, or to protect the safety, rights, or integrity of our users and platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">6. Data Security &amp; Retention</h2>
            <p className="mt-3 leading-7">
              We implement reasonable technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We retain review data for as long as necessary to provide an authentic, historical archive of parent experiences.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">7. Your Data Rights &amp; Choices</h2>
            <p className="mt-3 leading-7">
              You have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or request the deletion of your account and submitted reviews. To submit a data request, please contact our moderation team.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">8. Children&apos;s Privacy</h2>
            <p className="mt-3 leading-7">
              IKFW Reviews is designed for parents, legal guardians, and adult event participants. We do not knowingly collect personal contact information directly from children under 13. Parents who share experiences regarding their children&apos;s participation are advised not to include sensitive personal identification numbers or direct child contact information in public reviews.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">9. Updates to This Privacy Policy</h2>
            <p className="mt-3 leading-7">
              We may periodically update this Privacy Policy to reflect improvements to our practices or operational changes. The &ldquo;Last updated&rdquo; date at the top of this page indicates when revisions took effect.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-black">10. Contact Information</h2>
            <p className="mt-3 leading-7">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please get in touch with our team.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/reviews" className="rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-zinc-800">Browse IKFW Reviews</Link>
          <Link href="/review-policy" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Review Policy</Link>
          <Link href="/terms" className="rounded-xl border border-zinc-300 px-5 py-2.5 transition-colors hover:bg-zinc-100">Terms &amp; Conditions</Link>
        </div>
      </article>
      <WebsiteFooter />
    </main>
  );
}
