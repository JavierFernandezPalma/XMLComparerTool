const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class CausasService {

    constructor() {
        this.errors = [];
        this.result;
    }

    /**
     * Crea un nuevo registro de causa de error en la base de datos.
     * Si se proporcionan, también se asocian las posibles soluciones con la causa.
     * 
     * @param {Object} data - Datos necesarios para crear la causa.
     * @param {string} data.descripcion - Descripción de la causa del error.
     * @param {Array} [data.soluciones] - Array de soluciones asociadas a la causa. (opcional)
     * @returns {Object} - Un objeto con el statusCode 201 y el ID de la causa creada.
     * @throws {Error} - Si ocurre un error al crear el registro o al asociar las soluciones.
     */
    async create(data) {
        try {

            const newCausa = await models.Causa.create(data);

            // Si la causa tiene soluciones asociadas, las crea en paralelo
            if (Array.isArray(data.soluciones) && data.soluciones.length) {
                await Promise.all(data.soluciones.map(async solucion => {
                    // Verifica si la solución tiene la propiedad 'descripcionSolucion' antes de crearla
                    if (solucion.solucion?.descripcionSolucion) {
                        // Crea la solución asociada a la causa
                        await models.Solucion.create({
                            ...solucion.solucion, // Propaga todos los datos de la solución
                            idCausa: newCausa.idCausa, // Asocia el ID de la causa con la solución
                        });
                    }
                }));
            }

            // Retorna el ID del registro creado
            return {
                statusCode: 201,
                result: { idCausa: newCausa.idCausa }
            };
        } catch (err) {
            // Maneja el error si algo sale mal en la base de datos
            throw boom.notFound('Error al crear el registro en la base de datos');
        }
    }

    /**
     * Encuentra una causa específica por su ID.
     * 
     * @param {number} id - El ID único de la causa que se desea obtener.
     * @returns {Object} - Objeto que representa la causa encontrada.
     * @throws {Error} - Si no se encuentra la causa o hay un error al consultar la base de datos.
     */
    async findOne(id) {
        try {
            // Busca el registro por su ID en la base de datos
            const causa = await models.Causa.findByPk(id);

            // Si no se encuentra el registro, lanza un error 404
            if (!causa) {
                throw boom.notFound('Causa not foud')
            }
            return causa

        } catch (err) {
            // Si ocurre un error en la consulta, lanza un error 500
            throw boom.notFound('Error al ejecutar la consulta a la base de datos');
        }
    }

    /**
     * Actualiza los datos de una causa existente.
     * 
     * @param {number} id - El ID de la causa a actualizar.
     * @param {Object} changes - Datos que se desean actualizar en la causa.
     * @returns {Object} - Un objeto con el statusCode 200 y los datos actualizados de la causa.
     * @throws {Error} - Si ocurre un error al actualizar el registro en la base de datos.
     */
    async update(changes) {
        try {
            // Busca el registro que se quiere actualizar
            const causa = await this.findOne(changes.idCausa);
            // Realiza la actualización del egistro con los nuevos cambios
            const result = await causa.update(changes);
            return {
                statusCode: 200,
                result: result
            };
        } catch (err) {
            // Si ocurre un error en la actualización, lanza un error 404
            throw boom.notFound('Error al actualizar el registro en la base de datos');
        }
    }

    /**
     * Elimina una causa específica por su ID.
     * 
     * @param {number} id - El ID de la causa a eliminar.
     * @returns {Object} - Un objeto con el statusCode 200 y el ID de la causa eliminada.
     * @throws {Error} - Si ocurre un error al eliminar el registro en la base de datos.
     */
    async delete(id) {
        try {
            // Busca el registro que se quiere eliminar
            const causa = await this.findOne(id);
            // Elimina el registro de la base de datos
            await causa.destroy();
            return {
                statusCode: 200,
                result: { idCausa: id }
            };
        } catch (err) {
            // Si ocurre un error al eliminar el registro, lanza un error 500
            throw boom.notFound('Error al eliminar el registro en la base de datos');
        }
    }

    /**
     * Obtiene todas las causas registradas en la base de datos.
     * 
     * @returns {Object} - Un objeto con el statusCode 200 y un array de todas las causas registradas.
     * @throws {Error} - Si ocurre un error al ejecutar la consulta en la base de datos.
     */
    async findAll(body) {
        try {
            // Busca todos los registros en la base de datos
            const causas = await models.Causa.findAll({
                where: {
                    idError: body.idError
                },
                include: [{
                    model: models.Solucion,
                    as: 'soluciones'
                }]
            });

            return {
                statusCode: 200,
                result: causas
            };

        } catch (err) {
            // Si ocurre un error en la consulta, lanza un error 500
            throw boom.badData('Error al ejecutar la consulta a la base de datos');
        }
    }
}

module.exports = CausasService;