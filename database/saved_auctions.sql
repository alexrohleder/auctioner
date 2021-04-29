create table saved_auctions (
  id uuid default uuid_generate_v4(),
  auction_id uuid references auctions not null,
  user_ref varchar(192) not null
);
