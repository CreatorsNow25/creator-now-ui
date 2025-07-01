
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

interface FeedbackRequestEmailProps {
  recipient_name: string
  project_title: string
  requester_name: string
  requester_type: 'storyteller' | 'creator'
  feedback_type: 'revision' | 'improvement' | 'general'
  app_url: string
  project_id: string
  message?: string
}

export const FeedbackRequestEmail = ({
  recipient_name,
  project_title,
  requester_name,
  requester_type,
  feedback_type,
  app_url,
  project_id,
  message,
}: FeedbackRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>Feedback requested for {project_title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <div style={logoIcon}>▶</div>
            <span style={logoText}>Creators Now</span>
          </div>
        </Section>
        
        <Heading style={h1}>
          Feedback Request
        </Heading>
        
        <Text style={text}>
          Hi {recipient_name},
        </Text>
        
        <Text style={text}>
          {requester_name} has requested {feedback_type === 'revision' ? 'revisions' : 'feedback'} for the project "{project_title}".
        </Text>
        
        <Section style={requestCard}>
          <Text style={projectTitle}>{project_title}</Text>
          <Text style={requestType}>
            Request Type: {feedback_type === 'revision' ? 'Revision Request' : 
                          feedback_type === 'improvement' ? 'Improvement Suggestion' : 'General Feedback'}
          </Text>
          <Text style={requesterInfo}>
            From: {requester_name} ({requester_type === 'storyteller' ? 'Storyteller' : 'Creator'})
          </Text>
          {message && (
            <>
              <Text style={messageLabel}>Message:</Text>
              <Text style={messageContent}>"{message}"</Text>
            </>
          )}
        </Section>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${app_url}/project/${project_id}?tab=feedback`}
          >
            {feedback_type === 'revision' ? 'Review & Respond' : 'Provide Feedback'}
          </Button>
        </Section>
        
        <Text style={text}>
          {feedback_type === 'revision' 
            ? 'Please review the requested changes and respond with your updated work or questions.'
            : 'Your expertise and feedback are valuable for improving this project.'}
        </Text>
        
        <Text style={footerText}>
          Collaborative feedback helps create better outcomes for everyone involved in the project.
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

export default FeedbackRequestEmail

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

const requestCard = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const projectTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const requestType = {
  color: '#fbbf24',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const requesterInfo = {
  color: '#888888',
  fontSize: '14px',
  margin: '0 0 16px 0',
}

const messageLabel = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0 8px 0',
}

const messageContent = {
  color: '#e5e7eb',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
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
