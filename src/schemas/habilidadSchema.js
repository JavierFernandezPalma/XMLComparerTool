// schemas/habilidadSchema.js
const Joi = require('joi');

// Schema para crear habilidad
const createHabilidadSchema = Joi.object({
  id_usuario: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id_usuario debe ser un número',
      'number.integer': 'El id_usuario debe ser un número entero',
      'number.positive': 'El id_usuario debe ser un número positivo',
      'any.required': 'El id_usuario es obligatorio'
    }),
  
  nombre_hab: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El nombre_hab no puede estar vacío',
      'string.min': 'El nombre_hab debe tener al menos 1 carácter',
      'string.max': 'El nombre_hab no puede exceder los 100 caracteres',
      'any.required': 'El nombre_hab es obligatorio'
    })
});

// Schema para ID de habilidad (parámetro de ruta)
const idHabilidadSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id debe ser un número',
      'number.integer': 'El id debe ser un número entero',
      'number.positive': 'El id debe ser un número positivo',
      'any.required': 'El id es obligatorio'
    })
});

// Schema para ID de usuario (parámetro de ruta)
const idUsuarioSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id debe ser un número',
      'number.integer': 'El id debe ser un número entero',
      'number.positive': 'El id debe ser un número positivo',
      'any.required': 'El id es obligatorio'
    })
});

// Schema para actualizar habilidad
const updateHabilidadSchema = Joi.object({
  nombre_hab: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El nombre_hab no puede estar vacío',
      'string.min': 'El nombre_hab debe tener al menos 1 carácter',
      'string.max': 'El nombre_hab no puede exceder los 100 caracteres',
      'any.required': 'El nombre_hab es obligatorio'
    })
});

module.exports = {
  createHabilidadSchema,
  idHabilidadSchema,
  idUsuarioSchema,
  updateHabilidadSchema
};