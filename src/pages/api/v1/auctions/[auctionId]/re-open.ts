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

  if (auction.currentStatus === AuctionStatuses.OPEN) {
    throw new BadRequestError("Auction is not closed");
  }

  if (auction.currentStatus === AuctionStatuses.SOLD) {
    throw new BadRequestError("Cannot re-open sold auctions");
  }

  res.json(
    await prisma.auctionStatus.create({
      data: {
        auctionId: auction.id,
        status: AuctionStatuses.OPEN,
      },
    })
  );
});
