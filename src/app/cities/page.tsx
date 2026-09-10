import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { WebsiteFooter } from "@/components/WebsiteFooter";
import { DrizzleReviewRepository } from "@/lib/reviews/drizzleReviewRepository";
import { absoluteUrl, citySlug, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IKFW Reviews by City – India Kids Fashion Week",
  description: "Browse IKFW Reviews by city and read parent-submitted India Kids Fashion Week experiences from locations across India.",
  alternates: { canonical: "/cities" },
  openGraph: { title: "IKFW Reviews by City", description: "Browse India Kids Fashion Week reviews by city.", url: absoluteUrl("/cities"), type: "website" },
};

export default async function CitiesPage() {
  const cities = await new DrizzleReviewRepository().getCities();
  const items = cities.filter((city) => city.city !== "All Cities" && city.count > 0).sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "IKFW Reviews by City",
    url: absoluteUrl("/cities"),
    mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((city, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/cities/${citySlug(city.city)}`), name: `IKFW Reviews in ${city.city}` })) },
  };

  return (
    <main className="min-h-screen bg-[#f8f8f9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Header />
      <article className="mx-auto max-w-5xl bg-white px-6 py-10 my-6 rounded-2xl border border-zinc-200 shadow-sm sm:px-10">
        <Breadcrumbs items={[{ name: "Cities" }]} />
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">Parent Reviews by City</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">IKFW Reviews by City</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">Find parent-submitted India Kids Fashion Week reviews by city and compare local experiences before registering.</p>
        </header>
        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((city) => (
            <Link key={city.city} href={`/cities/${citySlug(city.city)}`} className="rounded-xl border border-zinc-200 p-5 transition-all hover:border-black hover:shadow-sm">
              <h2 className="font-black">IKFW Reviews in {city.city}</h2>
              <p className="mt-2 text-sm text-zinc-600">{city.count} published reviews</p>
            </Link>
          ))}
        </section>
      </article>
      <WebsiteFooter />
    </main>
  );
}
