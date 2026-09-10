import { jsonLd } from "@/lib/seo";

export const faqs = [
  {
    question: "What are IKFW Reviews?",
    answer:
      "IKFW Reviews are parent-submitted experiences and ratings about India Kids Fashion Week. They are intended to help parents compare experiences before registering.",
  },
  {
    question: "Where can I read India Kids Fashion Week reviews?",
    answer:
      "You can read India Kids Fashion Week reviews on IKFW Reviews, including individual reviews and pages organized by season and city.",
  },
  {
    question: "Can parents submit an IKFW review?",
    answer:
      "Yes. Parents can use the Write a Review page to submit an experience, rating, city, and season. Reviews may be moderated for spam, abuse, or relevance.",
  },
  {
    question: "Are all IKFW reviews the same?",
    answer:
      "No. Experiences can differ by family, city, season, and event. Reading multiple reviews is recommended rather than relying on a single rating.",
  },
];

export function SeoFaq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className="mx-auto mt-8 w-[calc(100%-64px)] max-w-[1120px] rounded-[4px] border border-zinc-200 bg-white px-7 py-7 max-sm:mx-5 max-sm:w-auto max-sm:px-4 max-sm:py-5">
      <h2 className="text-[24px] font-black tracking-tight max-sm:text-[18px]">Frequently Asked Questions About IKFW Reviews</h2>
      <div className="mt-5 space-y-5">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-[15px] font-extrabold max-sm:text-[13px]">{faq.question}</h3>
            <p className="mt-1.5 text-[14px] leading-6 text-zinc-700 max-sm:text-[12px]">{faq.answer}</p>
          </div>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </section>
  );
}
