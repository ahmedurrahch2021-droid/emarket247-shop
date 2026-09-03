/** Vermilion Atelier: the error state remains warm, calm, and offers immediate shopping escape routes. */
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return <SiteShell><section className="not-found container"><p className="eyebrow">Page not found</p><h1>That page has slipped out of the jewellery box.</h1><p>Return to the main edit, browse the developing categories, or contact eMarket247 for support.</p><div><Link href="/" className="button button-ink">Back home <ArrowRight size={18} /></Link><Link href="/shop" className="text-cta">Explore the edit <ArrowRight size={17} /></Link></div></section></SiteShell>;
}
