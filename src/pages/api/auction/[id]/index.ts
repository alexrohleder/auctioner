import Joi from "joi";
import api, { abort } from "../../../../lib/api";
import { getAuction } from "../../../../lib/queries";

const schema = Joi.object({
  id: Joi.string().uuid().required(),
});

export default api().get(async (req, res) => {
  const { value, error } = schema.validate(req.query);

  if (error) {
    return abort(400, error.details);
  }

  const auction = await getAuction(value.id);

  if (auction) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=43200"
    );

    return res.json(auction);
  }

  return abort(404);
});
