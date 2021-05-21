import { AttributeType, Prisma } from ".prisma/client";
import api from "../../../../lib/api";
import cacheRes from "../../../../lib/cache-res";
import prisma from "../../../../lib/db";
import {
  AttributeInsertSchema,
  AttributeSelectSchema,
} from "../../../../schemas/AttributeSchema";

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = AttributeSelectSchema.parse(req.query);

    cacheRes(res, "1d", "12h");

    res.json(
      await prisma.attribute.findMany({
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          options: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          name: data.name,
          type: data.type ? AttributeType[data.type] : undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        take,
        skip,
      })
    );
  })
  .post(async (req, res) => {
    const data = AttributeInsertSchema.parse(req.body);

    const payload: Prisma.AttributeCreateArgs = {
      data: {
        name: data.name,
        slug: data.slug,
        type: AttributeType[data.type],
        isRequired: data.isRequired,
      },
    };

    if (data.options) {
      payload.data.options = {
        createMany: {
          data: data.options,
        },
      };
    }

    res.json(await prisma.attribute.create(payload));
  });
