const express = require('express'); // Importar el módulo Express
const filesRoutes = require('./filesRoutes');
const validarXMLRoutes = require('./validateXMLRoutes');
const registroErroresRoutes = require('./errorRoutes');
const registroCausasRoutes = require('./causaRoutes');
const registroSolucionesRoutes = require('./solucionRoutes');
const registroImagenesRoutes = require('./imagenRoutes');
const authRoutes = require('./authRoutes');
// Nuevas rutas
const usuariosRoutes = require('./usuariosRoutes');
const tareasRoutes = require('./tareasRoutes');
const estadoTareasRoutes = require('./estadoTareasRoutes');
const rolesRoutes = require('./rolesRoutes');
const habilidadesRoutes = require('./habilidadesRoutes');
const actividadesRoutes = require('./actividadesRoutes');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/files', filesRoutes);
    router.use('/validateXML', validarXMLRoutes);
    router.use('/errors', registroErroresRoutes);
    router.use('/causas', registroCausasRoutes);
    router.use('/soluciones', registroSolucionesRoutes);
    router.use('/imagenes', registroImagenesRoutes);
    router.use('/security', authRoutes);
    // Rutas nuevas 
    router.use('/usuarios', usuariosRoutes);
    router.use('/roles', rolesRoutes);
    router.use('/estado-tareas', estadoTareasRoutes);
    router.use('/tareas', tareasRoutes);
    router.use('/habilidades', habilidadesRoutes);
    router.use('/actividades', actividadesRoutes);
}

module.exports = routerApi;