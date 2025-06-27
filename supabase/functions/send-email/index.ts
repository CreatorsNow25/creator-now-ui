
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationEmail } from './_templates/verification-email.tsx'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    console.log('Send email function called');
    
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Payload received, verifying webhook...');
    
    const wh = new Webhook(hookSecret)
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        id: string
        email: string
        user_metadata?: {
          full_name?: string
          role?: string
        }
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    console.log('Webhook verified, processing email...', {
      email: user.email,
      action_type: email_action_type,
      user_role: user.user_metadata?.role
    });

    const userName = user.user_metadata?.full_name || user.email.split('@')[0];
    const userRole = user.user_metadata?.role || 'storyteller';
    const appUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://creators-now.vercel.app';

    let emailHtml: string;
    let emailSubject: string;

    if (email_action_type === 'signup') {
      // Send verification email
      emailHtml = await renderAsync(
        React.createElement(VerificationEmail, {
          supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
          token,
          token_hash,
          redirect_to,
          email_action_type,
          user_name: userName,
        })
      );
      emailSubject = 'Verify your Creators Now account';
    } else {
      // Send welcome email for other actions
      emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, {
          user_name: userName,
          user_role: userRole,
          app_url: appUrl,
        })
      );
      emailSubject = 'Welcome to Creators Now!';
    }

    console.log('Sending email via Resend...');

    const { data, error } = await resend.emails.send({
      from: 'Creators Now <onboarding@resend.dev>',
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
});
