import * as Joi from "joi";

export const createRepliesSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
  thread_id: Joi.number().required(),
  user_id: Joi.number(),
});

export const updateRepliesSchema = Joi.object({
  content: Joi.string().min(5),
  image: Joi.string(),
})