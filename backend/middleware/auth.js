const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fleetflow_super_secret_key';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];

    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({ error: 'Forbidden. You do not have permission.' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
