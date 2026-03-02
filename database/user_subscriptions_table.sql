-- Create user_subscriptions table
create table if not exists public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_type text not null,
  status text not null check (status in ('active', 'inactive', 'cancelled', 'expired')),
  receipt text, -- Store purchase token or receipt ID
  purchase_date timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- One active subscription per user (simplification)
);

-- Enable RLS
alter table public.user_subscriptions enable row level security;

-- Policies
create policy "Users can view own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscription"
  on public.user_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscription"
  on public.user_subscriptions for update
  using (auth.uid() = user_id);
