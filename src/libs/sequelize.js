// Importa Sequelize, configuraciones y modelos
const { Sequelize } = require('sequelize');
// const { config } = require('../scripts/config');
const setupModels = require('../db/models');

const config = {
    env: 'production',
    port: 3000,
    dbUser: 'root',
    dbPassword: 'wWrwq8ebCY9R2V32TmuL0hl7S0qXbVFK',
    dbHost: 'dpg-cvf0acfnoe9s73bb4nog-a',
    dbName: 'myapp_db_cfgc',
    dbPort: '5432',
    dbGestor: 'postgres'
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
