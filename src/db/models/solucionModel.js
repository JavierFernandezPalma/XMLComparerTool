const { Model, DataTypes, Sequelize } = require('sequelize');

const SOLUCION_TABLE = 'soluciones';

const SolucionSchema = {
    idSolucion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_solucion', // Columna en la base de datos
    },
    idCausa: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'causas', // Tabla 'causas'
            key: 'id_causa'  // Columna 'id_causa' de la tabla 'causas'
        },
        onDelete: 'CASCADE', // Esto asegura que si se elimina una 'Causa', se eliminan las 'Soluciones'
        field: 'id_causa', // Columna en la base de datos
    },
    descripcionSolucion: {
        allowNull: false,
        type: DataTypes.TEXT,
        field: 'descripcion' // Columna en la base de datos
    }
};

// Modelo para la tabla 'soluciones'
class Solucion extends Model {
    static associate(models) {
        // Relación entre Solucion y Causa (una solución pertenece a una causa)
        this.belongsTo(models.Causa, {
            foreignKey: 'idCausa',
            as: 'causa',  // Alias para la relación
            onDelete: 'CASCADE',  // Elimina la solución cuando se elimina la causa
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Solucion',
            tableName: SOLUCION_TABLE,
            timestamps: false,      
        };
    }
}

module.exports = { SOLUCION_TABLE, SolucionSchema, Solucion };
