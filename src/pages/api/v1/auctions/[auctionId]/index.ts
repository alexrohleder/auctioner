import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import { getAuction, updateAuction } from "../../../../../queries/Auction";
import { AuctionUpdateSchema } from "../../../../../schemas/AuctionSchema";

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.auctionId);
    const auction = await getAuction(id);

    if (!auction) {
      throw new HttpError(404);
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );

    res.json(auction);
  })
  .post(async (req, res) => {
    const id = z.string().uuid().parse(req.query.auctionId);
    const data = AuctionUpdateSchema.parse(req.body);
    const auction = await getAuction(id);

    if (!auction) {
      throw new HttpError(404);
    }

    if (auction.currentStatus === AuctionStatuses.SOLD) {
      throw new BadRequestError("Cannot modify sold auctions");
    }

    if (data.startingPrice && auction.bids.length > 0) {
      throw new BadRequestError("Cannot modify starting price after first bid");
    }

    if (data.duration && auction.bids.length > 0) {
      throw new BadRequestError("Cannot modify duration after first bid");
    }

    if (auction.lastBidAmount) {
      if (data.reservePrice && data.reservePrice < auction.lastBidAmount) {
        throw new BadRequestError(
          "Cannot set reserve price to less than current quote"
        );
      }

      if (data.buyItNowPrice && data.buyItNowPrice < auction.lastBidAmount) {
        throw new BadRequestError(
          "Cannot set buy it now price to less than current quote"
        );
      }
    }

    res.json(await updateAuction(id, data));
  });
