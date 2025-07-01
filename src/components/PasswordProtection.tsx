
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

const PasswordProtection = ({ onAuthenticated }: PasswordProtectionProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [requestType, setRequestType] = useState<'waitlist' | 'demo' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple password - you can change this
  const ACCESS_PASSWORD = 'creators2024';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      onAuthenticated();
    } else {
      setError('Incorrect password');
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store in database
      const { error: dbError } = await supabase
        .from('waitlist_submissions')
        .insert({
          email,
          message: message || null,
          request_type: requestType!
        });

      if (dbError) {
        console.error('Database error:', dbError);
        setError('Failed to submit. Please try again.');
        return;
      }

      // Send notification email to admin
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'waitlist_notification',
          email,
          message,
          request_type: requestType,
          timestamp: new Date().toISOString()
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't show error to user since data was saved
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-white/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-white/80 mb-6">
              {requestType === 'demo' 
                ? "We'll be in touch soon to schedule your demo."
                : "You're on the waitlist! We'll notify you when we launch."
              }
            </p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setShowWaitlist(false);
                setEmail('');
                setMessage('');
                setRequestType(null);
                setError('');
              }}
              className="bg-white text-black hover:bg-gray-200"
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showWaitlist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-white/20">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-black" />
            </div>
            <CardTitle className="text-white">
              {requestType === 'demo' ? 'Request Demo' : 'Join Waitlist'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
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
                  onClick={() => setShowWaitlist(false)}
                  className="border-white/20 text-white hover:bg-white hover:text-black"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Access Card */}
        <Card className="bg-gray-900 border-white/20">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-black" />
            </div>
            <CardTitle className="text-white text-2xl">Creators Now</CardTitle>
            <p className="text-white/80">Private Beta Access</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  type="password"
                  placeholder="Enter access password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
              {error && (
                <Alert className="bg-red-900/50 border-red-500">
                  <AlertDescription className="text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                Access Platform
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Waitlist Options */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              setRequestType('waitlist');
              setShowWaitlist(true);
            }}
            variant="outline"
            className="w-full border-white/20 text-white bg-transparent hover:bg-white hover:text-black"
          >
            Join Waitlist
          </Button>
          <Button
            onClick={() => {
              setRequestType('demo');
              setShowWaitlist(true);
            }}
            variant="outline"
            className="w-full border-white/20 text-white bg-transparent hover:bg-white hover:text-black"
          >
            Request Demo
          </Button>
        </div>

        <p className="text-center text-white/60 text-sm">
          Connect with AI creators and bring your stories to life
        </p>
      </div>
    </div>
  );
};

export default PasswordProtection;
