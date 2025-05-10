import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MAX_VERIFICATION_TIME = 300; // 5 minutes in seconds

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const startTime = parseInt(
      searchParams.get("start_time") || Date.now() / 1000
    );
    const currentTime = Date.now() / 1000;

    if (!sessionId) {
      return NextResponse.json(
        { valid: false, error: "No session ID provided" },
        { status: 400 }
      );
    }

    // Check if we've exceeded maximum verification time
    if (currentTime - startTime > MAX_VERIFICATION_TIME) {
      return NextResponse.json(
        {
          valid: false,
          status: "timeout",
          message:
            "Payment verification timed out. Please contact support if your payment was processed.",
          shouldRetry: false,
        },
        { status: 200 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "subscription"],
    });
    // First check subscription status if this is a subscription
    if (session.mode === "subscription") {
      if (session.subscription) {
        const subscription = session.subscription;
        switch (subscription.status) {
          case "active":
          case "trialing":
            return NextResponse.json(
              {
                valid: true,
                status: "complete",
                message: "Subscription activated successfully!",
                shouldRetry: false,
              },
              { status: 200 }
            );
          case "incomplete":
            // Continue checking payment status
            break;
          case "canceled":
          case "incomplete_expired":
            return NextResponse.json(
              {
                valid: false,
                status: "failed",
                message: "Subscription setup failed. Please try again.",
                shouldRetry: false,
              },
              { status: 200 }
            );
        }
      }
    }

    // Check payment status
    switch (session.payment_status) {
      case "paid":
        return NextResponse.json(
          {
            valid: true,
            status: "complete",
            message: "Payment completed successfully!",
            shouldRetry: false,
          },
          { status: 200 }
        );

      case "unpaid":
        return NextResponse.json(
          {
            valid: false,
            status: "pending",
            message: "Payment has not been processed yet",
            shouldRetry: true,
            timeRemaining: MAX_VERIFICATION_TIME - (currentTime - startTime),
          },
          { status: 200 }
        );

      case "pending":
        // Check payment intent for more detailed status
        if (session.payment_intent) {
          const paymentIntent =
            typeof session.payment_intent === "string"
              ? await stripe.paymentIntents.retrieve(session.payment_intent)
              : session.payment_intent;

          switch (paymentIntent.status) {
            case "succeeded":
              return NextResponse.json(
                {
                  valid: true,
                  status: "complete",
                  message: "Payment processed successfully!",
                  shouldRetry: false,
                },
                { status: 200 }
              );

            case "processing":
              return NextResponse.json(
                {
                  valid: true,
                  status: "processing",
                  message:
                    "Your payment is being processed. This may take a moment.",
                  shouldRetry: true,
                  timeRemaining:
                    MAX_VERIFICATION_TIME - (currentTime - startTime),
                },
                { status: 200 }
              );

            case "requires_payment_method":
              return NextResponse.json(
                {
                  valid: false,
                  status: "failed",
                  message: "Payment method was declined. Please try again.",
                  shouldRetry: false,
                },
                { status: 200 }
              );

            default:
              return NextResponse.json(
                {
                  valid: false,
                  status: paymentIntent.status,
                  message:
                    "Payment is in an unexpected state. Please contact support.",
                  shouldRetry: true,
                  timeRemaining:
                    MAX_VERIFICATION_TIME - (currentTime - startTime),
                },
                { status: 200 }
              );
          }
        }
        return NextResponse.json(
          {
            valid: true,
            status: "pending",
            message: "Payment is being processed",
            shouldRetry: true,
            timeRemaining: MAX_VERIFICATION_TIME - (currentTime - startTime),
          },
          { status: 200 }
        );

      case "no_payment_required":
        return NextResponse.json(
          {
            valid: true,
            status: "complete",
            message: "No payment was required",
            shouldRetry: false,
          },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          {
            valid: false,
            status: "unknown",
            message: `Unexpected payment status: ${session.payment_status}`,
            shouldRetry: true,
            timeRemaining: MAX_VERIFICATION_TIME - (currentTime - startTime),
          },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "Session verification failed",
        message: error.message,
        shouldRetry: true,
      },
      { status: 400 }
    );
  }
}
