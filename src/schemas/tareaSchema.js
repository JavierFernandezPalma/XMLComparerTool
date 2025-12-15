// schemas/tareaSchema.js
const Joi = require('joi');

// Schema para crear tarea
const createTareaSchema = Joi.object({
  nom_tarea: Joi.string().min(1).max(200).required()
    .messages({
      'string.empty': 'El nom_tarea no puede estar vacío',
      'string.min': 'El nom_tarea debe tener al menos 1 carácter',
      'string.max': 'El nom_tarea no puede exceder los 200 caracteres',
      'any.required': 'El nom_tarea es obligatorio'
    }),
  
  id_usuario_practicante: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id_usuario_practicante debe ser un número',
      'number.integer': 'El id_usuario_practicante debe ser un número entero',
      'number.positive': 'El id_usuario_practicante debe ser un número positivo',
      'any.required': 'El id_usuario_practicante es obligatorio'
    }),
  
  fecha_ini: Joi.date().iso().required()
    .messages({
      'date.base': 'La fecha_ini debe ser una fecha válida',
      'date.format': 'La fecha_ini debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'La fecha_ini es obligatoria'
    }),
  
  fecha_fin: Joi.date().iso().greater(Joi.ref('fecha_ini'))
    .messages({
      'date.base': 'La fecha_fin debe ser una fecha válida',
      'date.format': 'La fecha_fin debe estar en formato ISO (YYYY-MM-DD)',
      'date.greater': 'La fecha_fin debe ser posterior a la fecha_ini'
    }),
  
  id_usuario_asignador: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id_usuario_asignador debe ser un número',
      'number.integer': 'El id_usuario_asignador debe ser un número entero',
      'number.positive': 'El id_usuario_asignador debe ser un número positivo',
      'any.required': 'El id_usuario_asignador es obligatorio'
    })
});

// Schema para ID de tarea (parámetro de ruta)
const idTareaSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id debe ser un número',
      'number.integer': 'El id debe ser un número entero',
      'number.positive': 'El id debe ser un número positivo',
      'any.required': 'El id es obligatorio'
    })
});

// Schema para ID de practicante (parámetro de ruta)
const idPracticanteSchema = Joi.object({
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
  id_estado: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id_estado debe ser un número',
      'number.integer': 'El id_estado debe ser un número entero',
      'number.positive': 'El id_estado debe ser un número positivo',
      'any.required': 'El id_estado es obligatorio'
    })
});

module.exports = {
  createTareaSchema,
  idTareaSchema,
  idPracticanteSchema,
  updateEstadoTareaSchema
};