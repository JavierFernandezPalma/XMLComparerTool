const { Model, DataTypes } = require('sequelize');
const { USUARIO_TABLE } = require('./usuariosModel');
const { ESTADO_TAREA_TABLE } = require('./estadoTareasModel');

const TAREA_TABLE = 'tareas';

const TareaSchema = {
  id_tarea: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nom_tarea: {
    allowNull: false,
    type: DataTypes.STRING(150)
  },
  id_usuario_practicante: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USUARIO_TABLE,
      key: 'id_usuario'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  id_usuario_asignador: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USUARIO_TABLE,
      key: 'id_usuario'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  fecha_ini: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fecha_fin: {
    allowNull: false,
    type: DataTypes.DATE
  },
  id_estado_tarea: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ESTADO_TAREA_TABLE,
      key: 'id_estado_tarea'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
};

class Tarea extends Model {
  static associate(models) {
    // Relaciones con usuarios
    this.belongsTo(models.Usuario, {
      as: 'practicante',
      foreignKey: 'id_usuario_practicante'
    });

    this.belongsTo(models.Usuario, {
      as: 'asignador',
      foreignKey: 'id_usuario_asignador'
    });

    // Relación con estado de tarea
    this.belongsTo(models.EstadoTarea, {
      as: 'estado',
      foreignKey: 'id_estado_tarea'
    });

    // Relación con actividades
    this.hasMany(models.Actividad, {
      as: 'actividades',
      foreignKey: 'id_tarea'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TAREA_TABLE,
      modelName: 'Tarea',
      timestamps: false
    };
  }
}

module.exports = { TAREA_TABLE, TareaSchema, Tarea };
