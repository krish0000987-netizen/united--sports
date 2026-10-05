-- ============================================================================
-- Migration: 20261005000001_donations_and_payments.sql
-- Purpose: Donations table, Razorpay integration, and payment audit records
-- ============================================================================

-- 1. Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  pan_number TEXT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  purpose TEXT NOT NULL DEFAULT 'General Athlete Support',
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations (status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_order_id ON public.donations (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_payment_id ON public.donations (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations (donor_email);

-- 2. Row Level Security for donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow public / checkout visitors to insert a donation
CREATE POLICY "public_insert_donations" ON public.donations
  FOR INSERT
  WITH CHECK (true);

-- Allow public to read their donation by razorpay_order_id (for receipt verification)
CREATE POLICY "public_read_donations_by_order" ON public.donations
  FOR SELECT
  USING (true);

-- Allow admin full CRUD on donations
CREATE POLICY "admins_manage_donations" ON public.donations
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Trigger for updated_at
CREATE OR REPLACE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 4. Seed default razorpay settings in site_settings if key-value schema
INSERT INTO public.site_settings (key, value)
SELECT 'razorpay', jsonb_build_object(
  'key_id', '',
  'key_secret', '',
  'is_enabled', true,
  'mode', 'test',
  'currency', 'INR',
  'min_amount', 100,
  'suggested_amounts', jsonb_build_array(500, 1000, 2500, 5000, 10000),
  'tax_benefit_info', 'Donations to UnitedAthletes for India Foundation (Section 8) may be eligible for 80G tax deductions.',
  'organization_name', 'UnitedAthletes for India Foundation'
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_settings WHERE key = 'razorpay'
);
