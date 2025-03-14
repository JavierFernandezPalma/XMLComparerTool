const Joi = require('joi');

const id_error = Joi.number().integer().min(1).max(2147483647);
const id_proceso = Joi.number().integer().min(1).max(2147483647);
const id_componente = Joi.number().integer().min(1).max(2147483647);
const descripcion_error = Joi.string().min(3).max(255);
const descripcion_causa = Joi.string();
const descripcion_solucion = Joi.string();
const image = Joi.string().uri();

const createErrorLog = Joi.object({
    idProceso: id_proceso.required(),
    idComponente: id_componente.required(),
    descripcionError: descripcion_error.required(),
    causas: Joi.array().items(
        Joi.object({
            causa: Joi.object({
                descripcionCausa: descripcion_causa,
                soluciones: Joi.array().items(
                    Joi.object({
                        solucion: Joi.object({
                            descripcionSolucion: descripcion_solucion
                        })
                    })
                )
            }).required()
        })
    ).min(1).required()
});

const updateErrorLog = Joi.object({
    idProceso: id_proceso,
    idComponente: id_componente,
    descripcionError: descripcion_error
});

const getErrorLog = Joi.object({
    idError: id_error,
    idProceso: id_proceso,
    idComponente: id_componente,
    descripcionError: descripcion_error.required()
});

const deleteErrorLog = Joi.object({
    idError: id_error.required()
});

module.exports = { createErrorLog, updateErrorLog, getErrorLog, deleteErrorLog }