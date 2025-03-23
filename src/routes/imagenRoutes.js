const express = require('express'); // Importar el módulo Express
const ImagenService = require('../services/imagenService'); // Servicio para manejar los logs de errores
const validatorErrorHandler = require('../middlewares/validatorErrorHandler'); // Middleware para validación de datos
const { createImagen, updateImagen, getImagen, deleteImagen } = require('../schemas/imagenSchema'); // Esquemas de validación
const jwtAuth = require('../middlewares/jwtAuth'); // Importar el middleware de autenticación

const router = express.Router(); // Crear el router de Express
const service = new ImagenService(); // Instancia del servicio para manejar los errores

/**
 * Ruta para obtener todos los logs de error
 * @swagger
 * /errors:
 *   get:
 *     tags:
 *      - Errores
 *     summary: Obtener todos los logs de errores
 *     description: Recupera todos los logs de errores registrados en la base de datos.
 *     responses:
 *       200:
 *         description: Listado de logs de errores obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GetErrorLog'
 *       500:
 *         description: Error interno al intentar obtener los logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los logs de error"
 */
router.get('/', 
    // jwtAuth, // Middleware de autenticación
    validatorErrorHandler(getImagen, 'query'), // Validar los parámetros de la solicitud
    async (req, res, next) => {
    try {
        // Delegar la validación al servicio
        const { statusCode, result } = await service.findAll(req.query);

        // Devuelve la respuesta con el código de estado dinámico
        return res.status(statusCode).json(result);
    } catch (error) {
        next(error); // Si ocurre un error, pasar al manejador de errores
    }
});

/**
 * Ruta para obtener un log de error específico
 * @swagger
 * /errors/findAll:
 *   get:
 *     tags:
 *      - Errores
 *     summary: Obtener todos los logs de errores según descripción del error
 *     description: Recupera todos los logs de errores registrados en la base de datos según la descripción.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetErrorLog'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetErrorLog/responses/200'
 *       400:
 *         $ref: '#/components/responses/GetErrorLog/responses/400'
 *       500:
 *         $ref: '#/components/responses/GetErrorLog/responses/500'
 */
router.get('/findAll',
    validatorErrorHandler(getImagen, 'query'), // Validar los parámetros de la solicitud
    async (req, res, next) => {
        try {
            const { descripcionError } = req.query; // Obtener el ID de los parámetros
            const body = req.body;
            const { statusCode, result } = await service.find(descripcionError); // Delegar la validación al servicio

            return res.status(statusCode).json(statusCode, result); // Devolver la respuesta con el resultado
        } catch (error) {
            next(error); // Si ocurre un error, pasar al manejador de errores
        }
    });

/**
 * Ruta para crear un nuevo log de error
 * @swagger
 * /errors:
 *   post:
 *     tags:
 *      - Errores
 *     summary: Crear un nuevo log de error
 *     description: Crea un nuevo registro de error en la base de datos, junto con sus causas y soluciones si existen.
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateErrorLog'
 *     responses:
 *       201:
 *         description: Log de error creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idError:
 *                   type: integer
 *       400:
 *         description: Error en la solicitud debido a datos inválidos o faltantes. Los siguientes campos son requeridos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 message:
 *                   type: string
 *                   example: "\"idProceso\" is required (integer, 1-9). \"idComponente\" is required (integer, 1-9). \"descripcionError\" is required (string, min 3 characters - max 45 characters). \"causas\" is required (array with at least one object)."
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 */
router.post('/',
    validatorErrorHandler(createImagen, 'body'), // Validar el cuerpo de la solicitud
    async (req, res, next) => {
        try {
            const body = req.body; // Obtener el cuerpo de la solicitud
            const { statusCode, result } = await service.create(body); // Llamar al servicio para crear el log de error
            return res.status(statusCode).json(result); // Devolver la respuesta con el resultado
        } catch (error) {
            next(error); // Si ocurre un error, pasar al manejador de errores
        }
    });

/**
 * Ruta para actualizar un log de error
 * @swagger
 * /errors/{id}:
 *   patch:
 *     tags:
 *      - Errores
 *     summary: Actualizar un log de error existente
 *     description: Actualiza la información de un log de error existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del log de error a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateErrorLog'
 *     responses:
 *       200:
 *         description: Log de error actualizado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error del servidor
 */
router.patch('/',
    validatorErrorHandler(updateImagen, 'body'), // Validar el cuerpo de la solicitud
    async (req, res, next) => {
        try {
            const body = req.body; // Obtener los datos del cuerpo de la solicitud
            const { statusCode, result } = await service.update(body); // Llamar al servicio para actualizar el log de error

            return res.status(statusCode).json(result); // Devolver la respuesta con el resultado
        } catch (error) {
            next(error); // Si ocurre un error, pasar al manejador de errores
        }
    });

/**
 * Ruta para eliminar un log de error
 * @swagger
 * /errors/{id}:
 *   delete:
 *     tags:
 *      - Errores
 *     summary: Eliminar un log de error
 *     description: Elimina un log de error existente por su ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteErrorLog'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteErrorLog/responses/200'
 *       400:
 *         $ref: '#/components/responses/DeleteErrorLog/responses/400'
 *       500:
 *         $ref: '#/components/responses/DeleteErrorLog/responses/500'
 */
router.delete('/',
    validatorErrorHandler(deleteImagen, 'body'), // Validar los datos para eliminar el log de error
    async (req, res, next) => {
        try {
            const body = req.body; // Obtener el ID del log de error desde el cuerpo de la solicitud
            const { statusCode, result } = await service.delete(body); // Llamar al servicio para eliminar el log de error

            return res.status(statusCode).json(result); // Devolver la respuesta con el resultado
        } catch (error) {
            next(error); // Si ocurre un error, pasar al manejador de errores
        }
    });

module.exports = router;