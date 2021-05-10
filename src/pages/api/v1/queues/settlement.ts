import prisma from "../../../../lib/db";
import { Queue } from "quirrel/next";
import z from "../../../../lib/validation";

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
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!auction) {
    // todo: log
    return;
  }

  if (auction.bids.length === 0) {
    // todo: if auction finishs without bids, then send email asking to re-open
  }

  // todo: notify the bidder and transfer the money to seller
});
