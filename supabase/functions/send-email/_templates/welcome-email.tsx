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

interface WelcomeEmailProps {
  user_name?: string
  user_role?: string
  app_url: string
}

export const WelcomeEmail = ({
  user_name,
  user_role,
  app_url,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Creators Now - Let's get you started!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <div style={logoIcon}>▶</div>
            <span style={logoText}>Creators Now</span>
          </div>
        </Section>
        
        <Heading style={h1}>
          {user_name ? `Welcome aboard, ${user_name}!` : 'Welcome to Creators Now!'}
        </Heading>
        
        <Text style={text}>
          Your email has been verified and your account is now active. You're all set to {user_role === 'storyteller' ? 'find amazing AI creators for your projects' : 'start creating incredible content'}.
        </Text>
        
        {user_role === 'storyteller' ? (
          <Section>
            <Text style={text}>
              <strong>As a Storyteller, you can:</strong>
            </Text>
            <Text style={listText}>
              • Post your creative projects and briefs<br/>
              • Browse and connect with talented AI creators<br/>
              • Manage your projects with built-in collaboration tools<br/>
              • Secure payments through our escrow system
            </Text>
          </Section>
        ) : (
          <Section>
            <Text style={text}>
              <strong>As an AI Creator, you can:</strong>
            </Text>
            <Text style={listText}>
              • Showcase your portfolio and skills<br/>
              • Browse and bid on exciting projects<br/>
              • Build your reputation with client reviews<br/>
              • Receive secure payments for your work
            </Text>
          </Section>
        )}
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${app_url}/${user_role === 'storyteller' ? 'storyteller-dashboard' : 'creator-dashboard'}`}
          >
            Get Started Now
          </Button>
        </Section>
        
        <Text style={text}>
          Need help getting started? Check out our{' '}
          <Link href={`${app_url}/help`} style={link}>
            Help Center
          </Link>{' '}
          or reply to this email with any questions.
        </Text>
        
        <Section style={footer}>
          <Text style={footerBrand}>
            <strong>Creators Now</strong> - Where Stories Meet AI
          </Text>
          <Text style={footerText}>
            Ready to create something amazing? Let's make it happen together.
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

export default WelcomeEmail

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

const listText = {
  color: '#cccccc',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0 16px 0',
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

const link = {
  color: '#ffffff',
  textDecoration: 'underline',
}

const footer = {
  borderTop: '1px solid #333333',
  paddingTop: '24px',
  textAlign: 'center' as const,
  marginTop: '32px',
}

const footerBrand = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const footerText = {
  color: '#888888',
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
