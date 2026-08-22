# Bangladesh Payment and Delivery Recommendation

## Recommendation

For eMarket247’s Bangladesh-first jewellery storefront, the recommended future setup is **SSLCOMMERZ as the primary hosted payment gateway** and **Pathao Courier as the initial delivery/COD partner**. This combination covers broad payment choice, mobile-first checkout expectations, nationwide delivery, cash-on-delivery operations, parcel tracking, and returns without exposing payment or courier credentials in the static Hostinger files.

> **Implementation status:** Research and integration boundaries are ready. No payment, delivery, COD, refund, processing-time, or return policy is live until eMarket247 completes provider onboarding and approves the customer-facing terms.

| Capability | Recommended starting option | Why it fits eMarket247 | Status |
|---|---|---|---|
| Digital payment | **SSLCOMMERZ hosted checkout** | The provider states it supports 33+ payment options, including cards, mobile banking, internet banking, e-wallets, and EMI-capable banks; this reduces checkout fragmentation for Bangladesh shoppers. | Merchant account and server-side order creation required. |
| bKash | **Included through the payment-gateway choice, then reassess direct bKash checkout** | bKash offers online-business payment APIs, tokenized checkout, refunds, and merchant solutions. A direct flow may be considered after eMarket247 has enough payment data to justify a second integration. | Do not expose bKash credentials in static files. |
| Delivery/COD | **Pathao Courier merchant service** | Pathao publicly describes nationwide home delivery, tracking, COD, fulfillment support, and reverse logistics. Jewellery packaging, declared value, coverage, and return handling must be confirmed contractually before launch. | Merchant registration and operations approval required. |
| Customer updates | **Courier tracking link + operational SMS/email provider later** | Tracking is meaningful only after parcels are created by the merchant workflow. | Not enabled. |

## Safe Architecture for a Static Hostinger Site

The public site remains pure HTML, CSS, and JavaScript. Payment and shipping actions must cross a secure server-side boundary:

1. A customer selects a product with approved price and availability.
2. The site sends the order request to a protected backend or provider-hosted order endpoint.
3. The backend validates price, stock, delivery zone, and order data.
4. The backend creates the hosted SSLCOMMERZ session or approved bKash transaction and returns only a redirect URL.
5. Payment confirmation is received and validated server-to-server; browser return URLs alone are never proof of payment.
6. A confirmed order is pushed to the selected courier workflow after packing/dispatch approval.

No API keys, store IDs, signatures, merchant passwords, courier credentials, customer delivery records, or payment amounts may be embedded in JavaScript, HTML, or the Hostinger upload archive.

## Approval Items Needed Before Activation

- Confirm **SSLCOMMERZ** as the initial payment gateway or choose another merchant provider.
- Confirm **Pathao Courier** as the initial courier/COD provider or choose another carrier.
- Complete the merchants’ business/KYC onboarding in their official portals.
- Provide approved product price, stock, packaging/declared-value rules, delivery zones, charges, return/exchange rules, and customer-support contact details.
- Choose where the protected order service will run; static Hostinger alone cannot safely create payment sessions or access courier APIs.

## Evidence Sources

- [bKash Business](https://www.bkash.com/en/business): online-business payment gateway, tokenized checkout, subscriptions, refunds, APIs, and merchant facilities.
- [SSLCOMMERZ](https://sslcommerz.com/): payment-channel, onboarding, integration, reporting, and compliance statements.
- [Pathao Courier](https://pathao.com/courier/): merchant registration, nationwide delivery, tracking, COD, fulfillment, and return-service information.
