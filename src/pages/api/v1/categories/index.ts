import api from "../../../../lib/api";
import cacheRes from "../../../../lib/cache-res";
import prisma from "../../../../lib/db";
import z from "../../../../lib/validation";

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
      await prisma.category.findMany({
        include: {
          attributes: {
            select: {
              id: true,
              name: true,
              type: true,
              isRequired: true,
              options: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
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
      await prisma.category.create({
        data: {
          name: data.name,
        },
      })
    );
  });
