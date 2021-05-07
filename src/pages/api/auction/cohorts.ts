import joi from "joi";
import api, { abort } from "../../../lib/api";
import { getViewCohorts } from "../../../lib/queries";

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

  const [views, uniqueVisitors] = await Promise.all([
    getViewCohorts(
      value.auctionId,
      new Date(value.startAt),
      new Date(value.endAt)
    ),
    getViewCohorts(
      value.auctionId,
      new Date(value.startAt),
      new Date(value.endAt),
      true
    ),
  ]);

  res.json({
    views,
    uniqueVisitors,
    bids: [],
    highestValue: [],
    bidders: [],
  });
});
