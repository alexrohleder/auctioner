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
    throw new BadRequestError("Cannot buy auctions that are not open");
  }

  // todo: payment

  res.json(
    await prisma.auctionStatus.create({
      data: {
        auctionId: id,
        status: AuctionStatuses.SOLD,
      },
    })
  );

  // todo: notify seller
});
