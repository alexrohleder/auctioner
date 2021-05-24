import { AuctionStatuses, Prisma } from ".prisma/client";
import { cast } from "../lib/casts";
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
  seller: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
  bids: {
    select: {
      bidderId: true,
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
      id: true,
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
          values: {
            select: {
              value: true,
            },
            take: 1,
          },
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

export const updateAuctionStatus = async (
  id: string,
  status: AuctionStatuses
) => {
  await prisma.auctionStatus.create({
    data: {
      auctionId: id,
      status,
    },
  });
};

export const bid = async (id: string, bidderId: string, value: number) =>
  prisma.bid.create({
    data: {
      auctionId: id,
      bidderId,
      value,
    },
  });

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

  const { category, ...props } = auction;
  const attributes = {};

  if (category?.attributes) {
    for (const attribute of category.attributes) {
      let value =
        typeof attribute.values[0]?.value !== "undefined"
          ? attribute.values[0].value
          : null;

      if (attribute.type === "NUMBER" || attribute.type === "BOOLEAN") {
        value = cast(value);
      }

      attributes[attribute.slug] = value;
    }
  }

  return {
    ...props,
    lastBidAmount,
    lastBidCreatedAt,
    totalBids,
    totalBidders,
    currentStatus: auction.statuses[0]?.status,
    category: category ? { id: category.id, name: category.name } : null,
    attributes,
  };
};

export type Auction = Exclude<ReturnType<typeof format>, null>;
