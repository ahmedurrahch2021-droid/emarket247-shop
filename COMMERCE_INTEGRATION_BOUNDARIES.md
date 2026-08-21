# eMarket247.shop — Secure Commerce Integration Boundaries

## Current state

The current eMarket247 build is a static, Hostinger-compatible storefront foundation. It does not collect payment details, submit customer orders, store newsletter subscriptions, calculate shipping, manage inventory, or contain merchant credentials. The cart and contact paths are intentionally transparent about this pre-launch state.

## Required service separation

| Capability | Static storefront responsibility | Secure service responsibility |
|---|---|---|
| Product catalog | Render approved product records, images, titles, alt text, captions, and published prices. | Authoritative product data, inventory, price validation, and admin updates. |
| Cart | Display browser-side selections only after product records are approved. | Validate product IDs, variants, pricing, quantity, and stock. |
| Checkout | Direct the customer to an approved secure checkout URL. | Create signed checkout, calculate totals, protect against tampering, and record orders. |
| Payments | Never collect card, wallet, or mobile-financial-service credentials in the static site. | Merchant onboarding, payment initiation, callback validation, and payment status verification. |
| Shipping | Display only approved delivery policy text or an approved quote. | Area coverage, fee, delivery estimate, tracking, returns, and courier API integration. |
| Newsletter | Present consent language and a form. | Store consent, handle confirmation/unsubscribe, and keep customer data secure. |
| Admin | Link to an approved private system; never expose controls through obscurity. | Authentication, product editing, order operations, image approval, and audit logging. |

## Provider decision status

No payment gateway, mobile financial service, courier, newsletter provider, or admin service has been selected for eMarket247. Earlier research identified bKash, SSLCOMMERZ, and Pathao as relevant Bangladesh-market services, but their merchant accounts, fees, terms, service coverage, technical integrations, and operating policies must be verified before selection.[1] [2] [3]

The storefront data model remains provider-neutral. A future secure adapter can expose checkout creation, approved shipping quotes, and consent-based newsletter subscriptions to the frontend without exposing API keys, merchant IDs, signature keys, customer records, or payment webhooks.

## Hostinger File Manager constraint

Hostinger File Manager can host the public static build but is not a safe place for payment secrets, webhook verification, private order processing, customer account authority, or newsletter database credentials. Any future service must use a secure provider-hosted backend, serverless function, commerce platform, or other protected integration layer. The static build should interact only with public, approved checkout/session URLs and carefully scoped endpoints.

## Business decisions required before activation

Payment methods, cash-on-delivery rules, delivery areas, delivery time estimates, delivery fees, returns/exchanges, refund policy, customer support channels, order confirmation messaging, newsletter consent wording, product price/availability, and catalogue ownership must be approved by eMarket247 before the related UI becomes active.

## References

[1]: https://www.bkash.com/en/products-services/payment "bKash payment information"

[2]: https://sslcommerz.com/ "SSLCOMMERZ payment gateway information"

[3]: https://pathao.com/courier/ "Pathao courier information"
