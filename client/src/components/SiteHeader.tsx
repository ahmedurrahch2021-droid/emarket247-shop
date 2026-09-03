/** Vermilion Atelier: compact, product-led eMarket247 navigation with vermilion used as a measured brand accent. */
import { Link, useLocation } from "wouter";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

const LOGO_URL = "/manus-storage/emarket247-logo-transparent_c0ae1043.png";

const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Bridal", href: "/bridal" },
  { label: "Occasions", href: "/occasions" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <div className="service-bar">
        <p>Thoughtful jewellery discovery, built for every meaningful moment.</p>
        <Link href="/contact">Need help choosing?</Link>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="icon-button mobile-only"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="brand-link" aria-label="eMarket247 home">
            <img src={LOGO_URL} width={184} height={96} alt="eMarket247 Fashion & Jewellery" decoding="async" />
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={location === item.href ? "nav-link is-active" : "nav-link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button className="icon-button" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
            <Link className="cart-link" href="/cart" aria-label="View shopping bag">
              <ShoppingBag size={20} />
              <span>Bag</span>
              <b>0</b>
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <Link key={item.href} href={item.href} className="mobile-nav-link">
                <span>0{index + 1}</span>{item.label}
              </Link>
            ))}
            <Link href="/contact" className="mobile-nav-contact">Contact & care</Link>
          </nav>
        )}
      </header>

      {isSearchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search eMarket247">
          <div className="search-dialog">
            <button className="search-close" onClick={() => setIsSearchOpen(false)} aria-label="Close search"><X size={22} /></button>
            <p className="eyebrow">Search eMarket247</p>
            <h2>Find a piece by category, occasion, or style.</h2>
            <label className="search-field">
              <span className="sr-only">Search the store</span>
              <Search size={20} />
              <input autoFocus placeholder="Try rings, earrings, bridal…" />
            </label>
            <p className="search-note">Search will connect to the approved catalog once product mapping is complete.</p>
          </div>
        </div>
      )}
    </>
  );
}
