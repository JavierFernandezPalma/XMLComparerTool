// /**
//  * @file swaggerWebServicesREST.js
//  * @description Configura la documentación Swagger para la API, habilita Swagger UI y define los esquemas necesarios para las rutas de causas.
//  */https://documenter.getpostman.com/view/31188339/2sA2r9UhVd#eedc87a0-bee0-49ff-85d5-ed7808608e9f
// const swaggerUi = require('swagger-ui-express'); // Importa Swagger UI para servir la interfaz de la documentación
// const swaggerJsdoc = require('swagger-jsdoc'); // Importa Swagger JSDoc para generar la especificación de Swagger a partir de los comentarios en el código

// /**
//  * @description Configura la interfaz de Swagger UI en la ruta '/api-docs' para visualizar la documentación interactiva de la API.
//  * @param {Object} app - Instancia de la aplicación Express
//  */
// const swaggerSpec2 = swaggerJsdoc({
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Web Service Híbrido REST',
//             version: '1.0.0',
//             description: 'Documentación de API REST híbrida con autenticación mediante token y autenticación básica.'
//         },
//         servers: [
//             {
//                 url: 'https://hercules-stg.similtech.co/api/v1',
//                 description: 'API de ejemplo'
//             },
//             {
//                 url: 'https://hercules-stg.similtech.co',
//                 description: 'API de prueba'
//             }
//         ],
//         components: {
//             securitySchemes: {
//                 basicAuth: {
//                     type: 'http',
//                     scheme: 'basic',
//                     description: 'El método de autenticación básica requiere que el cliente envíe un nombre de usuario y una contraseña en el encabezado de la solicitud HTTP, como parte del esquema de autenticación Basic.'
//                 },
//                 jwtAuth: {
//                     type: 'http',
//                     scheme: 'bearer',
//                     bearerFormat: 'JWT',
//                     description: 'El método de autenticación JWT requiere que el cliente envíe un token JWT en el encabezado de la solicitud HTTP, como parte del esquema de autenticación Bearer.'
//                 }
//                 // oauth2: {
//                 //     type: 'oauth2',
//                 //     flows: {
//                 //         authorizationCode: {
//                 //             authorizationUrl: 'https://example.com/oauth/authorize',
//                 //             tokenUrl: 'https://example.com/oauth/token',
//                 //             scopes: {
//                 //                 'read:documents': 'Read documents',
//                 //                 'write:documents': 'Write documents'
//                 //             }
//                 //         }
//                 //     }
//                 // },
//                 // clientCredentials: {
//                 //     type: 'oauth2',
//                 //     flow: 'clientCredentials',
//                 //     tokenUrl: 'https://example.com/oauth/token',
//                 //     scopes: {
//                 //         'read:data': 'Read data',
//                 //         'write:data': 'Write data'
//                 //     }
//                 // }
//             },
//             schemas: {
//                 xResultCodes: {
//                     type: 'object',
//                     properties: {
//                         1: { type: 'integer', example: 1, description: 'OK' },
//                         2: { type: 'integer', example: 2, description: 'NO EXISTE UN CAMPO REFERENCIA EN EL REQUEST' },
//                         3: { type: 'integer', example: 3, description: 'REFERENCIA YA PAGADA' },
//                         5: { type: 'integer', example: 5, description: 'EL VALOR DEL REACUDO DEBE CORRESPONDER CON EL RETORNADO EN LA CONSULTA' },
//                         6: { type: 'integer', example: 6, description: 'REFERENCIA DE PAGO NO ENCONTRADA' },
//                         7: { type: 'integer', example: 7, description: 'NO SE ADMITEN PAGOS DUPLICADOS' },
//                         8: { type: 'integer', example: 8, description: 'NO EXISTE UN CONVENIO ASOCIADO' },
//                         9: { type: 'integer', example: 9, description: 'NO EXISTE UNA CONFIGURACION ASOCIADA A LA OFICINA PARA DICHO CONVENIO' },
//                         10: { type: 'integer', example: 10, description: 'FACTURA VENCIDA' },
//                         11: { type: 'integer', example: 11, description: 'CREDENCIALES DE ACCESO INVALIDAS' },
//                         12: { type: 'integer', example: 12, description: 'CREDENCIALES DE ACCESO INVALIDAS' },
//                         13: { type: 'integer', example: 13, description: 'ERROR DE COMUNICACION CON EL FACTURADOR' },
//                         14: { type: 'integer', example: 14, description: 'SINTAXIS INVALIDA EN EL REQUEST, VERIFIQUE E INTENTE NUEVAMENTE' },
//                         15: { type: 'integer', example: 15, description: 'MONTO DE PAGO MENOR AL MÍNIMO PERMITIDO' },
//                         16: { type: 'integer', example: 16, description: 'YA EXISTE UN RECAUDO PARA EL NUMERO DE TRANSACCIÓN INGRESADO' },
//                         17: { type: 'integer', example: 17, description: 'NO EXISTE UN PAGO PREVIO PARA REVERSAR' },
//                         18: { type: 'integer', example: 18, description: 'NO ESTA CONFIGURADO EL MODULO CONECTOR' },
//                         19: { type: 'integer', example: 19, description: 'FACTURADOR RESPONDE CON ERROR' },
//                         20: { type: 'integer', example: 20, description: 'FACTURA NO EXISTE' }
//                     }
//                 },
//                 GetAuthorizationTokenRequest: {
//                     type: 'object',
//                     properties: {
//                         username: {
//                             type: 'string',
//                             description: 'Usuario',
//                             example: 'PagoApp',
//                             maxLength: 255  // Límite de caracteres para el usuario
//                         },
//                         password: {
//                             type: 'string',
//                             description: 'Contraseña cifrada con SHA256',
//                             example: 'fe45ff178cbd838e721eceb7d6cfa41289762f03b3392c9cfa25e3cfa2cbe8bb',
//                             maxLength: 255  // Límite de caracteres para la contraseña
//                         },
//                         grant_type: {
//                             type: 'string',
//                             description: 'Garantía de acceso',
//                             example: 'password',
//                             maxLength: 8  // Límite de caracteres para la garantía de acceso
//                         }
//                     },
//                     required: ['username', 'password', 'grant_type']
//                 },
//                 GetAuthorizationTokenResponse: {
//                     type: 'object',
//                     properties: {
//                         Authorized: { type: 'boolean', description: '', example: true || false },
//                         Message: { type: 'string', description: '', example: 'Authorized Success' },
//                         Data: {
//                             type: 'object',
//                             properties: {
//                                 Token: { type: 'string', description: '', example: 'iqC9pwRVmTjcF-Ihra3P375J1KD32YDO6JlAcNk-2yrCAzyzv8kQ8u5gS3LzxK6jciH-mnKKLnwx3JP_8xDTN6Y2SrQiHzV16Y644ZilMzdvVTh-dD58N0nIYaKl9z1wKhBmiJPCktPsOAch5_fKVN3g3sVyBisX3sFT5gGnToTAepMLYDMjYcs85bgQWam2fQUzAmqfvOQx-0_K-h83mqkZq1LrtIUKiIXu_9SUoOwr0gyFr-5nLO3G_7ObQ8PtXUFJS8_Ldff6wIqVD4FSL36jyXHCBXoEeI8Cm-nRi8v212QtL_BbfgxeYirBdvIoGAXPf5Gne8SpMQlE2aTExFAoqyYhINCWma2u4qPVI16oDxED9e9_IRB-dVkuUhGFN_2w_1MggiqZaLH_nv9M21ChOHrRDr7Tu5kWaT7SBCc' },
//                                 Expires: { type: 'string', description: '', example: '119' }
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         paths: {
//             '/security/getToken': {
//                 post: {
//                     summary: 'Obtener un token de autorización',
//                     requestBody: {
//                         content: {
//                             'application/x-www-form-urlencoded': {
//                                 schema: { $ref: '#/components/schemas/GetAuthorizationTokenRequest' }
//                             }
//                         }
//                     },
//                     responses: {
//                         '200': {
//                             description: 'Token generado con éxito',
//                             content: { 'application/json': { schema: { $ref: '#/components/schemas/GetAuthorizationTokenResponse' } } },
//                             tabla: {
//                                 'content-type': {
//                                     description: 'Tipo de contenido de la respuesta',
//                                     schema: {
//                                         type: 'string',
//                                         example: 'application/json; charset=utf-8'
//                                     }
//                                 }
//                             },
//                             headers: {
//                                 // 'content-type': {
//                                 //     description: 'Tipo de contenido de la respuesta',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'application/json; charset=utf-8'
//                                 //     }
//                                 // },
//                                 // 'server': {
//                                 //     description: 'Servidor que maneja la solicitud',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'Microsoft-IIS/10.0'
//                                 //     }
//                                 // },
//                                 // 'x-powered-by': {
//                                 //     description: 'Tecnología utilizada para procesar la solicitud',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'ASP.NET'
//                                 //     }
//                                 // },
//                                 // 'date': {
//                                 //     description: 'Fecha y hora en que se generó la respuesta',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'Wed, 06 Oct 2021 22:51:30 GMT'
//                                 //     }
//                                 // },
//                                 // 'content-length': {
//                                 //     description: 'Longitud del contenido de la respuesta',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: '525'
//                                 //     }
//                                 // }
//                             }
//                         },
//                         '401': {
//                             description: 'No autorizado',
//                             content: {
//                                 'application/json': {
//                                     schema: {
//                                         type: 'object',
//                                         properties: {
//                                             Authorized: { type: 'boolean', example: false },
//                                             Message: { type: 'string', example: 'Access Denied' },
//                                             Detail: { type: 'string', example: 'BadRequest' },
//                                             Data: { type: 'object', example: {} }
//                                         }
//                                     }
//                                 }
//                             },
//                             headers: {
//                                 // 'content-type': {
//                                 //     description: 'Tipo de contenido de la respuesta',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'application/json; charset=utf-8'
//                                 //     }
//                                 // },
//                                 // 'server': {
//                                 //     description: 'Servidor que maneja la solicitud',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'Microsoft-IIS/10.0'
//                                 //     }
//                                 // },
//                                 // 'x-powered-by': {
//                                 //     description: 'Tecnología utilizada para procesar la solicitud',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'ASP.NET'
//                                 //     }
//                                 // },
//                                 // 'date': {
//                                 //     description: 'Fecha y hora en que se generó la respuesta',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: 'Wed, 06 Oct 2021 22:51:30 GMT'
//                                 //     }
//                                 // },
//                                 // 'content-length': {
//                                 //     description: 'Longitud del contenido de la respuesta',
//                                 //     schema: {
//                                 //         type: 'string',
//                                 //         example: '78'
//                                 //     }
//                                 // }
//                             }
//                         },
//                         '500': { description: 'Error interno' }
//                     }
//                 }
//             },
//             '/transaction/viernes/query': {
//                 post: {
//                     summary: 'Consulta de saldo o valor a pagar asociado a una factura',
//                     description: 'Este método permite conocer el saldo o valor a pagar asociado a una factura determinada, dependiendo del convenio de recaudo especificado.',
//                     operationId: 'BillQuery',
//                     requestBody: {
//                         required: true,
//                         content: {
//                             'application/json': {
//                                 schema: {
//                                     type: 'object',
//                                     properties: {
//                                         user: {
//                                             type: 'string',
//                                             description: 'Usuario asignado para la entidad recaudadora.',
//                                             example: 'efecty',
//                                             minLength: 3,
//                                             maxLength: 55
//                                         },
//                                         password: {
//                                             type: 'string',
//                                             description: 'Contraseña asignada por Similtech para autenticación de la entidad recaudadora.',
//                                             example: 'pruebas2016',
//                                             minLength: 3,
//                                             maxLength: 255
//                                         },
//                                         office: {
//                                             type: 'integer',
//                                             description: 'Número de identificación del banco o entidad recaudadora.',
//                                             example: 3,
//                                             minimum: 1,
//                                             maximum: 999
//                                         },
//                                         project: {
//                                             type: 'integer',
//                                             description: 'Número de identificación del convenio de recaudo.',
//                                             example: 67,
//                                             minimum: 1,
//                                             maximum: 999
//                                         },
//                                         reference: {
//                                             type: 'string',
//                                             description: 'Número de referencia asociada a la factura a consultar.',
//                                             example: '81460',
//                                             minLength: 3,
//                                             maxLength: 255
//                                         },
//                                         totalAmount: {
//                                             type: 'string',
//                                             description: 'Valor total de la factura a pagar.',
//                                             example: '22',
//                                         },
//                                     },
//                                     required: ['user', 'password', 'office', 'project', 'reference'],
//                                 },
//                             },
//                         },
//                     },
//                     responses: {
//                         '200': {
//                             description: 'Factura consultada correctamente',
//                             content: {
//                                 'application/json': {
//                                     schema: {
//                                         type: 'object',
//                                         properties: {
//                                             ResultCode: {
//                                                 type: 'integer',
//                                                 example: 1,
//                                                 minimum: 1,
//                                                 maximum: 999
//                                             },
//                                             Result: {
//                                                 type: 'string',
//                                                 example: 'OK',
//                                                 minLength: 3,
//                                                 maxLength: 255
//                                             },
//                                             DataAuthorizer: {
//                                                 type: 'object',
//                                                 properties: {
//                                                     PrimaryReference: {
//                                                         type: 'string',
//                                                         example: '81460',
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     },
//                                                     FullReference: {
//                                                         type: 'string',
//                                                         example: '0',
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     },
//                                                     Amount: {
//                                                         type: 'integer',
//                                                         example: 44800,
//                                                         minimum: 999,
//                                                         maximum: 999999
//                                                     },
//                                                     ExpirationDate: {
//                                                         type: 'string',
//                                                         format: 'date-time',
//                                                         example: '2021-07-31T00:00:00'
//                                                     },
//                                                     BillDate: {
//                                                         type: 'string',
//                                                         format: 'date-time',
//                                                         example: '2020-09-03T10:12:47'
//                                                     },
//                                                     PaidOut: {
//                                                         type: 'boolean',
//                                                         example: false
//                                                     },
//                                                     RecordingDate: {
//                                                         type: 'string',
//                                                         format: 'date-time',
//                                                         example: '2020-09-03T10:12:47'
//                                                     },
//                                                     Data: {
//                                                         type: 'string',
//                                                         example: null,
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     }
//                                                 }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                         ,
//                         '400': {
//                             description: 'Solicitud incorrecta'
//                         },
//                         '401': {
//                             description: 'No autorizado'
//                         },
//                         '500': {
//                             description: 'Error interno del servidor'
//                         }
//                     },
//                     security: [
//                         {
//                             basicAuth: [] // Usar Basic Auth
//                         },
//                         {
//                             jwtAuth: [] // Usar JWT Authentication
//                         }
//                         // {
//                         //     oauth2: [] // Usar OAuth2.0
//                         // },
//                         // {
//                         //     clientCredentials: [] // Usar Client Credentials OAuth2.0
//                         // }
//                     ]
//                 }
//             },
//             '/transaction/viernes/payment': {
//                 post: {
//                     summary: 'Notificar pago de factura',
//                     description: 'Este método permite notificar el pago de una factura previamente consultada.',
//                     operationId: 'BillPayment',
//                     requestBody: {
//                         required: true,
//                         content: {
//                             'application/json': {
//                                 schema: {
//                                     type: 'object',
//                                     properties: {
//                                         user: {
//                                             type: 'string',
//                                             example: 'efecty',
//                                             minLength: 3,
//                                             maxLength: 255
//                                         },
//                                         password: {
//                                             type: 'string',
//                                             example: 'pruebas2016',
//                                             minLength: 3,
//                                             maxLength: 255
//                                         },
//                                         office: {
//                                             type: 'integer',
//                                             example: 3,
//                                             minimum: 1,
//                                             maximum: 999
//                                         },
//                                         project: {
//                                             type: 'integer',
//                                             example: 67,
//                                             minimum: 1,
//                                             maximum: 999
//                                         },
//                                         reference: {
//                                             type: 'string',
//                                             example: '81460',
//                                             minLength: 3,
//                                             maxLength: 255
//                                         },
//                                         totalAmount: {
//                                             type: 'integer',
//                                             description: 'Monto total de la transacción o pago.',
//                                             example: 25000,
//                                             minimum: 1,
//                                             maximum: 999999999999
//                                         },
//                                         controlNumber: {
//                                             type: 'string',
//                                             description: 'Número de control único para identificar transacciones o convenios.',
//                                             example: '987654323',
//                                             minLength: 3,
//                                             maxLength: 255
//                                         },
//                                         data: {
//                                             type: 'object',
//                                             additionalProperties: {
//                                                 type: 'string',
//                                                 minLength: 1,
//                                                 maxLength: 255,
//                                                 description: 'Diccionario de datos clave-valor, donde cada clave es única para cada convenio y proporciona información necesaria para el cliente o para el método de pago.'
//                                             },
//                                             example: {
//                                                 '92359': 'Información para convenio 92359',
//                                                 '60464': 'Recaudo general para convenio 60464',
//                                                 '94343': 'Acuerdo de pagos para convenio 94343'
//                                             }
//                                         }
//                                     },
//                                     required: ['user', 'password', 'office', 'project', 'reference', 'totalAmount', 'controlNumber']
//                                 }
//                             }
//                         }
//                     },
//                     responses: {
//                         '200': {
//                             description: 'Pago de factura exitoso',
//                             content: {
//                                 'application/json': {
//                                     schema: {
//                                         type: 'object',
//                                         properties: {
//                                             ResultCode: {
//                                                 type: 'integer',
//                                                 example: 1,
//                                                 minimum: 1,
//                                                 maximum: 999
//                                             },
//                                             Result: {
//                                                 type: 'string',
//                                                 example: 'OK',
//                                                 minLength: 3,
//                                                 maxLength: 255
//                                             },
//                                             DataAuthorizer: {
//                                                 type: 'object',
//                                                 properties: {
//                                                     CollectionId: {
//                                                         type: 'integer',
//                                                         example: 94499,
//                                                         minimum: 1,
//                                                         maximum: 999999
//                                                     },
//                                                     ProjectId: {
//                                                         type: 'integer',
//                                                         example: 67,
//                                                         minimum: 1,
//                                                         maximum: 999
//                                                     },
//                                                     UserId: {
//                                                         type: 'integer',
//                                                         example: 12,
//                                                         minimum: 1,
//                                                         maximum: 999
//                                                     },
//                                                     Reference: {
//                                                         type: 'string',
//                                                         example: '81460',
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     },
//                                                     ControlNumber: {
//                                                         type: 'string',
//                                                         example: '987654323',
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     },
//                                                     Amount: {
//                                                         type: 'integer',
//                                                         example: 25000,
//                                                         minimum: 1,
//                                                         maximum: 999999999999
//                                                     },
//                                                     BillDate: {
//                                                         type: 'string',
//                                                         format: 'date-time',
//                                                         example: '2020-11-09T00:00:00'
//                                                     },
//                                                     RecordingDate: {
//                                                         type: 'string',
//                                                         format: 'date-time',
//                                                         example: '2020-11-09T15:05:01'
//                                                     },
//                                                     Data: {
//                                                         type: 'string',
//                                                         example: null,
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     },
//                                                     AuthNumber: {
//                                                         type: 'string',
//                                                         example: null,
//                                                         minLength: 3,
//                                                         maxLength: 255
//                                                     }
//                                                 }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         },
//                         '400': {
//                             description: 'Solicitud incorrecta'
//                         },
//                         '401': {
//                             description: 'No autorizado'
//                         },
//                         '500': {
//                             description: 'Error interno del servidor'
//                         }
//                     },
//                     security: [
//                         {
//                             basicAuth: [] // Usar Basic Auth
//                         },
//                         {
//                             jwtAuth: [] // Usar JWT Authentication
//                         }
//                     ]
//                 }
//             }
//         }
//     },
//     apis: ['./src/routes/webServicesRestRauter.js']
// });

// /**
//  * @description Configura la interfaz de Swagger UI en la ruta '/api-docs' para visualizar la documentación interactiva de la API.
//  * @param {Object} app - Instancia de la aplicación Express
//  */
// const configureSwagger = (app) => {
//     app.use('/api-docs2', swaggerUi.serve, swaggerUi.setup(swaggerSpec2)); // Habilita Swagger UI en la ruta '/api-docs'
// };

// // Exporta la función para ser utilizada en el archivo principal de la aplicación
// module.exports = configureSwagger;