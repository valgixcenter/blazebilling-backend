import Joi from 'joi'

export const serviceAddSchema = Joi.object({
    name: Joi.string().max(32).required(),
    price: Joi.number().max(99999999).required(),
    handler: Joi.string().max(32).required(),
    metadata: Joi.object().optional()
})

export const serviceBuySchema = Joi.object({
    serviceId: Joi.number().min(1).required()
})

