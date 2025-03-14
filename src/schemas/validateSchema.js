const Joi = require('joi');

const scroll = Joi.number().integer().positive().min(3).max(3);

const validateSchema = Joi.object({
    scroll: scroll.required()
});