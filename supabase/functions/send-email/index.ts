
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
      const confirmationUrl = user.confirmation_url || user.email_confirm_url;
      
      console.log('Sending confirmation email to:', email);
      
      if (!email) {
        console.error('No email found in user record');
        return new Response(JSON.stringify({ error: 'No email found' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Send welcome/confirmation email
      const emailResponse = await resend.emails.send({
        from: "Creators Now <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Creators Now - Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000; text-align: center;">Welcome to Creators Now!</h1>
            <p>Thank you for joining our platform where storytellers connect with AI creators.</p>
            ${confirmationUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" 
                   style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Verify Your Email
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                <a href="${confirmationUrl}">${confirmationUrl}</a>
              </p>
            ` : '<p>Your account is ready to use!</p>'}
            <p>Once verified, you can start exploring our platform and connecting with creators.</p>
            <p>Best regards,<br>The Creators Now Team</p>
          </div>
        `,
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
