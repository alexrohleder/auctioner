import api from "../../../../../lib/api";
import cacheRes from "../../../../../lib/cache-res";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import {
  deleteAttribute,
  getAttribute,
  updateAttribute,
} from "../../../../../queries/Attribute";
import { AttributeUpdateSchema } from "../../../../../schemas/AttributeSchema";

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.attributeId);

    const attribute = await getAttribute(id);

    if (!attribute) {
      throw new HttpError(404);
    }

    cacheRes(res, "1d", "12h");

    res.json(attribute);
  })
  .post(async (req, res) => {
    const id = z.string().uuid().parse(req.query.attributeId);
    const data = AttributeUpdateSchema.parse(req.body);
    const attribute = await getAttribute(id);

    if (!attribute) {
      throw new HttpError(404);
    }

    res.json(
      await updateAttribute(id, {
        name: data.name,
        isRequired: data.isRequired,
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.attributeId);

    res.json(await deleteAttribute(id));
  });
