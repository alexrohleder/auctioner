import prisma from "../../../../lib/db";
import { Queue } from "quirrel/next";
import z from "../../../../lib/validation";
import { add, isPast } from "date-fns";
import { AuctionStatuses } from ".prisma/client";

type Payload = {
  auctionId: string;
};

export default Queue<Payload>("api/v1/queues/settlement", async (payload) => {
  const id = z.string().uuid().parse(payload.auctionId);

  const auction = await prisma.auction.findUnique({
    where: {
      id,
    },
    include: {
      bids: {
        select: {
          customerId: true,
          value: true,
        },
        orderBy: {
          value: "desc",
        },
        take: 1,
      },
      statuses: {
        select: {
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!auction) {
    return;
  }

  if (auction.statuses[0].status !== AuctionStatuses.OPEN) {
    return;
  }

  const isExpired = isPast(add(auction.createdAt, { days: auction.duration }));
  let status: AuctionStatuses | null = null;

  if (auction.bids.length === 0) {
    if (isExpired) {
      status = AuctionStatuses.EXPIRED;
    }
  } else {
    if (
      (auction.reservePrice && auction.bids[0].value >= auction.reservePrice) ||
      (auction.buyItNowPrice && auction.bids[0].value >= auction.buyItNowPrice)
    ) {
      status = AuctionStatuses.SOLD;
    } else if (isExpired) {
      status = auction.reservePrice
        ? AuctionStatuses.EXPIRED
        : AuctionStatuses.SOLD;
    }
  }

  if (status === null) {
    return;
  }

  await prisma.auctionStatus.create({
    data: {
      auctionId: id,
      status,
    },
  });

  if (status === AuctionStatuses.EXPIRED) {
    // todo: notify seller asking to re-open
  } else if (status === AuctionStatuses.SOLD) {
    // todo: notify seller and bidder, transfer money
  }
});
