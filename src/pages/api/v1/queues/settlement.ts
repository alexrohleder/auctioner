import prisma from "../../../../lib/db";
import { Queue } from "quirrel/next";

type Payload = {
  auctionId: string;
};

export default Queue<Payload>("api/v1/queues/settlement", async (payload) => {
  const auction = await prisma.auction.findUnique({
    where: {
      id: payload.auctionId,
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

  // todo: notify the bidder and transfer the money to seller
});
