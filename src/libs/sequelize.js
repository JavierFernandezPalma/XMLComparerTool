// Importa Sequelize, configuraciones y modelos
const { Sequelize } = require('sequelize');
// const { config } = require('../scripts/config');
const setupModels = require('../db/models');

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    dbGestor: process.env.DB_GESTOR
}

// Codifica las credenciales y crea la URI de conexión
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

const URI = `${config.dbGestor}://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// Crea la instancia de Sequelize
const sequelize = new Sequelize(URI, {
    dialect: `${config.dbGestor}`,
    // logging: console.log,
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

// sequelize.sync(); // Se comenta y no utiliza porque se utilizan migraciones sequelize-cli

// Exporta la instancia
module.exports = sequelize;
