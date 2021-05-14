import { Prisma } from "@prisma/client";

type Payload = Prisma.AuctionGetPayload<{
  include: {
    bids: true;
    statuses: true;
  };
}>;

const createAuctionResource = (auction: Payload) => {
  let lastBidAmount: number | null = null;
  let lastBidCreatedAt: Date | null = null;
  let totalBids = 0;
  let totalBidders = 0;

  if (auction.bids.length) {
    lastBidAmount = auction.bids[0].value;
    lastBidCreatedAt = auction.bids[0].createdAt;
  }

  return {
    ...auction,
    lastBidAmount,
    lastBidCreatedAt,
    totalBids,
    totalBidders,
    status: auction.statuses[0]?.status,
  };
};

export type AuctionResource = ReturnType<typeof createAuctionResource>;

export default createAuctionResource;
