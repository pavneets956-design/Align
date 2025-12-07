-- ALIGN Database Schema Extension
-- Run this in Supabase SQL Editor after the base schema.sql

-- Users table (extends Supabase auth.users)
-- We'll use Supabase Auth, so this is optional metadata
create table if not exists user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    tier text not null default 'free' check (tier in ('free', 'pro')),
    stripe_customer_id text,
    stripe_subscription_id text,
    subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Plans/Routines table (Pro feature)
create table if not exists plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    content jsonb not null, -- Stores plan structure, steps, etc.
    engine_used text check (engine_used in ('insight', 'action', 'plan')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index if not exists plans_user_id_idx on plans(user_id);
create index if not exists plans_created_at_idx on plans(created_at desc);

-- Subscription events log (for debugging Stripe webhooks)
create table if not exists subscription_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    event_type text not null,
    stripe_event_id text unique,
    event_data jsonb,
    created_at timestamptz default now()
);

create index if not exists subscription_events_user_id_idx on subscription_events(user_id);
create index if not exists subscription_events_stripe_event_id_idx on subscription_events(stripe_event_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_user_profiles_updated_at before update on user_profiles
    for each row execute function update_updated_at_column();

create trigger update_plans_updated_at before update on plans
    for each row execute function update_updated_at_column();

-- Row Level Security (RLS) policies
alter table user_profiles enable row level security;
alter table plans enable row level security;

-- Users can read/update their own profile
create policy "Users can view own profile" on user_profiles
    for select using (auth.uid() = id);

create policy "Users can update own profile" on user_profiles
    for update using (auth.uid() = id);

-- Users can manage their own plans
create policy "Users can view own plans" on plans
    for select using (auth.uid() = user_id);

create policy "Users can create own plans" on plans
    for insert with check (auth.uid() = user_id);

create policy "Users can update own plans" on plans
    for update using (auth.uid() = user_id);

create policy "Users can delete own plans" on plans
    for delete using (auth.uid() = user_id);

-- Service role can do everything (for server-side operations)
create policy "Service role full access user_profiles" on user_profiles
    for all using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role full access plans" on plans
    for all using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role full access subscription_events" on subscription_events
    for all using (auth.jwt() ->> 'role' = 'service_role');

