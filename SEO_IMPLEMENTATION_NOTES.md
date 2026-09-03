# eMarket247 SEO and Image-Discovery Notes

Google’s product documentation explains that product structured data can expose product information such as price, availability, ratings, shipping information, and more rich result features when those facts are valid for the page.[1] Because eMarket247 does not yet have approved product names, prices, availability, or mapped product images, the storefront must not publish `Product` or `Offer` JSON-LD for unconfirmed entries.

Google’s image guidance recommends real HTML image elements, a fallback `src` when using responsive image sources, supported image formats, descriptive filenames, information-rich alt text in the page’s context, and relevant page-level image metadata.[2] The existing eMarket247 asset workflow therefore keeps product records, titles, alt text, captions, filename rules, rights information, and image roles in a reviewed catalog contract before public image publication.

The implementation phase will use organization and website structured data for the approved brand-level pages, route-specific metadata, a static robots file, a static sitemap, semantic headings, a skip link, and no fake review, price, availability, shipping, or merchant structured data.

## References

[1]: https://developers.google.com/search/docs/appearance/structured-data/product "Google Search Central: Product structured data"

[2]: https://developers.google.com/search/docs/appearance/google-images "Google Search Central: Image SEO best practices"
