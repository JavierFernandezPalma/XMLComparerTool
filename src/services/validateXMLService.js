const fs = require('fs'); // Importar el módulo fs para manejar operaciones del sistema de archivos
const path = require('path'); // Importar el módulo Path para trabajar con rutas de archivos y directorios
const xsdValidator = require('xsd-schema-validator'); // Importar el validador XSD
const boom = require('@hapi/boom');

class ValidateXMLService {

    // constructor() {
    //     this.validateXML = null;
    // }

    async processValidationXML(req) {
        
        const { xml, xsd } = req.body; // Extrae XML y XSD del cuerpo de la solicitud

        // Delegar la validación al servicio
        const result = await this.validateXML(xml, xsd);

        // Determinar el código de estado dinámicamente según el resultado
        let statusCode;

        if (result.valid) {
            statusCode = 200; // Éxito
        } else if (result.errorType === 'SCHEMA_ERROR') {
            statusCode = 422; // Error de validación de esquema
        } else if (result.errorType === 'FATAL_ERROR' || result.errorType === 'WITH_ERRORS') {
            // Evaluar el mensaje para determinar el status
            const errorMessage = (result.message && typeof result.message[0] === 'string')
                ? result.message[0].toLowerCase().trim()
                : '';

            if (errorMessage.includes('premature end of file') ||
                errorMessage.includes('invalid xml') ||
                errorMessage.includes('cvc-datatype-valid') ||
                errorMessage.includes('cvc-type') ||
                errorMessage.includes('cvc-elt')) {
                statusCode = 422; // Error relacionado con la validación
            } else {
                statusCode = 400; // XML mal formado
            }
        } else {
            statusCode = 400; // Otros errores
        }

        return { statusCode, result };
    }

    // Método para validar un XML contra un esquema XSD
    async validateXML(xml, xsd) {

        // Limpia y prepara el XML y el XSD
        const xmlData = xml.trim().replace(/\s+/g, ' ');
        const xsdContent = xsd.trim().replace(/\s+/g, ' ');

        const xsdFilePath = path.join(__dirname, 'schema.xsd'); // Define la ruta temporal para el archivo XSD

        // Escribir el esquema XSD en un archivo temporal
        try {
            const a = this.prueba();
            fs.writeFileSync(xsdFilePath, xsdContent);
        } catch (fileWriteError) {
            console.error('Error al escribir el archivo XSD:', fileWriteError); // Error al escribir el archivo XSD
            // return { valid: false, errorType: 'SCHEMA_ERROR', message: ['Error al escribir el archivo XSD.'], details: '' };
            throw boom.badData('Error al escribir el archivo XSD.')
        }

        // Validación asincrónica del XML contra el archivo XSD
        try {
            // Validación del XML usando la promesa
            const result = await xsdValidator.validateXML(xmlData, xsdFilePath);

            // Verificar si la validación fue exitosa
            if (result.valid) {
                return { valid: result.valid, errorType: result.result, message: result.messages, details: result, }; // Validación exitosa
            } else {
                return {
                    valid: result.valid,
                    errorType: result.result,
                    message: result.messages || 'No se proporcionaron detalles del error.',
                    details: result, // Agregar detalles adicionales si es necesario
                };
            }
        } catch (error) {
            // console.error('Error durante la validación:', error);
            return {
                valid: error.valid,
                errorType: error.result,
                message: error.messages || 'Ocurrió un error desconocido durante la validación del XML.',
                details: error, // Agregar detalles adicionales si es necesario
            };
        }
    }
}

module.exports = ValidateXMLService;