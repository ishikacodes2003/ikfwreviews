import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { absoluteUrl, breadcrumbSchema, citySlug, cleanText, jsonLd, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function getReview(id: string) {
  const repository = new DrizzleReviewRepository();
  const review = await repository.getReviewById(id);
  if (!review || review.status !== "published") return null;
  return review;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) return { title: "Review Not Found", robots: { index: false, follow: false } };

  const title = `${review.season || "India Kids Fashion Week"} Review – IKFW Review by ${review.parentName}`;
  const description = cleanText(`${review.rating}/5 IKFW review from ${review.city || "India"}. Read this parent's experience with India Kids Fashion Week and compare it with other parent reviews.`, 155);
  const canonical = `/reviews/${encodeURIComponent(review.id)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
      url: absoluteUrl(canonical),
      publishedTime: review.createdAt,
      modifiedTime: review.createdAt,
      authors: [review.parentName],
      images: review.images.length ? review.images.map((image) => ({ url: image, alt: `${review.season || "India Kids Fashion Week"} review photo` })) : ["/kids-fashion-reference.png"],
    },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) notFound();

  const reviewUrl = absoluteUrl(`/reviews/${encodeURIComponent(review.id)}`);
  const itemName = review.season || review.eventName || "India Kids Fashion Week";
  const cityHref = review.city ? `/cities/${citySlug(review.city)}` : undefined;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${reviewUrl}#webpage`,
        url: reviewUrl,
        name: `${itemName} – IKFW Review`,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        datePublished: review.createdAt,
        dateModified: review.createdAt,
        description: `Review of ${itemName} by ${review.parentName}`,
        breadcrumb: { "@id": `${reviewUrl}#breadcrumbs` },
      },
      {
        "@type": "Review",
        "@id": `${reviewUrl}#review`,
        itemReviewed: {
          "@type": "Event",
          name: itemName,
          url: reviewUrl,
        },
        reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
        author: { "@type": "Person", name: review.parentName },
        datePublished: review.createdAt,
        reviewBody: review.reviewText,
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      },
      { ...breadcrumbSchema([
        { name: itemName, path: `/seasons/${encodeURIComponent(review.seasonId)}` },
        { name: "Review" },
      ]), "@id": `${reviewUrl}#breadcrumbs` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-3xl bg-white px-6 py-10 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: itemName, href: `/seasons/${encodeURIComponent(review.seasonId)}` }, { name: "Review" }]} />
        <header className="mt-8 border-b border-zinc-200 pb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">India Kids Fashion Week Review</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{itemName} – IKFW Review</h1>
          <p className="mt-3 text-sm font-semibold text-zinc-600">
            {review.rating}/5 · {review.parentName} · {review.city || "India"}
          </p>
          <time dateTime={review.createdAt} className="mt-2 block text-sm text-zinc-500">Published {new Date(review.createdAt).toLocaleDateString("en-IN")}</time>
        </header>

        {review.childExperienceHighlight ? <p className="mt-7 rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-bold text-zinc-900">{review.childExperienceHighlight}</p> : null}
        <div className="mt-7 whitespace-pre-wrap text-[16px] leading-8 text-zinc-800">{review.reviewText}</div>

        {review.images.length > 0 ? (
          <section aria-label="Review photos" className="mt-8 grid gap-4 sm:grid-cols-2">
            {review.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${image}-${index}`} src={image} alt={`${itemName} review photo ${index + 1}`} loading="lazy" className="h-auto w-full rounded-xl border border-zinc-200" />
            ))}
          </section>
        ) : null}

        <nav aria-label="Related IKFW review pages" className="mt-10 flex flex-wrap gap-3">
          <Link href={`/seasons/${encodeURIComponent(review.seasonId)}`} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-bold transition-colors hover:border-black">More {review.season || "season"} reviews</Link>
          {cityHref ? <Link href={cityHref} className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-bold transition-colors hover:border-black">IKFW Reviews in {review.city}</Link> : null}
          <Link href="/reviews" className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-zinc-800">All IKFW Reviews</Link>
        </nav>
      </article>
      <WebsiteFooter />
    </main>
  );
}
