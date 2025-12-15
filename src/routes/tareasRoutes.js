// routes/tareasRoutes.js
const express = require('express');
const TareasServices = require('../services/tareasServices');
const {
  createTareaSchema,
  idTareaSchema,
  idPracticanteSchema,
  updateEstadoTareaSchema
} = require('../schemas/tareaSchema');

const router = express.Router();
const service = new TareasServices();

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

// Crear tarea
router.post('/',
  validateRequest(createTareaSchema),
  async (req, res, next) => {
    try {
      const tarea = await service.create(req.body);
      res.status(201).json(tarea);
    } catch (error) {
      next(error);
    }
  }
);

// Listar todas las tareas
router.get('/', async (req, res, next) => {
  try {
    const tareas = await service.findAll();
    res.json(tareas);
  } catch (error) {
    next(error);
  }
});

// Listar tareas de un practicante
router.get('/practicante/:id',
  validateRequest(idPracticanteSchema, 'params'),
  async (req, res, next) => {
    try {
      const tareas = await service.findByPracticante(req.params.id);
      res.json(tareas);
    } catch (error) {
      next(error);
    }
  }
);

// Cambiar estado de una tarea
router.patch('/:id/estado',
  validateRequest(idTareaSchema, 'params'),
  validateRequest(updateEstadoTareaSchema),
  async (req, res, next) => {
    try {
      const { id_estado } = req.body;
      const tarea = await service.updateEstado(req.params.id, id_estado);
      res.json(tarea);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar tarea
router.delete('/:id',
  validateRequest(idTareaSchema, 'params'),
  async (req, res, next) => {
    try {
      const tarea = await service.delete(req.params.id);
      res.json(tarea);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;