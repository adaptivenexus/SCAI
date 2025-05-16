import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan, isNewRegistration } = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SWAGGER_URL}/subscription_plan/list/`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch plan list: ${response.status}`);
    }
    const data = await response.json();
    let planDetails;
    if (Array.isArray(data)) {
      planDetails = data.find((item) => item.id == plan); // loose equality for type safety
    } else {
      throw new Error("Plan list response is not an array");
    }
    if (!planDetails) {
      throw new Error(`Plan with id ${plan} not found`);
    }

    console.log(planDetails);

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
      }&plan=${plan}`,
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
