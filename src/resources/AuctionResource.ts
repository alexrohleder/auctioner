import { Prisma } from "@prisma/client";

export const payload = {
  bids: true,
  statuses: true,
  category: {
    select: {
      name: true,
      attributes: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          isRequired: true,
          options: {
            select: {
              name: true,
            },
          },
          values: true,
        },
      },
    },
  },
};

const createAuctionResource = (
  auction: Prisma.AuctionGetPayload<{ select: typeof payload }>
) => {
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
