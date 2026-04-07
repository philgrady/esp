import Stripe from 'stripe';

export default async (req) => {
  if (req.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = JSON.parse(req.body || '{}');
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to create Stripe Checkout session.' })
    };
  }
};
