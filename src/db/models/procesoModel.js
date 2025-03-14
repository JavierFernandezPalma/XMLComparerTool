const { Model, DataTypes, Sequelize } = require('sequelize');

const PROCESO_TABLE = 'procesos';

const ProcesoSchema = {
    idProceso: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        field: 'id_proceso',  // Nombre de la columna en la base de datos
    },
    nombreProceso: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'nombre_proceso',  // Nombre de la columna en la base de datos
    },
    descripcionProceso: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'descripcion',  // Nombre de la columna en la base de datos
    }
};

class Proceso extends Model {
    static associate(models) {
        // Un proceso puede tener muchos LogError (errores)
        this.hasMany(models.LogError, {
            foreignKey: 'idProceso',
            as: 'errores',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Proceso',
            tableName: PROCESO_TABLE,  // El nombre de la tabla en la base de datos
            timestamps: false,  // No tiene campos de timestamps como createdAt/updatedAt
        };
    }
}

module.exports = { PROCESO_TABLE, ProcesoSchema, Proceso };
