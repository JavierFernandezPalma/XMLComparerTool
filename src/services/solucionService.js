const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class SolucionService {
    async findAll(body) {
        try {
            const soluciones = await models.Solucion.findAll({
                where: {
                    idCausa: body.idCausa
                }
            });  // Busca las soluciones
            return { statusCode: 200, result: soluciones };
        } catch (error) {
            // Si ocurre un error en la consulta, lanza un error 500
            throw boom.badData('Error al ejecutar la consulta a la base de datos');
        }
    }

    async create(data) {
        try {
            const solucion = await models.Solucion.create(data);  // Crea una nueva solución
            return { statusCode: 201, result: solucion };
        } catch (error) {
            // Maneja el error si algo sale mal en la base de datos
            throw boom.notFound('Error al crear el registro en la base de datos');
        }
    }

    async update(id, data) {
        try {
            const solucion = await models.Solucion.findByPk(id);  // Busca la solución por ID
            if (!solucion) throw new Error('Solución no encontrada');  // Si no existe la solución, lanza un error
            const updatedSolucion = await solucion.update(data);  // Actualiza la solución
            return { statusCode: 200, result: updatedSolucion };
        } catch (error) {
            // Si ocurre un error en la actualización, lanza un error 404
            throw boom.notFound('Error al actualizar el registro en la base de datos');
        }
    }

    async delete(id) {
        try {
            const solucion = await models.Solucion.findByPk(id);  // Busca la solución por ID
            if (!solucion) throw new Error('Solución no encontrada');  // Si no existe la solución, lanza un error
            await solucion.destroy();  // Elimina la solución
            return { statusCode: 200, result: { message: 'Solución eliminada correctamente' } };
        } catch (error) {
            // Si ocurre un error al eliminar el registro, lanza un error 500
            throw boom.notFound('Error al eliminar el registro en la base de datos');
        }
    }
}

module.exports = SolucionService;