// Importa Sequelize, configuraciones y modelos
const { Sequelize } = require('sequelize');
const { config } = require('../scripts/config');
const setupModels = require('../db/models');

// Codifica las credenciales y crea la URI de conexión
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// Crea la instancia de Sequelize
const sequelize = new Sequelize(URI, {
    dialect: 'mysql',
    logging: console.log,
});

// Configura los modelos
setupModels(sequelize);

// sequelize.sync(); // Se comenta y no utiliza porque se utilizan migraciones sequelize-cli

// Exporta la instancia
module.exports = sequelize;
