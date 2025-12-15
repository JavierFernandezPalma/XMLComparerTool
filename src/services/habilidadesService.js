// services/habilidadesService.js - CON SEQUELIZE
const { Habilidad } = require('../db/models/habilidadesModel');
const { Usuario } = require('../db/models/usuariosModel');

class habilidadesService {
  
  // Crear habilidad para un usuario
  async create({ id_usuario, nombre_hab }) {
    const habilidad = await Habilidad.create({
      id_usuario,
      nombre_hab
    });
    return habilidad;
  }

  // Listar todas las habilidades
  async findAll() {
    const habilidades = await Habilidad.findAll({
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['nom_usuario']
      }],
      order: [['id_habilidad', 'DESC']],
      raw: true,
      nest: true
    });

    // Mapear el resultado para que coincida con tu estructura original
    return habilidades.map(habilidad => ({
      ...habilidad,
      nom_usuario: habilidad.usuario?.nom_usuario
    }));
  }

  // Listar habilidades por usuario
  async findByUsuario(id_usuario) {
    const habilidades = await Habilidad.findAll({
      where: { id_usuario },
      order: [['id_habilidad', 'DESC']]
    });
    return habilidades;
  }

  // Editar habilidad
  async update(id_habilidad, { nombre_hab }) {
    const habilidad = await Habilidad.findByPk(id_habilidad);
    
    if (!habilidad) {
      throw new Error(`Habilidad con id ${id_habilidad} no encontrada`);
    }

    await habilidad.update({ nombre_hab });
    return habilidad;
  }

  // Eliminar habilidad
  async delete(id_habilidad) {
    const habilidad = await Habilidad.findByPk(id_habilidad);
    
    if (!habilidad) {
      throw new Error(`Habilidad con id ${id_habilidad} no encontrada`);
    }

    await habilidad.destroy();
    return habilidad;
  }
}

module.exports = habilidadesService;