
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const {
      project_id,
      creator_connect_id,
      project_fee,
      platform_fee,
      processing_fee,
      total_amount,
      success_url,
      cancel_url
    } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session with payment on hold
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Project Payment (Escrow Protected)",
              description: "Funds held in escrow until project completion"
            },
            unit_amount: total_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        capture_method: "manual", // Hold the payment
        metadata: {
          project_id,
          creator_connect_id,
          escrow_protected: "true"
        }
      },
      success_url: success_url,
      cancel_url: cancel_url,
    });

    // Get project and creator info for database record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get creator user_id from connect_id
    const { data: creatorData } = await supabaseService
      .from("creators")
      .select("user_id")
      .eq("stripe_connect_id", creator_connect_id)
      .single();

    // Store escrow payment record
    await supabaseService.from("escrow_payments").insert({
      project_id,
      storyteller_id: user.id,
      creator_id: creatorData?.user_id,
      stripe_session_id: session.id,
      project_fee,
      platform_fee,
      processing_fee,
      total_amount,
      status: "pending",
      created_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({ 
      checkout_url: session.url,
      session_id: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating escrow payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
