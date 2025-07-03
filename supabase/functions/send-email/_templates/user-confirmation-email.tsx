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

interface UserConfirmationEmailProps {
  user_name: string;
  request_type: 'waitlist' | 'demo';
  app_url: string;
}

export const UserConfirmationEmail = ({
  user_name,
  request_type,
  app_url,
}: UserConfirmationEmailProps) => {
  const requestTypeText = request_type === 'demo' ? 'demo request' : 'waitlist signup';
  const actionText = request_type === 'demo' ? 'demo request' : 'joined our waitlist';

  return (
    <Html>
      <Head />
      <Preview>Thank you for your {requestTypeText}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you, {user_name}! ✨</Heading>
          
          <Section style={section}>
            <Text style={text}>
              We've received your {actionText} and are excited to connect with you!
            </Text>
            
            {request_type === 'demo' ? (
              <>
                <Text style={text}>
                  Our team will review your demo request and get back to you within 24-48 hours.
                </Text>
                <Text style={text}>
                  In the meantime, feel free to explore more about how we're connecting storytellers with AI creators at{' '}
                  <Link
                    href={app_url}
                    target="_blank"
                    style={link}
                  >
                    creators.now
                  </Link>
                </Text>
              </>
            ) : (
              <>
                <Text style={text}>
                  You're now on our exclusive waitlist! We'll keep you updated on our progress and notify you as soon as we're ready to welcome new users.
                </Text>
                <Text style={text}>
                  We're working hard to build something amazing for creators and storytellers. Stay tuned for updates!
                </Text>
              </>
            )}
            
            <Hr style={hr} />
            
            <Text style={text}>
              <strong>What's Next?</strong>
            </Text>
            <Text style={text}>
              {request_type === 'demo' 
                ? '• We\'ll reach out within 24-48 hours\n• Prepare any questions about your project\n• Get ready to see how AI creators can bring your stories to life'
                : '• Keep an eye on your inbox for updates\n• Follow our progress on social media\n• Share the word with other creators and storytellers'
              }
            </Text>
            
            <Text style={text}>
              Thank you for your interest in Creators Now!
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

export default UserConfirmationEmail;

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