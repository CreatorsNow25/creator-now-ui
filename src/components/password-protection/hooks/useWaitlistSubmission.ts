
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWaitlistSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitWaitlist = async (
    email: string, 
    message: string, 
    requestType: 'waitlist' | 'demo'
  ) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Store in database
      const { error: dbError } = await supabase
        .from('waitlist_submissions')
        .insert({
          email,
          message: message || null,
          request_type: requestType
        });

      if (dbError) {
        console.error('Database error:', dbError);
        setError('Failed to submit. Please try again.');
        return false;
      }

      // Send notification email to admin
      console.log('Invoking send-email function for:', requestType, 'request from:', email);
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'waitlist_notification',
          email,
          message,
          request_type: requestType,
          timestamp: new Date().toISOString()
        }
      });

      if (emailError) {
        console.error('Email function error:', emailError);
        console.error('Email error details:', JSON.stringify(emailError, null, 2));
        // Show warning to user about email notification failure
        setError(`Submission saved successfully, but email notification failed: ${emailError.message || 'Unknown error'}`);
        return true; // Still return true since data was saved
      }

      console.log('Email function response:', emailData);

      return true;
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitWaitlist,
    isSubmitting,
    error,
    setError
  };
};
