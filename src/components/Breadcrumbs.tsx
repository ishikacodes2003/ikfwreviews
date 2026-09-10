import Link from "next/link";
import { absoluteUrl, breadcrumbSchema, jsonLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: Array<{ name: string; href?: string }> }) {
  const schemaItems = [{ name: "IKFW Reviews", path: "/" }, ...items.map((item) => ({ name: item.name, path: item.href }))];
  return (
    <>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-500">
        <Link href="/" className="hover:text-black">IKFW Reviews</Link>
        {items.map((item) => (
          <span key={`${item.name}-${item.href ?? "current"}`} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? <Link href={item.href} className="hover:text-black">{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...breadcrumbSchema(schemaItems) }) }}
      />
    </>
  );
}
