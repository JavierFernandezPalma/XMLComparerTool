const { Model, DataTypes, Sequelize } = require('sequelize');
const { LOG_ERROR_TABLE } = require('./logErrorModel');

const CAUSA_TABLE = 'causas';

const CausaSchema = {
    idCausa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_causa', // Columna en la base de datos
    },
    idError: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: LOG_ERROR_TABLE, // Tabla 'errores'
            key: 'id_error'   // Columna 'id_error' de la tabla 'errores'
        },
        field: 'id_error', // Columna en la base de datos
    },
    descripcionCausa: {
        allowNull: false,
        type: DataTypes.TEXT,
        field: 'descripcion' // Columna en la base de datos
    }
};

// Modelo para la tabla 'causas'
class Causa extends Model {
    static associate(models) {
        // Relación entre Causa y LogError (una causa pertenece a un error)
        this.belongsTo(models.LogError, {
            foreignKey: 'idError',
            as: 'errores',  // Alias para la relación
        });

        // Relación entre Causa y Solucion (una causa puede tener muchas soluciones)
        this.hasMany(models.Solucion, {
            foreignKey: 'idCausa',
            as: 'soluciones',
            onDelete: 'CASCADE',  // Elimina las soluciones cuando se elimina una causa
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Causa',
            tableName: CAUSA_TABLE,
            timestamps: false,
        };
    }
}

module.exports = { CAUSA_TABLE, CausaSchema, Causa };
