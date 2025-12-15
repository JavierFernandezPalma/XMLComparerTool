// services/tareasServices.js - CON SEQUELIZE
const { Tarea } = require('../db/models/tareasModel');
const { Usuario } = require('../db/models/usuariosModel');
const { EstadoTarea } = require('../db/models/estadoTareasModel');

class TareasServices {
  
  // Crear una nueva tarea
  async create({ nom_tarea, id_usuario_practicante, fecha_ini, fecha_fin, id_usuario_asignador }) {
    const tarea = await Tarea.create({
      nom_tarea,
      id_usuario_practicante,
      fecha_ini,
      fecha_fin,
      id_usuario_asignador,
      id_estado_tarea: 1 // Valor por defecto como en PostgreSQL
    });
    return tarea;
  }

  // Obtener todas las tareas
  async findAll() {
    const tareas = await Tarea.findAll({
      include: [
        {
          model: Usuario,
          as: 'practicante',
          attributes: ['nom_usuario']
        },
        {
          model: Usuario,
          as: 'asignador',
          attributes: ['nom_usuario']
        },
        {
          model: EstadoTarea,
          as: 'estado',
          attributes: ['estado_tarea']
        }
      ],
      order: [['fecha_ini', 'DESC']],
      raw: true,
      nest: true
    });

    // Mapear el resultado para que coincida con tu estructura original
    return tareas.map(tarea => ({
      ...tarea,
      practicante: tarea.practicante?.nom_usuario,
      asignador: tarea.asignador?.nom_usuario,
      nom_estado: tarea.estado?.estado_tarea
    }));
  }

  // Obtener tareas por practicante
  async findByPracticante(id_usuario) {
    const tareas = await Tarea.findAll({
      where: { id_usuario_practicante: id_usuario },
      include: [
        {
          model: Usuario,
          as: 'asignador',
          attributes: ['nom_usuario']
        },
        {
          model: EstadoTarea,
          as: 'estado',
          attributes: ['estado_tarea']
        }
      ],
      order: [['fecha_ini', 'DESC']],
      raw: true,
      nest: true
    });

    // Mapear el resultado para que coincida con tu estructura original
    return tareas.map(tarea => ({
      ...tarea,
      asignador: tarea.asignador?.nom_usuario,
      nom_estado: tarea.estado?.estado_tarea
    }));
  }

  // Cambiar estado de una tarea
  async updateEstado(id_tarea, id_estado) {
    const tarea = await Tarea.findByPk(id_tarea);
    
    if (!tarea) {
      throw new Error(`Tarea con id ${id_tarea} no encontrada`);
    }

    await tarea.update({ id_estado_tarea: id_estado });
    return tarea;
  }

  // Eliminar tarea
  async delete(id_tarea) {
    const tarea = await Tarea.findByPk(id_tarea);
    
    if (!tarea) {
      throw new Error(`Tarea con id ${id_tarea} no encontrada`);
    }

    await tarea.destroy();
    return tarea;
  }
}

module.exports = TareasServices;