-- Create real user profiles table with additional fields
CREATE TABLE IF NOT EXISTS public.real_user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city_state_country TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('storyteller', 'creator')),
  avatar_url TEXT,
  bio TEXT,
  display_name TEXT GENERATED ALWAYS AS (first_name || ' ' || LEFT(last_name, 1) || '.') STORED,
  email_confirmed BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real user projects table
CREATE TABLE IF NOT EXISTS public.real_user_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.real_user_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real user videos table  
CREATE TABLE IF NOT EXISTS public.real_user_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.real_user_profiles(user_id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tools_used TEXT,
  specialties TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.real_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_user_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for real_user_profiles
CREATE POLICY "Users can view all confirmed profiles" 
ON public.real_user_profiles 
FOR SELECT 
USING (email_confirmed = true);

CREATE POLICY "Users can insert their own profile" 
ON public.real_user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.real_user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for real_user_projects
CREATE POLICY "Users can view projects of confirmed profiles"
ON public.real_user_projects
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.real_user_profiles 
  WHERE real_user_profiles.user_id = real_user_projects.user_id 
  AND real_user_profiles.email_confirmed = true
));

CREATE POLICY "Users can manage their own projects"
ON public.real_user_projects
FOR ALL
USING (auth.uid() = user_id);

-- Create policies for real_user_videos  
CREATE POLICY "Users can view videos of confirmed profiles"
ON public.real_user_videos
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.real_user_profiles 
  WHERE real_user_profiles.user_id = real_user_videos.user_id 
  AND real_user_profiles.email_confirmed = true
));

CREATE POLICY "Users can manage their own videos"
ON public.real_user_videos
FOR ALL
USING (auth.uid() = user_id);

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for user uploads
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all uploaded files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user-uploads');

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_real_user_profiles_updated_at
  BEFORE UPDATE ON public.real_user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_real_user_projects_updated_at
  BEFORE UPDATE ON public.real_user_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_real_user_videos_updated_at
  BEFORE UPDATE ON public.real_user_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();