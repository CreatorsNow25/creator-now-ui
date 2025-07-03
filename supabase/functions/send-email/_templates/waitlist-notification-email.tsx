
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WaitlistNotificationEmailProps {
  email: string;
  message?: string;
  request_type: 'waitlist' | 'demo';
  timestamp: string;
}

export const WaitlistNotificationEmail = ({
  email,
  message,
  request_type,
  timestamp,
}: WaitlistNotificationEmailProps) => {
  const requestTypeText = request_type === 'demo' ? 'Demo Request' : 'Waitlist Signup';
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <Html>
      <Head />
      <Preview>New {requestTypeText} from {email}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 New {requestTypeText}!</Heading>
          
          <Section style={section}>
            <Text style={text}>
              You have a new {request_type === 'demo' ? 'demo request' : 'waitlist signup'} from:
            </Text>
            
            <Text style={highlightText}>
              📧 {email}
            </Text>
            
            <Text style={text}>
              📅 {formatDate(timestamp)}
            </Text>
            
            {message && (
              <>
                <Hr style={hr} />
                <Text style={text}>
                  <strong>Message:</strong>
                </Text>
                <Text style={messageText}>
                  "{message}"
                </Text>
              </>
            )}
            
            <Hr style={hr} />
            
            <Text style={text}>
              <strong>Next Steps:</strong>
            </Text>
            <Text style={text}>
              {request_type === 'demo' 
                ? '• Reach out to schedule a demo\n• Prepare demo materials\n• Follow up within 24-48 hours'
                : '• Add to your email list\n• Send welcome/updates when ready\n• Keep them engaged with progress updates'
              }
            </Text>
            
            <Text style={text}>
              You can view all waitlist submissions in your Supabase dashboard.
            </Text>
          </Section>
          
        <Text style={footerBrand}>
          <strong>Creators Now</strong> - Connecting Storytellers with AI Creators
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
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistNotificationEmail;

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const section = {
  padding: '24px',
  border: 'solid 1px #333333',
  borderRadius: '5px',
  textAlign: 'left' as const,
  backgroundColor: '#111111',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '24px 0',
  lineHeight: '1.5',
};

const highlightText = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#1a1a1a',
  borderRadius: '4px',
};

const messageText = {
  color: '#cccccc',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#1a1a1a',
  borderLeft: '4px solid #ffffff',
  borderRadius: '4px',
};

const link = {
  color: '#ffffff',
  textDecoration: 'underline',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #333333',
  margin: '26px 0',
  width: '100%',
};

const footerBrand = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
};

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
};

const socialLink = {
  color: '#888888',
  fontSize: '12px',
  textDecoration: 'none',
  margin: '0 4px',
};

const socialSeparator = {
  color: '#888888',
  fontSize: '12px',
  margin: '0 8px',
};
