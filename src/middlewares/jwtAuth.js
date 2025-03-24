const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('http-errors'); // Si necesitas crear un error de autorización.

const jwtSecret = 'mysecretkey'; // Debes cambiar esto a una clave secreta más segura y mantenerla privada.

const jwtAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado "Authorization"

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verificar y decodificar el token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = decoded; // Almacenar la información decodificada en el objeto `user`
        next();
    });
};

module.exports = jwtAuth;