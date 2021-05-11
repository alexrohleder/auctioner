import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import settlement from "../../queues/settlement";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.auctionId);

  const auction = await prisma.auction.findUnique({
    where: {
      id,
    },
    include: {
      bids: {
        select: {
          value: true,
        },
        orderBy: {
          value: "desc",
        },
        take: 1,
      },
    },
  });

  if (!auction) {
    throw new HttpError(404);
  }

  if (auction.bids.length === 0) {
    await prisma.auction.update({
      where: {
        id,
      },
      data: {
        isSettled: true,
      },
    });

    return res.json({ status: "CLOSED" });
  }

  settlement.enqueue({ auctionId: id }, { id });
  res.json({ status: "ENQUEUED" });
});
