
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
