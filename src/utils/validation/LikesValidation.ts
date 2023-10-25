import * as Joi from "joi";

export const createLikeSchema = Joi.object({
    user_id: Joi.number().required(),
    threads_id: Joi.number().required(),
})