-- ALIGN Pro Database Schema
-- Run this in your Supabase SQL editor

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'pro-plus')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Plans (30-day transformation plans)
CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  goal_category TEXT CHECK (goal_category IN ('discipline', 'anxiety', 'side-hustle', 'fitness', 'money', 'confidence', 'relationships', 'productivity', 'other')),
  tone TEXT DEFAULT 'gentle' CHECK (tone IN ('gentle', 'tough')),
  time_commitment INTEGER NOT NULL, -- minutes per day
  obstacles TEXT[], -- array of obstacles
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  anchor_habit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan Days (individual daily tasks)
CREATE TABLE IF NOT EXISTS public.plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.user_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  date DATE NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT,
  action_steps JSONB DEFAULT '[]'::jsonb, -- array of step objects
  reflection_prompt TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, day_number)
);

-- Weekly Reviews (AI-generated progress analysis)
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.user_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 4),
  summary TEXT NOT NULL,
  completed_tasks INTEGER DEFAULT 0,
  missed_tasks INTEGER DEFAULT 0,
  efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
  insights TEXT,
  adjustments TEXT,
  motivation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications (scheduled messages)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.user_plans(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('morning', 'evening', 'weekly', 'reminder')),
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress Tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.user_plans(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completed_days INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- Saved Routines (Pro+ feature)
CREATE TABLE IF NOT EXISTS public.saved_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON public.user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_status ON public.user_plans(status);
CREATE INDEX IF NOT EXISTS idx_plan_days_plan_id ON public.plan_days(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_days_date ON public.plan_days(date);
CREATE INDEX IF NOT EXISTS idx_plan_days_completed ON public.plan_days(completed);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_plan_id ON public.weekly_reviews(plan_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for, sent);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_routines ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own plans" ON public.user_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plans" ON public.user_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.user_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own plan days" ON public.plan_days
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.user_plans WHERE id = plan_id));

CREATE POLICY "Users can update own plan days" ON public.plan_days
  FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.user_plans WHERE id = plan_id));

CREATE POLICY "Users can view own reviews" ON public.weekly_reviews
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.user_plans WHERE id = plan_id));

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own routines" ON public.saved_routines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own routines" ON public.saved_routines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON public.user_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_days_updated_at BEFORE UPDATE ON public.plan_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_routines_updated_at BEFORE UPDATE ON public.saved_routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

