
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationEmail } from './_templates/verification-email.tsx'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { PasswordResetEmail } from './_templates/password-reset-email.tsx'
import { EmailChangeEmail } from './_templates/email-change-email.tsx'
import { ReviewRequestEmail } from './_templates/review-request-email.tsx'
import { ReviewReceivedEmail } from './_templates/review-received-email.tsx'
import { FeedbackRequestEmail } from './_templates/feedback-request-email.tsx'

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
    console.log('🚀 Send email function called');
    
    // Check if required environment variables are present
    if (!resend) {
      console.error('❌ RESEND_API_KEY is missing');
      throw new Error('RESEND_API_KEY is not configured');
    }
    
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('📧 Processing email request...');
    
    let webhookData;
    let emailType = 'auth'; // default to auth emails
    
    try {
      const parsedPayload = JSON.parse(payload);
      
      // Check if this is a custom email type (review/feedback)
      if (parsedPayload.email_type) {
        emailType = 'custom';
        webhookData = parsedPayload;
        console.log('📬 Custom email type detected:', parsedPayload.email_type);
      } else {
        // Standard auth webhook verification
        if (!hookSecret) {
          console.error('❌ SEND_EMAIL_HOOK_SECRET is missing');
          throw new Error('SEND_EMAIL_HOOK_SECRET is not configured');
        }
        
        const wh = new Webhook(hookSecret)
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
            new_email?: string
          }
        }
        console.log('✅ Auth webhook verified successfully');
      }
    } catch (webhookError) {
      console.error('❌ Webhook verification failed:', webhookError);
      throw new Error(`Webhook verification failed: ${webhookError.message}`);
    }

    let emailHtml: string;
    let emailSubject: string;
    let recipientEmail: string;

    if (emailType === 'custom') {
      // Handle custom email types (reviews, feedback, etc.)
      const customData = webhookData as any;
      recipientEmail = customData.recipient_email;
      
      if (customData.email_type === 'review_request') {
        console.log('📝 Sending review request email...');
        emailHtml = await renderAsync(
          React.createElement(ReviewRequestEmail, {
            recipient_name: customData.recipient_name,
            project_title: customData.project_title,
            reviewer_name: customData.reviewer_name,
            reviewer_type: customData.reviewer_type,
            app_url: customData.app_url || 'https://creators-now.vercel.app',
            project_id: customData.project_id,
          })
        );
        emailSubject = `Review Request: ${customData.project_title}`;
        
      } else if (customData.email_type === 'review_received') {
        console.log('⭐ Sending review received email...');
        emailHtml = await renderAsync(
          React.createElement(ReviewReceivedEmail, {
            recipient_name: customData.recipient_name,
            project_title: customData.project_title,
            reviewer_name: customData.reviewer_name,
            reviewer_type: customData.reviewer_type,
            rating: customData.rating,
            review_comment: customData.review_comment,
            app_url: customData.app_url || 'https://creators-now.vercel.app',
            project_id: customData.project_id,
          })
        );
        emailSubject = `New ${customData.rating}-star review for ${customData.project_title}`;
        
      } else if (customData.email_type === 'feedback_request') {
        console.log('💬 Sending feedback request email...');
        emailHtml = await renderAsync(
          React.createElement(FeedbackRequestEmail, {
            recipient_name: customData.recipient_name,
            project_title: customData.project_title,
            requester_name: customData.requester_name,
            requester_type: customData.requester_type,
            feedback_type: customData.feedback_type,
            app_url: customData.app_url || 'https://creators-now.vercel.app',
            project_id: customData.project_id,
            message: customData.message,
          })
        );
        emailSubject = `Feedback Request: ${customData.project_title}`;
        
      } else {
        throw new Error(`Unknown custom email type: ${customData.email_type}`);
      }
      
    } else {
      // Handle standard auth emails
      const {
        user,
        email_data: { token, token_hash, redirect_to, email_action_type, new_email },
      } = webhookData as any;

      console.log('📋 Email details:', {
        email: user.email,
        action_type: email_action_type,
        user_role: user.user_metadata?.role,
        redirect_to,
        new_email
      });

      recipientEmail = user.email;
      const userName = user.user_metadata?.full_name || user.email.split('@')[0];
      const userRole = user.user_metadata?.role || 'storyteller';
      const appUrl = 'https://creators-now.vercel.app';

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
      } else if (email_action_type === 'recovery') {
        console.log('🔐 Sending password reset email...');
        emailHtml = await renderAsync(
          React.createElement(PasswordResetEmail, {
            supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
            token,
            token_hash,
            redirect_to,
            email_action_type,
            user_name: userName,
          })
        );
        emailSubject = 'Reset your Creators Now password';
      } else if (email_action_type === 'email_change') {
        console.log('✉️ Sending email change confirmation...');
        emailHtml = await renderAsync(
          React.createElement(EmailChangeEmail, {
            supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
            token,
            token_hash,
            redirect_to,
            email_action_type,
            user_name: userName,
            new_email,
          })
        );
        emailSubject = 'Confirm your email address change';
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
    }

    console.log('📤 Sending email via Resend...');

    const { data, error } = await resend.emails.send({
      from: 'Creators Now <info@creators.now>',
      to: [recipientEmail],
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
      message: 'Email sent successfully!' 
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
