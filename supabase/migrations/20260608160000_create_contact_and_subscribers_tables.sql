-- Backs the footer "Contact Us" form and the $10-off newsletter popup.
-- Both are public-facing forms, so anonymous visitors must be able to insert
-- (but never read back) rows — mirroring the anon/authenticated GRANT pattern
-- already required for the products table (see migration 20260608150000).

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "authenticated users can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

grant select, insert on public.contact_messages to anon, authenticated;

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text not null,
  source      text not null default 'popup',
  created_at  timestamptz not null default now()
);

alter table public.subscribers enable row level security;

create policy "anyone can subscribe"
  on public.subscribers for insert
  with check (true);

create policy "authenticated users can read subscribers"
  on public.subscribers for select
  using (auth.role() = 'authenticated');

grant select, insert on public.subscribers to anon, authenticated;
