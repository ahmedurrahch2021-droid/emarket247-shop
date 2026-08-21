/** Vermilion Atelier: eMarket247 product data is approval-gated so images and commerce details are never invented in the UI. */
export type ImageRole = "product-primary" | "product-gallery" | "editorial" | "occasion" | "bridal" | "gift";
export type ReviewStatus = "unassigned" | "needs-business-review" | "metadata-drafted" | "approved" | "do-not-publish";

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

export type CatalogProduct = {
  productId: string;
  slug: string;
  name: string;
  category: string;
  material?: string;
  color?: string;
  sku?: string;
  price?: { currency: "BDT"; amount: number; saleAmount?: number };
  availability?: "in-stock" | "out-of-stock" | "pre-order";
  images: CatalogImage[];
  reviewStatus: ReviewStatus;
};

/** Published entries must be both product-approved and image-approved. */
export function canPublishProduct(product: CatalogProduct) {
  return product.reviewStatus === "approved" && product.images.some((image) => image.role === "product-primary" && image.reviewStatus === "approved");
}

/** No values are added until the business confirms the source-image mapping and product facts. */
export const catalog: CatalogProduct[] = [];

export const catalogStatus = {
  sourceImageCount: 48,
  publishedProductCount: catalog.filter(canPublishProduct).length,
  priceStatus: "pending-business-confirmation" as const,
  imageMetadataStatus: "source-to-product mapping in progress" as const,
};
