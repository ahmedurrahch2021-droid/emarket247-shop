# eMarket247.shop — Static Hosting and Brand Direction

## Approved visual direction

The eMarket247 storefront will use a **predominantly white and warm-ivory layout**. The supplied eMarket247 logo establishes the identity, with **black** carrying typography, navigation, footer, and high-confidence controls, while **eMarket247 red** is reserved for calls to action, active states, category cues, and editorial accents. Pandora remains a benchmark for clear luxury eCommerce UX; it is not a color, campaign, or visual template for this project.

## Price publication policy

Prices will remain absent from the pre-launch catalog until approved values are received. The storefront must not use sample prices, fake sales, availability, or inferred product claims. The catalog model is ready to receive pricing later without changing image metadata, image accessibility, or the public URL structure.

## Hostinger File Manager delivery contract

The final site will be exported as a static production build. The delivery workflow creates a clean external `emarket247-hostinger-package` folder that contains `dist/public`, local copies of the approved eMarket247 brand files, local copies of the generated campaign images, static configuration files, and a small deployment guide. This package has no dependency on Manus storage URLs.

For a standard static deployment, upload the **contents** of `emarket247-hostinger-package` into the domain’s `public_html` directory rather than uploading the parent folder itself. Because the storefront uses browser routes, the final package includes a Hostinger-compatible `.htaccess` fallback so routes such as `/shop`, `/bridal`, and `/contact` resolve to the application shell when Apache rewrite support is available.

The static package will not contain payment secrets, merchant keys, personal data storage, real checkout logic, or mail credentials. Payment, order, customer account, newsletter, and admin functions will be connected later through secure services, not through Hostinger File Manager JavaScript.
