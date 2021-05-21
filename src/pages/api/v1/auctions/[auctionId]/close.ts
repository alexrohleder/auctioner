import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import {
  getAuction,
  updateAuctionStatus,
} from "../../../../../queries/Auction";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.auctionId);
  const auction = await getAuction(id);

  if (!auction) {
    throw new HttpError(404);
  }

  if (auction.currentStatus !== AuctionStatuses.OPEN) {
    throw new BadRequestError("Auction is not open");
  }

  res.json(await updateAuctionStatus(id, AuctionStatuses.CLOSED));

  // todo: notify bidders if any
});
