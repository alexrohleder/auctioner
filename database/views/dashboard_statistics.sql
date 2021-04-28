create or replace view dashboard_statistics as
  select
    41 total_bids,
    23 total_bids_from,
    3 open_auctions,
    10000 revenue,
    9000 revenue_from,
    47.04 convertion_rate,
    55.34 convertion_rate_from,
    8623 page_views
  from auctions;
