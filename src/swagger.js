/**
 * @file swagger.js
 * @description Configura la documentación Swagger para la API, habilita Swagger UI y define los esquemas necesarios para las rutas de causas.
 */

const swaggerUi = require('swagger-ui-express'); // Importa Swagger UI para servir la interfaz de la documentación
const swaggerJsdoc = require('swagger-jsdoc'); // Importa Swagger JSDoc para generar la especificación de Swagger a partir de los comentarios en el código
const { CreateCausa, UpdateCausa, DeleteCausa, GetCausa } = require('./schemas/swaggerCausaSchemas'); // Importa los esquemas de causas para la documentación
const { CreateErrorLog, GetErrorLog, UpdateErrorLog, DeleteErrorLog } = require('./schemas/swaggerErrorSchemas'); // Importa los esquemas de error para la documentación
const { CreateSolucion, UpdateSolucion, DeleteSolucion, GetAllSoluciones } = require('./schemas/swaggerSolucionSchemas'); // Importa los esquemas de solucion para la documentación

/**
 * @description Define la especificación de Swagger para la API, incluyendo la versión, la información del servidor y los esquemas para causas.
 */
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0', // Especificación de OpenAPI 3.0
        info: {
            title: 'API de Gestión de Errores y Soluciones', // Título de la API
            version: '1.0.0', // Versión de la API
            description: `
                Esta API permite gestionar los registros de errores dentro del sistema, 
                junto con sus causas y soluciones asociadas. A través de esta API se pueden 
                crear, leer, actualizar y eliminar logs de errores. Los logs incluyen información 
                sobre el proceso, componente, descripción del error, causas y soluciones propuestas.

                **Operaciones soportadas:**
                - **Crear un log de error**: Se puede crear un nuevo registro de error con sus causas y soluciones.
                - **Obtener los logs de error**: Permite obtener todos los logs de error registrados.
                - **Actualizar un log de error**: Permite modificar un log de error existente, incluyendo la actualización de causas y soluciones.
                - **Eliminar un log de error**: Permite eliminar un log de error específico basado en su identificador.
                
                Esta API es útil para sistemas que requieren monitoreo y seguimiento de errores, 
                y ayuda en la implementación de soluciones a problemas que puedan surgir en el entorno de producción o desarrollo.
                
                **Autenticación:**
                - Actualmente, la API no requiere autenticación, pero en futuras versiones se puede implementar un sistema de autenticación basado en tokens (JWT) o API keys.
                
                **Formato de respuesta:**
                - La mayoría de las respuestas son en formato JSON, proporcionando datos sobre el estado de la operación y la información solicitada.
                
                **Manejo de errores:**
                - La API maneja errores de validación y errores del servidor, proporcionando códigos de estado HTTP adecuados y mensajes descriptivos sobre el tipo de error.
            `,
        },
        servers: [
            {
                url: 'http://localhost:3000/api/{version}', // URL base para la API con una versión dinámica
                variables: {
                    version: {
                        default: 'v1', // Versión predeterminada
                        enum: ['v1', 'v2'], // Versiones soportadas
                        description: 'La versión de la API' // Descripción del parámetro de versión
                    }
                }
            }
        ],
        components: {
            schemas: {
                // Esquemas que se utilizan para las operaciones de log de errores
                CreateErrorLog,
                GetErrorLog,
                UpdateErrorLog,
                DeleteErrorLog,
                // Esquemas que se utilizan para las operaciones de causas
                CreateCausa,
                UpdateCausa,
                DeleteCausa,
                GetCausa,
                // Esquemas que se utilizan para las operaciones de soluciones
                CreateSolucion,
                UpdateSolucion,
                DeleteSolucion,
                GetAllSoluciones
            },
            responses: {
                CreateErrorLog,
                GetErrorLog,
                UpdateErrorLog,
                DeleteErrorLog
            }
        },
        tags: [
            {
                name: 'Errores',
                description: 'Operaciones relacionadas con los errores'
            },
            {
                name: 'Causas',
                description: 'Operaciones relacionadas con las causas'
            },
            {
                name: 'Soluciones',
                description: 'Operaciones relacionadas con las soluciones'
            }
        ]
    },
    apis: ['./src/routes/*.js'], // Directorio donde se encuentran las rutas que contienen los comentarios Swagger
});

/**
 * @description Configura la interfaz de Swagger UI en la ruta '/api-docs' para visualizar la documentación interactiva de la API.
 * @param {Object} app - Instancia de la aplicación Express
 */
const configureSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Habilita Swagger UI en la ruta '/api-docs'
};

// Exporta la función para ser utilizada en el archivo principal de la aplicación
module.exports = configureSwagger;