import * as Joi from "joi";

export const createThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
  user_id: Joi.number(),
});

export const updateThreadSchema = Joi.object({
  content: Joi.string(),
  image: Joi.string(),
})
