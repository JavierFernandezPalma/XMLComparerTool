const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class ImagenService {

    constructor() {
        this.errors = [];
        this.result;
    }

    async findAll(query) {
        try {
            console.error('Error al buscar el error:');
            const Imagen = await models.Imagen.findAll();

            return {
                statusCode: 200,
                result: Imagen
            };

        } catch (err) {
            // Si hay un error, usamos boom para devolver una respuesta adecuada
            throw boom.badData('Error al ejecutar la consulta a la base de datos');
        }
    }
}

module.exports = ImagenService;