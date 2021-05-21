import api from "../../../../../lib/api";
import cacheRes from "../../../../../lib/cache-res";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import { CategoryUpdateSchema } from "../../../../../schemas/CategorySchema";

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        auctions: {
          select: {
            id: true,
          },
        },
        attributes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      throw new HttpError(404);
    }

    cacheRes(res, "1d", "12h");

    res.json(category);
  })
  .post(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);
    const data = CategoryUpdateSchema.parse(req.body);

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HttpError(404);
    }

    res.json(
      await prisma.category.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          attributes: {
            connect: data.attributes,
          },
        },
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);

    res.json(
      await prisma.category.delete({
        where: {
          id,
        },
      })
    );
  });
