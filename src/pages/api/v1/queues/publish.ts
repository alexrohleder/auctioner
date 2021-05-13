import { isPast } from "date-fns";
import { Queue } from "quirrel/next";
import prisma from "../../../../lib/db";
import z from "../../../../lib/validation";

type Payload = {
  auctionId: string;
};

const publish = Queue<Payload>("/api/queues/publish", async (payload) => {
  const id = z.string().uuid().parse(payload.auctionId);

  const auction = await prisma.auction.findUnique({
    where: {
      id,
    },
    select: {
      publicateAt: true,
      isPublished: true,
    },
  });

  if (!auction || auction.isPublished) {
    return;
  }

  if (isPast(auction.publicateAt)) {
    await prisma.auction.update({
      where: {
        id,
      },
      data: {
        isPublished: true,
      },
    });
  } else {
    publish.enqueue({ auctionId: id }, { id, runAt: auction.publicateAt });
  }
});

export default publish;
