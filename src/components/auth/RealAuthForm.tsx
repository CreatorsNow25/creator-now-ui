import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const RealAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'storyteller' | 'creator'>('storyteller');
  
  
  const { toast } = useToast();


  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions and Privacy Policy to continue.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    

    try {
      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const redirectUrl = `${window.location.origin}/verify`;
      
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            role: selectedRole
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        let avatarUrl = null;

        // Create user profile
        const displayName = `${firstName} ${lastName.charAt(0)}.`;
        const { error: profileError } = await supabase
          .from('real_user_profiles')
          .insert({
            user_id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            city_state_country: '',
            role: selectedRole,
            avatar_url: avatarUrl,
            email_confirmed: false,
            onboarding_completed: false,
            display_name: displayName
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the signup if profile creation fails, just log it
        }


        setSuccessMessage(
          'Account created successfully! Please check your email to verify your account before signing in.'
        );
        
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'An unexpected error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // Check if user profile exists and is confirmed
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('real_user_profiles')
          .select('email_confirmed, onboarding_completed, role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile check error:', profileError);
        }

        if (!profile?.email_confirmed) {
          await supabase.auth.signOut();
          setError('Please verify your email address before signing in. Check your inbox for a verification link.');
          setIsLoading(false);
          return;
        }

        if (!profile?.onboarding_completed) {
          // Redirect to onboarding
          window.location.href = '/onboarding';
          return;
        }

        // Redirect to appropriate dashboard
        const userRole = data.user.user_metadata?.role || profile?.role;
        if (userRole === 'creator') {
          window.location.href = '/creator-dashboard';
        } else {
          window.location.href = '/storyteller-dashboard';
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in. Check your inbox for a verification link.');
      } else {
        setError(error.message || 'An unexpected error occurred during sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt('Please enter your email address:');
    if (!email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full bg-dark-card text-white border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">Join Creators Now</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Create your account or sign in to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 bg-green-900/20 border-green-500 text-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
              Sign In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-white">I am a:</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value: 'storyteller' | 'creator') => setSelectedRole(value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="storyteller" id="storyteller" />
                    <Label htmlFor="storyteller" className="text-white cursor-pointer">Storyteller</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="creator" id="creator" />
                    <Label htmlFor="creator" className="text-white cursor-pointer">AI Creator</Label>
                  </div>
                </RadioGroup>
              </div>


              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-sm text-gray-400">At least 8 characters, with lowercase, uppercase, and a number.</p>
              </div>


              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-white leading-relaxed cursor-pointer">
                  By signing up, I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('/terms', '_blank', 'noopener,noreferrer');
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('/privacy', '_blank', 'noopener,noreferrer');
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-white">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-white">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Button
                type="button"
                variant="link"
                onClick={handleForgotPassword}
                className="w-full text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};