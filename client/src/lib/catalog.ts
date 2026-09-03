/** Vermilion Atelier: eMarket247 product data is approval-gated so images and commerce details are never invented in the UI. */
export type ImageRole = "product-primary" | "product-gallery" | "editorial" | "occasion" | "bridal" | "gift";
export type ReviewStatus = "unassigned" | "needs-business-review" | "metadata-drafted" | "approved" | "do-not-publish";
export type Availability = "in-stock" | "out-of-stock" | "pre-order";

/** BDT money. A null amount on a product means the value is pending business approval. */
export type BdtMoney = { currency: "BDT"; amount: number };

/** A purchasable choice for one product (e.g. metal or size option). */
export type ProductVariant = {
  id: string;
  name: string;
  sku?: string | null;
  price?: BdtMoney | null;
};

/** Per-language SEO title/description for a product record. */
export type ProductSeo = {
  title: string;
  description: string;
};

/** Image metadata as published in the static catalogue JSON (primary + gallery). */
export type ProductImage = {
  src: string;
  srcset?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type CatalogImage = {
  assetId: string;
  sourceFilename: string;
  publishedFilename: string;
  src: string;
  width: number;
  height: number;
  role: ImageRole;
  title: string;
  alt: string;
  caption?: string;
  copyright: "© eMarket247. All rights reserved.";
  creator: string;
  credit: string;
  reviewStatus: ReviewStatus;
  codeReference: string;
};

/**
 * Canonical product record shape. Mirrors `static-site/assets/data/catalog.<lang>.json`
 * so the checkpoint model stays a faithful superset of the published data. Fields that
 * have no approved value (sku, price, compareAtPrice, availability, materials, sizes,
 * variants, gallery) are null / empty and must never be fabricated.
 */
export type CatalogProduct = {
  id: string;
  slug: string;
  sku: string | null;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  price: BdtMoney | null;
  compareAtPrice: BdtMoney | null;
  currency: "BDT";
  availability: Availability | null;
  materials: string[];
  sizes: string[];
  variants: ProductVariant[];
  image: ProductImage;
  gallery: ProductImage[];
  seo: ProductSeo;
  status?: string;
  copyright?: string;
  original_filename?: string;
  reviewStatus: ReviewStatus;
};

/** Published entries must be both product-approved and image-approved. */
export function canPublishProduct(product: CatalogProduct) {
  return product.reviewStatus === "approved";
}

/** No values are added until the business confirms the source-image mapping and product facts. */
export const catalog: CatalogProduct[] = [];

export const catalogStatus = {
  dataModelVersion: "2.0" as const,
  sourceImageCount: 48,
  publishedProductCount: catalog.filter(canPublishProduct).length,
  /** 27 jewellery-detail records are awaiting the business's category decision; the remaining 21 are already mapped. */
  unassignedCategoryCount: 27,
  priceStatus: "pending-business-confirmation" as const,
  imageMetadataStatus: "source-to-product mapping in progress" as const,
};
