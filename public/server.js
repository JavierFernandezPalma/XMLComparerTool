const express = require('express'); // Importar el módulo Express
const multer = require('multer'); // Importar el módulo Multer para manejar la carga de archivos
const cors = require('cors'); // Importar el módulo CORS para habilitar solicitudes desde otros dominios
const fs = require('fs'); // Importar el módulo fs para manejar operaciones del sistema de archivos
const path = require('path'); // Importar el módulo Path para trabajar con rutas de archivos y directorios
const libxmljs = require('libxmljs2'); // Importa la librería libxmljs2 para manipulación y validación de documentos XML.
const packageJson = require('../package.json'); // Importa el contenido del archivo package.json para acceder a metadatos del proyecto, como la versión.

const app = express(); // Crear una aplicación Express
const PORT = process.env.PORT || 3000; // Definir el puerto en el que el servidor escuchará

// Configurar multer para almacenar archivos en la carpeta "upload"
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // Función para definir la carpeta de destino
        cb(null, 'upload/'); // Guardar archivos en la carpeta "upload"
    },
    filename: function (req, file, cb) { // Función para definir el nombre del archivo
        cb(null, file.originalname); // Usar el nombre original del archivo
    }
});

const upload = multer({ storage: storage }); // Crear una instancia de multer con la configuración de almacenamiento

// Lista de dominios permitidos
const allowedOrigins = [
    'https://xml-comparer-tool.vercel.app',
    'https://xml-comparer-tool-prueba.vercel.app',
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
// Middleware para servir archivos estáticos
app.use(express.json()); // Middleware para parsear JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde la carpeta "public"

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta que devuelve versión desde package
app.get('/version', (req, res) => {
    res.json({ version: packageJson.version });
});

app.get('/api/saludo', (req, res) => {
    res.json({ message: 'Hola desde la API' });
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hola desde la API' });
});

// Ruta para la carga de archivos
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) { // Comprobar si no se ha subido ningún archivo
        return res.status(400).send('No se ha subido ningún archivo.'); // Enviar una respuesta de error si no hay archivo
    }

    const fileName = req.file.originalname; // Obtener el nombre original del archivo subido
    const filePath = path.join(__dirname, 'data', 'files.json'); // Definir la ruta del archivo JSON donde se guardarán los nombres de los archivos subidos

    // Leer el archivo JSON existente
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { // Manejar errores de lectura del archivo
            console.error('Error leyendo el archivo:', err);
            return res.status(500).send('Error interno del servidor'); // Enviar una respuesta de error si hay un problema con la lectura del archivo
        }

        let files = { xmlFiles: [] }; // Inicializar un objeto para almacenar los nombres de los archivos
        if (data) { // Si el archivo tiene contenido, parsear el JSON
            try {
                files = JSON.parse(data); // Parsear el contenido JSON del archivo

            } catch (jsonErr) { // Manejar errores de parseo del JSON
                console.error('Error parseando JSON:', jsonErr);
                return res.status(500).send('Error interno del servidor'); // Enviar una respuesta de error si hay un problema con el parseo del JSON
            }
        }

        // Verificar si el archivo ya existe en el array
        const fileIndex = files.xmlFiles.indexOf(fileName);
        if (fileIndex === -1) { // Si el archivo no existe, agregarlo
            // Añadir el nuevo nombre de archivo al array xmlFiles
            files.xmlFiles.push(fileName);
        } else { // Si el archivo existe, actualizar su entrada (opcional, dependiendo de los requisitos)
            files.xmlFiles[fileIndex] = fileName; // No es realmente necesario en este caso, ya que estamos sobrescribiendo con el mismo nombre
        }

        // Escribir el array actualizado de vuelta al archivo JSON
        fs.writeFile(filePath, JSON.stringify(files, null, 2), (writeErr) => {
            if (writeErr) { // Manejar errores de escritura del archivo
                console.error('Error escribiendo el archivo:', writeErr);
                return res.status(500).send('Error interno del servidor'); // Enviar una respuesta de error si hay un problema con la escritura del archivo
            }
            console.log('Archivo subido y registrado exitosamente'); // Imprimir un mensaje de éxito en la consola
            res.status(200).send('Archivo subido y registrado exitosamente.'); // Enviar una respuesta de éxito si el archivo se ha subido y registrado correctamente
        });
    });

});

// Ruta para obtener la lista de archivos XML
app.get('/xmlfiles', (req, res) => {
    const directoryPath = path.join(__dirname, 'upload'); // Definir la ruta del directorio de subida

    fs.readdir(directoryPath, (err, files) => {
        if (err) { // Manejar errores al leer el directorio
            console.error('No se puede escanear el directorio:', err);
            return res.status(500).send('Error al obtener la lista de archivos.');
        }

        const xmlFiles = files.filter(file => file.endsWith('.xml')); // Filtrar solo archivos XML
        res.status(200).json(xmlFiles); // Enviar la lista de archivos XML como respuesta
    });
});

