create or replace view dashboard_statistics as
  select
    0 expected_income,
    0 revenue_last_30_days
  from auctions;
