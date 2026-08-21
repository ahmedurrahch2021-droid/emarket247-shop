/** Vermilion Atelier: warm editorial footer that closes the shopping journey with clear, trustworthy paths. */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

const LOGO_URL = "/manus-storage/emarket247-logo-transparent_c0ae1043.png";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <footer className="site-footer">
      <section className="newsletter-panel">
        <div>
          <p className="eyebrow">Notes from the atelier</p>
          <h2>New collections, gifting ideas, and considered jewellery notes.</h2>
        </div>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" required />
          <button type="submit" aria-label="Join eMarket247 notes"><ArrowUpRight size={20} /></button>
          <p>{submitted ? "Thank you — your interest has been noted for launch." : "By joining, you agree to receive eMarket247 updates. A formal privacy workflow will be connected before launch."}</p>
        </form>
      </section>

      <div className="footer-main">
        <div className="footer-brand">
          <img src={LOGO_URL} width={180} height={94} alt="eMarket247 Fashion & Jewellery" decoding="async" />
          <p>A modern destination for jewellery that carries the moment.</p>
        </div>
        <div className="footer-column">
          <h3>Discover</h3>
          <Link href="/shop">Shop all</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/bridal">Bridal edit</Link>
          <Link href="/occasions">Occasions</Link>
        </div>
        <div className="footer-column">
          <h3>Care</h3>
          <Link href="/about">About eMarket247</Link>
          <Link href="/contact">Contact & support</Link>
          <Link href="/faq">Frequently asked questions</Link>
          <Link href="/shipping-returns">Shipping & returns</Link>
        </div>
        <div className="footer-column">
          <h3>Information</h3>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cart">Your bag</Link>
          <span className="footer-status">Catalog being prepared with care.</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} eMarket247. All rights reserved.</p>
        <p>Built with product care, clear detail, and responsible publishing.</p>
      </div>
    </footer>
  );
}
