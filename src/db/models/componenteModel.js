const { Model, DataTypes, Sequelize } = require('sequelize');

const COMPONENTE_TABLE = 'componentes';

const ComponenteSchema = {
    idComponente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'id_componente',  // Nombre de la columna en la base de datos
    },
    nombreComponente: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'nombre_componente',  // Nombre de la columna en la base de datos
    },
    descripcionComponente: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'descripcion',  // Nombre de la columna en la base de datos
    }
};

class Componente extends Model {
    static associate(models) {
        // Un componente puede tener muchos LogError (errores)
        this.hasMany(models.LogError, {
            foreignKey: 'idComponente',
            as: 'errores',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Componente',
            tableName: COMPONENTE_TABLE,  // El nombre de la tabla en la base de datos
            timestamps: false,  // No tiene campos de timestamps como createdAt/updatedAt
        };
    }
}

module.exports = { COMPONENTE_TABLE, ComponenteSchema, Componente};
