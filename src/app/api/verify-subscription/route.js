import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    // If no subscription was created, return an error
    if (!session.subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    // Get full subscription details
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription.id,
      {
        expand: ['default_payment_method', 'plan.product']
      }
    );

    return NextResponse.json({
      status: subscription.status,
      subscription: {
        id: subscription.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        plan: {
          id: subscription.plan.id,
          name: subscription.plan.product.name,
          amount: subscription.plan.amount,
          currency: subscription.plan.currency,
          interval: subscription.plan.interval
        },
        payment_method: subscription.default_payment_method ? {
          last4: subscription.default_payment_method.card.last4,
          brand: subscription.default_payment_method.card.brand
        } : null
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}