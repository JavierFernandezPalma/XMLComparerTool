// routes/usuariosRoutes.js
const express = require('express');
const usuariosService = require('../services/usuariosService');
const path = require('path');

// ✅ DIAGNÓSTICO DETALLADO
console.log('🔍 Cargando usuarioSchema...');
const schemaPath = path.join(__dirname, '..', 'schemas', 'usuarioSchema.js');
console.log('Ruta completa:', schemaPath);

try {
  // Intenta cargar el schema
  const usuarioSchema = require(schemaPath);
  console.log('✅ usuarioSchema cargado correctamente');
  console.log('Keys disponibles:', Object.keys(usuarioSchema));
  
  var {
    createUsuarioSchema,
    updateUsuarioSchema,
    idUsuarioSchema,
    idHabilidadSchema,
    createHabilidadSchema
  } = usuarioSchema;
  
} catch (error) {
  console.log('❌ ERROR cargando usuarioSchema:', error.message);
  // Si falla, crea schemas vacíos para evitar crash
  var createUsuarioSchema = null;
  var updateUsuarioSchema = null;
  var idUsuarioSchema = null;
  var idHabilidadSchema = null;
  var createHabilidadSchema = null;
}

const router = express.Router();
const service = new usuariosService();

// Función de validación con manejo de schemas faltantes
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    // Si el schema no está disponible, saltar validación
    if (!schema) {
      console.log('⚠️  Schema no disponible, saltando validación para:', property);
      return next();
    }
    
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

// =========================
// CRUD USUARIOS
// =========================

// Obtener todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const users = await service.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Obtener practicantes
router.get('/practicantes', async (req, res, next) => {
  try {
    const practicantes = await service.findPracticantes();
    res.json(practicantes);
  } catch (error) {
    next(error);
  }
});

// Obtener usuario por ID (con habilidades)
router.get('/:id',
  validateRequest(idUsuarioSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findById(id);
      res.json(user);
    } catch (error) {
      console.error('Error en GET /usuarios/:id:', error);
      next(error);
    }
  }
);

// Crear usuario
router.post('/',
  validateRequest(createUsuarioSchema),
  async (req, res, next) => {
    try {
      const newUser = await service.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error en POST /usuarios:', error);
      next(error);
    }
  }
);

// Actualizar usuario
router.patch('/:id',
  validateRequest(idUsuarioSchema, 'params'),
  validateRequest(updateUsuarioSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedUser = await service.update(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error en PATCH /usuarios/:id:', error);
      next(error);
    }
  }
);

// Eliminar usuario
router.delete('/:id',
  validateRequest(idUsuarioSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedUser = await service.delete(id);
      res.json(deletedUser);
    } catch (error) {
      console.error('Error en DELETE /usuarios/:id:', error);
      next(error);
    }
  }
);

// =========================
// CRUD HABILIDADES
// =========================

// Listar habilidades de un usuario
router.get('/:id/habilidades',
  validateRequest(idUsuarioSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const skills = await service.findSkillsByUser(id);
      res.json(skills);
    } catch (error) {
      console.error('Error en GET /usuarios/:id/habilidades:', error);
      next(error);
    }
  }
);

// Crear habilidad para un usuario
router.post('/:id/habilidades',
  validateRequest(idUsuarioSchema, 'params'),
  validateRequest(createHabilidadSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre_hab } = req.body;
      const newSkill = await service.addSkill(id, nombre_hab);
      res.status(201).json(newSkill);
    } catch (error) {
      console.error('Error en POST /usuarios/:id/habilidades:', error);
      next(error);
    }
  }
);

// Eliminar habilidad
router.delete('/habilidades/:skillId',
  validateRequest(idHabilidadSchema, 'params'),
  async (req, res, next) => {
    try {
      const { skillId } = req.params;
      const deletedSkill = await service.deleteSkill(skillId);
      res.json(deletedSkill);
    } catch (error) {
      console.error('Error en DELETE /usuarios/habilidades/:skillId:', error);
      next(error);
    }
  }
);

module.exports = router;