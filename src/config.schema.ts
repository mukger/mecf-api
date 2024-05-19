import * as Joi from "@hapi/joi"

export const configValidationSchema = Joi.object({
    STAGE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432).required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    TOKEN_EXPIRATION_ACCESS: Joi.number().required(),
    TOKEN_EXPIRATION_REFRESH: Joi.number().required(),
    SUBSID_API: Joi.string().required().uri(),
    SIMILARITY_UPPER_LIMIT: Joi.number().required().min(0).max(1)
})