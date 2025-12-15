// schemas/rolSchema.js
const Joi = require('joi');

// Schema para crear rol
const createRolSchema = Joi.object({
  nom_roll: Joi.string().min(1).max(50).required()
    .messages({
      'string.empty': 'El nom_roll no puede estar vacío',
      'string.min': 'El nom_roll debe tener al menos 1 carácter',
      'string.max': 'El nom_roll no puede exceder los 50 caracteres',
      'any.required': 'El nom_roll es obligatorio'
    })
});

// Schema para ID de rol (parámetro de ruta)
const idRolSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id debe ser un número',
      'number.integer': 'El id debe ser un número entero',
      'number.positive': 'El id debe ser un número positivo',
      'any.required': 'El id es obligatorio'
    })
});

// Schema para actualizar rol
const updateRolSchema = Joi.object({
  nom_roll: Joi.string().min(1).max(50).required()
    .messages({
      'string.empty': 'El nom_roll no puede estar vacío',
      'string.min': 'El nom_roll debe tener al menos 1 carácter',
      'string.max': 'El nom_roll no puede exceder los 50 caracteres',
      'any.required': 'El nom_roll es obligatorio'
    })
});

module.exports = {
  createRolSchema,
  idRolSchema,
  updateRolSchema
};