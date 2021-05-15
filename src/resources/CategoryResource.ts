import { Prisma } from "@prisma/client";

export type CategoryResource = Prisma.CategoryGetPayload<{
  include: {
    auctions: {
      select: {
        id: true;
      };
    };
    attributes: true;
  };
}>;
