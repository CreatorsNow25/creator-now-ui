import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Play, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'storyteller' | 'creator'>('storyteller');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (userType === 'storyteller') {
        // Prompt user to search AI Creators
        navigate('/storyteller-dashboard');
      } else {
        // Prompt user to add bio, pricing, and showcase portfolio
        navigate('/creator-dashboard');
      }
    }, 1500);
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    // Initiate OAuth sign-in with Supabase
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
    if (error) {
      alert(`Unable to authenticate with ${provider.charAt(0).toUpperCase() + provider.slice(1)}: ${error.message}`);
      return;
    }
    // The redirect will occur automatically on successful auth.
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Creators Now</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:text-black hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back To Home
            </Button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* User Type Selection */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Join Creators Now</h2>
            <p className="text-white/80 mb-6">Choose How You Want To Get Started</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                variant={userType === 'storyteller' ? 'default' : 'outline'}
                onClick={() => setUserType('storyteller')}
                className={userType === 'storyteller' 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'border-white text-white hover:bg-white hover:text-black'
                }
              >
                <User className="w-4 h-4 mr-2" />
                Storyteller
              </Button>
              <Button
                variant={userType === 'creator' ? 'default' : 'outline'}
                onClick={() => setUserType('creator')}
                className={userType === 'creator' 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-white text-black border-white hover:bg-white/90'
                }
              >
                <Play className="w-4 h-4 mr-2" />
                AI Creator
              </Button>
            </div>
          </div>

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
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black">
                  <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                        <Input
                          id="email"
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                        <Input
                          id="name"
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
                          type="password"
                          placeholder="Create A Password"
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
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-white/60">Or Continue With</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full bg-white text-black border-white/20 hover:bg-white/90"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin('apple')}
                    className="w-full bg-white text-black border-white/20 hover:bg-white/90"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
