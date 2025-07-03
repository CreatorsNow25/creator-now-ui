
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
  email_type: 'verification' | 'welcome' | 'waitlist_notification' | 'user_confirmation';
  email: string;
  user_name?: string;
  user_role?: string;
  message?: string;
  request_type?: 'waitlist' | 'demo';
  timestamp?: string;
}

interface AuthTriggerPayload {
  type: string;
  table: string;
  record: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
    };
  };
  schema: string;
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

    let emailHtml = '';
    let subject = '';
    let toEmail = '';

    // Check if this is a Supabase auth trigger (for verification emails)
    if (payload.type === 'INSERT' && payload.table === 'users' && payload.schema === 'auth') {
      console.log('Handling auth trigger for verification email');
      
      const authPayload = payload as AuthTriggerPayload;
      const userEmail = authPayload.record.email;
      const userName = authPayload.record.raw_user_meta_data?.full_name;
      
      // For verification emails triggered by Supabase auth, we don't have access to the tokens here
      // The user will get the native Supabase verification email with working tokens
      // We'll skip sending our custom verification email from the trigger to avoid conflicts
      console.log('Auth trigger detected - letting Supabase handle verification email');
      
      return new Response(JSON.stringify({ success: true, message: 'Auth trigger handled' }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Handle manual email requests (all other email types)
    const emailRequest = payload as EmailRequest;

    switch (emailRequest.email_type) {
      case 'verification':
        console.log('Manual verification email request - this should not happen anymore');
        return new Response(JSON.stringify({ error: 'Verification emails are now handled by auth trigger' }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });

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
