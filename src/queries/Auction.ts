import { AuctionStatuses, Prisma } from ".prisma/client";
import prisma from "../lib/db";

const select = {
  id: true,
  title: true,
  description: true,
  startingPrice: true,
  bidIncrement: true,
  buyItNowPrice: true,
  reservePrice: true,
  duration: true,
  createdAt: true,
  bids: {
    select: {
      customerId: true,
      value: true,
      createdAt: true,
    },
    orderBy: {
      value: Prisma.SortOrder.desc,
    },
  },
  statuses: {
    select: {
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
  },
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
  medias: {
    select: {
      id: true,
      url: true,
      thumbnail: true,
      width: true,
      height: true,
    },
  },
};

export const getAuction = async (id: string) => {
  return format(
    await prisma.auction.findUnique({
      where: {
        id,
      },
      select,
    })
  );
};

export const getAuctions = async ({
  where,
  orderBy,
  take = 10,
  skip,
}: {
  where: Prisma.AuctionWhereInput;
  orderBy?: Prisma.AuctionOrderByInput;
  take: number;
  skip?: number;
}) => {
  const auctions = await prisma.auction.findMany({
    select,
    where,
    orderBy,
    take,
    skip,
  });

  return auctions.map(format);
};

export const createAuction = async (
  data: Prisma.XOR<
    Prisma.AuctionCreateInput,
    Prisma.AuctionUncheckedCreateInput
  >
) => {
  return format(
    await prisma.auction.create({
      data: {
        ...data,
        statuses: {
          create: {
            status: AuctionStatuses.OPEN,
          },
        },
      },
      select,
    })
  ) as Auction;
};

export const updateAuction = async (
  id: string,
  data: Prisma.XOR<
    Prisma.AuctionUpdateInput,
    Prisma.AuctionUncheckedUpdateInput
  >
) => {
  return format(
    await prisma.auction.update({
      where: {
        id,
      },
      data,
      select,
    })
  ) as Auction;
};

const format = (
  auction: Prisma.AuctionGetPayload<{ select: typeof select }> | null
) => {
  if (auction === null) {
    return null;
  }

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
    currentStatus: auction.statuses[0]?.status,
  };
};

export type Auction = Exclude<ReturnType<typeof format>, null>;
