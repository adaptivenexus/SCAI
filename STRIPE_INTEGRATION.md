# Stripe Payment Page Integration in Next.js (App Router)

This guide provides a step-by-step process to integrate a Stripe payment page in a Next.js application using the App Router and server-side logic.

## Prerequisites

1. **Stripe Account**: Create an account at [Stripe](https://stripe.com/).
2. **Install Dependencies**: Run the following command to install the required Stripe libraries:

   ```bash
   npm install stripe @stripe/stripe-js
   ```

3. **Environment Variables**: Add the following variables to your `.env.local` file:

   ```env
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   Replace `your_stripe_secret_key` and `your_stripe_publishable_key` with your actual Stripe keys.

---

## Backend Logic

Create a server-side API route to handle the creation of a Stripe Checkout session.

1. **File**: `src/app/api/checkout/route.js`
2. **Code**:

   ```javascript
   import Stripe from "stripe";

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

   export async function POST(req) {
     try {
       const { planType } = await req.json();

       const prices = {
         "free-plan": "price_free",
         "basic-plan": "price_basic",
         "standard-plan": "price_standard",
         "enterprise-plan": "price_enterprise",
         "executive-plan": "price_executive",
       };

       const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         line_items: [
           {
             price: prices[planType],
             quantity: 1,
           },
         ],
         mode: "subscription",
         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
         cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
       });

       return new Response(JSON.stringify({ url: session.url }), {
         status: 200,
       });
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
       });
     }
   }
   ```

---

## Frontend Logic

Use Stripe's client-side library to redirect users to the Stripe Checkout page.

1. **File**: `src/components/StripePaymentPage.jsx`
2. **Code**:

   ```javascript
   "use client";

   import { useState } from "react";

   export default function StripePaymentPage() {
     const [loading, setLoading] = useState(false);

     const handleCheckout = async (planType) => {
       setLoading(true);
       try {
         const response = await fetch("/api/checkout", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({ planType }),
         });

         const { url } = await response.json();
         window.location.href = url;
       } catch (error) {
         console.error("Error:", error);
       } finally {
         setLoading(false);
       }
     };

     return (
       <div>
         <button
           onClick={() => handleCheckout("basic-plan")}
           disabled={loading}
           className="bg-blue-500 text-white px-4 py-2 rounded"
         >
           {loading ? "Processing..." : "Subscribe to Basic Plan"}
         </button>
       </div>
     );
   }
   ```

---

## Integrate the Payment Page

Use the `StripePaymentPage` component in your desired page, such as the pricing page.

1. **File**: `src/app/(landing)/pricing/page.jsx`
2. **Code**:

   ```javascript
   import StripePaymentPage from "../../../components/StripePaymentPage";

   export default function PricingPage() {
     return (
       <div>
         <h1>Pricing</h1>
         <StripePaymentPage />
       </div>
     );
   }
   ```

---

## Testing

1. Run your application:

   ```bash
   npm run dev
   ```

2. Navigate to the pricing page and test the Stripe payment page.
3. Use Stripe's test card numbers for testing payments. Refer to the [Stripe Testing Guide](https://stripe.com/docs/testing).

---

## Deployment

1. Ensure your environment variables are set in your production environment.
2. Test the integration in production mode.

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)

By following these steps, you should have successfully integrated a Stripe payment page into your Next.js application.
