// Importar los módulos necesarios de Sequelize
const { Model, DataTypes } = require('sequelize');
const { LOG_ERROR_TABLE } = require('./logErrorModel');

// Definición del nombre de la tabla para 'imagenes'
const IMAGEN_TABLE = 'imagenes';

// Esquema de la tabla 'imagenes'
const ImagenSchema = {
    idImagen: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id_imagen' // Columna en la base de datos
    },
    idError: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: LOG_ERROR_TABLE, // Nombre de la tabla 'errores'
            key: 'id_error'   // Columna en la tabla 'errores'
        },
        field: 'id_error' // Columna en la base de datos
    },
    imagenId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'imagen_id' // Columna en la base de datos
    },
    rutaImagen: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'ruta_imagen' // Columna en la base de datos
    },
    descripcionImagen: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'descripcion_imagen' // Columna en la base de datos
    }
};

// Modelo para la tabla 'imagenes'
class Imagen extends Model {
    static associate(models) {
        // Relación entre 'imagenes' y 'errores' (una imagen pertenece a un error)
        this.belongsTo(models.LogError, {  // 'Error' debe ser el modelo de la tabla 'errores'
            foreignKey: 'idError',  // Clave foránea en la tabla 'imagenes'
            as: 'errores',  // Alias para la relación
            onDelete: 'CASCADE',  // Si se elimina un error, también se eliminan sus imágenes
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'Imagen',
            tableName: IMAGEN_TABLE,
            timestamps: false,  // No necesitamos usar 'timestamps' ya que las fechas 'fecha_registro' y 'fecha_modificacion' ya están definidas en la base de datos
        };
    }
}

// Exportar el modelo y esquema
module.exports = { IMAGEN_TABLE, ImagenSchema, Imagen };
