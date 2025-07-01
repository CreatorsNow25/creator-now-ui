
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { VerificationEmail } from './_templates/verification-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailHookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
  old_record?: any;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send email function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailHookPayload = await req.json();
    console.log('Email hook payload:', JSON.stringify(payload, null, 2));

    // Handle user confirmation email
    if (payload.type === 'INSERT' && payload.table === 'users') {
      const user = payload.record;
      const email = user.email;
      const userName = user.raw_user_meta_data?.full_name || user.email?.split('@')[0];
      
      console.log('Sending confirmation email to:', email);
      
      if (!email) {
        console.error('No email found in user record');
        return new Response(JSON.stringify({ error: 'No email found' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Use the React email template for verification
      const emailHtml = await renderAsync(
        React.createElement(VerificationEmail, {
          supabase_url: Deno.env.get('SUPABASE_URL') || '',
          email_action_type: 'signup',
          redirect_to: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com') || 'http://localhost:3000'}/verify`,
          token_hash: user.confirmation_token || '',
          token: user.confirmation_token || '',
          user_name: userName,
        })
      );

      // Send verification email using the template
      const emailResponse = await resend.emails.send({
        from: "Creators Now <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Creators Now - Verify Your Email",
        html: emailHtml,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, emailResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // If we don't handle this type of email, just return success
    console.log('Email type not handled, returning success');
    return new Response(JSON.stringify({ success: true, message: 'Email type not handled' }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
