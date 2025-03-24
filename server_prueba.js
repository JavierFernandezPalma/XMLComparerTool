const express = require('express'); // Importar el módulo Express
const cors = require('cors'); // Importar el módulo CORS para habilitar solicitudes desde otros dominios
const path = require('path'); // Importar el módulo Path para trabajar con rutas de archivos y directorios
const packageJson = require('./package.json'); // Importa el contenido del archivo package.json para acceder a metadatos del proyecto, como la versión.

const routerApi = require('./src/routes/api'); // Importar 

const app = express(); // Crear una aplicación Express
const PORT = process.env.PORT || 3000; // Definir el puerto en el que el servidor escuchará
const DOMAIN = process.env.DOMAIN || 'localhost'; // Definir el dominio, nombre del servidor o IP

// Lista de dominios permitidos
const allowedOrigins = [
    'https://xml-comparer-tool.vercel.app',
    'https://xml-comparer-tool-prueba.vercel.app',
    'https://xmlcomparertool.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3001'
];

// Configuración de CORS
const corsOptions = {
    origin: (origin, callback) => {
        // console.log(`Origen recibido: ${origin}`); // Para depuración
        // Verifica si el origen de la solicitud está en la lista de dominios permitidos
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // Permite el origen si está en la lista o si no se proporciona un origen (por ejemplo, solicitudes locales)
            callback(null, true);
        } else {
            // Rechaza el origen si no está en la lista
            callback(new Error('No autorizado por CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'] // Encabezados permitidos en las solicitudes
};

// Habilitar CORS para permitir solicitudes desde otros dominios
app.use(cors(corsOptions));

// Middlewares
app.use(express.json()); // Middleware para parsear JSON
app.use(express.static(path.join(__dirname, 'dist'))); // Servir archivos estáticos desde la carpeta "dist"

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta que devuelve versión desde package
app.get('/version', (req, res) => {
    res.json({ version: packageJson.version });
});

routerApi(app);

// Iniciar el servidor
app.listen(PORT, DOMAIN, () => {
    console.log(`El servidor está corriendo en http://${DOMAIN}:${PORT}`); // Imprimir un mensaje cuando el servidor esté listo
});