// import { Model, DataTypes, Sequelize } from 'sequelize';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROCESO_TABLE } = require('./procesoModel');
const { COMPONENTE_TABLE } = require('./componenteModel');

const LOG_ERROR_TABLE = 'errores';

const LogErrorSchema = {
    idError: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_error' // Columna en la base de datos
    },
    idProceso: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: PROCESO_TABLE, // Tabla 'procesos'
            key: 'id_proceso' // Columna 'id_proceso' de la tabla 'procesos'
        },
        field: 'id_proceso' // Columna en la base de datos
    },
    idComponente: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: COMPONENTE_TABLE, // Tabla 'componentes'
            key: 'id_componente' // Columna 'id_componente' de la tabla 'componentes'
        },
        field: 'id_componente' // Columna en la base de datos
    },
    descripcionError: {
        allowNull: false,
        type: DataTypes.TEXT,
        field: 'descripcion_error' // Columna en la base de datos
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, // Valor por defecto: la fecha y hora actual
        field: 'fecha_registro' // Columna en la base de datos
    },
    fechaModificacion: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW, // Valor por defecto: la fecha y hora actual
        onUpdate: Sequelize.NOW, // Se actualiza automáticamente en cada modificación
        field: 'fecha_modificacion' // Columna en la base de datos
    }
};

// Modelo para la tabla 'errores'
class LogError extends Model {
    static associate(models) {

        // Relación entre LogError y Componente (un error pertenece a un componente)
        this.belongsTo(models.Componente, {
            foreignKey: 'idComponente',  // Campo de LogError que hace referencia a Componente
            as: 'componentes',  // Nombre de la relación
        });

        // Relación entre LogError y Proceso (un error pertenece a un proceso)
        this.belongsTo(models.Proceso, {
            foreignKey: 'idProceso',  // Campo de LogError que hace referencia a Proceso
            as: 'procesos',  // Nombre de la relación
            // attributes: ['nombreProceso']  // Solo traer el 'nombreProceso' y no el 'idProceso'
        });

        // Relación entre LogError y Causa (un error puede tener muchas causas)
        // Relación entre LogError y Solucion (un error puede tener muchas soluciones a través de causas)
        this.hasMany(models.Causa, {
            foreignKey: 'idError',  // Clave foránea en la tabla 'causas'
            as: 'causas',  // Alias para la relación
            onDelete: 'CASCADE', // Esto asegura que si se elimina un 'LogError', las 'causas' también se eliminen
        });

        // Relación entre LogError y Imagen (un error puede tener muchas imágenes)
        this.hasMany(models.Imagen, {
            foreignKey: 'idError',  // Clave foránea en la tabla 'imagenes'
            as: 'imagenes',  // Alias para la relación
            onDelete: 'CASCADE', // Esto asegura que si se elimina un 'LogError', las 'imagenes' también se eliminen
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'LogError',
            tableName: LOG_ERROR_TABLE,
            timestamps: false,  // Como ya usamos 'fecha_registro' y 'fecha_modificacion', no es necesario activar timestamps      
        }
    }
}

// LogError.init(LogErrorSchema, {
//     sequelize: new Sequelize('mysql://user:password@localhost:3306/database'), // Cambiar por tu conexión
//     modelName: 'LogError',
//     tableName: LOG_ERROR_TABLE,
//     timestamps: false, // Ya que estamos usando 'fecha_registro' y 'fecha_modificacion'
// });

module.exports = { LOG_ERROR_TABLE, LogErrorSchema, LogError };