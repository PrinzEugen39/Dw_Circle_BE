import * as Joi from "joi";

export const createThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
  userId: Joi.number(),
});

export const updateThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
})
