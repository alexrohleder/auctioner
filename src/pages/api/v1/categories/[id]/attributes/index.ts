import api from "../../../../../../lib/api";
import prisma from "../../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../../lib/errors";
import z from "../../../../../../lib/validation";

const SelectSchema = z.object({
  creatorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100),
  skip: z.number().int().min(1).optional(),
});

const InsertSchema = z.object({
  creatorId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  defaultValue: z.string().optional(),
});

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectSchema.parse(req.query);

    res.json(
      await prisma.attribute.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          creatorId: data.creatorId,
          categoryId: data.categoryId,
          name: data.name,
          type: data.type,
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

    const category = prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new HttpError(404);
    }

    if (data.defaultValue !== undefined) {
      const hasAuctions = await category.auctions({ take: 1 });

      if (hasAuctions) {
        throw new BadRequestError(
          "Cannot update attributes in categories containg auctions"
        );
      }
    }

    res.json(
      await prisma.attribute.create({
        data: {
          creatorId: data.creatorId,
          categoryId: data.categoryId,
          name: data.name,
          type: data.type,
          defaultValue: data.defaultValue,
        },
      })
    );
  });
