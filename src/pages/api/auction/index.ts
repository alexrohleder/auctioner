import joi from "joi";
import api, { abort } from "../../../lib/api";
import { createAuction, getAuctionsBySellerId } from "../../../lib/queries";

export default api()
  .get(async (req, res) => {
    const schema = joi.object({ sellerId: joi.string().uuid().required() });
    const { value, error } = schema.validate(req.query);

    if (error) {
      return abort(400, error.details);
    }

    res.json(await getAuctionsBySellerId(value.sellerId));
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
