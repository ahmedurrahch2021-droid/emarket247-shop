/** Vermilion Atelier: route-level titles and valid brand-level structured data, deliberately excluding unconfirmed product offers. */
import { useEffect } from "react";
import { useLocation } from "wouter";

const ORIGIN = "https://emarket247.shop";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": { title: "eMarket247 | Fashion & Jewellery", description: "eMarket247 is preparing a considered Bangladesh-focused jewellery shopping experience with clear product detail and thoughtful discovery." },
  "/shop": { title: "Shop Jewellery | eMarket247", description: "Explore the developing eMarket247 jewellery edit. Product records and image metadata are being carefully prepared before publication." },
  "/categories": { title: "Jewellery Categories | eMarket247", description: "Discover eMarket247 jewellery by category, including rings, earrings, necklaces, bracelets, bangles, pendants, sets, and gifts." },
  "/bridal": { title: "Bridal Jewellery Edit | eMarket247", description: "Explore the developing eMarket247 bridal jewellery edit, prepared with verified product details and imagery." },
  "/occasions": { title: "Jewellery for Occasions | eMarket247", description: "Discover eMarket247 occasion-led jewellery ideas for gifting, celebrations, weddings, anniversaries, and milestones." },
  "/about": { title: "About eMarket247 | Fashion & Jewellery", description: "Learn about eMarket247’s approach to clear product information, thoughtful jewellery discovery, and responsible publishing." },
  "/contact": { title: "Contact eMarket247 | Jewellery Support", description: "Contact eMarket247 for support and collection guidance as the jewellery catalog is prepared for launch." },
  "/cart": { title: "Your Bag | eMarket247", description: "Your eMarket247 selection will appear here once the secure catalog and checkout workflow are available." },
  "/faq": { title: "Frequently Asked Questions | eMarket247", description: "Find clear answers about the developing eMarket247 catalog, product information, and future shopping support." },
  "/shipping-returns": { title: "Shipping & Returns | eMarket247", description: "eMarket247 shipping and returns details will be published when approved policies and providers are confirmed." },
  "/privacy": { title: "Privacy | eMarket247", description: "Read eMarket247’s privacy information when the final customer data and newsletter workflow is published." },
  "/terms": { title: "Terms | eMarket247", description: "Read eMarket247’s terms when final commerce and service policies are approved for launch." },
};

function upsertMeta(selector: string, attribute: "name" | "property", value: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function SeoHead() {
  const [location] = useLocation();
  const meta = routeMeta[location] ?? { title: "Page not found | eMarket247", description: "The requested eMarket247 page could not be found." };
  const canonicalUrl = `${ORIGIN}${location === "/" ? "/" : location}`;

  useEffect(() => {
    document.title = meta.title;
    upsertMeta('meta[name="description"]', "name", "description", meta.description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", meta.description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
  }, [canonicalUrl, meta.description, meta.title]);

  if (location !== "/") return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${ORIGIN}/#organization`, name: "eMarket247", url: ORIGIN, logo: `${ORIGIN}/manus-storage/emarket247-logo-transparent_c0ae1043.png` },
      { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: ORIGIN, name: "eMarket247", publisher: { "@id": `${ORIGIN}/#organization` }, inLanguage: "en" },
      { "@type": "WebPage", "@id": `${ORIGIN}/#home`, url: ORIGIN, name: meta.title, description: meta.description, isPartOf: { "@id": `${ORIGIN}/#website` }, about: { "@id": `${ORIGIN}/#organization` } },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
