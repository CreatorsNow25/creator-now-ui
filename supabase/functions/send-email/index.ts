import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: 'welcome' | 'waitlist_notification' | 'user_confirmation' | 'verification' | 'signup_confirmation' | 'admin_notification';
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
  admin_email?: string;
  form_data?: {
    name: string;
    email: string;
    password?: string;
    userType: string;
    actionType: 'signup' | 'signin';
    demo_code_used: string;
    timestamp: string;
  };
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

    // Resolve base app URL from redirect_to (e.g., https://domain/verify -> https://domain)
    const resolveBaseUrl = (redirect?: string) => {
      try {
        if (!redirect) throw new Error('no redirect');
        const url = new URL(redirect);
        return `${url.protocol}//${url.host}`;
      } catch {
        return 'https://creators-now.vercel.app';
      }
    };
    const appBaseUrl = resolveBaseUrl(emailRequest.redirect_to);

    // Gracefully handle Supabase Auth Hooks (user_confirmation_requested, etc.)
    // These hooks may POST a payload without our expected "email_type" shape.
    // We acknowledge and no-op so signup isn't blocked.
    if (!emailRequest.email_type && (payload?.auth_event || payload?.email_data)) {
      return new Response(JSON.stringify({ success: true, ignored: 'auth_hook' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    switch (emailRequest.email_type) {
      case 'admin_notification':
        // New admin notification for form submissions
        const formData = emailRequest.form_data!;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
              <div style="margin: 0 auto; padding: 20px; max-width: 600px; background-color: #ffffff;">
                <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">
                  New Demo Platform Form Submission
                </h1>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                  <h2 style="color: #333333; font-size: 18px; margin-top: 0;">Form Details</h2>
                  <p><strong>Action:</strong> ${formData.actionType === 'signup' ? 'Sign Up' : 'Sign In'}</p>
                  <p><strong>User Type:</strong> ${formData.userType}</p>
                  <p><strong>Name:</strong> ${formData.name}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  ${formData.password ? `<p><strong>Password:</strong> ${formData.password}</p>` : ''}
                  <p><strong>Demo Code Used:</strong> ${formData.demo_code_used}</p>
                  <p><strong>Submitted:</strong> ${new Date(formData.timestamp).toLocaleString()}</p>
                </div>
                
                <p style="color: #666666; font-size: 14px;">
                  This notification was sent from the Creators Now demo platform.
                </p>
              </div>
            </body>
          </html>
        `;
        
        subject = `Demo Platform: New ${formData.actionType} form submission from ${formData.email}`;
        toEmail = emailRequest.admin_email!;
        break;

      case 'signup_confirmation':
        // Simple thank you signup confirmation email
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
              <div style="margin: 0 auto; padding: 20px 0 48px; max-width: 560px;">
                
                <!-- Header -->
                <div style="padding: 24px 0; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center;">
                    <div style="background-color: #ffffff; color: #000000; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin-right: 8px;">▶</div>
                    <span style="color: #ffffff; font-size: 20px; font-weight: bold;">Creators Now</span>
                  </div>
                </div>

                <!-- Content -->
                <div style="background-color: #111111; border: 1px solid #333333; border-radius: 5px; padding: 24px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 30px 0;">
                    ${emailRequest.user_name ? `Welcome to Creators Now, ${emailRequest.user_name}!` : 'Welcome to Creators Now!'}
                  </h1>
                  
                  <p style="color: #ffffff; font-size: 16px; line-height: 26px; margin: 16px 0;">
                    Thank you for signing up! We're excited to have you join our community of storytellers and AI creators.
                  </p>
                  
                  <p style="color: #ffffff; font-size: 16px; line-height: 26px; margin: 16px 0;">
                    Your account has been created successfully. You can now explore all the features Creators Now has to offer.
                  </p>
                  
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${appBaseUrl}/real-auth" style="background-color: #ffffff; color: #000000; border-radius: 6px; font-weight: bold; font-size: 16px; text-decoration: none; display: inline-block; padding: 12px 24px;">
                      Get Started
                    </a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #333333; padding-top: 24px; text-align: center; margin-top: 32px;">
                  <p style="color: #ffffff; font-size: 14px; margin: 0;">
                    <strong>Creators Now</strong> - Where Stories Meet AI
                  </p>
                  
                  <div style="text-align: center; margin-top: 16px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                    <a href="https://x.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    <a href="https://instagram.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="none" stroke="#ffffff" viewBox="0 0 24 24" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    <a href="https://tiktok.com/@joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.204-1.864-1.204-2.804V1H12.68v14.66c0 .917-.283 1.793-.82 2.535a4.37 4.37 0 01-2.24 1.629c-.897.309-1.864.309-2.761 0a4.37 4.37 0 01-2.24-1.629c-.537-.742-.82-1.618-.82-2.535 0-.917.283-1.793.82-2.535a4.37 4.37 0 012.24-1.629c.448-.154.923-.231 1.398-.231v-3.89c-1.381.077-2.716.464-3.89 1.127-1.174.664-2.145 1.635-2.808 2.808C.674 12.644.287 13.98.21 15.36v.3c0 2.12.84 4.156 2.34 5.66C4.05 22.82 6.086 23.66 8.206 23.66s4.156-.84 5.66-2.34c1.5-1.504 2.34-3.54 2.34-5.66V8.542a9.1 9.1 0 005.115 1.55V6.235c-.795-.077-1.55-.385-2.145-.964-.595-.58-.964-1.35-.964-2.145-.077-.232-.154-.463-.231-.695z"></path></svg>
                    </a>
                    <a href="https://threads.net/@joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.001 1.5 8.416 2.35 5.562 3.995 3.51 5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.56 22.5 8.414 22.5 11.999c0 3.585-.85 6.439-2.495 8.49-1.85 2.305-4.603 3.486-8.184 3.51zm5.267-13.566c-.684-5.207-3.88-8.77-7.454-8.77s-6.77 3.563-7.454 8.77c.684 5.207 3.88 8.77 7.454 8.77s6.77-3.563 7.454-8.77z"></path></svg>
                    </a>
                    <a href="https://facebook.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;
        
        subject = emailRequest.user_name ? `Welcome to Creators Now, ${emailRequest.user_name}!` : 'Welcome to Creators Now!';
        toEmail = emailRequest.email;
        break;

      case 'verification':
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
              <div style="margin: 0 auto; padding: 20px 0 48px; max-width: 560px;">
                
                <!-- Header -->
                <div style="padding: 24px 0; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center;">
                    <div style="background-color: #ffffff; color: #000000; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin-right: 8px;">▶</div>
                    <span style="color: #ffffff; font-size: 20px; font-weight: bold;">Creators Now</span>
                  </div>
                </div>

                <!-- Content -->
                <div style="background-color: #111111; border: 1px solid #333333; border-radius: 5px; padding: 24px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 30px 0;">
                    ${emailRequest.user_name ? `Welcome to Creators Now, ${emailRequest.user_name}!` : 'Welcome to Creators Now!'}
                  </h1>
                  
                  <p style="color: #ffffff; font-size: 16px; line-height: 26px; margin: 16px 0;">
                    Thank you for signing up! We're excited to have you join our community of storytellers and AI creators.
                  </p>
                  
                  <p style="color: #ffffff; font-size: 16px; line-height: 26px; margin: 16px 0;">
                    Your account has been created successfully. You can now explore all the features Creators Now has to offer.
                  </p>
                  
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${appBaseUrl}/real-auth" style="background-color: #ffffff; color: #000000; border-radius: 6px; font-weight: bold; font-size: 16px; text-decoration: none; display: inline-block; padding: 12px 24px;">
                      Get Started
                    </a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #333333; padding-top: 24px; text-align: center; margin-top: 32px;">
                  <p style="color: #ffffff; font-size: 14px; margin: 0;">
                    <strong>Creators Now</strong> - Where Stories Meet AI
                  </p>
                  
                  <div style="text-align: center; margin-top: 16px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                    <a href="https://x.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    <a href="https://instagram.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="none" stroke="#ffffff" viewBox="0 0 24 24" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    <a href="https://tiktok.com/@joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.204-1.864-1.204-2.804V1H12.68v14.66c0 .917-.283 1.793-.82 2.535a4.37 4.37 0 01-2.24 1.629c-.897.309-1.864.309-2.761 0a4.37 4.37 0 01-2.24-1.629c-.537-.742-.82-1.618-.82-2.535 0-.917.283-1.793.82-2.535a4.37 4.37 0 012.24-1.629c.448-.154.923-.231 1.398-.231v-3.89c-1.381.077-2.716.464-3.89 1.127-1.174.664-2.145 1.635-2.808 2.808C.674 12.644.287 13.98.21 15.36v.3c0 2.12.84 4.156 2.34 5.66C4.05 22.82 6.086 23.66 8.206 23.66s4.156-.84 5.66-2.34c1.5-1.504 2.34-3.54 2.34-5.66V8.542a9.1 9.1 0 005.115 1.55V6.235c-.795-.077-1.55-.385-2.145-.964-.595-.58-.964-1.35-.964-2.145-.077-.232-.154-.463-.231-.695z"></path></svg>
                    </a>
                    <a href="https://threads.net/@joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.001 1.5 8.416 2.35 5.562 3.995 3.51 5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.56 22.5 8.414 22.5 11.999c0 3.585-.85 6.439-2.495 8.49-1.85 2.305-4.603 3.486-8.184 3.51zm5.267-13.566c-.684-5.207-3.88-8.77-7.454-8.77s-6.77 3.563-7.454 8.77c.684 5.207 3.88 8.77 7.454 8.77s6.77-3.563 7.454-8.77z"></path></svg>
                    </a>
                    <a href="https://facebook.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;
        
        subject = emailRequest.user_name ? `Welcome to Creators Now, ${emailRequest.user_name}!` : 'Welcome to Creators Now!';
        toEmail = emailRequest.email;
        break;

      case 'waitlist_notification':
        // Admin notification email for waitlist/demo requests
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
              <div style="margin: 0 auto; padding: 20px; max-width: 600px; background-color: #ffffff;">
                <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">
                  New ${emailRequest.request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup'}
                </h1>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                  <h2 style="color: #333333; font-size: 18px; margin-top: 0;">Request Details</h2>
                  <p><strong>Type:</strong> ${emailRequest.request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup'}</p>
                  <p><strong>Email:</strong> ${emailRequest.email}</p>
                  ${emailRequest.message ? `<p><strong>Message:</strong> ${emailRequest.message}</p>` : ''}
                  <p><strong>Submitted:</strong> ${new Date(emailRequest.timestamp || new Date().toISOString()).toLocaleString()}</p>
                </div>
                
                <p style="color: #666666; font-size: 14px;">
                  This notification was sent from the Creators Now platform.
                </p>
              </div>
            </body>
          </html>
        `;
        
        subject = `New ${emailRequest.request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup'} - ${emailRequest.email}`;
        toEmail = 'info@creators.now';
        break;

      case 'user_confirmation':
        // User confirmation email for waitlist/demo requests
        const demoContent = emailRequest.request_type === 'demo' 
          ? `We've received your demo request and are excited to connect with you!
Our team will review your demo request and get back to you within 24–48 hours.

In the meantime, feel free to explore more about how we're connecting storytellers with AI creators at creators.now

What's Next?
We'll reach out within 24–48 hours with the access code and answer any questions you may have. Thank you for your interest in Creators Now!`
          : `Thank you for your interest in Creators Now! You're now on our exclusive waitlist!
We're working hard to build something amazing for creators and storytellers. Stay tuned for updates!

What's Next?
• Keep an eye on your inbox for updates
• Follow our progress on social media
• Share the word with other creators and storytellers`;

        const emailTitle = emailRequest.request_type === 'demo' ? 'Thank you for requesting a demo' : 'You\'re now on our waitlist!';
        
        // Format content with bold "What's Next?" header
        const formattedContent = emailRequest.request_type === 'demo' 
          ? `We've received your demo request and are excited to connect with you! Our team will review your demo request and get back to you within 24–48 hours.`
          : `We're working hard to build something big for both AI creators and storytellers. Stay tuned for updates!<br><br><strong>What's Next?</strong><br>• Keep an eye on your inbox for updates<br>• Follow our progress on social media<br>• Share the word with other creators and storytellers`;

        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
              <div style="margin: 0 auto; padding: 20px 0 48px; max-width: 560px;">
                
                <!-- Header -->
                <div style="padding: 24px 0; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center;">
                    <div style="background-color: #ffffff; color: #000000; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; margin-right: 8px;">▶</div>
                    <span style="color: #ffffff; font-size: 20px; font-weight: bold;">Creators Now</span>
                  </div>
                </div>

                <!-- Content -->
                <div style="background-color: #000000; border-radius: 5px; padding: 24px; text-align: left;">
                  <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0 0 24px 0; text-align: center;">
                    ${emailTitle}
                  </h1>
                  
                  <div style="color: #ffffff; font-size: 16px; line-height: 28px; margin: 0;">
                    ${formattedContent}
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 32px 0 0 0;">
                    <a href="https://creators.now" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; text-decoration: none;">
                      Creators Now
                    </a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #333333; padding-top: 24px; text-align: center; margin-top: 32px;">
                  <p style="color: #ffffff; font-size: 14px; margin: 0;">
                    <strong>Creators Now</strong> - Where Stories Meet AI
                  </p>
                  
                  <div style="text-align: center; margin-top: 16px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                    <a href="https://x.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    <a href="https://instagram.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="none" stroke="#ffffff" viewBox="0 0 24 24" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                    <a href="https://tiktok.com/@joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.204-1.864-1.204-2.804V1H12.68v14.66c0 .917-.283 1.793-.82 2.535a4.37 4.37 0 01-2.24 1.629c-.897.309-1.864.309-2.761 0a4.37 4.37 0 01-2.24-1.629c-.537-.742-.82-1.618-.82-2.535 0-.917.283-1.793.82-2.535a4.37 4.37 0 012.24-1.629c.448-.154.923-.231 1.398-.231v-3.89c-1.381.077-2.716.464-3.89 1.127-1.174.664-2.145 1.635-2.808 2.808C.674 12.644.287 13.98.21 15.36v.3c0 2.12.84 4.156 2.34 5.66C4.05 22.82 6.086 23.66 8.206 23.66s4.156-.84 5.66-2.34c1.5-1.504 2.34-3.54 2.34-5.66V8.542a9.1 9.1 0 005.115 1.55V6.235c-.795-.077-1.55-.385-2.145-.964-.595-.58-.964-1.35-.964-2.145-.077-.232-.154-.463-.231-.695z"></path></svg>
                    </a>
                    <a href="https://threads.net/@joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.001 1.5 8.416 2.35 5.562 3.995 3.51 5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.56 22.5 8.414 22.5 11.999c0 3.585-.85 6.439-2.495 8.49-1.85 2.305-4.603 3.486-8.184 3.51zm5.267-13.566c-.684-5.207-3.88-8.77-7.454-8.77s-6.77 3.563-7.454 8.77c.684 5.207 3.88 8.77 7.454 8.77s6.77-3.563 7.454-8.70z"></path></svg>
                    </a>
                    <a href="https://facebook.com/joincreatorsnow" style="color: #888888; font-size: 12px; text-decoration: none; margin: 0 4px;">
                      <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;
        
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
