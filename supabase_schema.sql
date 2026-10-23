-- EngageEd: Unified Customer Feedback Analytics Platform
-- Supabase PostgreSQL Schema with Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'business_owner')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PARTICIPATING SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Food Delivery', 'E-Commerce', 'Banking', 'Travel', 
    'Education', 'Healthcare', 'Entertainment', 'Local Services'
  )),
  logo_url TEXT,
  description TEXT NOT NULL,
  website_url TEXT NOT NULL,
  is_embeddable BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC(3, 2) DEFAULT 4.5,
  feedback_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FEEDBACK CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.feedback_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  description TEXT
);

INSERT INTO public.feedback_categories (id, label, icon, description) VALUES
  ('Product', 'Product Quality', 'package', 'Physical items, specifications, and build quality'),
  ('Service', 'Overall Service', 'heart-handshake', 'General service delivery and brand satisfaction'),
  ('Support', 'Customer Support', 'headset', 'Agent responsiveness, live chat, and issue resolution'),
  ('Payment', 'Billing & Payment', 'credit-card', 'Checkout speed, refund handling, and invoice clarity'),
  ('Delivery', 'Shipping & Delivery', 'truck', 'Delivery punctuality, package condition, and tracking'),
  ('User Interface', 'UI & Navigation', 'layout', 'Website/app design, button discoverability, and ease of use'),
  ('Performance', 'Speed & Reliability', 'zap', 'Loading speeds, crash resistance, and responsiveness'),
  ('Other', 'Other Feedback', 'message-square', 'General opinions or miscellaneous requests')
ON CONFLICT (id) DO NOTHING;

-- 5. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY, -- e.g. 'ENG-8491'
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  rating_emoji TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  refined_text TEXT,
  ai_summary TEXT,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('Positive', 'Neutral', 'Negative', 'Mixed')),
  sentiment_score NUMERIC(5, 2) DEFAULT 50.0,
  category TEXT NOT NULL REFERENCES public.feedback_categories(id),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  topic TEXT,
  image_url TEXT,
  has_voice_note BOOLEAN DEFAULT false,
  is_quick_feedback BOOLEAN DEFAULT false,
  quick_type TEXT CHECK (quick_type IN ('like', 'dislike')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'In Progress', 'Resolved')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FEEDBACK ISSUES TABLE (Aggregated Prioritization)
CREATE TABLE IF NOT EXISTS public.feedback_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  issue_title TEXT NOT NULL,
  category TEXT NOT NULL,
  mentions INT DEFAULT 1,
  sentiment TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'New',
  sample_quote TEXT,
  last_reported TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_issues ENABLE ROW LEVEL SECURITY;

-- Services: Everyone can read active services
CREATE POLICY "Public Read Active Services" ON public.services
  FOR SELECT USING (is_active = true);

-- Services: Admins can insert/update services
CREATE POLICY "Admin Manage Services" ON public.services
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Feedback: Public/Anonymous can insert feedback
CREATE POLICY "Allow Feedback Submission" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Feedback: Customers can only read their own non-anonymous feedback
CREATE POLICY "Customer Read Own Feedback" ON public.feedback
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_anonymous = false);

-- Feedback: Admins & Business owners can read all feedback
CREATE POLICY "Admin Read All Feedback" ON public.feedback
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'business_owner')));

-- Indexes for high-throughput feedback queries
CREATE INDEX IF NOT EXISTS idx_feedback_service ON public.feedback(service_id);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON public.feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON public.feedback(priority);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at DESC);
