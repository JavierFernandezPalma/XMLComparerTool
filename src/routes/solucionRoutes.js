const express = require('express');  // Framework web Express
const SolucionService = require('../services/solucionService');  // Servicio para manejar las soluciones
const validatorErrorHandler = require('../middlewares/validatorErrorHandler');  // Middleware para validar datos
const { createSolucion, updateSolucion, deleteSolucion, getSolucion } = require('../schemas/solucionSchema');  // Validaciones de esquema
const jwtAuth = require('../middlewares/jwtAuth'); // Importar el middleware de autenticación

const router = express.Router();  // Router de Express para definir las rutas
const service = new SolucionService();  // Instancia del servicio para el manejo de soluciones

/**
 * Ruta para obtener todas las soluciones de una causa.
 * 
 * Esta ruta maneja las solicitudes GET para recuperar todas las soluciones asociadas a una causa.
 * 
 * @swagger
 * /soluciones/{idCausa}:
 *   get:
 *     tags:
 *       - Soluciones
 *     summary: Obtener todas las soluciones de una causa
 *     description: Recupera todas las soluciones asociadas a una causa específica.
 *     parameters:
 *       - in: path
 *         name: idCausa
 *         required: true
 *         description: ID de la causa para obtener sus soluciones
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listado de soluciones obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idSolucion:
 *                     type: integer
 *                     description: ID de la solución.
 *                     example: 1
 *                   descripcionSolucion:
 *                     type: string
 *                     description: Descripción de la solución.
 *                     example: "Reiniciar el servidor"
 *       500:
 *         description: Error interno al recuperar las soluciones.
 */
router.get('/findAll', 
    validatorErrorHandler(getSolucion, 'body'), // Validar los parámetros de la solicitud
    async (req, res, next) => {
    try {
        const body = req.body;
        const { statusCode, result } = await service.findAll(body);  // Llama al servicio para listar las soluciones
        return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
    } catch (error) {
        next(error);  // Si ocurre un error, pasa al manejador de errores
    }
});

/**
 * Ruta para crear una nueva solución
 * 
 * Esta ruta maneja las solicitudes POST para crear una nueva solución asociada a una causa.
 * 
 * @swagger
 * /soluciones:
 *   post:
 *     tags:
 *       - Soluciones
 *     summary: Crear una nueva solución
 *     description: Crea una nueva solución asociada a una causa específica.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSolucion'
 *     responses:
 *       201:
 *         description: Solución creada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       500:
 *         description: Error del servidor.
 */
router.post('/',
    validatorErrorHandler(createSolucion, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;  // Obtiene los datos del cuerpo de la solicitud
            const { statusCode, result } = await service.create(body);  // Llama al servicio para crear la solución
            return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
        } catch (error) {
            next(error);  // Si ocurre un error, pasa al manejador de errores
        }
    });

/**
 * Ruta para actualizar una solución existente
 * 
 * Esta ruta maneja las solicitudes PATCH para actualizar una solución existente.
 * 
 * @swagger
 * /soluciones/{id}:
 *   patch:
 *     tags:
 *       - Soluciones
 *     summary: Actualizar una solución
 *     description: Actualiza la descripción de una solución específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solución a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSolucion'
 *     responses:
 *       200:
 *         description: Solución actualizada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       500:
 *         description: Error del servidor.
 */
router.patch('/:id',
    jwtAuth, // Middleware de autenticación
    validatorErrorHandler(updateSolucion, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;  // Obtiene el ID de la solución desde los parámetros de la URL
            const body = req.body;  // Obtiene los datos del cuerpo de la solicitud
            const { statusCode, result } = await service.update(id, body);  // Llama al servicio para actualizar la solución
            return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
        } catch (error) {
            next(error);  // Si ocurre un error, pasa al manejador de errores
        }
    });

/**
 * Ruta para eliminar una solución
 * 
 * Esta ruta maneja las solicitudes DELETE para eliminar una solución existente.
 * 
 * @swagger
 * /soluciones/{id}:
 *   delete:
 *     tags:
 *       - Soluciones
 *     summary: Eliminar una solución
 *     description: Elimina una solución específica por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solución a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solución eliminada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       500:
 *         description: Error del servidor.
 */
router.delete('/:id',
    jwtAuth, // Middleware de autenticación
    validatorErrorHandler(deleteSolucion, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;  // Obtiene el ID de la solución desde los parámetros de la URL
            const { statusCode, result } = await service.delete(id);  // Llama al servicio para eliminar la solución
            return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
        } catch (error) {
            next(error);  // Si ocurre un error, pasa al manejador de errores
        }
    });

module.exports = router;