
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log("Webhook event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);
        
        // Update escrow payment status to held
        await supabaseService
          .from("escrow_payments")
          .update({
            status: "held",
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_session_id", session.id);
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment intent succeeded:", paymentIntent.id);
        
        // Confirm payment is complete
        await supabaseService
          .from("escrow_payments")
          .update({
            status: "held",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);
        break;

      case "transfer.created":
        const transfer = event.data.object as Stripe.Transfer;
        console.log("Transfer created:", transfer.id);
        
        // Mark payment as completed when transfer is created
        await supabaseService
          .from("escrow_payments")
          .update({
            status: "completed",
            released_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("stripe_payment_intent_id", transfer.source_transaction as string);
        break;

      case "account.updated":
        const account = event.data.object as Stripe.Account;
        console.log("Account updated:", account.id);
        
        // Update creator Connect status
        await supabaseService
          .from("creators")
          .update({
            charges_enabled: account.charges_enabled,
            details_submitted: account.details_submitted,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_connect_id", account.id);
        break;

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
