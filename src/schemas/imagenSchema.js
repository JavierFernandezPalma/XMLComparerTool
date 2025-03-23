const Joi = require('joi');

const id_imagen = Joi.number().integer().min(1).max(2147483647);
const id_error = Joi.number().integer().min(1).max(2147483647);
const imagen_id = Joi.string().uuid();
const ruta_imagen = Joi.string().uri().min(3).max(255);
const descripcion_imagen = Joi.string().min(3).max(255);

const createImagen = Joi.object({
    idError: id_error.required(),
    imagenId: imagen_id.required(),
    rutaImagen: ruta_imagen.required(),
    descripcionImagen: descripcion_imagen.required()
});

const updateImagen = Joi.object({
    idImagen: id_imagen.required(),
    descripcionImagen: descripcion_imagen.required()
});

const getImagen = Joi.object({
    idImagen: id_imagen.required(),
    idError: id_error,
    imagenId: imagen_id,
    rutaImagen: ruta_imagen,
    descripcionImagen: descripcion_imagen
});

const deleteImagen = Joi.object({
    idImagen: id_imagen.required()
});

module.exports = { createImagen, updateImagen, getImagen, deleteImagen }