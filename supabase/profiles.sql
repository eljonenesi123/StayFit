-- StayFit "profiles" table — run this once in the Supabase SQL Editor
-- (dashboard -> SQL Editor -> New query -> paste -> Run).
--
-- One row per user, keyed by auth.users.id. height/weight are stored in a
-- fixed unit (cm, kg) regardless of which unit the person picked in the UI —
-- the app converts ft-in/lb to cm/kg before saving, since this table has no
-- separate unit columns.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  height numeric,
  weight numeric,
  age integer,
  gender text,
  goal text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Row Level Security: every policy is scoped to auth.uid() = user_id, so a
-- signed-in user can only ever read or write their OWN profile row. This
-- matters because the app talks to Supabase with the public anon key
-- straight from the browser — without RLS, that key alone would let anyone
-- read or overwrite any other user's profile.

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
