-- Employees Table
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) not null,
  name text not null,
  email text,
  created_at timestamptz default now()
);

-- Loyalty Programs Table
create table if not exists loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) not null,
  title text not null,
  stamps_required int not null,
  prize_description text not null,
  terms_conditions text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User Loyalty Stamps Table
create table if not exists user_loyalty_stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  loyalty_program_id uuid references loyalty_programs(id) not null,
  stamps_collected int default 0,
  last_stamp_at timestamptz,
  is_completed boolean default false,
  completed_at timestamptz,
  prize_redeemed boolean default false,
  redeemed_at timestamptz,
  unique (user_id, loyalty_program_id)
);

-- Stamp Transactions Table
create table if not exists stamp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  loyalty_program_id uuid references loyalty_programs(id) not null,
  business_id uuid references businesses(id) not null,
  amount_spent numeric,
  employee_id uuid references employees(id),
  transaction_qr_timestamp timestamptz,
  qr_payload_hash text unique,
  created_at timestamptz default now()
); 