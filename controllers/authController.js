const { matchedData } = require('express-validator');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/sendResponse');
const createToken = require('../utils/token');

const register = async (req, res) => {
  const { fullName, email, password, phoneNumber } = matchedData(req, { locations: ['body'] });
  const user = await User.create({ fullName, email, password, phoneNumber });
  sendResponse(res, 201, 'User registered successfully.', { token: createToken(user._id), user });
};

const login = async (req, res) => {
  const { email, password } = matchedData(req, { locations: ['body'] });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password.');
  sendResponse(res, 200, 'Login successful.', { token: createToken(user._id), user });
};

module.exports = { register, login };
