export const SITE_URL = "https://ikfwreviews.com";
export const SITE_NAME = "IKFW Reviews";
export const SITE_DESCRIPTION =
  "Read parent-submitted IKFW Reviews about India Kids Fashion Week. Compare ratings, experiences, seasons, and city-specific feedback before registering.";
export const PRIMARY_KEYWORD = "IKFW Reviews";
export const ORGANIZATION_NAME = "IKFW Reviews";

export function absoluteUrl(path = "") {
  return new URL(path, SITE_URL).toString();
}

export function cleanText(value: string, maxLength = 160) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function citySlug(city: string) {
  return city
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export function breadcrumbSchema(items: Array<{ name: string; path?: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function googleSiteVerification() {
  const value = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return value || undefined;
}

export function bingSiteVerification() {
  const value = process.env.BING_SITE_VERIFICATION?.trim();
  return value || undefined;
}
