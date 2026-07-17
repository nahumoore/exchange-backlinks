-- Schema for exchange-backlinks.com — paste into the Supabase SQL editor.
-- Idempotent throughout (IF NOT EXISTS / CREATE OR REPLACE) so it's always
-- safe to paste-and-run the whole file, regardless of what's already there.
--
-- Access model: RLS is enabled on every table with NO policies, so the
-- anon/publishable key can read nothing. All reads and writes go through the
-- server-side secret key in the Next.js route handlers.

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  verified_at timestamptz,
  last_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- Weekday digest cadence — separate from last_email_sent_at, which only
-- throttles the verification-email resend.
alter table public.members add column if not exists last_digest_sent_at timestamptz;

-- Soft-disable: set when a member confirms /unsubscribe. Digests stop and all
-- of the member's sites are excluded from matching, but nothing is deleted —
-- clearing this column would fully restore participation.
alter table public.members add column if not exists unsubscribed_at timestamptz;

create table if not exists public.sites (
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

create index if not exists sites_member_id_idx on public.sites (member_id);

-- A double-blind relay thread between two sites, created the first time the
-- digest matches them. Mail sent TO alias_a is forwarded to site_a's owner;
-- alias_b forwards to site_b's owner — so the alias shown to A in a listing
-- about B is alias_b, and messages A sends there arrive at B's real inbox.
-- site_a_id is always the smaller uuid so a pair maps to exactly one row.
create table if not exists public.relay_threads (
  id uuid primary key default gen_random_uuid(),
  site_a_id uuid not null references public.sites (id) on delete cascade,
  site_b_id uuid not null references public.sites (id) on delete cascade,
  alias_a text not null unique,
  alias_b text not null unique,
  niche text not null,
  created_at timestamptz not null default now(),
  check (site_a_id < site_b_id),
  unique (site_a_id, site_b_id)
);

create index if not exists relay_threads_site_a_idx on public.relay_threads (site_a_id);
create index if not exists relay_threads_site_b_idx on public.relay_threads (site_b_id);

-- One row per calendar day, tracking total Resend sends (digests + relay
-- forwards) so both stay under the account-wide 90/day cap.
create table if not exists public.email_usage (
  day date primary key,
  sent int not null default 0
);

alter table public.members enable row level security;
alter table public.sites enable row level security;
alter table public.relay_threads enable row level security;
alter table public.email_usage enable row level security;
-- No policies on purpose: all access goes through the server-side secret key.

-- Atomically reserves one send against today's usage row, returning whether
-- the reservation succeeded (false once `sent` would exceed p_cap). Digests
-- reserve against the 80/day cap and relay forwards against the 90/day cap,
-- so once digests push the shared counter past 80 only relay sends can still
-- reserve the remaining headroom — a single counter enforces both caps.
create or replace function public.try_reserve_email_send(p_cap int)
returns boolean
language plpgsql
as $body$
declare
  v_sent int;
begin
  insert into public.email_usage (day, sent)
  values (current_date, 0)
  on conflict (day) do nothing;

  update public.email_usage
  set sent = sent + 1
  where day = current_date and sent < p_cap
  returning sent into v_sent;

  return v_sent is not null;
end;
$body$;

create or replace function public.get_email_usage_today()
returns int
language sql
stable
as $body$
  select coalesce(sent, 0) from public.email_usage where day = current_date;
$body$;
