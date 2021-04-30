create type t_currency_codes as enum('NOK'); /* https://en.wikipedia.org/wiki/ISO_4217 */
create domain d_external_ref as varchar(192); /* references used by storefront */
create table auctions (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references auth.users not null,
  bid_increment int not null,
  starting_price int not null,
  currency_code t_currency_codes not null,
  title varchar(120) check (char_length(title) > 3),
  description text,
  images text[], /* paths within auction-images bucket */
  is_published boolean default false,
  is_settled boolean default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table bids (
  id uuid default uuid_generate_v4() primary key,
  auction_id uuid references auctions not null,
  bidder_ref d_external_ref not null,
  amount int not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table auctions_starred (
  id uuid default uuid_generate_v4(),
  auction_id uuid references auctions not null,
  user_ref d_external_ref not null
);
