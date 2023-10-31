import * as Joi from "joi";

export const createLikeSchema = Joi.object({
    user_id: Joi.number(),
    threads_id: Joi.number(),
})