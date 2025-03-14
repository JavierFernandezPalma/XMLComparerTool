const { Proceso, ProcesoSchema } = require('./procesoModel');
const { Componente, ComponenteSchema } = require('./componenteModel');
const { LogError, LogErrorSchema } = require('./logErrorModel');
const { Causa, CausaSchema } = require('./causaModel');
const { Solucion, SolucionSchema } = require('./solucionModel'); // Importa el modelo Solucion

function setupModels(sequelize) {
    Proceso.init(ProcesoSchema, Proceso.config(sequelize));
    Componente.init(ComponenteSchema, Componente.config(sequelize));
    LogError.init(LogErrorSchema, LogError.config(sequelize));
    Causa.init(CausaSchema, Causa.config(sequelize));
    Solucion.init(SolucionSchema, Solucion.config(sequelize));

    Proceso.associate(sequelize.models);
    Componente.associate(sequelize.models);
    LogError.associate(sequelize.models);
    Causa.associate(sequelize.models);
    Solucion.associate(sequelize.models);

}

module.exports = setupModels;