module.exports = (req, res, next) => {
  const key = req.headers['x-internal-key'];
  if (!key || key !== process.env.INTERNAL_KEY) {
    return res.status(403).json({ message: 'Недопустимый источник запроса' });
  }
  next();
};