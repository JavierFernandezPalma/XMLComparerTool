const { Proceso, ProcesoSchema } = require('./procesoModel');
const { Componente, ComponenteSchema } = require('./componenteModel');
const { LogError, LogErrorSchema } = require('./logErrorModel');
const { Causa, CausaSchema } = require('./causaModel');
const { Solucion, SolucionSchema } = require('./solucionModel'); // Importa el modelo Solucion
const { Imagen, ImagenSchema } = require('./imagenModel'); // Importa el modelo Imagen
const { Rol, RolSchema } = require('./rolesModel');
const { Usuario, UsuarioSchema } = require('./usuariosModel');
const { Habilidad, HabilidadSchema } = require('./habilidadesModel');
const { EstadoTarea, EstadoTareaSchema } = require('./estadoTareasModel');
const { Tarea, TareaSchema } = require('./tareasModel');
const { Actividad, ActividadSchema } = require('./actividadesModel');

function setupModels(sequelize) {
    Proceso.init(ProcesoSchema, Proceso.config(sequelize));
    Componente.init(ComponenteSchema, Componente.config(sequelize));
    LogError.init(LogErrorSchema, LogError.config(sequelize));
    Causa.init(CausaSchema, Causa.config(sequelize));
    Solucion.init(SolucionSchema, Solucion.config(sequelize));
    Imagen.init(ImagenSchema, Imagen.config(sequelize));
    Rol.init(RolSchema, Rol.config(sequelize));
    Usuario.init(UsuarioSchema, Usuario.config(sequelize));
    Habilidad.init(HabilidadSchema, Habilidad.config(sequelize));
    EstadoTarea.init(EstadoTareaSchema, EstadoTarea.config(sequelize));
    Tarea.init(TareaSchema, Tarea.config(sequelize));
    Actividad.init(ActividadSchema, Actividad.config(sequelize));

    Proceso.associate(sequelize.models);
    Componente.associate(sequelize.models);
    LogError.associate(sequelize.models);
    Causa.associate(sequelize.models);
    Solucion.associate(sequelize.models);
    Imagen.associate(sequelize.models);
    Rol.associate(sequelize.models);
    Usuario.associate(sequelize.models);
    Habilidad.associate(sequelize.models);
    EstadoTarea.associate(sequelize.models);
    Tarea.associate(sequelize.models);
    Actividad.associate(sequelize.models);

}

module.exports = setupModels;