import api from "../../../../lib/api";
import cacheRes from "../../../../lib/cache-res";
import z from "../../../../lib/validation";
import { createCategory, getCategories } from "../../../../queries/Category";

const SelectSchema = z.object({
  creatorId: z.string().uuid().optional(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100).optional(),
  skip: z.number().int().min(1).optional(),
});

const InsertSchema = z.object({
  name: z.string(),
});

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectSchema.parse(req.query);

    cacheRes(res, "1d", "12h");

    res.json(
      await getCategories({
        where: {
          name: data.name,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        take,
        skip,
      })
    );
  })
  .post(async (req, res) => {
    const data = InsertSchema.parse(req.body);

    res.json(
      await createCategory({
        name: data.name,
      })
    );
  });
