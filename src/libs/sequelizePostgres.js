// Importa Sequelize, configuraciones y modelos
const { Sequelize } = require('sequelize');
const { config } = require('../scripts/config');
const setupModels = require('../db/models');

// Codifica las credenciales y crea la URI de conexión
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// Crea la instancia de Sequelize para PostgreSQL
const sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Configura los modelos
setupModels(sequelize);

// Intentar la conexión con la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos:', error.message);
        // Aquí puedes agregar más lógica dependiendo del tipo de error:
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.error('La conexión fue rechazada, verifique la base de datos y la configuración de red.');
        } else if (error.name === 'SequelizeHostNotFoundError') {
            console.error('No se pudo encontrar el host especificado. Verifique la URL del servidor de la base de datos.');
        } else if (error.name === 'SequelizeConnectionTimedOutError') {
            console.error('La conexión con la base de datos excedió el tiempo de espera. Verifique la red y la base de datos.');
        } else {
            console.error('Error desconocido al intentar conectar con la base de datos:', error);
        }
    });

// Exporta la instancia
module.exports = sequelize;