// Ruta para la eliminación de archivos
app.delete('/delete', (req, res) => {
    const fullPath = req.body.fileName; // Obtener la ruta completa del archivo
    const fileName = path.basename(fullPath); // Obtener solo el nombre del archivo
    const relativeUploadPath = path.join('upload', fileName); // Ruta correcta para el archivo a eliminar
    const absoluteUploadPath = path.join(__dirname, relativeUploadPath); // Ruta absoluta del archivo a eliminar

    const filePath = path.join(__dirname, 'data', 'files.json'); // Ruta al archivo files.json

    // Verificar si el archivo existe antes de intentar eliminarlo
    if (!fs.existsSync(absoluteUploadPath)) {
        console.error('El archivo no existe en la ruta especificada:', absoluteUploadPath);
        return res.status(404).send('El archivo no existe.');
    }

    // Eliminar el archivo
    fs.unlink(absoluteUploadPath, (err) => {
        if (err) {
            console.error('Error al eliminar el archivo:', err);
            return res.status(500).send('Error al eliminar el archivo.');
        }

        // Leer el archivo JSON existente
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error leyendo files.json:', err);
                return res.status(500).send('Error al eliminar el registro del archivo.');
            }

            let files = { xmlFiles: [] };
            if (data) {
                try {
                    files = JSON.parse(data); // Parsear el contenido JSON del archivo
                } catch (jsonErr) {
                    console.error('Error parseando JSON:', jsonErr);
                    return res.status(500).send('Error al eliminar el registro del archivo.');
                }
            }

            // Filtrar el array para eliminar el archivo
            files.xmlFiles = files.xmlFiles.filter(file => file !== fileName);

            // Escribir el array actualizado de vuelta al archivo JSON
            fs.writeFile(filePath, JSON.stringify(files, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error escribiendo files.json:', writeErr);
                    return res.status(500).send('Error al eliminar el registro del archivo.');
                }
                console.log('Archivo eliminado y registrado borrado exitosamente'); // Imprimir un mensaje de éxito en la consola
                res.status(200).send('Archivo eliminado exitosamente.');
            });
        });
    });
});

// Endpoint para la validación del XML
app.post('/validate', (req, res) => {
    const { xml, xsd } = req.body;

    // console.log('XML:', xml);
    // console.log('XSD:', xsd);

    // Primero, verifica si el XSD es válido
    let xsdDoc;
    try {
        xsdDoc = libxmljs.parseXml(xsd);
        // console.log(xsdDoc);
    } catch (err) {
        // XSD inválido
        // console.error('Error al parsear el XSD:', err);
        return res.status(400).json({ isValid: false, message: 'El esquema XSD proporcionado es inválido.', validationErrors: err.message });
    }

    try {

        // Parse XML
        const xmlDoc = libxmljs.parseXml(xml);
        // Validar XML contra XSD
        const isValid = xmlDoc.validate(xsdDoc);

        if (isValid) {
            console.log('Validación:', isValid);
            res.status(200).json({ isValid, message: 'XML válido respecto al XSD.' });
        } else {
            console.log('Errores de validación:', xmlDoc.validationErrors);
            const validationErrors = xmlDoc.validationErrors.map(err => ({
                message: err.message,
                line: err.line,
                column: err.column
            }));
            res.status(400).json({
                isValid: false,
                message: 'El XML no es válido respecto al XSD.',
                validationErrors: validationErrors
            });
        }
    } catch (error) {
        // console.error('Error al validar XML contra XSD:', error);
        // Manejar errores relacionados con el esquema XSD
        if (error.message.includes('Invalid XSD schema')) {
            // Inicializar el array
            let validationErrors = [];
            // Agregar objetos al array
            validationErrors.push({ message: error.message });
            res.status(400).json({
                isValid: false,
                message: 'Error en el esquema XSD.',
                validationErrors: validationErrors
            });
        } else {
            // Manejar otros errores internos
            // console.error('Error al validar XML contra XSD:', error);
            res.status(500).json({
                error: 'Error interno al validar XML contra XSD.',
                details: {
                    message: error.message,
                    stack: error.stack
                }
            });
        }
    }
});

// Crear la carpeta 'upload' si no existe
if (!fs.existsSync('public/upload')) {
    try {
        fs.mkdirSync('public/upload');
    } catch (error) {
        console.error('Error al crear la carpeta upload:', error);
    }
}

// Crear la carpeta 'data' y el archivo 'files.json' si no existen
if (!fs.existsSync('public/data')) {
    try {
        fs.mkdirSync('public/data');
    } catch (error) {
        console.error('Error al crear la carpeta data:', error);
    }
}

// Crear el archivo 'files.json' si no existe
const filePath = path.join(__dirname, 'data', 'files.json');
if (!fs.existsSync(filePath)) {
    try {
        // Crear el archivo 'files.json' con un valor inicial si no existe
        fs.writeFileSync(filePath, JSON.stringify({ xmlFiles: ["Select template"] }, null, 2));
    } catch (error) {
        console.error('Error al crear el archivo files.json:', error);
    }
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`); // Imprimir un mensaje cuando el servidor esté listo
});