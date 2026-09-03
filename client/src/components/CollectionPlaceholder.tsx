/** Vermilion Atelier: transparent pre-catalog presentation avoids inventing product names, prices, or availability. */
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

type CollectionPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

export function CollectionPlaceholder({ eyebrow, title, description, image, imageAlt, reverse = false }: CollectionPlaceholderProps) {
  return (
    <section className={reverse ? "collection-placeholder is-reversed" : "collection-placeholder"}>
      <div className="collection-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link href="/contact" className="text-cta">Ask about the collection <ArrowRight size={17} /></Link>
      </div>
      <div className="collection-image-wrap">
        <img src={image} alt={imageAlt} width={1200} height={900} loading="lazy" decoding="async" />
        <span className="image-status"><Sparkles size={15} /> Editorial reference</span>
      </div>
    </section>
  );
}
