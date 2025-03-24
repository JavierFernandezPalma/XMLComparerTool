/**
 * Define el esquema para la documentación Swagger de Causas
 */

const CreateCausa = {
    type: 'object',
    properties: {
        idError: {
            type: 'integer',
            description: 'ID del error relacionado',
            example: 1
        },
        descripcionCausa: {
            type: 'string',
            description: 'Descripción de la causa',
            example: 'Servidor no responde'
        },
        soluciones: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    solucion: {
                        type: 'object',
                        properties: {
                            descripcionSolucion: {
                                type: 'string',
                                description: 'Descripción de la solución',
                                example: 'Reiniciar servidor'
                            }
                        }
                    }
                }
            }
        }
    }
};

const UpdateCausa = {
    type: 'object',
    properties: {
        descripcionCausa: {
            type: 'string',
            description: 'Descripción de la causa',
            example: 'Servidor en mantenimiento'
        }
    }
};

const DeleteCausa = {
    type: 'object',
    properties: {
        idCausa: {
            type: 'integer',
            description: 'ID de la causa a eliminar',
            example: 1
        }
    }
};

// Esquema para la respuesta de listar causas
const GetCausa = {
    type: 'object',
    properties: {
        idError: {
            type: 'integer',
            description: 'ID único del error relacionado',
            example: 1
        }
    }
};


module.exports = {
    CreateCausa,
    UpdateCausa,
    DeleteCausa,
    GetCausa
};
