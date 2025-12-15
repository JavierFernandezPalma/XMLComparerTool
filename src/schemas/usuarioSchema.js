// src/schemas/usuarioSchema.js
const Joi = require('joi');

// Schema para crear usuario
const createUsuarioSchema = Joi.object({
  nom_usuario: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El nom_usuario no puede estar vacío',
      'string.min': 'El nom_usuario debe tener al menos 1 carácter',
      'string.max': 'El nom_usuario no puede exceder los 100 caracteres',
      'any.required': 'El nom_usuario es obligatorio'
    }),
  
  id_roll: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id_roll debe ser un número',
      'number.integer': 'El id_roll debe ser un número entero',
      'number.positive': 'El id_roll debe ser un número positivo',
      'any.required': 'El id_roll es obligatorio'
    })
});

// Schema para actualizar usuario
const updateUsuarioSchema = Joi.object({
  nom_usuario: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El nom_usuario no puede estar vacío',
      'string.min': 'El nom_usuario debe tener al menos 1 carácter',
      'string.max': 'El nom_usuario no puede exceder los 100 caracteres',
      'any.required': 'El nom_usuario es obligatorio'
    }),
  
  id_roll: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El id_roll debe ser un número',
      'number.integer': 'El id_roll debe ser un número entero',
      'number.positive': 'El id_roll debe ser un número positivo',
      'any.required': 'El id_roll es obligatorio'
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

// Schema para ID de habilidad (parámetro de ruta)
const idHabilidadSchema = Joi.object({
  skillId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El skillId debe ser un número',
      'number.integer': 'El skillId debe ser un número entero',
      'number.positive': 'El skillId debe ser un número positivo',
      'any.required': 'El skillId es obligatorio'
    })
});

// Schema para crear habilidad
const createHabilidadSchema = Joi.object({
  nombre_hab: Joi.string().min(1).max(100).required()
    .messages({
      'string.empty': 'El nombre_hab no puede estar vacío',
      'string.min': 'El nombre_hab debe tener al menos 1 carácter',
      'string.max': 'El nombre_hab no puede exceder los 100 caracteres',
      'any.required': 'El nombre_hab es obligatorio'
    })
});

// ✅ EXPORTACIÓN CORRECTA - NO OLVIDES ESTO
module.exports = {
  createUsuarioSchema,
  updateUsuarioSchema,
  idUsuarioSchema,
  idHabilidadSchema,
  createHabilidadSchema
};