
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
    console.log('🚀 Send email function called - FUNCTION IS WORKING!');
    console.log('🔍 Request details:', {
      method: req.method,
      headers: Object.keys(Object.fromEntries(req.headers)),
      url: req.url
    });
    
    // Check if required environment variables are present
    if (!resend) {
      console.error('❌ RESEND_API_KEY is missing');
      throw new Error('RESEND_API_KEY is not configured');
    }
    
    if (!hookSecret) {
      console.error('❌ SEND_EMAIL_HOOK_SECRET is missing');
      throw new Error('SEND_EMAIL_HOOK_SECRET is not configured');
    }
    
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('📧 Processing email request...');
    console.log('Headers received:', Object.keys(headers));
    console.log('Payload length:', payload.length);
    console.log('Hook secret length:', hookSecret.length);
    console.log('Hook secret first/last chars:', hookSecret.charAt(0) + '...' + hookSecret.charAt(hookSecret.length - 1));
    
    // Verify webhook signature
    let webhookData;
    try {
      const wh = new Webhook(hookSecret.trim()) // Trim any whitespace
      webhookData = wh.verify(payload, headers) as {
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
      console.log('✅ Webhook verified successfully');
    } catch (webhookError) {
      console.error('❌ Webhook verification failed:', webhookError);
      console.error('Webhook headers:', JSON.stringify(headers, null, 2));
      throw new Error(`Webhook verification failed: ${webhookError.message}`);
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = webhookData;

    console.log('📋 Email details:', {
      email: user.email,
      action_type: email_action_type,
      user_role: user.user_metadata?.role,
      redirect_to
    });

    const userName = user.user_metadata?.full_name || user.email.split('@')[0];
    const userRole = user.user_metadata?.role || 'storyteller';
    const appUrl = 'https://creators-now.vercel.app';

    let emailHtml: string;
    let emailSubject: string;

    if (email_action_type === 'signup') {
      console.log('📨 Sending verification email...');
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
      console.log('👋 Sending welcome email...');
      emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, {
          user_name: userName,
          user_role: userRole,
          app_url: appUrl,
        })
      );
      emailSubject = 'Welcome to Creators Now!';
    }

    console.log('📤 Sending email via Resend...');

    const { data, error } = await resend.emails.send({
      from: 'Creators Now <info@creators.now>',
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log('✅ Email sent successfully!', data);

    return new Response(JSON.stringify({ 
      success: true, 
      data,
      message: 'Custom email sent successfully!' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('💥 Error in send-email function:', error);
    console.error('Stack trace:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
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
