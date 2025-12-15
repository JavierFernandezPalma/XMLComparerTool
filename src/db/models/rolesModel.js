const { Model, DataTypes } = require('sequelize');

const ROL_TABLE = 'roles';

const RolSchema = {
  id_roll: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nom_roll: {
    allowNull: false,
    type: DataTypes.STRING(100)
  }
};

class Rol extends Model {
  static associate(models) {
    // Un rol tiene muchos usuarios
    this.hasMany(models.Usuario, {
      as: 'usuarios',
      foreignKey: 'id_roll'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROL_TABLE,
      modelName: 'Rol',
      timestamps: false
    };
  }
}

module.exports = { ROL_TABLE, RolSchema, Rol };
