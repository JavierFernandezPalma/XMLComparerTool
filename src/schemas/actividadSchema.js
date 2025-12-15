// src/schemas/actividadSchema.js
const Joi = require('joi');

const createActividadSchema = Joi.object({
  id_tarea: Joi.number().integer().positive().required(),
  descripcion: Joi.string().min(1).max(500).required(),
  id_estado_tarea: Joi.number().integer().positive().default(1)
});

const idActividadSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const idTareaSchema = Joi.object({
  id_tarea: Joi.number().integer().positive().required()
});

const updateEstadoSchema = Joi.object({
  id_estado: Joi.number().integer().positive().required()
});

const updateDescripcionSchema = Joi.object({
  descripcion: Joi.string().min(1).max(500).required()
});

// ✅ EXPORTACIÓN CORRECTA
module.exports = {
  createActividadSchema,
  idActividadSchema,
  idTareaSchema,
  updateEstadoSchema,
  updateDescripcionSchema
};