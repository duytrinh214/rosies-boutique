import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, shipping, discountCode, discountAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Build line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.name,
          description: item.size ? `Size: ${item.size}` : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Add shipping cost if express
    if (shipping?.method === 'express') {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: 'Express Delivery (next-day before 2pm)' },
          unit_amount: 1200,
        },
        quantity: 1,
      });
    }

    // Add discount as negative line item if applicable
    if (discountAmount && discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: { name: `Discount${discountCode ? ` (${discountCode})` : ''}` },
          unit_amount: -Math.round(discountAmount * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/bag`,
      automatic_tax: { enabled: false },
      metadata: {
        shipping_method: shipping?.method || 'standard',
        shipping_address: shipping
          ? `${shipping.address}, ${shipping.suburb} ${shipping.state} ${shipping.postcode}`
          : '',
        customer_name: shipping
          ? `${shipping.firstName} ${shipping.lastName}`.trim()
          : '',
        customer_phone: shipping?.phone || '',
        delivery_instructions: shipping?.instructions || '',
      },
    };

    // Prefill email so khach khong can nhap lai
    if (shipping?.email) {
      sessionParams.customer_email = shipping.email;
    }

    // Prefill shipping address vao payment_intent_data
    if (shipping?.address && shipping?.suburb && shipping?.state && shipping?.postcode) {
      sessionParams.payment_intent_data = {
        shipping: {
          name: `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim() || 'Customer',
          phone: shipping.phone || undefined,
          address: {
            line1: shipping.address,
            line2: shipping.unit || undefined,
            city: shipping.suburb,
            state: shipping.state,
            postal_code: shipping.postcode,
            country: 'AU',
          },
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
}
