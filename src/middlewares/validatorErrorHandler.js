const boom = require('@hapi/boom');

function validatorErrorHandler(schema, property) {
    return (req, res, next) => {
        const data = req[property];
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            next(boom.badRequest(error));
        } else {
            next();
        }
    }
}

module.exports = validatorErrorHandler;