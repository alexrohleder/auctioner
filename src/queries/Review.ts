import { Prisma } from ".prisma/client";
import prisma from "../lib/db";
import { UserRelationQuery } from "./User";

const select = {
  id: true,
  review: true,
  createdAt: true,
  updatedAt: true,
  reviewer: {
    select: UserRelationQuery,
  },
};

export const getReview = async (id: string) =>
  prisma.userReview.findUnique({
    where: {
      id,
    },
    select,
  });

export const getReviews = async ({
  where,
  orderBy = { createdAt: Prisma.SortOrder.desc },
  take = 10,
  skip,
}: {
  where: Prisma.UserReviewWhereInput;
  orderBy?: Prisma.UserReviewOrderByInput;
  take: number;
  skip?: number;
}) =>
  prisma.userReview.findMany({
    select,
    where,
    orderBy,
    take,
    skip,
  });

export const createReview = async (
  data: Prisma.XOR<
    Prisma.UserReviewCreateInput,
    Prisma.UserReviewUncheckedCreateInput
  >
) =>
  prisma.userReview.create({
    data,
    select,
  });

export const updateReview = async (
  id: string,
  data: Prisma.XOR<
    Prisma.UserReviewUpdateInput,
    Prisma.UserReviewUncheckedUpdateInput
  >
) =>
  prisma.userReview.update({
    where: {
      id,
    },
    data,
    select,
  });

export const deleteReview = async (id: string) =>
  prisma.userReview.delete({
    where: {
      id,
    },
    select,
  });
