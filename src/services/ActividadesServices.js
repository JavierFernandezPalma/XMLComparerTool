// services/actividadesServices.js - CON SEQUELIZE

const { Actividad } = require('../db/models/actividadesModel');
const { EstadoTarea } = require('../db/models/estadoTareasModel');
const { Tarea } = require('../db/models/tareasModel');

class ActividadesServices {

  // Crear una nueva actividad
  async create({ id_tarea, descripcion, id_estado_tarea = 1 }) {
    const actividad = await Actividad.create({
      id_tarea,
      descripcion,
      id_estado_tarea
    });
    return actividad;
  }

  // Obtener todas las actividades de una tarea
  async findByTarea(id_tarea) {
    const actividades = await Actividad.findAll({
      where: { id_tarea },
      include: [{
        model: EstadoTarea,
        as: 'estado',
        attributes: ['estado_tarea']
      }],
      order: [['id_actividad', 'ASC']],
      raw: true,
      nest: true
    });

    // Mapear el resultado para que coincida con tu estructura original
    return actividades.map(actividad => ({
      ...actividad,
      nom_estado: actividad.estado?.estado_tarea
    }));
  }

  // Obtener actividad por ID
  async findById(id_actividad) {
    const actividad = await Actividad.findOne({
      where: { id_actividad },
      include: [
        {
          model: EstadoTarea,
          as: 'estado',
          attributes: ['estado_tarea']
        },
        {
          model: Tarea,
          as: 'tarea',
          attributes: ['nom_tarea']
        }
      ],
      raw: true,
      nest: true
    });

    if (!actividad) {
      throw new Error(`Actividad con id ${id_actividad} no encontrada`);
    }

    // Formatear el resultado para que coincida con tu estructura
    return {
      ...actividad,
      nom_estado: actividad.estado?.estado_tarea,
      nom_tarea: actividad.tarea?.nom_tarea
    };
  }

  // Cambiar estado de una actividad
  async updateEstado(id_actividad, id_estado) {
    const actividad = await Actividad.findByPk(id_actividad);

    if (!actividad) {
      throw new Error(`Actividad con id ${id_actividad} no encontrada`);
    }

    await actividad.update({ id_estado_tarea: id_estado });
    return actividad;
  }

  // Actualizar descripción de una actividad
  async updateDescripcion(id_actividad, descripcion) {
    const actividad = await Actividad.findByPk(id_actividad);

    if (!actividad) {
      throw new Error(`Actividad con id ${id_actividad} no encontrada`);
    }

    await actividad.update({ descripcion });
    return actividad;
  }

  // Eliminar actividad
  async delete(id_actividad) {
    const actividad = await Actividad.findByPk(id_actividad);

    if (!actividad) {
      throw new Error(`Actividad con id ${id_actividad} no encontrada`);
    }

    await actividad.destroy();
    return actividad;
  }

  // Eliminar todas las actividades de una tarea
  async deleteByTarea(id_tarea) {
    const actividades = await Actividad.findAll({
      where: { id_tarea }
    });

    if (actividades.length > 0) {
      await Actividad.destroy({
        where: { id_tarea }
      });
    }

    return actividades;
  }
}

module.exports = ActividadesServices;