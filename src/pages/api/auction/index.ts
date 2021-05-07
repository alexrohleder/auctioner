import api, { abort } from "../../../lib/api";
import { createAuction, getAuctionsBySellerId } from "../../../lib/queries";

export default api()
  .get(async (req, res) => {
    if (typeof req.query.sellerId !== "string" || !req.query.sellerId) {
      return abort(400);
    }

    res.json(await getAuctionsBySellerId(req.query.sellerId));
  })
  .post(async (req, res) => {
    res.json(
      await createAuction({
        sellerId: req.body.sellerId,
        bidIncrement: req.body.bidIncrement,
        startingPrice: req.body.startingPrice,
        currencyCode: req.body.currencyCode,
        title: req.body.title,
        description: req.body.description,
        isPublished: req.body.isPublished,
        isSettled: true,
      })
    );
  });
