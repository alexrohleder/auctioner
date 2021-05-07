import joi from "joi";
import api, { abort } from "../../../lib/api";
import { getAuctionStats } from "../../../lib/queries";

const schema = joi.object({
  auctionId: joi.string().uuid().required(),
  startAt: joi.date().required(),
  endAt: joi.date().required(),
});

export default api().get(async (req, res) => {
  const { value, error } = schema.validate(req.query);

  if (error) {
    return abort(400, error.details);
  }

  res.json(
    await getAuctionStats(
      value.auctionId,
      new Date(value.startAt),
      new Date(value.endAt)
    )
  );
});
