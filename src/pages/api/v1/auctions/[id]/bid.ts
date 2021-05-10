import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import notifyNewBid from "../../queues/notify-new-bid";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.id);
  const customerId = z.string().uuid().parse(req.body.customerId);
  const value = z.number().positive().min(1).parse(req.body.value);

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

  if (auction.isSettled) {
    // todo: perhaps test current time against auction duration too?
    throw new BadRequestError("Cannot bid in settled auctions");
  }

  if (auction.bids[0]) {
    if (auction.bids[0].value >= value) {
      throw new BadRequestError("Cannot bid less than current quote");
    }

    if (value - auction.bidIncrement !== auction.bids[0].value) {
      throw new BadRequestError("Cannot bid less than bid increment");
    }
  } else {
    if (value !== auction.bidIncrement) {
      throw new BadRequestError("Cannot bid different than bid increment");
    }
  }

  res.json(
    await prisma.bid.create({
      data: {
        auctionId: id,
        customerId,
        value,
      },
    })
  );

  // todo: if we reach the buy it now call this:
  // settlement.enqueue({ auctionId: data.id }, { id: data.id });

  notifyNewBid.enqueue({ auctionId: id }, { id, delay: "10 minutes" });
});
