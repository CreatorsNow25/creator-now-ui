
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BrandHeader from './BrandHeader';
import { useWaitlistSubmission } from './hooks/useWaitlistSubmission';

interface WaitlistFormProps {
  requestType: 'waitlist' | 'demo';
  onSuccess: () => void;
  onBack: () => void;
}

const WaitlistForm = ({ requestType, onSuccess, onBack }: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { submitWaitlist, isSubmitting, error, setError } = useWaitlistSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitWaitlist(email, message, requestType);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-white/20">
      <CardHeader>
        <BrandHeader 
          title={requestType === 'demo' ? 'Request Demo' : 'Join Waitlist'}
          iconSize="sm"
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-white/20 text-white placeholder:text-white/60"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <textarea
              placeholder={requestType === 'demo' 
                ? "Tell us about your project or what you'd like to see in the demo..."
                : "Tell us about yourself and what you're interested in..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-black border border-white/20 rounded-md text-white placeholder:text-white/60 resize-none"
              disabled={isSubmitting}
            />
          </div>
          {error && (
            <Alert className="bg-red-900/50 border-red-500">
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button 
              type="submit"
              className="flex-1 bg-white text-black hover:bg-gray-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (requestType === 'demo' ? 'Request Demo' : 'Join Waitlist')}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-white/20 text-white hover:bg-white hover:text-black"
              disabled={isSubmitting}
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WaitlistForm;
