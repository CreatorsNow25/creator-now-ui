
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

interface ReviewRequestEmailProps {
  recipient_name: string
  project_title: string
  reviewer_name: string
  reviewer_type: 'storyteller' | 'creator'
  app_url: string
  project_id: string
}

export const ReviewRequestEmail = ({
  recipient_name,
  project_title,
  reviewer_name,
  reviewer_type,
  app_url,
  project_id,
}: ReviewRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>You have a new review request for {project_title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <div style={logoIcon}>▶</div>
            <span style={logoText}>Creators Now</span>
          </div>
        </Section>
        
        <Heading style={h1}>
          New Review Request
        </Heading>
        
        <Text style={text}>
          Hi {recipient_name},
        </Text>
        
        <Text style={text}>
          {reviewer_name} has requested a review for the project "{project_title}". 
          {reviewer_type === 'storyteller' 
            ? 'Your creative work is ready for feedback!' 
            : 'They would like your feedback on their storytelling project.'}
        </Text>
        
        <Section style={projectCard}>
          <Text style={projectTitle}>{project_title}</Text>
          <Text style={projectMeta}>
            {reviewer_type === 'storyteller' ? 'Storyteller' : 'Creator'}: {reviewer_name}
          </Text>
        </Section>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${app_url}/project/${project_id}?tab=review`}
          >
            Leave Review & Feedback
          </Button>
        </Section>
        
        <Text style={text}>
          Your honest feedback helps improve the quality of work on our platform and builds trust within our community.
        </Text>
        
        <Text style={footerText}>
          Reviews are important for maintaining high standards and helping {reviewer_type === 'storyteller' ? 'creators' : 'storytellers'} improve their craft.
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

export default ReviewRequestEmail

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

const projectCard = {
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
  margin: '0 0 8px 0',
}

const projectMeta = {
  color: '#888888',
  fontSize: '14px',
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
