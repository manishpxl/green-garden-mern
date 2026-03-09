const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

const validateToken = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({ message: 'Authentication failed' });
        }
    }

    if (!token) {
        res.status(400).json({ message: 'Authentication failed' });
    }
};

module.exports = {
    generateToken,
    validateToken
};
