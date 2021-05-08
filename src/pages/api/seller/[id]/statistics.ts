import Joi from "joi";
import api, { abort } from "../../../../lib/api";
import { getSellerStatistics } from "../../../../lib/queries";

const schema = Joi.object({
  id: Joi.string().uuid().required(),
});

export default api().get(async (req, res) => {
  const { value, error } = schema.validate(req.query);

  if (error) {
    return abort(400, error.details);
  }

  res.json(await getSellerStatistics(value.id));
});
