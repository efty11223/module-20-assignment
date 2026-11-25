const { matchedData } = require('express-validator');
const User = require('../models/User');
const Borrow = require('../models/Borrow');
const sendResponse = require('../utils/sendResponse');

const getProfile = (req, res) => {
  sendResponse(res, 200, 'Profile retrieved successfully.', req.user);
};

const updateProfile = async (req, res) => {
  const fields = matchedData(req, { locations: ['body'] });
  const user = await User.findByIdAndUpdate(req.user._id, fields, { new: true, runValidators: true });
  sendResponse(res, 200, 'Profile updated successfully.', user);
};

const getBorrowedBooks = async (req, res) => {
  const borrowedBooks = await Borrow.find({ user: req.user._id })
    .populate('book', 'title author category isbn').sort({ borrowDate: -1 });
  sendResponse(res, 200, 'Borrowing history retrieved successfully.', borrowedBooks);
};

module.exports = { getProfile, updateProfile, getBorrowedBooks };
