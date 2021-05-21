import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import { bid, getAuction } from "../../../../../queries/Auction";
import notifyNewBid from "../../../queues/notify-new-bid";
import settlement from "../../../queues/settlement";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.auctionId);
  const customerId = z.string().uuid().parse(req.body.customerId);
  const value = z.number().positive().min(1).parse(req.body.value);
  const auction = await getAuction(id);

  if (!auction) {
    throw new HttpError(404);
  }

  if (auction.currentStatus !== AuctionStatuses.OPEN) {
    throw new BadRequestError(
      `Cannot bid in auction with ${auction.currentStatus} status`
    );
  }

  if (auction.lastBidAmount) {
    if (auction.lastBidAmount >= value) {
      throw new BadRequestError("Cannot bid less than current quote");
    }

    if (value - auction.bidIncrement !== auction.lastBidAmount) {
      throw new BadRequestError("Cannot bid less than bid increment");
    }
  } else {
    if (value !== auction.bidIncrement) {
      throw new BadRequestError("Cannot bid different than bid increment");
    }
  }

  res.json(await bid(id, customerId, value));

  if (auction.buyItNowPrice && value >= auction.buyItNowPrice) {
    settlement.enqueue({ auctionId: auction.id }, { id: auction.id });
  }

  notifyNewBid.enqueue({ auctionId: id }, { id, delay: "10 minutes" });
});
