import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import { getAuction } from "../../../../../queries/Auction";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.auctionId);
  const auction = await getAuction(id);

  if (!auction) {
    throw new HttpError(404);
  }

  if (auction.currentStatus !== AuctionStatuses.OPEN) {
    throw new BadRequestError("Cannot settle an auction that is not open");
  }

  if (auction.bids.length === 0) {
    throw new BadRequestError("Cannot settle an auction without bids");
  }

  res.json(
    await prisma.auctionStatus.create({
      data: {
        auctionId: id,
        status: AuctionStatuses.SOLD,
      },
    })
  );

  // todo: notify bidder and transfer money
});
