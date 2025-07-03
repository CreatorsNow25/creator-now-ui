
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_name?: string
}

export const PasswordResetEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_name,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Creators Now password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <div style={logoIcon}>▶</div>
            <span style={logoText}>Creators Now</span>
          </div>
        </Section>
        
        <Heading style={h1}>
          Reset Your Password
        </Heading>
        
        <Text style={text}>
          {user_name ? `Hi ${user_name},` : 'Hello,'} 
        </Text>
        
        <Text style={text}>
          We received a request to reset your password for your Creators Now account. If you didn't make this request, you can safely ignore this email.
        </Text>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          >
            Reset Password
          </Button>
        </Section>
        
        <Text style={text}>
          Or copy and paste this reset code:
        </Text>
        <code style={code}>{token}</code>
        
        <Text style={text}>
          This link will expire in 1 hour for security reasons.
        </Text>
        
        <Text style={footerText}>
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </Text>
        
        <Section style={footer}>
          <Text style={footerBrand}>
            <strong>Creators Now</strong> - Where Stories Meet AI
          </Text>
          
          <Text style={connectText}>Connect with us</Text>
          
          <Section style={socialLinks}>
            <Link href="https://x.com/joincreatorsnow" style={socialLink}>X</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://instagram.com/joincreatorsnow" style={socialLink}>Instagram</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://tiktok.com/@joincreatorsnow" style={socialLink}>TikTok</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://threads.net/@joincreatorsnow" style={socialLink}>Threads</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://facebook.com/joincreatorsnow" style={socialLink}>Facebook</Link>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const header = {
  padding: '24px 0',
}

const logo = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const logoIcon = {
  backgroundColor: '#ffffff',
  color: '#000000',
  borderRadius: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: '8px',
}

const logoText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
}

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const text = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#ffffff',
  color: '#000000',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const code = {
  display: 'inline-block',
  padding: '16px 24px',
  width: '100%',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontFamily: 'monospace',
  textAlign: 'center' as const,
  margin: '16px 0',
}

const footerText = {
  color: '#888888',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 0 16px',
}

const footer = {
  borderTop: '1px solid #333333',
  paddingTop: '24px',
  textAlign: 'center' as const,
}

const footerBrand = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
}

const connectText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '16px 0 8px 0',
  textAlign: 'center' as const,
};

const socialLinks = {
  textAlign: 'center' as const,
  marginTop: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
}

const socialLink = {
  color: '#888888',
  fontSize: '12px',
  textDecoration: 'none',
  margin: '0 4px',
}

const socialSeparator = {
  color: '#888888',
  fontSize: '12px',
  margin: '0 8px',
}
