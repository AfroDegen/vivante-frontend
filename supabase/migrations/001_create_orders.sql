create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed')),

  payment_method text not null
    check (payment_method in ('card', 'bank_transfer')),

  subtotal_kobo bigint not null check (subtotal_kobo >= 0),
  delivery_kobo bigint not null check (delivery_kobo >= 0),
  total_kobo bigint not null check (total_kobo >= 0),

  lines jsonb not null,
  customer jsonb not null,

  provider_ref text unique,

  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_status_idx
  on public.orders(status);

create index if not exists orders_created_at_idx
  on public.orders(created_at desc);

alter table public.orders enable row level security;

-- No public policies. Server accesses this table using the service role.