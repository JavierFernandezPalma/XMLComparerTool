// routes/habilidadesRouter.js
const express = require('express');
const habilidadesService = require('../services/habilidadesService');
const {
  createHabilidadSchema,
  idHabilidadSchema,
  idUsuarioSchema,
  updateHabilidadSchema
} = require('../schemas/habilidadSchema');

const router = express.Router();
const service = new habilidadesService();

/**
 * @swagger
 * tags:
 *   name: Habilidades
 *   description: Endpoints para gestionar habilidades de los usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Habilidad:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         nombre:
 *           type: string
 *         nivel:
 *           type: string
 *       example:
 *         id: 1
 *         id_usuario: 12
 *         nombre: "JavaScript"
 *         nivel: "Avanzado"
 * 
 *     CrearHabilidad:
 *       type: object
 *       required:
 *         - id_usuario
 *         - nombre
 *         - nivel
 *       properties:
 *         id_usuario:
 *           type: integer
 *         nombre:
 *           type: string
 *         nivel:
 *           type: string
 *       example:
 *         id_usuario: 12
 *         nombre: "Node.js"
 *         nivel: "Intermedio"
 * 
 *     ActualizarHabilidad:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         nivel:
 *           type: string
 *       example:
 *         nombre: "React"
 *         nivel: "Avanzado"
 */

// Función de validación inline
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property]);
    if (error) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: error.details.map(detail => detail.message)
      });
    }
    req[property] = value;
    next();
  };
};

/**
 * @swagger
 * /habilidades:
 *   post:
 *     summary: Crear una nueva habilidad
 *     tags: [Habilidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearHabilidad'
 *     responses:
 *       201:
 *         description: Habilidad creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habilidad'
 */
router.post('/',
  validateRequest(createHabilidadSchema),
  async (req, res, next) => {
    try {
      const habilidad = await service.create(req.body);
      res.status(201).json(habilidad);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /habilidades:
 *   get:
 *     summary: Obtener todas las habilidades
 *     tags: [Habilidades]
 *     responses:
 *       200:
 *         description: Lista de habilidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habilidad'
 */
router.get('/', async (req, res, next) => {
  try {
    const habilidades = await service.findAll();
    res.json(habilidades);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /habilidades/usuario/{id}:
 *   get:
 *     summary: Obtener habilidades por ID de usuario
 *     tags: [Habilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de habilidades del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habilidad'
 */
router.get('/usuario/:id',
  validateRequest(idUsuarioSchema, 'params'),
  async (req, res, next) => {
    try {
      const habilidades = await service.findByUsuario(req.params.id);
      res.json(habilidades);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /habilidades/{id}:
 *   put:
 *     summary: Actualizar una habilidad
 *     tags: [Habilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la habilidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarHabilidad'
 *     responses:
 *       200:
 *         description: Habilidad actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habilidad'
 */
router.put('/:id',
  validateRequest(idHabilidadSchema, 'params'),
  validateRequest(updateHabilidadSchema),
  async (req, res, next) => {
    try {
      const habilidad = await service.update(req.params.id, req.body);
      res.json(habilidad);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /habilidades/{id}:
 *   delete:
 *     summary: Eliminar una habilidad
 *     tags: [Habilidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la habilidad
 *     responses:
 *       200:
 *         description: Habilidad eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habilidad'
 */
router.delete('/:id',
  validateRequest(idHabilidadSchema, 'params'),
  async (req, res, next) => {
    try {
      const habilidad = await service.delete(req.params.id);
      res.json(habilidad);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
