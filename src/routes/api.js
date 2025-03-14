const express = require('express'); // Importar el módulo Express
const filesRoutes = require('./filesRoutes');
const validarXMLRoutes = require('./validateXMLRoutes');
const registroErroresRoutes = require('./errorRoutes');
const registroCausasRoutes = require('./causaRoutes');
const registroSolucionesRoutes = require('./solucionRoutes');
const authRoutes = require('./authRoutes');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/files', filesRoutes);
    router.use('/validateXML', validarXMLRoutes);
    router.use('/errors', registroErroresRoutes);
    router.use('/causas', registroCausasRoutes);
    router.use('/soluciones', registroSolucionesRoutes);
    router.use('/security', authRoutes);
}

module.exports = routerApi;