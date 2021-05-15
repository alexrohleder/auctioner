import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";

const UpdateSchema = z.object({
  name: z.string(),
  attributes: z.array(z.object({ id: z.string().uuid() })),
});

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );

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
            name: true,
            type: true,
          },
        },
      },
    });

    if (!category) {
      throw new HttpError(404);
    }

    res.json(category);
  })
  .patch(async (req, res) => {
    const id = z.string().uuid().parse(req.query.categoryId);
    const data = UpdateSchema.parse(req.body);

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
    const id = z.string().uuid().parse(req.query.id);

    res.json(
      await prisma.category.delete({
        where: {
          id,
        },
      })
    );
  });
