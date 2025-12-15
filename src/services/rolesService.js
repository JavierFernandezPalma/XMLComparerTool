// services/rolesService.js - CON SEQUELIZE
const { Rol } = require('../db/models/rolesModel');

class rolesService {
  
  // Crear un nuevo rol
  async create({ nom_roll }) {
    const rol = await Rol.create({
      nom_roll
    });
    return rol;
  }

  // Obtener todos los roles
  async findAll() {
    const roles = await Rol.findAll({
      order: [['id_roll', 'ASC']]
    });
    return roles;
  }

  // Obtener un rol por ID
  async findById(id) {
    const rol = await Rol.findByPk(id);
    
    if (!rol) {
      throw new Error(`Rol con id ${id} no encontrado`);
    }
    
    return rol;
  }

  // Actualizar un rol por ID
  async update(id, { nom_roll }) {
    const rol = await Rol.findByPk(id);
    
    if (!rol) {
      throw new Error(`Rol con id ${id} no encontrado`);
    }

    await rol.update({ nom_roll });
    return rol;
  }

  // Eliminar un rol por ID
  async delete(id) {
    const rol = await Rol.findByPk(id);
    
    if (!rol) {
      throw new Error(`Rol con id ${id} no encontrado`);
    }

    await rol.destroy();
    return rol;
  }
}

module.exports = rolesService;