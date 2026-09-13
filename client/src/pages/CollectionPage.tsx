/** Vermilion Atelier: category-route foundation uses approved editorial imagery and explicit catalog-preparation status. */
import { Link, useLocation } from "wouter";
import { ArrowRight, Check, SlidersHorizontal } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { catalogStatus } from "@/lib/catalog";

const HERO = "/manus-storage/emarket247-gifting-puja-editorial_9dd55897.jpg";

const pages: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/shop": { eyebrow: "The eMarket247 edit", title: "A considered collection is taking shape.", description: "We are mapping each original jewellery image to its correct product record, accessibility description, and rights metadata before it joins the public catalog." },
  "/categories": { eyebrow: "Browse by form", title: "Start with the silhouette that feels like yours.", description: "Rings, earrings, necklaces, bracelets, bangles, pendants, jewellery sets, and gifts will be organized through a clear, verified catalog." },
  "/bridal": { eyebrow: "Bridal edit", title: "Pieces for the day you will remember.", description: "The bridal collection will be published only after products, material details, sizing, and editorial roles have been verified." },
  "/occasions": { eyebrow: "Occasion edit", title: "Make the moment feel considered.", description: "Explore future edits for gifting, celebrations, weddings, anniversaries, and personal milestones through approved collection relationships." },
};

const proofingCards = ["Primary image", "Gallery detail", "Product facts", "Rights & access"];

export default function CollectionPage() {
  const [location] = useLocation();
  const page = pages[location] ?? pages["/shop"];
  return (
    <SiteShell>
      <section className="page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        <img src={HERO} alt="Editorial jewellery and gift-wrap composition on warm paper" width={1200} height={800} decoding="async" />
      </section>
      <section className="catalog-staging container">
        <div className="catalog-toolbar">
          <div><span className="vermilion-rule" /><p className="eyebrow">Catalog status</p><h2>Product records are under careful review.</h2></div>
          <button className="filter-button" type="button"><SlidersHorizontal size={18} /> Filters will appear here</button>
        </div>
        <div className="catalog-proof-grid" aria-label="Catalog proofing structure">
          {proofingCards.map((label, index) => (
            <article className="proof-card" key={label}>
              <div className="proof-image"><span>0{index + 1}</span><i /></div>
              <div className="proof-body"><p>{label}</p><b>Awaiting approved record</b><em /><em className="short" /></div>
              <footer><span>Metadata</span><span>Review required</span></footer>
            </article>
          ))}
        </div>
        <div className="catalog-review-note">
          <div><span>01</span><h3>Publishing product detail responsibly.</h3></div>
          <p>Each of the {catalogStatus.sourceImageCount} source photographs is being matched to a confirmed product name, image role, alt text, caption, and rights record before it is offered for purchase. Prices remain unpublished until approved.</p>
          <Link href="/contact" className="text-cta">Contact the team <ArrowRight size={17} /></Link>
        </div>
      </section>
    </SiteShell>
  );
}
