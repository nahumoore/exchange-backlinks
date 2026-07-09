-- Schema for exchange-backlinks.com — paste into the Supabase SQL editor.
--
-- Access model: RLS is enabled on every table with NO policies, so the
-- anon/publishable key can read nothing. All reads and writes go through the
-- server-side secret key in the Next.js route handlers.

create table public.members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  verified_at timestamptz,
  last_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  -- Normalized before insert (lowercase, no protocol/www/path); globally
  -- unique — a domain belongs to exactly one member, ever.
  domain text not null unique check (domain = lower(domain)),
  niche text not null,
  keywords text[] not null,
  description text not null,
  domain_rating int,
  created_at timestamptz not null default now()
);

create index sites_member_id_idx on public.sites (member_id);

alter table public.members enable row level security;
alter table public.sites enable row level security;
-- No policies on purpose: all access goes through the server-side secret key.
