/**
 * Define el esquema para la documentación Swagger de Causas
 */

const CreateErrorLog = {
    type: 'object',
    properties: {
        idProceso: {
            type: 'integer',
            description: 'ID del proceso',
            example: 1
        },
        idComponente: {
            type: 'integer',
            description: 'ID del componente',
            example: 2
        },
        descripcionError: {
            type: 'string',
            description: 'Descripción del error',
            example: 'Error en el sistema'
        },
        causas: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    causa: {
                        type: 'object',
                        properties: {
                            descripcionCausa: {
                                type: 'string',
                                description: 'Causa del error',
                                example: 'Servidor caído'
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
                                                    description: 'Solución propuesta',
                                                    example: 'Levantar servidor'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

// Documentación Swagger para obtener todos los logs de error (listar)
// const GetErrorLog = {
//     type: 'object',
//     properties: {
//         statusCode: {
//             type: 'integer',
//             example: 200
//         },
//         result: {
//             type: 'array',
//             items: {
//                 $ref: '#/components/schemas/CreateErrorLog'  // Referencia al esquema CreateErrorLog
//             }
//         }
//     }
// };
const GetErrorLog = {
    type: 'object',
    properties: {
        descripcionError: {
            type: 'string',
            description: 'Descripción del error',
            example: "Error de WSDL no válido"
        }
    },
    parameters: [
        {
            name: 'idError',
            in: 'path',
            required: true,
            description: 'ID del error a eliminar',
            schema: {
                type: 'integer',
                example: 1
            }
        }
    ],
    responses: {
        200: {
            description: 'Listado de logs de errores obtenido correctamente',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: {
                                type: 'integer',
                                example: 200
                            },
                            result: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        idError: {
                                            type: 'integer',
                                            description: 'ID del error',
                                            example: 1
                                        },
                                        idProceso: {
                                            type: 'integer',
                                            description: 'ID del proceso asociado',
                                            example: 1
                                        },
                                        idComponente: {
                                            type: 'integer',
                                            description: 'ID del componente asociado',
                                            example: 1
                                        },
                                        descripcionError: {
                                            type: 'string',
                                            description: 'Descripción del error',
                                            example: 'Error de WSDL no válido'
                                        },
                                        fechaRegistro: {
                                            type: 'string',
                                            format: 'date-time',
                                            description: 'Fecha y hora de registro del error',
                                            example: '2025-01-30T21:10:00.000Z'
                                        },
                                        fechaModificacion: {
                                            type: 'string',
                                            format: 'date-time',
                                            description: 'Fecha y hora de la última modificación del error',
                                            example: '2025-02-21T19:52:09.000Z'
                                        },
                                        componentes: {
                                            type: 'object',
                                            properties: {
                                                idComponente: {
                                                    type: 'integer',
                                                    description: 'ID del componente',
                                                    example: 1
                                                },
                                                nombreComponente: {
                                                    type: 'string',
                                                    description: 'Nombre del componente',
                                                    example: 'DataPower'
                                                },
                                                descripcionComponente: {
                                                    type: 'string',
                                                    description: 'Descripción del componente',
                                                    example: 'Plataforma de integración de servicios web y seguridad'
                                                }
                                            }
                                        },
                                        procesos: {
                                            type: 'object',
                                            properties: {
                                                idProceso: {
                                                    type: 'integer',
                                                    description: 'ID del proceso',
                                                    example: 1
                                                },
                                                nombreProceso: {
                                                    type: 'string',
                                                    description: 'Nombre del proceso',
                                                    example: 'Lanzamiento a QA'
                                                },
                                                descripcionProceso: {
                                                    type: 'string',
                                                    description: 'Descripción del proceso',
                                                    example: 'Proceso de lanzamiento a ambiente de calidad'
                                                }
                                            }
                                        },
                                        causas: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    idCausa: {
                                                        type: 'integer',
                                                        description: 'ID de la causa',
                                                        example: 1
                                                    },
                                                    idError: {
                                                        type: 'integer',
                                                        description: 'ID del error asociado',
                                                        example: 1
                                                    },
                                                    descripcionCausa: {
                                                        type: 'string',
                                                        description: 'Descripción de la causa',
                                                        example: 'Archivo WSDL incorrecto o corrupto'
                                                    },
                                                    soluciones: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                idSolucion: {
                                                                    type: 'integer',
                                                                    description: 'ID de la solución',
                                                                    example: 1
                                                                },
                                                                idCausa: {
                                                                    type: 'integer',
                                                                    description: 'ID de la causa asociada',
                                                                    example: 1
                                                                },
                                                                descripcionSolucion: {
                                                                    type: 'string',
                                                                    description: 'Descripción de la solución',
                                                                    example: 'Asegurarse de que el archivo WSDL sea el correcto y esté accesible'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        400: {
            description: 'Error en la solicitud debido a datos inválidos o faltantes. Los siguientes campos son requeridos.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: {
                                type: 'integer',
                                example: 400
                            },
                            error: {
                                type: 'string',
                                example: 'Bad Request'
                            },
                            message: {
                                type: 'string',
                                example: '"\"descripcionError\" is required (string, 3-45 characters)"'
                            }
                        }
                    }
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: {
                                type: 'integer',
                                example: 500
                            },
                            message: {
                                type: 'string',
                                example: 'Error en el servidor'
                            }
                        }
                    }
                }
            }
        }
    },
    tags: [
        'Errores' // Categoría de la API a la que pertenece esta operación
    ],
    summary: 'Obtener todos los logs de errores según descripción del error',
    description: 'Recupera todos los logs de errores registrados en la base de datos según la descripción.'
};

