create table bids (
  id uuid default uuid_generate_v4(),
  auction_id uuid references auctions not null,
  bidder_ref varchar(192) not null, /* external ref to the storefront */
  amount int not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);
