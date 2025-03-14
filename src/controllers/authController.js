const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwtSecret = 'mysecretkey'; // Se debe manejar de forma segura en un archivo de configuración
const users = [
    {
        username: 'admin',
        password: '$2b$10$VsWGFTM6wwD88dcKatxPn.bhzCW9kDcz0XC.IsBA2vff7Ry43EK7e' // Contraseña: 'admin123' (hashed con bcrypt)
    }
];

// const password = 'admin123'; // Contraseña en texto claro
// const saltRounds = 10; // Niveles de "sal" (salt)

// bcrypt.hash(password, saltRounds, (err, hash) => {
//   if (err) {
//     console.error('Error al generar el hash', err);
//   } else {
//     console.log('Nuevo hash generado:', hash);
//   }
// });

// Función para autenticar al usuario
const login = (req, res) => {
    const { username, password } = req.body;

    // Buscar al usuario
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({ message: 'Error al verificar la contraseña' });
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Crear un JWT (si las credenciales son correctas)
        const payload = { username: user.username }; // Datos que quieres incluir en el JWT
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Token válido por 1 hora

        return res.json({ message: 'Autenticación exitosa', token });
    });
};

module.exports = {
    login
};