
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
          
          <Text style={footer}>
            <Link
              href="https://creators-now.vercel.app"
              target="_blank"
              style={{ ...link, color: '#898989' }}
            >
              Creators Now
            </Link>
            {' '}- Connecting Storytellers with AI Creators
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistNotificationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'left' as const,
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '14px',
  margin: '24px 0',
  lineHeight: '1.5',
};

const highlightText = {
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
};

const messageText = {
  color: '#555',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#f9f9f9',
  borderLeft: '4px solid #007ee6',
  borderRadius: '4px',
};

const link = {
  color: '#007ee6',
  textDecoration: 'underline',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '26px 0',
  width: '100%',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};
