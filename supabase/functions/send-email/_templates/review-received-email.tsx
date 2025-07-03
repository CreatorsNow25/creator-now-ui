
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

interface ReviewReceivedEmailProps {
  recipient_name: string
  project_title: string
  reviewer_name: string
  reviewer_type: 'storyteller' | 'creator'
  rating: number
  review_comment?: string
  app_url: string
  project_id: string
}

export const ReviewReceivedEmail = ({
  recipient_name,
  project_title,
  reviewer_name,
  reviewer_type,
  rating,
  review_comment,
  app_url,
  project_id,
}: ReviewReceivedEmailProps) => (
  <Html>
    <Head />
    <Preview>You received a {rating}-star review for {project_title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <div style={logoIcon}>▶</div>
            <span style={logoText}>Creators Now</span>
          </div>
        </Section>
        
        <Heading style={h1}>
          New Review Received!
        </Heading>
        
        <Text style={text}>
          Hi {recipient_name},
        </Text>
        
        <Text style={text}>
          Great news! {reviewer_name} has left a review for your work on "{project_title}".
        </Text>
        
        <Section style={reviewCard}>
          <Text style={projectTitle}>{project_title}</Text>
          <div style={ratingContainer}>
            <Text style={ratingText}>Rating: </Text>
            <div style={starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={star <= rating ? starFilled : starEmpty}>★</span>
              ))}
            </div>
            <Text style={ratingNumber}>({rating}/5)</Text>
          </div>
          {review_comment && (
            <>
              <Text style={reviewLabel}>Review:</Text>
              <Text style={reviewComment}>"{review_comment}"</Text>
            </>
          )}
          <Text style={reviewerInfo}>
            - {reviewer_name} ({reviewer_type === 'storyteller' ? 'Storyteller' : 'Creator'})
          </Text>
        </Section>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${app_url}/project/${project_id}?tab=reviews`}
          >
            View Full Review
          </Button>
        </Section>
        
        <Text style={text}>
          {rating >= 4 
            ? 'Congratulations on the excellent feedback! Keep up the great work.' 
            : 'Use this feedback to continue improving your craft and building your reputation.'}
        </Text>
        
        <Text style={footerText}>
          Reviews help build trust and credibility in our community. Thank you for delivering quality work!
        </Text>
        
        <Section style={footer}>
          <Text style={footerBrand}>
            <strong>Creators Now</strong> - Where Stories Meet AI
          </Text>
          
          <Text style={connectText}>Connect with us</Text>
          
          <Section style={socialLinks}>
            <Link href="https://x.com/joincreatorsnow" style={socialLink}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </Link>
            <Link href="https://instagram.com/joincreatorsnow" style={socialLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </Link>
            <Link href="https://tiktok.com/@joincreatorsnow" style={socialLink}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.204-1.864-1.204-2.804V1H12.68v14.66c0 .917-.283 1.793-.82 2.535a4.37 4.37 0 01-2.24 1.629c-.897.309-1.864.309-2.761 0a4.37 4.37 0 01-2.24-1.629c-.537-.742-.82-1.618-.82-2.535 0-.917.283-1.793.82-2.535a4.37 4.37 0 012.24-1.629c.448-.154.923-.231 1.398-.231v-3.89c-1.381.077-2.716.464-3.89 1.127-1.174.664-2.145 1.635-2.808 2.808C.674 12.644.287 13.98.21 15.36v.3c0 2.12.84 4.156 2.34 5.66C4.05 22.82 6.086 23.66 8.206 23.66s4.156-.84 5.66-2.34c1.5-1.504 2.34-3.54 2.34-5.66V8.542a9.1 9.1 0 005.115 1.55V6.235c-.795-.077-1.55-.385-2.145-.964-.595-.58-.964-1.35-.964-2.145-.077-.232-.154-.463-.231-.695z"></path></svg>
            </Link>
            <Link href="https://threads.net/@joincreatorsnow" style={socialLink}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.001 1.5 8.416 2.35 5.562 3.995 3.51 5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.56 22.5 8.414 22.5 11.999c0 3.585-.85 6.439-2.495 8.49-1.85 2.305-4.603 3.486-8.184 3.51zm5.267-13.566c-.684-5.207-3.88-8.77-7.454-8.77s-6.77 3.563-7.454 8.77c.684 5.207 3.88 8.77 7.454 8.77s6.77-3.563 7.454-8.77z"></path></svg>
            </Link>
            <Link href="https://facebook.com/joincreatorsnow" style={socialLink}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
            </Link>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReviewReceivedEmail

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

const reviewCard = {
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
  margin: '0 0 16px 0',
}

const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
}

const ratingText = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0 8px 0 0',
}

const starsContainer = {
  display: 'flex',
  alignItems: 'center',
  margin: '0 8px 0 0',
}

const starFilled = {
  color: '#fbbf24',
  fontSize: '20px',
}

const starEmpty = {
  color: '#374151',
  fontSize: '20px',
}

const ratingNumber = {
  color: '#888888',
  fontSize: '14px',
  margin: '0',
}

const reviewLabel = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0 8px 0',
}

const reviewComment = {
  color: '#e5e7eb',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const reviewerInfo = {
  color: '#888888',
  fontSize: '14px',
  margin: '16px 0 0 0',
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
