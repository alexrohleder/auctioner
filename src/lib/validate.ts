import Joi from "joi";
import { BadRequestError } from "./errors";

const validate = (
  fields: Record<string, any>,
  schema: Record<string, Joi.Schema>
) => {
  const { value, error } = Joi.object(schema).validate(fields);

  if (error) {
    throw new BadRequestError(error);
  }

  const where = {};
  const { take, skip, ...data } = value;

  for (const key in data) {
    if (typeof data[key] === "string") {
      where[key] = {
        contains: data[key],
        mode: "insensitive",
      };
    } else {
      where[key] = {
        equals: data[key],
      };
    }
  }

  return {
    take,
    skip,
    where,
    data,
  };
};

validate.pagination = {
  take: Joi.number().min(1).max(100).default(10),
  skip: Joi.number().min(1).default(0),
};

export default validate;