// Documentación Swagger para actualizar un log de error
const UpdateErrorLog = {
    type: 'object',
    properties: {
        idProceso: {
            type: 'integer',
            description: 'ID del proceso',
            example: 1
        },
        idComponente: {
            type: 'integer',
            description: 'ID del componente',
            example: 2
        },
        descripcionError: {
            type: 'string',
            description: 'Descripción del error',
            example: 'Error corregido en el sistema'
        },
        causas: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    causa: {
                        type: 'object',
                        properties: {
                            descripcionCausa: {
                                type: 'string',
                                description: 'Causa del error',
                                example: 'Servidor reiniciado'
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
                                                    description: 'Solución aplicada',
                                                    example: 'Reiniciar servicios'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

// Documentación Swagger para eliminar un log de error
const DeleteErrorLog = {
    type: 'object',
    properties: {
        idError: {
            type: 'integer',
            description: 'ID del error a eliminar',
            example: 1
        }
    },
    parameters: [
        {
            name: 'idError',
            in: 'path',
            required: true,
            description: 'ID del error a eliminar',
            schema: {
                type: 'integer',
                example: 1
            }
        }
    ],
    responses: {
        200: {
            description: 'Log de error eliminado correctamente',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            idError: {
                                type: 'integer',
                                description: 'ID del error eliminado',
                                example: 1
                            }
                        }
                    }
                }
            }
        },
        400: {
            description: 'Error en la solicitud debido a datos inválidos o faltantes. Los siguientes campos son requeridos.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: {
                                type: 'integer',
                                example: 400
                            },
                            error: {
                                type: 'string',
                                example: 'Bad Request'
                            },
                            message: {
                                type: 'string',
                                example: '"\"idProceso\" is required (integer, 1-2147483647)'
                            }
                        }
                    }
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: {
                                type: 'integer',
                                example: 500
                            },
                            message: {
                                type: 'string',
                                example: 'Error en el servidor'
                            }
                        }
                    }
                }
            }
        }
    },
    tags: [
        'Errores' // Categoría de la API a la que pertenece esta operación
    ],
    summary: 'Eliminar un log de error',
    description: 'Elimina un log de error existente por su ID.'
};

module.exports = {
    CreateErrorLog,
    GetErrorLog,
    UpdateErrorLog,
    DeleteErrorLog
};