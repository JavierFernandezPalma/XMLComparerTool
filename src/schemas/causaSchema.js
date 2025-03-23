const Joi = require('joi');

const id_causa = Joi.number().integer().min(1).max(2147483647);
const id_error = Joi.number().integer().min(1).max(2147483647);
const descripcion_causa = Joi.string();
const descripcion_solucion = Joi.string();

const createCausa = Joi.object({
    idError: id_error.required(),
    descripcionCausa: descripcion_causa.required(),
    soluciones: Joi.array().items(
        Joi.object({
            solucion: Joi.object({
                descripcionSolucion: descripcion_solucion
            })
        })
    ).min(1).required()
});

const updateCausa = Joi.object({
    idCausa: id_causa.required(),
    descripcionCausa: descripcion_causa.required()
});

const getCausa = Joi.object({
    idCausa: id_causa,
    idError: id_error.required()
});

const deleteCausa = Joi.object({
    idCausa: id_causa.required()
});

module.exports = { createCausa, updateCausa, getCausa, deleteCausa }