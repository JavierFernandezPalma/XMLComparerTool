const { Model, DataTypes } = require('sequelize');
const { TAREA_TABLE } = require('./tareasModel');
const { ESTADO_TAREA_TABLE } = require('./estadoTareasModel');

const ACTIVIDAD_TABLE = 'actividades';

const ActividadSchema = {
  id_actividad: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  id_tarea: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: TAREA_TABLE,
      key: 'id_tarea'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  descripcion: { // CAMBIÉ nom_actividad por descripcion
    allowNull: false,
    type: DataTypes.STRING
  },
  id_estado_tarea: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 1, // VALOR POR DEFECTO
    references: {
      model: ESTADO_TAREA_TABLE,
      key: 'id_estado_tarea'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
  // ELIMINÉ fecha_ini y fecha_fin porque no se usan en tu servicio
};

class Actividad extends Model {
  static associate(models) {
    this.belongsTo(models.Tarea, {
      as: 'tarea',
      foreignKey: 'id_tarea'
    });

    this.belongsTo(models.EstadoTarea, {
      as: 'estado',
      foreignKey: 'id_estado_tarea'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ACTIVIDAD_TABLE,
      modelName: 'Actividad',
      timestamps: false
    };
  }
}

module.exports = { ACTIVIDAD_TABLE, ActividadSchema, Actividad };