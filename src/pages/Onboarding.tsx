import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/real-auth');
        return;
      }

      const { data: profile, error } = await supabase
        .from('real_user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        navigate('/real-auth');
        return;
      }

      if (!profile) {
        navigate('/real-auth');
        return;
      }

      if (profile.onboarding_completed) {
        // Redirect to appropriate dashboard
        if (profile.role === 'creator') {
          navigate('/creator-dashboard');
        } else {
          navigate('/storyteller-dashboard');
        }
        return;
      }

      setUserProfile(profile);
      setProfileImagePreview(profile.avatar_url);
    } catch (error) {
      console.error('Error checking user profile:', error);
      navigate('/real-auth');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'image') {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for images
        setError('Profile image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for other files
        setError('File must be less than 50MB');
        return;
      }
      setUploadedFile(file);
    }
    setError(null);
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!userProfile) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userProfile.user_id}/${folder}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const bio = formData.get('bio') as string;
      const location = formData.get('location') as string;

      let avatarUrl = userProfile.avatar_url;

      // Upload new profile image if provided
      if (profileImage) {
        const uploadedUrl = await uploadFile(profileImage, 'avatar');
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Update profile with basic info including location
      const { error } = await supabase
        .from('real_user_profiles')
        .update({
          bio: bio || null,
          avatar_url: avatarUrl,
          city_state_country: location
        })
        .eq('user_id', userProfile.user_id);

      if (error) throw error;

      setCurrentStep(2);
      toast({
        title: "Profile Updated",
        description: "Basic information saved successfully.",
      });
    } catch (error: any) {
      console.error('Step 1 error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      if (userProfile.role === 'storyteller') {
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;

        if (!uploadedFile) {
          setError('Please upload a project file');
          setIsLoading(false);
          return;
        }

        // Upload project file
        const fileUrl = await uploadFile(uploadedFile, 'projects');
        if (!fileUrl) {
          throw new Error('Failed to upload project file');
        }

        // Create project record
        const { error: projectError } = await supabase
          .from('real_user_projects')
          .insert({
            user_id: userProfile.user_id,
            title,
            summary,
            file_url: fileUrl,
            file_name: uploadedFile.name
          });

        if (projectError) throw projectError;

      } else {
        // Creator flow
        const toolsUsed = formData.get('toolsUsed') as string;
        const specialties = formData.get('specialties') as string;

        if (!uploadedFile) {
          setError('Please upload a sample video');
          setIsLoading(false);
          return;
        }

        // Upload video file
        const videoUrl = await uploadFile(uploadedFile, 'videos');
        if (!videoUrl) {
          throw new Error('Failed to upload video');
        }

        // Create video record
        const { error: videoError } = await supabase
          .from('real_user_videos')
          .insert({
            user_id: userProfile.user_id,
            video_url: videoUrl,
            tools_used: toolsUsed,
            specialties: specialties
          });

        if (videoError) throw videoError;
      }

      // Mark onboarding as completed
      const { error: updateError } = await supabase
        .from('real_user_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', userProfile.user_id);

      if (updateError) throw updateError;

      toast({
        title: "Onboarding Complete!",
        description: "Welcome to Creators Now. Redirecting to your dashboard...",
      });

      // Redirect to appropriate dashboard
      setTimeout(() => {
        if (userProfile.role === 'creator') {
          navigate('/creator-dashboard');
        } else {
          navigate('/storyteller-dashboard');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Step 2 error:', error);
      setError(error.message || 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
            <div className="text-white text-sm">
              Step {currentStep} of 2
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500 text-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep === 1 && (
          <Card className="bg-dark-card text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Welcome, {userProfile.display_name}!
              </CardTitle>
              <CardDescription className="text-gray-400">
                Let's set up your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* Profile Image */}
                <div className="space-y-2">
                  <Label className="text-white">Profile Photo</Label>
                  <div className="flex items-center space-x-4">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile preview" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="profileImageUpdate"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('profileImageUpdate')?.click()}
                        className="text-white border-gray-600 hover:bg-gray-700"
                      >
                        {profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, State or Country"
                    required
                    defaultValue={userProfile.city_state_country}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself..."
                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="bg-dark-card text-white border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {userProfile.role === 'storyteller' ? 'Upload Your First Project' : 'Show Your Work'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {userProfile.role === 'storyteller' 
                  ? 'Share a project you\'d like to bring to life'
                  : 'Upload a sample video showcasing your AI creation skills'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep2Submit} className="space-y-6">
                {userProfile.role === 'storyteller' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary" className="text-white">Short Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        placeholder="Brief description of your project..."
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Upload Project File (PDF, TXT, etc.)</Label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="projectFile"
                          accept=".pdf,.txt,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'file')}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('projectFile')?.click()}
                          className="text-white border-gray-600 hover:bg-gray-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        {uploadedFile && (
                          <p className="mt-2 text-green-400">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            {uploadedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white">Upload Sample Video</Label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="videoFile"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'file')}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('videoFile')?.click()}
                          className="text-white border-gray-600 hover:bg-gray-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Video
                        </Button>
                        {uploadedFile && (
                          <p className="mt-2 text-green-400">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            {uploadedFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toolsUsed" className="text-white">Tools Used / Specialties</Label>
                      <Input
                        id="toolsUsed"
                        name="toolsUsed"
                        type="text"
                        placeholder="e.g., After Effects, Blender, AI animation tools..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialties" className="text-white">Your Specialties</Label>
                      <Textarea
                        id="specialties"
                        name="specialties"
                        placeholder="What type of AI content do you create? What's your style?"
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Completing Setup...' : 'Complete Setup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;