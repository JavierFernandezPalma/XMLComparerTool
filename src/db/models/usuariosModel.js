const { Model, DataTypes } = require('sequelize');
const { ROL_TABLE } = require('./rolesModel');

const USUARIO_TABLE = 'usuarios';

const UsuarioSchema = {
  id_usuario: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nom_usuario: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  id_roll: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ROL_TABLE,
      key: 'id_roll'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
};

class Usuario extends Model {
  static associate(models) {
    // Un usuario pertenece a un rol
    this.belongsTo(models.Rol, {
      as: 'rol',
      foreignKey: 'id_roll'
    });

    // Un usuario puede tener muchas habilidades
    this.hasMany(models.Habilidad, {
      as: 'habilidades',
      foreignKey: 'id_usuario'
    });

    // Un usuario puede tener muchas tareas como practicante
    this.hasMany(models.Tarea, {
      as: 'tareasPracticante',
      foreignKey: 'id_usuario_practicante'
    });

    // Un usuario puede tener muchas tareas como asignador
    this.hasMany(models.Tarea, {
      as: 'tareasAsignador',
      foreignKey: 'id_usuario_asignador'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USUARIO_TABLE,
      modelName: 'Usuario',
      timestamps: false
    };
  }
}

module.exports = { USUARIO_TABLE, UsuarioSchema, Usuario };
