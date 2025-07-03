
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { VerificationEmail } from './_templates/verification-email.tsx';
import { WelcomeEmail } from './_templates/welcome-email.tsx';
import { WaitlistNotificationEmail } from './_templates/waitlist-notification-email.tsx';
import { UserConfirmationEmail } from './_templates/user-confirmation-email.tsx';

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: 'welcome' | 'waitlist_notification' | 'user_confirmation' | 'verification';
  email: string;
  user_name?: string;
  user_role?: string;
  user_id?: string;
  message?: string;
  request_type?: 'waitlist' | 'demo';
  timestamp?: string;
  redirect_to?: string;
  token_hash?: string;
  token?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const emailRequest = payload as EmailRequest;
    let emailHtml = '';
    let subject = '';
    let toEmail = '';

    switch (emailRequest.email_type) {
      case 'verification':
        // For verification emails, generate OTP through Supabase
        const supabaseUrl = 'https://qwvleuornxbjkudvsifr.supabase.co';
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        // Generate OTP for email verification
        const otpResponse = await fetch(`${supabaseUrl}/auth/v1/otp`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({
            email: emailRequest.email,
            type: 'signup',
            create_user: false
          })
        });

        const otpData = await otpResponse.json();
        const token_hash = otpData.token_hash || '';
        
        emailHtml = await renderAsync(
          React.createElement(VerificationEmail, {
            supabase_url: supabaseUrl,
            email_action_type: 'signup',
            redirect_to: emailRequest.redirect_to || 'https://creators-now.vercel.app/verify',
            token_hash: token_hash,
            token: otpData.token || '',
            user_name: emailRequest.user_name || '',
          })
        );
        
        subject = emailRequest.user_name ? `Welcome to Creators Now, ${emailRequest.user_name}!` : 'Welcome to Creators Now!';
        toEmail = emailRequest.email;
        break;

      case 'welcome':
        emailHtml = await renderAsync(
          React.createElement(WelcomeEmail, {
            user_name: emailRequest.user_name,
            user_role: emailRequest.user_role,
            app_url: 'https://creators.now',
          })
        );
        
        subject = "Welcome to Creators Now - Let's Get Started!";
        toEmail = emailRequest.email;
        break;

      case 'waitlist_notification':
        emailHtml = await renderAsync(
          React.createElement(WaitlistNotificationEmail, {
            email: emailRequest.email,
            message: emailRequest.message,
            request_type: emailRequest.request_type || 'waitlist',
            timestamp: emailRequest.timestamp || new Date().toISOString(),
          })
        );
        
        subject = `New ${emailRequest.request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup'} - ${emailRequest.email}`;
        toEmail = 'info@creators.now';
        break;

      case 'user_confirmation':
        emailHtml = await renderAsync(
          React.createElement(UserConfirmationEmail, {
            user_name: emailRequest.user_name || emailRequest.email.split('@')[0],
            request_type: emailRequest.request_type || 'waitlist',
            app_url: 'https://creators.now',
          })
        );
        
        subject = `Thank you for your ${emailRequest.request_type === 'demo' ? 'demo request' : 'waitlist signup'}!`;
        toEmail = emailRequest.email;
        break;

      default:
        return new Response(JSON.stringify({ error: 'Unknown email type' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }

    const emailResponse = await resend.emails.send({
      from: "Creators Now <info@creators.now>",
      to: [toEmail],
      subject,
      html: emailHtml,
    });
    
    if (emailResponse.error) {
      return new Response(JSON.stringify({ error: 'Failed to send email', details: emailResponse.error }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
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
