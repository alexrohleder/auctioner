import { Prisma } from ".prisma/client";
import prisma from "./db";

export const getAuctions = async ({ query = null, take = 10, skip = 0 }) => {
  const where = query ? Prisma.sql`WHERE auctions.id = ${query.id}` : "";

  return prisma.sql`
    SELECT
      auctions.*,
      COUNT(bids.*) total_bids,
      COUNT(DISTINCT bids.bidder_id) total_bidders,
      MAX(bids.value) last_bid_amount,
      MAX(bids.created_at) last_bid_created_at
    FROM auctions
    LEFT JOIN bids ON auctions.id = bids.auction_id
    ${where}
    GROUP BY auctions.id
    ORDER BY created_at, last_bid_created_at DESC
    LIMIT ${take} OFFSET ${skip}
  `;
};

export const getAuction = async (id: string) => {
  const [auction] = await getAuctions({ query: { id } });
  return auction;
};
