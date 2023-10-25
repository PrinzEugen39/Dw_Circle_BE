import * as Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  full_name: Joi.string(),
  profile_picture: Joi.string(),
  profile_description: Joi.string(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
  username: Joi.string(),
  full_name: Joi.string(),
  profile_picture: Joi.string(),
  profile_description: Joi.string(),
});
