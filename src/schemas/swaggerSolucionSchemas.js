const CreateSolucion = {
    type: 'object',
    properties: {
        idCausa: {
            type: 'integer',
            description: 'ID de la causa asociada',
            example: 1
        },
        descripcionSolucion: {
            type: 'string',
            description: 'Descripción de la solución',
            example: 'Reiniciar el servidor'
        }
    },
    required: ['idCausa', 'descripcionSolucion']
};

const UpdateSolucion = {
    type: 'object',
    properties: {
        descripcionSolucion: {
            type: 'string',
            description: 'Nueva descripción de la solución',
            example: 'Verificar el hardware'
        }
    },
    required: ['descripcionSolucion']
};

const DeleteSolucion = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID de la solución a eliminar',
            example: 1
        }
    },
    required: ['id']
};

// Respuesta para obtener todas las soluciones de una causa
const GetAllSoluciones = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            idSolucion: {
                type: 'integer',
                description: 'ID de la solución',
                example: 1
            },
            descripcionSolucion: {
                type: 'string',
                description: 'Descripción de la solución',
                example: 'Reiniciar el servidor'
            }
        }
    }
};

module.exports = { CreateSolucion, UpdateSolucion, DeleteSolucion, GetAllSoluciones };