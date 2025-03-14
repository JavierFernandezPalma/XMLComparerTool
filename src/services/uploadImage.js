// npm install uuid

const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer'); // Para manejar la carga de imágenes
const RegistroErroresService = require('../services/errorService');
const validatorErrorHandler = require('../middlewares/errorHandler');
const { createErrorLog, updateErrorLog, getErrorLog } = require('../schemas/errorSchema');

const router = express.Router();
const service = new RegistroErroresService();

// Configuración de Multer para subir las imágenes
const upload = multer({ dest: 'uploads/imagenes/' });

router.post('/', upload.single('imagen'), async (req, res, next) => {
    try {
        const body = req.body;

        // Generar un UUID para la imagen
        const imagenId = uuidv4();
        const extension = path.extname(req.file.originalname);
        const imagenRuta = path.join('uploads', 'imagenes', `${imagenId}${extension}`);

        // Mover la imagen del directorio temporal al destino final
        fs.renameSync(req.file.path, imagenRuta);

        // Incluir el UUID de la imagen y la ruta en los datos del error
        body.imagen_id = imagenId;
        body.ruta_imagen = imagenRuta;

        const { statusCode, result } = await service.create(body);

        // Devuelve la respuesta con el código de estado dinámico
        return res.status(statusCode).json(result);
    } catch (error) {
        next(error);
    }
});


// Ejemplo para acceder a la imagen asociada a un error
const obtenerImagenError = async (errorId) => {
    const error = await service.findOne(errorId);
    if (error && error.ruta_imagen) {
        return error.ruta_imagen;
    }
    throw new Error('Imagen no encontrada');
};

module.exports = router;
