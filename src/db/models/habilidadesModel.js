const { Model, DataTypes } = require('sequelize');
const { USUARIO_TABLE } = require('./usuariosModel');

const HABILIDAD_TABLE = 'habilidades';

const HabilidadSchema = {
  id_habilidad: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre_hab: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  id_usuario: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USUARIO_TABLE,
      key: 'id_usuario'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
};

class Habilidad extends Model {
  static associate(models) {
    // Una habilidad pertenece a un usuario
    this.belongsTo(models.Usuario, {
      as: 'usuario',
      foreignKey: 'id_usuario'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: HABILIDAD_TABLE,
      modelName: 'Habilidad',
      timestamps: false
    };
  }
}

module.exports = { HABILIDAD_TABLE, HabilidadSchema, Habilidad };
