create table auctions (
  id uuid default uuid_generate_v4(),
  seller_id uuid references auth.users not null,

  bid_increment int not null,
  starting_price int not null,

  title varchar(120) check (char_length(title) > 3),
  description text,

  /* is_published boolean default false, */
  is_settled boolean default false,

  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table auctions enable row level security;

create policy "Seller can create auctions." on auctions for
  insert with check (auth.uid() = seller_id);

create policy "Seller can update their own auctions." on auctions for
  update using (auth.uid() = seller_id);

create policy "Seller can delete their own auctions." on auctions for
  delete using (auth.uid() = seller_id);

create policy "Seller can see their unpublished auctions." on auctions for
  select using (auth.uid() = seller_id and is_published = false);

create policy "Everyone can see published auctions." on auctions for
  select using (is_published = true);
