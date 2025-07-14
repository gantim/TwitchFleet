const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles]; // поддержка строки типа 'admin'
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Нет токена' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }

      next();
    } catch {
      return res.status(403).json({ error: 'Неверный токен' });
    }
  };
}

module.exports = authMiddleware;