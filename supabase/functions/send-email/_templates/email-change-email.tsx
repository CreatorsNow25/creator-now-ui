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

interface EmailChangeEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_name?: string
  new_email?: string
}

export const EmailChangeEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_name,
  new_email,
}: EmailChangeEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your email address change for Creators Now</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <div style={logoIcon}>▶</div>
            <span style={logoText}>Creators Now</span>
          </div>
        </Section>
        
        <Heading style={h1}>
          Confirm Email Address Change
        </Heading>
        
        <Text style={text}>
          {user_name ? `Hi ${user_name},` : 'Hello,'} 
        </Text>
        
        <Text style={text}>
          We received a request to change your email address {new_email ? `to ${new_email}` : ''}. To complete this change, please confirm your new email address.
        </Text>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          >
            Confirm Email Change
          </Button>
        </Section>
        
        <Text style={text}>
          Or copy and paste this confirmation code:
        </Text>
        <code style={code}>{token}</code>
        
        <Text style={text}>
          This link will expire in 24 hours for security reasons.
        </Text>
        
        <Text style={footerText}>
          If you didn't request this email change, please ignore this email and contact support immediately.
        </Text>
        
        <Section style={footer}>
          <Text style={footerBrand}>
            <strong>Creators Now</strong> - Where Stories Meet AI
          </Text>
          
          <Section style={socialLinks}>
            <Link href="https://facebook.com/creatorsnow" style={socialLink}>Facebook</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://instagram.com/creatorsnow" style={socialLink}>Instagram</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://linkedin.com/company/creatorsnow" style={socialLink}>LinkedIn</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://twitter.com/creatorsnow" style={socialLink}>Twitter</Link>
            <Text style={socialSeparator}>•</Text>
            <Link href="https://youtube.com/@creatorsnow" style={socialLink}>YouTube</Link>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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

const socialLinks = {
  textAlign: 'center' as const,
  marginTop: '16px',
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
