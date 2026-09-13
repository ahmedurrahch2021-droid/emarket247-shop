/** Vermilion Atelier: browser code can request approved commerce actions but never carries payment, merchant, customer, or email-service secrets. */
export type Money = { currency: "BDT"; amount: number };

export type CartLineRequest = { productId: string; quantity: number; variantId?: string };

export type CheckoutRequest = {
  lines: CartLineRequest[];
  customer?: { email?: string; phone?: string };
  shippingAddress?: { country: string; city?: string; area?: string };
};

export type CheckoutResponse = { checkoutUrl: string };

export type ShippingQuote = { providerName: string; serviceName: string; price?: Money; deliveryEstimate?: string };

/**
 * This interface belongs behind a secure serverless/backend adapter.
 * It deliberately has no API key, signing secret, merchant ID, or payment credential fields.
 */
export interface CommerceGateway {
  createCheckout(request: CheckoutRequest): Promise<CheckoutResponse>;
  getShippingQuotes(request: CheckoutRequest): Promise<ShippingQuote[]>;
  subscribeToNewsletter(email: string, consent: boolean): Promise<void>;
}

/** The static starter does not implement a gateway; all commerce buttons remain transparent until one is approved. */
export const commerceGateway: CommerceGateway | null = null;
