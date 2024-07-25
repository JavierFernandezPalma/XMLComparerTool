const express = require('express'); // Importar el módulo Express
const multer = require('multer'); // Importar el módulo Multer para manejar la carga de archivos
const cors = require('cors'); // Importar el módulo CORS para habilitar solicitudes desde otros dominios
const fs = require('fs'); // Importar el módulo fs para manejar operaciones del sistema de archivos
const path = require('path'); // Importar el módulo Path para trabajar con rutas de archivos y directorios

const app = express(); // Crear una aplicación Express
const PORT = 3000; // Definir el puerto en el que el servidor escuchará

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

app.use(cors()); // Habilitar CORS para permitir solicitudes desde otros dominios
app.use(express.json()); // Middleware para parsear JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde la carpeta "public"

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


// Crear la carpeta 'upload' si no existe
if (!fs.existsSync('upload')) {
    fs.mkdirSync('upload'); // Crear la carpeta 'upload' si no existe
}

// Crear la carpeta 'data' y el archivo 'files.json' si no existen
if (!fs.existsSync('data')) {
    fs.mkdirSync('data'); // Crear la carpeta 'data' si no existe
}
const filePath = path.join(__dirname, 'data', 'files.json');
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ xmlFiles: ["Select template"] }, null, 2)); // Crear el archivo 'files.json' con un valor inicial si no existe
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`); // Imprimir un mensaje cuando el servidor esté listo
});