// services/usuariosService.js - CON SEQUELIZE
const { Usuario } = require('../db/models/usuariosModel');
const { Rol } = require('../db/models/rolesModel');
const { Habilidad } = require('../db/models/habilidadesModel');


class usuariosService {
  
  // Obtener todos los usuarios con su rol
  async findAll() {
    const usuarios = await Usuario.findAll({
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['nom_roll']
      }],
      order: [['id_usuario', 'ASC']],
      raw: true,
      nest: true
    });

    // Mapear el resultado para que coincida con tu estructura original
    return usuarios.map(usuario => ({
      id_usuario: usuario.id_usuario,
      nom_usuario: usuario.nom_usuario,
      id_roll: usuario.id_roll,
      nom_roll: usuario.rol?.nom_roll
    }));
  }

  // Obtener practicantes
  async findPracticantes() {
    const usuarios = await Usuario.findAll({
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['nom_roll'],
        where: {
          nom_roll: {
            [Sequelize.Op.iLike]: '%practicante%'
          }
        }
      }],
      order: [['nom_usuario', 'ASC']],
      raw: true,
      nest: true
    });

    // Mapear el resultado para que coincida con tu estructura original
    return usuarios.map(usuario => ({
      id_usuario: usuario.id_usuario,
      nom_usuario: usuario.nom_usuario,
      id_roll: usuario.id_roll,
      nom_roll: usuario.rol?.nom_roll
    }));
  }

  // Buscar un usuario por ID (con sus habilidades y rol)
  async findById(id) {
    try {
      const usuario = await Usuario.findOne({
        where: { id_usuario: id },
        include: [{
          model: Rol,
          as: 'rol',
          attributes: ['nom_roll']
        }],
        raw: true,
        nest: true
      });

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Obtener habilidades con try-catch por si falla
      let habilidades = [];
      try {
        habilidades = await Habilidad.findAll({
          where: { id_usuario: id },
          attributes: ['id_habilidad', 'nombre_hab'],
          order: [['id_habilidad', 'ASC']],
          raw: true
        });
      } catch (error) {
        console.log('No se pudieron cargar las habilidades, usando array vacío');
        // Continuamos con habilidades vacías en lugar de fallar
      }

      return { 
        id_usuario: usuario.id_usuario,
        nom_usuario: usuario.nom_usuario,
        id_roll: usuario.id_roll,
        nom_roll: usuario.rol?.nom_roll,
        habilidades: habilidades 
      };
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  // Crear usuario
  async create(data) {
    const { nom_usuario, id_roll } = data;
    const usuario = await Usuario.create({
      nom_usuario,
      id_roll
    });
    return usuario;
  }

  // Actualizar usuario
  async update(id, data) {
    const { nom_usuario, id_roll } = data;
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.update({ nom_usuario, id_roll });
    return usuario;
  }

  // Eliminar usuario
  async delete(id) {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.destroy();
    return usuario;
  }

  // =======================
  // SECCIÓN DE HABILIDADES
  // =======================

  // Obtener habilidades de un usuario
  async findSkillsByUser(userId) {
    const habilidades = await Habilidad.findAll({
      where: { id_usuario: userId },
      attributes: ['id_habilidad', 'nombre_hab'],
      order: [['id_habilidad', 'ASC']]
    });
    return habilidades;
  }

  // Crear habilidad para un usuario
  async addSkill(userId, nombre_hab) {
    const habilidad = await Habilidad.create({
      id_usuario: userId,
      nombre_hab
    });
    return habilidad;
  }

  // Eliminar habilidad
  async deleteSkill(id) {
    const habilidad = await Habilidad.findByPk(id);
    
    if (!habilidad) {
      throw new Error('Habilidad no encontrada');
    }

    await habilidad.destroy();
    return habilidad;
  }
}

module.exports = usuariosService;