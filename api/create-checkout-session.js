import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = req.body || {};
    const line_items = (items || []).map((item) => ({
      price: item.stripe_price_id,
      quantity: Math.max(1, Number(item.qty) || 1)
    }));

    const origin = req.headers.origin || process.env.SITE_URL;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
      billing_address_collection: 'auto'
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create Stripe Checkout session.' });
  }
}
