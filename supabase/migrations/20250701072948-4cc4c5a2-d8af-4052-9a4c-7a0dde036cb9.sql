
-- Create waitlist table to store submissions
CREATE TABLE public.waitlist_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('waitlist', 'demo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved'))
);

-- Add Row Level Security (but make it accessible for admin functions)
ALTER TABLE public.waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to access all submissions (for admin/email functions)
CREATE POLICY "Service role can manage all waitlist submissions" 
  ON public.waitlist_submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX idx_waitlist_submissions_created_at ON public.waitlist_submissions(created_at DESC);
CREATE INDEX idx_waitlist_submissions_email ON public.waitlist_submissions(email);
