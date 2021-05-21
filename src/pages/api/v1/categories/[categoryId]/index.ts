import api from "../../../../../lib/api";
import cacheRes from "../../../../../lib/cache-res";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "../../../../../queries/Category";
import { CategoryUpdateSchema } from "../../../../../schemas/CategorySchema";

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);
    const category = await getCategory(id);

    if (!category) {
      throw new HttpError(404);
    }

    cacheRes(res, "1d");

    res.json(category);
  })
  .post(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);
    const data = CategoryUpdateSchema.parse(req.body);
    const category = await getCategory(id);

    if (!category) {
      throw new HttpError(404);
    }

    res.json(
      await updateCategory(id, {
        name: data.name,
        attributes: {
          connect: data.attributes,
        },
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);

    res.json(await deleteCategory(id));
  });
