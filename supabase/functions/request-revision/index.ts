
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

    if (!project_id || !feedback) {
      throw new Error("Project ID and feedback are required");
    }

    // Use service role to update project_approvals
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update the project approval status to revision_requested
    const { data: approval, error: approvalError } = await supabaseService
      .from("project_approvals")
      .update({
        status: "revision_requested",
        feedback: feedback,
        updated_at: new Date().toISOString()
      })
      .eq("project_id", project_id)
      .eq("storyteller_id", user.id)
      .select()
      .single();

    if (approvalError) {
      throw new Error(`Failed to update approval: ${approvalError.message}`);
    }

    // Update escrow payment status to pending revision
    await supabaseService
      .from("escrow_payments")
      .update({
        status: "revision_requested",
        updated_at: new Date().toISOString()
      })
      .eq("project_id", project_id);

    return new Response(JSON.stringify({
      success: true,
      message: "Revision requested successfully",
      approval: approval
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error requesting revision:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
