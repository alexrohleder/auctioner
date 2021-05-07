drop table if exists bids;
drop table if exists auctions_starred;
drop table if exists auctions;
drop table if exists sessions;
drop table if exists auction_views;

drop type if exists t_currency_codes;
drop domain if exists d_external_ref;

create type t_currency_codes as enum('NOK'); /* https://en.wikipedia.org/wiki/ISO_4217 */
create domain d_external_ref as varchar(192); /* references used by storefront */

create table auctions (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references auth.users on delete cascade not null,
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
  auction_id uuid references auctions on delete cascade not null,
  bidder_ref d_external_ref not null,
  amount int not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table auctions_starred (
  id uuid default uuid_generate_v4(),
  auction_id uuid references auctions not null,
  user_ref d_external_ref not null
);

create table sessions (
  id uuid primary key,
  hostname varchar(100),
  browser varchar(20),
  os varchar(20),
  device varchar(20),
  screen varchar(11),
  language varchar(35),
  country char(2),
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table auction_views (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references sessions on delete cascade not null,
  auction_id uuid references auctions on delete cascade not null,
  referrer varchar(500),
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index auctions_is_published_idx on auctions(is_published);
create index auctions_is_settled_idx on auctions(is_settled);
create index auctions_inserted_at_idx on auctions(inserted_at);
create index auctions_updated_at_idx on auctions(updated_at);
create index bids_bidder_ref_idx on bids(bidder_ref);
create index bids_inserted_at_idx on bids(inserted_at);
create index auctions_starred_user_ref_idx on auctions_starred(user_ref);
create index sessions_inserted_at_idx on sessions(inserted_at);
create index auction_views_inserted_at_idx on auction_views(inserted_at);
