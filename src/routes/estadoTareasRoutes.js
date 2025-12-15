// routes/estadoTareasRoutes.js
const express = require('express');
const EstadoTareasServices = require('../services/estadoTareasServices');
const {
  createEstadoTareaSchema,
  idEstadoSchema,
  updateEstadoTareaSchema
} = require('../schemas/estadoTareaSchema');

const router = express.Router();
const service = new EstadoTareasServices();

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

// Obtener todos los estados
router.get('/', async (req, res, next) => {
  try {
    const estados = await service.findAll();
    res.json(estados);
  } catch (error) {
    next(error);
  }
});

// Obtener estado por ID
router.get('/:id',
  validateRequest(idEstadoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const estado = await service.findById(id);
      res.json(estado);
    } catch (error) {
      next(error);
    }
  }
);

// Crear estado
router.post('/',
  validateRequest(createEstadoTareaSchema),
  async (req, res, next) => {
    try {
      const newEstado = await service.create(req.body);
      res.status(201).json(newEstado);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar estado
router.patch('/:id',
  validateRequest(idEstadoSchema, 'params'),
  validateRequest(updateEstadoTareaSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedEstado = await service.update(id, req.body);
      res.json(updatedEstado);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar estado
router.delete('/:id',
  validateRequest(idEstadoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedEstado = await service.delete(id);
      res.json(deletedEstado);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;