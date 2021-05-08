import prisma from "./db";

const buildAuctionQuery = (where: string) =>
  `
    select
      a.*,
      count(b.*) total_bids,
      count(distinct b.bidder_id) total_bidders,
      max(b.value) last_bid_amount,
      max(b.created_at) last_bid_created_at
    from auctions a
    left join bids b on a.id = b.auction_id
    where ${where}
    group by a.id
    order by a.created_at, last_bid_created_at
  `;

export const getAuction = async (auctionId: string) => {
  const [auction] = await prisma.$queryRaw(
    buildAuctionQuery("a.id = $1"),
    auctionId
  );

  return auction;
};

export const getAuctionsBySellerId = async (sellerId: string) => {
  return prisma.$queryRaw(buildAuctionQuery("a.seller_id = $1"), sellerId);
};

export const createAuction = async (data: {
  sellerId: string;
  bidIncrement: number;
  startingPrice: number;
  currencyCode: string;
  title: string;
  description?: string;
  isPublished: boolean;
  isSettled: boolean;
}) => {
  return prisma.auction.create({
    data,
  });
};

export const getViewSessionById = async (id: string) => {
  return prisma.viewSession.findUnique({
    where: {
      id,
    },
  });
};

export const createViewSession = async (data: {
  id?: string;
  hostname?: string;
  browser?: string;
  os?: string;
  device?: string;
  screen?: string;
  language?: string;
  country?: string;
}) => {
  return prisma.viewSession.create({
    data,
  });
};

export const createView = async (data: {
  viewSessionId: string;
  auctionId: string;
  referrer?: string;
}) => {
  return prisma.view.create({
    data,
  });
};

export const getAuctionStats = async (
  auctionId: string,
  startAt: Date,
  endAt: Date
) => {
  const [result] = await prisma.$queryRaw(
    `
    select
      sum(t.c) as views,
      count(distinct t.view_session_id) as uniques,
      sum(case when t.c = 1 then 1 else 0 end) as bounces,
      sum(t.time) as time
    from (
      select
        view_session_id,
        to_char(date_trunc('hour', created_at), 'YYYY-MM-DD HH24:00:00'),
        count(*) c,
        floor(extract(epoch from max(created_at) - min(created_at))) as time
      from views
      where auction_id = $1
      and created_at between $2 and $3
      group by 1, 2
    ) t
  `,
    auctionId,
    startAt,
    endAt
  );

  return result;
};

export const getViewCohorts = async (
  auctionId: string,
  startAt: Date,
  endAt: Date,
  distinct = false
) => {
  return prisma.$queryRaw(
    `
    select
      to_char(date_trunc('hour', created_at), 'HH24:00') as x,
      count(${distinct ? "distinct view_session_id" : "*"}) as y
    from views
    where auction_id = $1
    and created_at between $2 and $3
    group by 1
    order by 1
  `,
    auctionId,
    startAt,
    endAt
  );
};

export const getSellerStatistics = async (
  sellerId: string,
  startAt: Date,
  endAt: Date
) => {
  const buildQuery = (where: string) => `
    select
      count(id) total_auctions,
      sum(case when is_settled then 1 else 0 end) total_settled_auctions,
      sum(total_bids) total_bids,
      sum(total_bidders) total_bidders,
      sum(case when is_settled then last_bid_amount else 0 end) revenue
      from (
        select
          a.id,
          a.is_settled,
          count(b.*) total_bids,
          count(distinct b.bidder_id) total_bidders,
          max(b.value) last_bid_amount
        from auctions a
        left join bids b on a.id = b.auction_id
        where a.seller_id = $1
        and ${where}
        group by a.id
    ) t
  `;

  const [statistics] = await prisma.$queryRaw(
    `
      select
        a.*,
        b.total_bids total_bids_from,
        b.revenue revenue_from
      from
        (${buildQuery("1 = 1")}) a,
        (${buildQuery("1 = 0")}) b
    `,
    sellerId
  );

  return statistics;
};
