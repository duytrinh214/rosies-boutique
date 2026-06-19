import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const customerEmail = session.customer_email || session.customer_details?.email;
    const customerName = session.customer_details?.name || session.metadata?.customer_name || 'Valued Customer';
    const orderRef = 'RB-' + session.id.slice(-6).toUpperCase();
    const total = (session.amount_total / 100).toFixed(2);
    const shippingAddress = session.metadata?.shipping_address || '';
    const shippingMethod = session.metadata?.shipping_method === 'express'
      ? 'Express delivery · next-day before 2pm'
      : 'Standard delivery · 2–4 business days';

    if (customerEmail) {
      try {
        await resend.emails.send({
          from: 'Rosie\'s Boutique <orders@rosiesboutique.com.au>',
          to: customerEmail,
          subject: `Order confirmed · ${orderRef}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9f5f3;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">

    <!-- Header -->
    <div style="background:#2b1d18;padding:32px 40px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:400;letter-spacing:0.05em;">Rosie's Boutique</h1>
      <p style="color:#c9a882;margin:8px 0 0;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;">Artificial Flowers · Melbourne</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#9a7d6e;font-family:Arial,sans-serif;margin:0 0 12px;">Order confirmed</p>
      <h2 style="font-size:32px;font-weight:400;margin:0 0 8px;color:#2b1d18;">Thank you, ${customerName.split(' ')[0]}.</h2>
      <p style="font-size:15px;color:#6b5548;line-height:1.6;margin:16px 0 32px;">
        Your order has been received and your atelier is hand-tying your arrangement now. We'll dispatch within 2 hours.
      </p>

      <!-- Order details -->
      <div style="background:#f9f5f3;border-radius:12px;padding:24px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9a7d6e;font-family:Arial,sans-serif;padding-bottom:6px;">Order reference</td>
            <td style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9a7d6e;font-family:Arial,sans-serif;padding-bottom:6px;text-align:right;">Total</td>
          </tr>
          <tr>
            <td style="font-size:22px;color:#2b1d18;font-weight:400;">${orderRef}</td>
            <td style="font-size:22px;color:#2b1d18;font-weight:600;text-align:right;">$${total} AUD</td>
          </tr>
        </table>

        <hr style="border:none;border-top:1px solid #e8ddd8;margin:20px 0;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9a7d6e;font-family:Arial,sans-serif;padding-bottom:8px;">Delivery</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#2b1d18;line-height:1.5;font-family:Arial,sans-serif;">
              ${shippingAddress}<br>
              <span style="color:#6b5548;font-size:13px;">${shippingMethod}</span>
            </td>
          </tr>
        </table>
      </div>

      <p style="font-size:14px;color:#6b5548;line-height:1.6;font-family:Arial,sans-serif;">
            This is an automated email. If you have any questions about your order, please contact us at
            <a href="mailto:enquiry.rosiesboutique@outlook.com" style="color:#2b1d18;">enquiry.rosiesboutique@outlook.com</a>
            or call <a href="tel:0434513180" style="color:#2b1d18;">0434 513 180</a>.
          </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9f5f3;padding:24px 40px;text-align:center;border-top:1px solid #e8ddd8;">
      <p style="font-size:12px;color:#9a7d6e;margin:0;font-family:Arial,sans-serif;">
        87 President Rd, Albanvale VIC 3021 · Mon–Fri 9am–5pm, Sat 10am–3pm
      </p>
      <p style="font-size:11px;color:#b8a89e;margin:8px 0 0;font-family:Arial,sans-serif;">
        © Rosie's Boutique 2026
      </p>
    </div>

  </div>
</body>
</html>
          `,
        });
        console.log('Confirmation email sent to:', customerEmail);
      } catch (emailErr) {
        console.error('Email send failed:', emailErr);
      }
    }
  }

  return res.status(200).json({ received: true });
}
