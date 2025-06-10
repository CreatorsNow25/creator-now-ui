
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

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { project_id, feedback } = await req.json();

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get escrow payment details
    const { data: escrowPayment } = await supabaseService
      .from("escrow_payments")
      .select("*, creators!inner(stripe_connect_id, user_id)")
      .eq("project_id", project_id)
      .eq("storyteller_id", user.id)
      .single();

    if (!escrowPayment) {
      throw new Error("Escrow payment not found");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Capture the held payment
    const paymentIntent = await stripe.paymentIntents.capture(
      escrowPayment.stripe_payment_intent_id
    );

    // Calculate creator payout based on tenure
    const { data: payoutPercentage } = await supabaseService
      .rpc("calculate_creator_payout_percentage", {
        creator_user_id: escrowPayment.creators.user_id
      });

    const creatorPayoutAmount = Math.round(
      (escrowPayment.project_fee * (payoutPercentage || 100)) / 100
    );

    // Transfer funds to creator's Connect account
    const transfer = await stripe.transfers.create({
      amount: creatorPayoutAmount,
      currency: "usd",
      destination: escrowPayment.creators.stripe_connect_id,
      metadata: {
        project_id,
        escrow_payment_id: escrowPayment.id,
        payout_percentage: payoutPercentage || 100
      }
    });

    // Update escrow payment status
    await supabaseService
      .from("escrow_payments")
      .update({
        status: "released",
        released_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", escrowPayment.id);

    // Create approval record
    await supabaseService
      .from("project_approvals")
      .insert({
        project_id,
        escrow_payment_id: escrowPayment.id,
        storyteller_id: user.id,
        creator_id: escrowPayment.creators.user_id,
        status: "approved",
        feedback,
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({
      success: true,
      transfer_id: transfer.id,
      payout_amount: creatorPayoutAmount,
      payout_percentage: payoutPercentage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error approving project:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
