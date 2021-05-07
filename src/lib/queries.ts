import prisma from "./db";

export const getAuctionsBySellerId = async (sellerId: string) => {
  return prisma.auction.findMany({
    where: {
      sellerId,
    },
  });
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
  return prisma.$queryRaw(
    `
    select
      sum(t.c) as views,
      count(distinct t.view_session_id) as uniques,
      sum(case when t.c = 1 then 1 else 0 end) as bounces,
      sum(t.time) as totalTime
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
};
