const Joi = require('joi');  // Librería para validaciones

const id_solucion = Joi.number().integer().min(1).max(2147483647).description('ID de la solucion');
const id_causa = Joi.number().integer().min(1).max(2147483647).description('ID de la causa');
const descripcion_solucion = Joi.string().description('Descripción de la solución');

const createSolucion = Joi.object({
    idCausa: id_causa.required(),
    descripcionSolucion: descripcion_solucion.required()
});

const updateSolucion = Joi.object({
    idSolucion: id_solucion.required(),
    descripcionSolucion: descripcion_solucion.required()
});

const deleteSolucion = Joi.object({
    idSolucion: id_solucion.required()
});

const getSolucion = Joi.object({
    idCausa: id_causa.required()
});

module.exports = { createSolucion, updateSolucion, deleteSolucion, getSolucion };