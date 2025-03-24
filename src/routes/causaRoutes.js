const express = require('express');  // Framework web Express
const RegistroCausasService = require('../services/causaService');  // Servicio para manejo de causas
const validatorErrorHandler = require('../middlewares/validatorErrorHandler');  // Middleware para validar datos
const { createCausa, updateCausa, deleteCausa, getCausa } = require('../schemas/causaSchema');  // Validaciones de esquema para causas
const jwtAuth = require('../middlewares/jwtAuth'); // Importar el middleware de autenticación

const router = express.Router();  // Router de Express para definir las rutas
const service = new RegistroCausasService();  // Instancia del servicio para el manejo de causas

/**
 * Ruta para obtener todas las causas.
 * 
 * Esta ruta maneja las solicitudes GET para recuperar todas las causas registradas en la base de datos.
 * Si ocurre un error durante la operación, se pasa al manejador de errores.
 * 
 * @swagger
 * /causas:
 *   get:
 *     tags:
 *      - Causas 
 *     summary: Obtener todas las causas
 *     description: Recupera todas las causas asociadas a un error.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetCausa'
 *     responses:
*       200:
*         description: Listado de causas obtenido correctamente.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   idCausa:
*                     type: integer
*                     description: ID de la causa.
*                     example: 2
*                   idError:
*                     type: integer
*                     description: ID del error asociado a la causa.
*                     example: 2
*                   descripcionCausa:
*                     type: string
*                     description: Descripción de la causa.
*                     example: "Archivo WSDL incorrecto o corrupto"
*                   soluciones:
*                     type: array
*                     items:
*                       type: object
*                       properties:
*                         idSolucion:
*                           type: integer
*                           description: ID de la solución.
*                           example: 2
*                         idCausa:
*                           type: integer
*                           description: ID de la causa asociada a la solución.
*                           example: 2
*                         descripcionSolucion:
*                           type: string
*                           description: Descripción de la solución propuesta.
*                           example: "Asegurarse de que el archivo WSDL sea el correcto y esté accesible"
*       400:
*         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor al intentar recuperar las causas.
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
 *                   example: "Error al ejecutar la consulta en la base de datos"
 */
router.get('/findAll', 
    validatorErrorHandler(getCausa, 'body'), // Validar los parámetros de la solicitud
    async (req, res, next) => {
    try {
        const body = req.body;
        const { statusCode, result } = await service.findAll(body);  // Llama al servicio para listar las causas

        return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
    } catch (error) {
        next(error);  // Si ocurre un error, pasa al manejador de errores
    }

});

/**
 * Ruta para crear una nueva causa
 * 
 * Esta ruta maneja las solicitudes POST para crear una nueva causa asociada a un error.
 * La validación se realiza mediante el middleware 'validatorErrorHandler' para asegurar
 * que los datos sean correctos antes de pasarlos al servicio.
 * 
 * @swagger
 * /causas:
 *   post:
 *     tags:
 *      - Causas
 *     summary: Crear una nueva causa
 *     description: Crea una nueva causa asociada a un error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCausa'
 *     responses:
 *       201:
 *         description: Causa creada correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error del servidor
 */
router.post('/',
    validatorErrorHandler(createCausa, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;  // Obtiene los datos del cuerpo de la solicitud
            const { statusCode, result } = await service.create(body);  // Llama al servicio para crear la causa

            return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
        } catch (error) {
            next(error);  // Si ocurre un error, pasa al manejador de errores
        }

    });

/**
 * Ruta para actualizar una causa existente
 * 
 * Esta ruta maneja las solicitudes PATCH para actualizar una causa existente.
 * La validación se realiza mediante el middleware 'validatorErrorHandler' para asegurar
 * que los datos sean correctos antes de pasarlos al servicio.
 * 
 * @swagger
 * /causas/{id}:
 *   patch:
 *     tags:
 *      - Causas
 *     summary: Actualizar una causa existente
 *     description: Actualiza la descripción de una causa específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la causa a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCausa'
 *     responses:
 *       200:
 *         description: Causa actualizada correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error del servidor
 */
router.patch('/',
    jwtAuth, // Middleware de autenticación
    // Middleware que valida el cuerpo de la solicitud según el esquema 'updateCausa'
    validatorErrorHandler(updateCausa, 'body'),
    async (req, res, next) => {
        try {
            // const { id } = req.params;  // Obtiene el ID de la causa desde los parámetros de la URL
            const body = req.body;  // Obtiene los datos del cuerpo de la solicitud
            const { statusCode, result } = await service.update(body);  // Llama al servicio para actualizar la causa

            return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
        } catch (error) {
            next(error);  // Si ocurre un error, pasa al manejador de errores
        }

    });

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        // Delegar la validación al servicio
        const { statusCode, result } = await service.update(id, body);

        // Devuelve la respuesta con el código de estado dinámico
        return res.status(statusCode).json(result);
    } catch (error) {

        next(error);
    }

});

/**
 * Ruta para eliminar una causa
 * 
 * Esta ruta maneja las solicitudes DELETE para eliminar una causa existente.
 * La validación se realiza mediante el middleware 'validatorErrorHandler' para asegurar
 * que el ID de la causa esté presente y sea válido antes de pasar al servicio.
 * 
 * @swagger
 * /causas/{id}:
 *   delete:
 *     tags:
 *      - Causas
 *     summary: Eliminar una causa
 *     description: Elimina una causa específica por su ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteCausa'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la causa a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Causa eliminada correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id',
    jwtAuth, // Middleware de autenticación
    // Middleware que valida el cuerpo de la solicitud según el esquema 'deleteCausa
    validatorErrorHandler(deleteCausa, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;  // Obtiene el ID de la causa desde los parámetros de la URL
            const { statusCode, result } = await service.delete(id);  // Llama al servicio para eliminar la causa

            return res.status(statusCode).json(result);  // Devuelve la respuesta con el estado correspondiente
        } catch (error) {
            next(error);  // Si ocurre un error, pasa al manejador de errores
        }

    });

module.exports = router;