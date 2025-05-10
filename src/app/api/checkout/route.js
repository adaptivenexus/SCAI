import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan, isNewRegistration } = await req.json();

    const fetchedPlanDetails = await fetch(
      `${process.env.NEXT_PUBLIC_SWAGGER_URL}/subscription_plan/plans/${plan}/`
    );
    const planDetails = await fetchedPlanDetails.json();

    const sessionConfig = {
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ScanDoq: ${planDetails.name}`,
              description: planDetails.description,
            },
            unit_amount: Math.round(planDetails.price * 100), // Convert to cents and ensure integer
            recurring: {
              interval: "month", // Set to month for monthly subscription
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/success?session_id={CHECKOUT_SESSION_ID}&type=${
        isNewRegistration ? "registration" : "upgrade"
      }`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while creating the checkout session." },
      { status: 500 }
    );
  }
}
