// const mysql = require('mysql2');
// import mysql from 'mysql2/promise';  // Importamos la versión con promesas
const mysql = require('mysql2/promise');
const { config } = require('../scripts/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
// const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// const createPool = mysql.createPool({ connectionString: URI });

// Creando el pool de conexiones utilizando la API de promesas
const createPool = mysql.createPool({
    host: config.dbHost || 3306,
    port: config.dbPort,
    user: USER,
    password: PASSWORD,
    database: config.dbName,
    waitForConnections: true,  // Habilita la espera por conexiones disponibles
    connectionLimit: 10,  // Número máximo de conexiones en el pool
    queueLimit: 0  // Sin límite de conexiones en espera
});

// Creamos la conexión utilizando la API de promesas
const createConnection = async () => {
    try {
        const con = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'user',
            password: 'userpassword',
            database: 'my_database',
            waitForConnections: true,  // Espera si no hay conexiones disponibles
            connectionLimit: 10,  // Número máximo de conexiones en el pool
            queueLimit: 0  // No limitamos la cantidad de solicitudes en espera
        });

        console.log('Conexión exitosa!');

        return con;  // Devolvemos la conexión para usarla en otros lugares
    } catch (err) {
        console.error('Error al conectar a la base de datos: ', err);
        throw err;  // Lanzamos el error para que pueda ser manejado en otros lugares
    }
};

// Exportamos la conexión para usarla en otros módulos
module.exports = createPool;