import prisma from "../../../../lib/db";
import { Queue } from "quirrel/next";
import z from "../../../../lib/validation";
import { add, isPast } from "date-fns";
import { AuctionStatuses } from ".prisma/client";
import { getAuction } from "../../../../queries/Auction";

type Payload = {
  auctionId: string;
};

export default Queue<Payload>("api/v1/queues/settlement", async (payload) => {
  const id = z.string().uuid().parse(payload.auctionId);
  const auction = await getAuction(id);

  if (!auction) {
    return;
  }

  if (auction.currentStatus !== AuctionStatuses.OPEN) {
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
      auction.lastBidAmount &&
      ((auction.reservePrice &&
        auction.lastBidAmount >= auction.reservePrice) ||
        (auction.buyItNowPrice &&
          auction.lastBidAmount >= auction.buyItNowPrice))
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
