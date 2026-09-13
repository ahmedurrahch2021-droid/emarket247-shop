/** Vermilion Atelier: concise support and information pages retain a refined, transparent eMarket247 voice. */
import { Check, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { SiteShell } from "@/components/SiteShell";

const pageCopy: Record<string, { eyebrow: string; title: string; description: string; details: string[] }> = {
  "/about": { eyebrow: "About eMarket247", title: "Jewellery should be easy to understand, not difficult to choose.", description: "eMarket247 is building a clear, thoughtful online jewellery experience for people shopping for themselves, gifting, and meaningful occasions.", details: ["Product information will be published only after review.", "Source imagery is handled through a traceable, rights-aware workflow.", "Shopping guidance will stay direct, useful, and grounded in approved details."] },
  "/contact": { eyebrow: "Contact & care", title: "A considered answer begins with the right question.", description: "Tell us what you are looking for and the eMarket247 team can guide you when the customer-support workflow is live.", details: ["Product availability and pricing require a confirmed catalog record.", "Delivery, returns, and payment support will use approved local policies.", "Please do not send payment information through this preliminary contact path."] },
  "/cart": { eyebrow: "Your bag", title: "Your selection will appear here.", description: "Cart behavior will connect to a secure commerce platform after the product catalog, payment method, shipping policy, and order workflow are approved.", details: ["No payment details are stored in this static storefront foundation.", "Prices and product availability are not shown until verified.", "Checkout will be implemented through a secure service boundary."] },
};

export default function InfoPage() {
  const [location] = useLocation();
  const page = pageCopy[location] ?? pageCopy["/about"];
  const Icon = location === "/contact" ? MessageCircle : location === "/cart" ? ShieldCheck : Mail;
  return (
    <SiteShell>
      <section className="info-page container">
        <div className="info-intro"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p></div>
        <div className="info-panel"><Icon size={25} /><ol>{page.details.map((detail, index) => <li key={detail}><span>0{index + 1}</span>{detail}</li>)}</ol></div>
        {location === "/contact" && <aside className="contact-care-panel"><div><p className="eyebrow">The care standard</p><h2>Useful guidance begins with verified detail.</h2></div><p>Before the full service workflow goes live, eMarket247 is preparing a clear route from collection discovery to confirmed product information, secure checkout, and approved support.</p><div className="contact-care-points"><span><Check size={16} /> Product facts before promises</span><span><Check size={16} /> Clear support at the decision point</span><span><Check size={16} /> Secure services for every transaction</span></div></aside>}
      </section>
    </SiteShell>
  );
}
