const express = require('express'); // Importar el módulo Express
const bodyParser = require('body-parser'); // Middleware para manejar el cuerpo de la solicitud

const ValidateXMLService = require('./../services/validateXMLService.js');

const router = express.Router();
const service = new ValidateXMLService();

// Middlewares
router.use(bodyParser.text({ type: 'application/xml' })); // Middleware para XML

// Endpoint para la validación del XML
router.post('/validate', async (req, res, next) => {
    try {
        // Delegar la validación al servicio
        const { statusCode, result } = await service.processValidationXML(req);

        // Devuelve la respuesta con el código de estado dinámico
        return res.status(statusCode).json(result);
    } catch (error) {
        // console.error('Error procesando la solicitud en el endpoint /validate:', error);
        // Manejo de errores inesperados
        // return res.status(500).json({
        //     status: 'error',
        //     message: 'Error interno del servidor.',
        //     details: error.message,
        // });
        next(error);
    }

});

module.exports = router;