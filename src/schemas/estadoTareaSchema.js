// schemas/estadoTareaSchema.js
const Joi = require('joi');

// Schema para crear estado de tarea
const createEstadoTareaSchema = Joi.object({
  estado_tarea: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El estado_tarea no puede estar vacío',
      'string.min': 'El estado_tarea debe tener al menos 1 carácter',
      'string.max': 'El estado_tarea no puede exceder los 100 caracteres',
      'any.required': 'El estado_tarea es obligatorio'
    })
});

// Schema para ID de estado (parámetro de ruta)
const idEstadoSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id debe ser un número',
      'number.integer': 'El id debe ser un número entero',
      'number.positive': 'El id debe ser un número positivo',
      'any.required': 'El id es obligatorio'
    })
});

// Schema para actualizar estado de tarea
const updateEstadoTareaSchema = Joi.object({
  estado_tarea: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El estado_tarea no puede estar vacío',
      'string.min': 'El estado_tarea debe tener al menos 1 carácter',
      'string.max': 'El estado_tarea no puede exceder los 100 caracteres',
      'any.required': 'El estado_tarea es obligatorio'
    })
});

module.exports = {
  createEstadoTareaSchema,
  idEstadoSchema,
  updateEstadoTareaSchema
};