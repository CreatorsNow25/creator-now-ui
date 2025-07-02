
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { VerificationEmail } from './_templates/verification-email.tsx';
import { WelcomeEmail } from './_templates/welcome-email.tsx';
import { WaitlistNotificationEmail } from './_templates/waitlist-notification-email.tsx';

const resendApiKey = Deno.env.get("RESEND_API_KEY");
console.log('RESEND_API_KEY configured:', !!resendApiKey);

if (!resendApiKey) {
  console.error('RESEND_API_KEY not found in environment variables');
}

const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: 'verification' | 'welcome' | 'waitlist_notification';
  email: string;
  user_name?: string;
  user_role?: string;
  message?: string;
  request_type?: 'waitlist' | 'demo';
  timestamp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send email function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailRequest = await req.json();
    console.log('Email request payload:', JSON.stringify(payload, null, 2));

    if (!resendApiKey) {
      console.error('Cannot send email: RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let emailHtml = '';
    let subject = '';
    let toEmail = '';

    switch (payload.email_type) {
      case 'verification':
        console.log('Sending verification email to:', payload.email);
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const redirectTo = 'https://creators-now.vercel.app/verify';
        
        emailHtml = await renderAsync(
          React.createElement(VerificationEmail, {
            supabase_url: supabaseUrl,
            email_action_type: 'signup',
            redirect_to: redirectTo,
            token_hash: '', // Will be filled by Supabase auth
            token: '', // Will be filled by Supabase auth
            user_name: payload.user_name,
          })
        );
        
        subject = "Welcome to Creators Now - Verify Your Email";
        toEmail = payload.email;
        break;

      case 'welcome':
        console.log('Sending welcome email to:', payload.email);
        
        emailHtml = await renderAsync(
          React.createElement(WelcomeEmail, {
            user_name: payload.user_name,
            user_role: payload.user_role,
            app_url: 'https://creators-now.vercel.app',
          })
        );
        
        subject = "Welcome to Creators Now - Let's Get Started!";
        toEmail = payload.email;
        break;

      case 'waitlist_notification':
        console.log('Sending waitlist notification email');
        
        emailHtml = await renderAsync(
          React.createElement(WaitlistNotificationEmail, {
            email: payload.email,
            message: payload.message,
            request_type: payload.request_type || 'waitlist',
            timestamp: payload.timestamp || new Date().toISOString(),
          })
        );
        
        subject = `New ${payload.request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup'} - ${payload.email}`;
        toEmail = 'contact@creators-now.com'; // Admin email
        break;

      default:
        console.error('Unknown email type:', payload.email_type);
        return new Response(JSON.stringify({ error: 'Unknown email type' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }

    console.log('Attempting to send email via Resend...');
    
    const emailResponse = await resend.emails.send({
      from: "Creators Now <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);
    
    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
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
