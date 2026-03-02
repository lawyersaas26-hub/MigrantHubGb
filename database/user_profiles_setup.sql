-- Create user_profiles table (extending auth.users)
create table if not exists public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user',
  subscription_plan text,
  subscription_status text default 'inactive',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on public.user_profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
