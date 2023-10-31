import * as Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
    full_name: Joi.string().required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})