const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

module.exports = async (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication is required.');

  let userId;
  try {
    userId = jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch (_error) {
    throw new ApiError(401, 'Invalid or expired authentication token.');
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, 'The account for this token no longer exists.');
  req.user = user;
  next();
};
