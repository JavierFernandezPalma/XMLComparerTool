// services/estadoTareasServices.js - CON SEQUELIZE
const { EstadoTarea } = require('../db/models/estadoTareasModel');

class EstadoTareasServices {
  
  // Crear un estado
  async create({ estado_tarea }) {
    const estado = await EstadoTarea.create({
      estado_tarea
    });
    return estado;
  }

  // Obtener todos los estados
  async findAll() {
    const estados = await EstadoTarea.findAll({
      order: [['id_estado_tarea', 'ASC']]
    });
    return estados;
  }

  // Obtener estado por ID
  async findById(id) {
    const estado = await EstadoTarea.findByPk(id);
    
    if (!estado) {
      throw new Error(`Estado con id ${id} no encontrado`);
    }
    
    return estado;
  }

  // Actualizar estado
  async update(id, { estado_tarea }) {
    const estado = await EstadoTarea.findByPk(id);
    
    if (!estado) {
      throw new Error(`Estado con id ${id} no encontrado`);
    }

    await estado.update({ estado_tarea });
    return estado;
  }

  // Eliminar estado
  async delete(id) {
    const estado = await EstadoTarea.findByPk(id);
    
    if (!estado) {
      throw new Error(`Estado con id ${id} no encontrado`);
    }

    await estado.destroy();
    return estado;
  }
}

module.exports = EstadoTareasServices;