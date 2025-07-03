
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { VerificationEmail } from './_templates/verification-email.tsx';
import { WelcomeEmail } from './_templates/welcome-email.tsx';
import { WaitlistNotificationEmail } from './_templates/waitlist-notification-email.tsx';
import { UserConfirmationEmail } from './_templates/user-confirmation-email.tsx';

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
  email_type: 'welcome' | 'waitlist_notification' | 'user_confirmation' | 'verification';
  email: string;
  user_name?: string;
  user_role?: string;
  user_id?: string;
  message?: string;
  request_type?: 'waitlist' | 'demo';
  timestamp?: string;
  redirect_to?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Send email function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Email request payload:', JSON.stringify(payload, null, 2));

    if (!resendApiKey) {
      console.error('Cannot send email: RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailRequest = payload as EmailRequest;
    let emailHtml = '';
    let subject = '';
    let toEmail = '';

    switch (emailRequest.email_type) {
      case 'verification':
        console.log('Sending verification email to:', emailRequest.email);
        
        // Generate verification URL using Supabase's auth confirm endpoint
        const verificationUrl = `https://qwvleuornxbjkudvsifr.supabase.co/auth/v1/verify?type=signup&redirect_to=${encodeURIComponent(emailRequest.redirect_to || 'https://creators-now.vercel.app/verify')}`;
        
        emailHtml = await renderAsync(
          React.createElement(VerificationEmail, {
            supabase_url: 'https://qwvleuornxbjkudvsifr.supabase.co',
            email_action_type: 'signup',
            redirect_to: emailRequest.redirect_to || 'https://creators-now.vercel.app/verify',
            token_hash: '',
            token: '',
            user_name: emailRequest.user_name,
            verification_url: verificationUrl,
          })
        );
        
        subject = emailRequest.user_name ? `Welcome to Creators Now, ${emailRequest.user_name}!` : 'Welcome to Creators Now!';
        toEmail = emailRequest.email;
        break;

      case 'welcome':
        console.log('Sending welcome email to:', emailRequest.email);
        
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
        console.log('Sending waitlist notification email');
        
        emailHtml = await renderAsync(
          React.createElement(WaitlistNotificationEmail, {
            email: emailRequest.email,
            message: emailRequest.message,
            request_type: emailRequest.request_type || 'waitlist',
            timestamp: emailRequest.timestamp || new Date().toISOString(),
          })
        );
        
        subject = `New ${emailRequest.request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup'} - ${emailRequest.email}`;
        toEmail = 'info@creators.now'; // Admin email
        break;

      case 'user_confirmation':
        console.log('Sending user confirmation email to:', emailRequest.email);
        
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
        console.error('Unknown email type:', emailRequest.email_type);
        return new Response(JSON.stringify({ error: 'Unknown email type' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }

    console.log('Attempting to send email via Resend...');
    
    const emailResponse = await resend.emails.send({
      from: "Creators Now <info@creators.now>",
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
