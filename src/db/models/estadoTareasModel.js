// src/db/models/estadoTareasModel.js
const { Model, DataTypes } = require('sequelize');

const ESTADO_TAREA_TABLE = 'estado_tareas';

const EstadoTareaSchema = {
  id_estado_tarea: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  estado_tarea: {
    allowNull: false,
    type: DataTypes.STRING(100)
  }
};

class EstadoTarea extends Model {
  static associate(models) {
    this.hasMany(models.Tarea, {
      as: 'tareas',
      foreignKey: 'id_estado_tarea'
    });

    this.hasMany(models.Actividad, {
      as: 'actividades',
      foreignKey: 'id_estado_tarea'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ESTADO_TAREA_TABLE,
      modelName: 'EstadoTarea',
      timestamps: false
    };
  }
}

// Asegúrate de que esta exportación sea correcta
module.exports = { ESTADO_TAREA_TABLE, EstadoTareaSchema, EstadoTarea };