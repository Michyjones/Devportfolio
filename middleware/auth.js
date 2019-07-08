const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('token');

  if (!token) {
    res.status(401).json({ msg: 'Unauthorize access, token required !!' });
  }
  try {
    const decode = jwt.verify(token, config.get('secretKey'));
    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
