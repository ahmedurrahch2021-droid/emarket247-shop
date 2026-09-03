/** Vermilion Atelier: editorial campaign rhythm, precise category scaffolding, and trustworthy pre-catalog transparency. */
import { ArrowDownRight, ArrowRight, CircleHelp, Gem, Heart, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { CollectionPlaceholder } from "@/components/CollectionPlaceholder";
import { SiteShell } from "@/components/SiteShell";

const HERO = "/manus-storage/emarket247-hero-vermilion-atelier_4b6b7b63.jpg";
const BRIDAL = "/manus-storage/emarket247-bridal-occasion-editorial_ed91364d.jpg";
const GIFTING = "/manus-storage/emarket247-gifting-puja-editorial_9dd55897.jpg";

const categories = ["Rings", "Earrings", "Necklaces", "Bracelets", "Bangles", "Pendants", "Jewellery Sets", "Gift Jewellery"];

export default function Home() {
  return (
    <SiteShell>
      <section className="hero-section">
        <div className="hero-copy">
          <div><span className="vermilion-rule" /><p className="eyebrow">The eMarket247 atelier</p></div>
          <h1>Jewellery,<br /><em>with a point of view.</em></h1>
          <p>Considered pieces, clear detail, and a calmer way to find the adornment that carries the moment.</p>
          <div className="hero-actions"><Link href="/shop" className="button button-ink">Explore the edit <ArrowRight size={18} /></Link><Link href="/about" className="text-cta">Our point of view <ArrowDownRight size={17} /></Link></div>
        </div>
        <div className="hero-image-wrap"><img src={HERO} width={1920} height={1080} fetchPriority="high" decoding="async" alt="Editorial jewellery still life on ivory paper with a vermilion ribbon" /><span className="hero-edition">Edition 01<br />In formation</span></div>
      </section>

      <section className="category-section container">
        <div className="section-heading"><div><p className="eyebrow">Find your form</p><h2>Start with the silhouette.</h2></div><Link href="/categories" className="text-cta">View all categories <ArrowRight size={17} /></Link></div>
        <div className="category-grid">
          {categories.map((category, index) => <Link href="/categories" className="category-tile" key={category}><span>0{index + 1}</span><h3>{category}</h3><ArrowRight size={18} /></Link>)}
        </div>
      </section>

      <section className="manifesto-strip"><div className="container"><p>Product stories should hold up to a closer look.</p><span>eMarket247</span><p>That is why every image, description, and detail is being prepared with care.</p></div></section>

      <CollectionPlaceholder eyebrow="Bridal edit" title="For the day the details matter most." description="A quiet, considered bridal direction with space for the pieces that become part of the memory." image={BRIDAL} imageAlt="Editorial bridal jewellery still life on woven ivory textile" />

      <section className="process-section container">
        <div className="process-title"><p className="eyebrow">A clearer way to choose</p><h2>The beauty is in the detail.<br /><em>So is the confidence.</em></h2></div>
        <div className="process-list">
          <article><Gem size={23} /><span>01</span><h3>See the piece</h3><p>Original product imagery is being mapped to the correct item and view.</p></article>
          <article><CircleHelp size={23} /><span>02</span><h3>Know the details</h3><p>Material, size, care, and product information will be published only when verified.</p></article>
          <article><ShieldCheck size={23} /><span>03</span><h3>Choose with clarity</h3><p>Secure commerce services will be connected through approved payment and delivery workflows.</p></article>
        </div>
      </section>

      <CollectionPlaceholder reverse eyebrow="Gifting & occasions" title="Let the gesture do the talking." description="An intentional edit for celebrations, milestones, and the small moments worth making visible." image={GIFTING} imageAlt="Jewellery and gift-wrap editorial composition on warm handcrafted paper" />

      <section className="launch-note container"><div><Heart size={20} fill="currentColor" /><p className="eyebrow">Before the first collection</p></div><h2>We are building the catalog with the same attention you would give the gift.</h2><p>eMarket247 is preparing accurate product records, image descriptions, and care information before opening the full shopping experience.</p><Link href="/contact" className="button button-primary">Keep in touch <ArrowRight size={18} /></Link></section>
    </SiteShell>
  );
}
