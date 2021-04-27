create or replace view dashboard_auctions as
  select
    auctions.*,
    0 highest_bid_amount,
    now() highest_bid_inserted_at,
    0 bid_count
  from auctions;
