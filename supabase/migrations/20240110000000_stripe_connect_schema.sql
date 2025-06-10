
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create creators table to track Stripe Connect accounts and tenure
CREATE TABLE public.creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_connect_id TEXT UNIQUE,
  onboarded_at TIMESTAMPTZ,
  charges_enabled BOOLEAN DEFAULT false,
  details_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create escrow_payments table to track payments
CREATE TABLE public.escrow_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  storyteller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  project_fee INTEGER NOT NULL, -- Amount to creator in cents
  platform_fee INTEGER NOT NULL, -- Platform fee in cents
  processing_fee INTEGER NOT NULL, -- Stripe processing fee in cents
  total_amount INTEGER NOT NULL, -- Total charged to storyteller in cents
  status TEXT DEFAULT 'pending', -- pending, held, approved, released, completed
  approved_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_approvals table for workflow tracking
CREATE TABLE public.project_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  escrow_payment_id UUID REFERENCES public.escrow_payments(id) ON DELETE CASCADE,
  storyteller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, revision_requested
  feedback TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creators
CREATE POLICY "creators_own_profile" ON public.creators
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for escrow_payments
CREATE POLICY "view_own_payments" ON public.escrow_payments
  FOR SELECT USING (storyteller_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "edge_functions_payments" ON public.escrow_payments
  FOR ALL USING (true);

-- RLS Policies for project_approvals
CREATE POLICY "view_own_approvals" ON public.project_approvals
  FOR SELECT USING (storyteller_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "storytellers_approve" ON public.project_approvals
  FOR UPDATE USING (storyteller_id = auth.uid());

CREATE POLICY "edge_functions_approvals" ON public.project_approvals
  FOR ALL USING (true);

-- Function to calculate creator payout percentage based on tenure
CREATE OR REPLACE FUNCTION calculate_creator_payout_percentage(creator_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  onboarded_date TIMESTAMPTZ;
  days_since_onboarding INTEGER;
BEGIN
  SELECT onboarded_at INTO onboarded_date
  FROM public.creators
  WHERE user_id = creator_user_id;
  
  IF onboarded_date IS NULL THEN
    RETURN 100; -- Default to 100% for new creators
  END IF;
  
  days_since_onboarding := EXTRACT(DAY FROM (now() - onboarded_date));
  
  IF days_since_onboarding <= 90 THEN
    RETURN 100; -- 100% for first 90 days
  ELSE
    RETURN 95; -- 95% after 90 days (5% platform fee)
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
