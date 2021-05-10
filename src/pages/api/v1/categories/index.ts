import api from "../../../../lib/api";
import prisma from "../../../../lib/db";
import z from "../../../../lib/validation";

const SelectSchema = z.object({
  creatorId: z.string().uuid().optional(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100),
  skip: z.number().int().min(1).optional(),
});

const InsertSchema = z.object({
  creatorId: z.string().uuid(),
  name: z.string(),
});

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectSchema.parse(req.query);

    res.json(
      await prisma.category.findMany({
        include: {
          attributes: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          creatorId: data.creatorId,
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
          creatorId: data.creatorId,
          name: data.name,
        },
      })
    );
  });
