
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import OAuthButtons from './OAuthButtons';

interface AuthFormProps {
  userType: 'storyteller' | 'creator';
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  onSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  onOAuthLogin: (provider: "google") => void;
}

const AuthForm = ({
  userType,
  isLoading,
  error,
  successMessage,
  onSignUp,
  onSignIn,
  onOAuthLogin
}: AuthFormProps) => {
  return (
    <Card className="bg-gray-900 border-white/20 text-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">
          {userType === 'storyteller' ? 'Post Your First Project' : 'Start Creating'}
        </CardTitle>
        <p className="text-center text-white/80">
          {userType === 'storyteller' 
            ? 'Find The Perfect AI Creator For Your Story'
            : 'Join Thousands Of Successful AI Creators'
          }
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-red-900/50 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 bg-green-900/50 border-green-500">
            <AlertDescription className="text-green-200">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black">
            <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={onSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Your Email"
                    className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 focus:text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter Your Password"
                    className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 focus:text-white"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-white/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={onSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Your Full Name"
                    className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 focus:text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="email-signup"
                    name="email"
                    type="email"
                    placeholder="Enter Your Email"
                    className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 focus:text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="password-signup"
                    name="password"
                    type="password"
                    placeholder="8+ characters with uppercase, lowercase & numbers"
                    className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 focus:text-white"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-white/60">
                  Password must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-white/90"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <OAuthButtons onOAuthLogin={onOAuthLogin} />
      </CardContent>
    </Card>
  );
};

export default AuthForm;
