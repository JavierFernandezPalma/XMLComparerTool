const express = require('express'); // Importar el módulo Express
const router = express.Router(); // Crear el router de Express

router.post('/', (req, res, next) => {
    try {
        return res.status(200).json(result); // Devolver la respuesta con el resultado
    } catch (error) {
        next(error); // Si ocurre un error, pasar al manejador de errores
    }
});