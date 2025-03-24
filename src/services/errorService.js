const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class ArchivoErroresService {

    constructor() {
        this.errors = [];
        this.result;
    }

    /**
     * Crea un nuevo log de error, sus causas y soluciones asociadas si existen.
     * 
     * @param {Object} data - Datos necesarios para crear el log de error y sus relaciones.
     * @param {Array} data.causas - Array de causas relacionadas con el error, cada causa puede tener soluciones.
     * @returns {Object} - Un objeto con el statusCode 201 y el ID del log de error creado.
     * @throws {Error} - Si ocurre algún error al crear el log o sus relaciones en la base de datos.
     */
    async create(data) {
        try {
            // Crea un nuevo log de error en la base de datos
            const newLogError = await models.LogError.create(data);

            // Si existen causas asociadas y es un array no vacío
            if (Array.isArray(data.causas) && data.causas.length) {
                // Usamos Promise.all para ejecutar todas las operaciones en paralelo, mejorando el rendimiento
                await Promise.all(data.causas.map(async causa => {
                    // Verifica si la causa tiene la propiedad 'descripcionCausa' antes de continuar
                    if (causa.causa?.descripcionCausa) {
                        // Crea la causa asociada al log de error
                        const newCausa = await models.Causa.create({
                            ...causa.causa, // Propaga todos los datos de la causa
                            idError: newLogError.idError, // Asocia el ID del log de error con la causa
                        });

                        // Si la causa tiene soluciones asociadas, las crea en paralelo
                        if (Array.isArray(causa.causa.soluciones) && causa.causa.soluciones.length) {
                            await Promise.all(causa.causa.soluciones.map(async solucion => {
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
                    }
                }));
            }

            // Retorna el ID del log de error creado
            return {
                statusCode: 201,
                result: { idError: newLogError.idError }
            };
        } catch (err) {
            // console.error('Error al crear el log de error:', err);
            throw boom.notFound('Error al crear el log de error en la base de datos');
        }
    }

    /**
     * Busca un log de error por su descripcion, incluyendo relaciones y aplicando filtros en las tablas relacionadas.
     * 
     * @param {Object} body - Los datos del cuerpo de la solicitud que contienen posibles filtros para las relaciones.
     * @returns {Object} - El log de error encontrado, con sus relaciones filtradas.
     * @throws {Error} - Si ocurre algún error al buscar el log de error en la base de datos.
     */
    async find(descripcionError) {
        try {
            const logError = await models.LogError.findAll({
                where: {
                    descripcionError: {
                        [Op.like]: `%${descripcionError}%`  // Buscar por parte de la descripción, insensible a mayúsculas/minúsculas
                    }
                },
                include: [
                    {
                        model: models.Componente,  // Relación con el modelo 'Componente'
                        as: 'componentes',  // Alias de la relación
                    },
                    {
                        model: models.Proceso,  // Relación con el modelo 'Proceso'
                        as: 'procesos',  // Alias de la relación
                        // attributes: ['nombreProceso'],  // Solo traer el 'nombreProceso' y no el 'idProceso'
                        // required: false, // Esto es opcional, en caso de que el 'Proceso' sea opcional
                    },
                    {
                        model: models.Causa,  // Relación con el modelo 'Causa'
                        as: 'causas',  // Alias de la relación
                        include: [
                            {
                                model: models.Solucion,  // Relación con el modelo 'Solucion'
                                as: 'soluciones',  // Alias de la relación
                            }
                        ]
                    },
                    {
                        model: models.Imagen,  // Relación con el modelo 'Componente'
                        as: 'imagenes',  // Alias de la relación
                    }                    
                ]
            });

            if (!logError) {
                throw boom.notFound('Log error not foud')
            }
            return {
                statusCode: 200,
                result: logError
            };
        } catch (err) {
            // console.error('Error al buscar el error:', err);
            throw boom.notFound('Error al ejecutar la consulta a la base de datos');
        }
    }

    async findOne(id) {
        try {
            const logError = await models.LogError.findByPk(id);

            if (!logError) {
                throw boom.notFound('Log error not foud')
            }
            return logError

        } catch (err) {
            // console.error('Error al buscar el error:', err);
            throw boom.notFound('Error al ejecutar la consulta a la base de datos');
        }
    }

    async update(changes) {
        try {
            const logError = await this.findOne(changes.idError);
            const result = await logError.update(changes);
            return {
                statusCode: 200,
                result: result
            };
        } catch (err) {
            throw boom.notFound('Error al actualizar el registro en la base de datos');
        }
    }

    async delete(body) {
        try {
            const logError = await this.findOne(body.idError);
            await logError.destroy();
            return {
                statusCode: 200,
                result: { id_error: body.idError }
            };
        } catch (err) {
            throw boom.notFound('Error al eliminar el registro en la base de datos');
        }
    }

    async findAll(query) {
        try {
            const options = {};
            const { offset, limit } = query;
            if (offset && limit) {
                options.offset = parseInt(offset, 10);
                options.limit = parseInt(limit, 10);
            }
            const logError = await models.LogError.findAll(options);

            return {
                statusCode: 200,
                result: logError
            };

        } catch (err) {
            // Si hay un error, usamos boom para devolver una respuesta adecuada
            throw boom.badData('Error al ejecutar la consulta a la base de datos');
        }
    }
}

module.exports = ArchivoErroresService;




// const createPool = require('../libs/mysql');
// const boom = require('@hapi/boom');

// class ArchivoErroresService {

//     constructor() {
//         this.errors = [];
//         this.result;
//         this.createPool = createPool;
//         this.createPool.on('error', (err) => console.error("HOLA HOLA HOLA " + err));
//     }

//     async create(data) {
//         // const newError = { ...data }
//         // this.errors.push(newError);
//         const { procesName, componentName, descriptionError } = data;
//         const query = `
//         INSERT INTO errores (nombre_proceso, nombre_componente, descripcion_error)
//         VALUES (?, ?, ?);
//         `;
//         try {
//             const [res] = await this.createPool.execute(query, [procesName, componentName, descriptionError]);
//             console.log("RESPUESTA: ", res);
//             const result_ = {
//                 idError: res.insertId,  // El ID generado al insertar
//                 procesName,
//                 componentName,
//                 descriptionError
//             };

//             this.result = {
//                 statusCode: 201,
//                 result: result_
//             };

//             return this.result;
//         } catch (err) {
//             // console.error('Error al crear el log de error:', err);
//             throw boom.notFound('Error al crear el log de error en la base de datos');
//         }
//     }

//     async findOne(id) {
//         const query = 'SELECT * FROM errores WHERE id_error = ?';
//         // const error = this.errors.find(item => item.id === id);
//         try {
//             const [rows] = await this.createPool.execute(query, [id]);

//             if (rows.length === 0) {
//                 throw boom.notFound('Error not found');
//             }

//             const result_ = {
//                 idError: rows[0].id_error,
//                 procesName: rows[0].nombre_proceso,
//                 componentName: rows[0].nombre_componente,
//                 descriptionError: rows[0].descripcion_error
//             };

//             return {
//                 statusCode: 200,
//                 result: result_
//             };

//         } catch (err) {
//             // console.error('Error al buscar el error:', err);
//             throw boom.notFound('Error al ejecutar la consulta a la base de datos');
//         }
//     }

//     async update(id, changes) {
//         // const index = this.errors.findIndex(item => item.id === id);
//         // if (index === -1) {
//         //     throw boom.notFound('product not found');
//         // }
//         // const error = this.errors[index];
//         // this.errors[index] = {
//         //     ...error,
//         //     ...changess
//         // };
//         // return this.errors[index];
//         const queryFind = 'SELECT * FROM errores WHERE id_error = ?'; // Consulta para verificar si el registro existe

//         // Validar si 'changes' está vacío
//         if (!changes || Object.keys(changes).length === 0 || Object.values(changes).every(value => value === '' || value === null || value === undefined)) {
//             throw boom.badRequest('No se proporcionaron cambios válidos para actualizar.');
//         }

//         try {
//             // Buscar el error existente por ID
//             const [rows] = await this.createPool.execute(queryFind, [id]);

//             if (rows.length === 0) {
//                 // Si no existe el error, lanzar un error de "notFound"
//                 throw boom.notFound('Error no encontrado para actualizar');
//             }

//             // Si el error existe, tomamos los valores actuales del error
//             const errorExistente = rows[0];

//             // Asignar los valores de 'changes' si están disponibles, de lo contrario, usar los actuales
//             const nombreProcesoFinal = changes.procesName || errorExistente.nombre_proceso;
//             const nombreComponenteFinal = changes.componentName || errorExistente.nombre_componente;
//             const descripcionErrorFinal = changes.descriptionError || errorExistente.descripcion_error;

//             // Consulta para actualizar los datos
//             const queryUpdate = `
//                 UPDATE errores
//                 SET nombre_proceso = ?, nombre_componente = ?, descripcion_error = ? WHERE id_error = ?;
//             `;

//             // Ejecutar la actualización
//             const [result] = await this.createPool.execute(queryUpdate, [
//                 nombreProcesoFinal,
//                 nombreComponenteFinal,
//                 descripcionErrorFinal,
//                 id
//             ]);

//             // Verificar si se realizó la actualización
//             if (result.affectedRows === 0) {
//                 throw boom.notFound('Error no encontrado para actualizar');
//             }

//             const result_ = {
//                 idError: id,
//                 procesName: nombreProcesoFinal,
//                 componentName: nombreComponenteFinal,
//                 descriptionError: descripcionErrorFinal
//             };

//             // Devolvemos los datos actualizados
//             return {
//                 result: result_
//             };
//         } catch (err) {
//             // console.error('Error al actualizar el error:', err);
//             throw boom.notFound('Error al actualizar el error en la base de datos');
//         }
//     }

//     async delete(id) {
//         const query = 'DELETE FROM errores WHERE id_error = ?';
//         // const index = this.errors.findIndex(item => item.id === id);
//         // if (index === -1) {
//         //     throw boom.notFound('product not found');
//         // }
//         // this.errors.splice(index, 1);
//         // return { id };
//         try {
//             const [result] = await this.createPool.execute(query, [id]);

//             if (result.affectedRows === 0) {
//                 throw boom.notFound('Error no encontrado para eliminar');
//             }

//             return { id_error: id };
//         } catch (err) {
//             // console.error('Error al eliminar el error:', err);
//             throw boom.notFound('Error al eliminar el error en la base de datos');
//         }
//     }

//     async find() {
//         const query = 'SELECT * FROM my_database.errores;';
//         let pool;  // Guardar el pool resuelto
//         try {
//             // Usamos el pool de conexiones
//             pool = this.createPool;

//             // Ejecutamos la consulta con la conexión obtenida
//             const [rows] = await pool.execute(query);
//             console.log("RESPUESTA: ", rows);

//             this.result = {
//                 statusCode: 200,
//                 result: rows
//             };
//             // Devolvemos las filas resultantes
//             return this.result;
//         } catch (err) {
//             console.error('Error al ejecutar la consulta:', err);
//             // Si hay un error, usamos boom para devolver una respuesta adecuada
//             throw boom.badData('Error al ejecutar la consulta a la base de datos');
//         }

//     }
// }