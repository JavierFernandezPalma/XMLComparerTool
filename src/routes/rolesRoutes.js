// routes/rolesRouter.js
const express = require('express');
const rolesService = require('../services/rolesService');
const {
  createRolSchema,
  idRolSchema,
  updateRolSchema
} = require('../schemas/rolSchema');

const router = express.Router();
const service = new rolesService();

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

// Obtener todos los roles
router.get('/', async (req, res, next) => {
  try {
    const roles = await service.findAll();
    res.json(roles);
  } catch (error) {
    next(error);
  }
});

// Obtener rol por ID
router.get('/:id',
  validateRequest(idRolSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const role = await service.findById(id);
      res.json(role);
    } catch (error) {
      next(error);
    }
  }
);

// Crear rol
router.post('/',
  validateRequest(createRolSchema),
  async (req, res, next) => {
    try {
      const newRole = await service.create(req.body);
      res.status(201).json(newRole);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar rol
router.patch('/:id',
  validateRequest(idRolSchema, 'params'),
  validateRequest(updateRolSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedRole = await service.update(id, req.body);
      res.json(updatedRole);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar rol
router.delete('/:id',
  validateRequest(idRolSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedRole = await service.delete(id);
      res.json(deletedRole);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;