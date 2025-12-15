// routes/actividadesRoutes.js
const express = require('express');
const ActividadesServices = require('../services/actividadesServices');
const path = require('path');

// ✅ USA RUTA ABSOLUTA
const schemaPath = path.join(__dirname, '..', 'schemas', 'actividadSchema');
const {
  createActividadSchema,
  idActividadSchema,
  idTareaSchema,
  updateEstadoSchema,
  updateDescripcionSchema
} = require(schemaPath);

const router = express.Router();
const service = new ActividadesServices();

// ✅ DEBUG PARA VERIFICAR
console.log('🔍 En actividadesRoutes - Schemas cargados:');
console.log('   createActividadSchema:', !!createActividadSchema);
console.log('   idTareaSchema:', !!idTareaSchema);
console.log('   idActividadSchema:', !!idActividadSchema);

// Función de validación
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

// Crear actividad - CON VALIDACIÓN
router.post('/',
  validateRequest(createActividadSchema),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, creando actividad...');
      const actividad = await service.create(req.body);
      res.status(201).json(actividad);
    } catch (error) {
      console.error('Error en POST /actividades:', error);
      next(error);
    }
  }
);

// Obtener todas las actividades de una tarea - CON VALIDACIÓN
router.get('/tarea/:id_tarea',
  validateRequest(idTareaSchema, 'params'),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, buscando actividades...');
      const actividades = await service.findByTarea(req.params.id_tarea);
      res.json(actividades);
    } catch (error) {
      console.error('Error en GET /actividades/tarea/:id_tarea:', error);
      next(error);
    }
  }
);

// Obtener actividad por ID - CON VALIDACIÓN
router.get('/:id',
  validateRequest(idActividadSchema, 'params'),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, buscando actividad...');
      const actividad = await service.findById(req.params.id);
      res.json(actividad);
    } catch (error) {
      console.error('Error en GET /actividades/:id:', error);
      next(error);
    }
  }
);

// Cambiar estado de una actividad - CON VALIDACIÓN
router.patch('/:id/estado',
  validateRequest(idActividadSchema, 'params'),
  validateRequest(updateEstadoSchema),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, actualizando estado...');
      const { id_estado } = req.body;
      const actividad = await service.updateEstado(req.params.id, id_estado);
      res.json(actividad);
    } catch (error) {
      console.error('Error en PATCH /actividades/:id/estado:', error);
      next(error);
    }
  }
);

// Actualizar descripción de una actividad - CON VALIDACIÓN
router.patch('/:id/descripcion',
  validateRequest(idActividadSchema, 'params'),
  validateRequest(updateDescripcionSchema),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, actualizando descripción...');
      const { descripcion } = req.body;
      const actividad = await service.updateDescripcion(req.params.id, descripcion);
      res.json(actividad);
    } catch (error) {
      console.error('Error en PATCH /actividades/:id/descripcion:', error);
      next(error);
    }
  }
);

// Eliminar actividad - CON VALIDACIÓN
router.delete('/:id',
  validateRequest(idActividadSchema, 'params'),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, eliminando actividad...');
      const actividad = await service.delete(req.params.id);
      res.json(actividad);
    } catch (error) {
      console.error('Error en DELETE /actividades/:id:', error);
      next(error);
    }
  }
);

// Eliminar todas las actividades de una tarea - CON VALIDACIÓN
router.delete('/tarea/:id_tarea',
  validateRequest(idTareaSchema, 'params'),
  async (req, res, next) => {
    try {
      console.log('✅ Validación exitosa, eliminando actividades...');
      const actividades = await service.deleteByTarea(req.params.id_tarea);
      res.json(actividades);
    } catch (error) {
      console.error('Error en DELETE /actividades/tarea/:id_tarea:', error);
      next(error);
    }
  }
);

module.exports = router;