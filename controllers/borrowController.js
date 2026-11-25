const { matchedData } = require('express-validator');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/sendResponse');

const borrowBook = async (req, res) => {
  const { bookId } = matchedData(req, { locations: ['body'] });
  const book = await Book.findOneAndUpdate(
    { _id: bookId, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );

  if (!book) {
    if (!await Book.exists({ _id: bookId })) throw new ApiError(404, 'Book not found.');
    throw new ApiError(409, 'No copies of this book are currently available.');
  }

  try {
    const borrow = await Borrow.create({ user: req.user._id, book: book._id });
    sendResponse(res, 201, 'Book borrowed successfully.', borrow);
  } catch (error) {
    await Book.updateOne({ _id: book._id }, { $inc: { availableCopies: 1 } });
    throw error;
  }
};

const returnBook = async (req, res) => {
  const borrow = await Borrow.findOne({
    _id: req.params.id,
    user: req.user._id,
    status: 'BORROWED'
  });

  if (!borrow) {
    const record = await Borrow.findById(req.params.id);
    if (!record) throw new ApiError(404, 'Borrow record not found.');
    if (!record.user.equals(req.user._id)) {
      throw new ApiError(403, 'You can only return your own borrow records.');
    }
    throw new ApiError(409, 'This book has already been returned.');
  }

  const book = await Book.findById(borrow.book);
  if (!book) throw new ApiError(404, 'The book for this borrow record no longer exists.');

  const updatedBorrow = await Borrow.findOneAndUpdate(
    { _id: borrow._id, status: 'BORROWED' },
    { status: 'RETURNED', returnDate: new Date() },
    { new: true }
  );
  if (!updatedBorrow) throw new ApiError(409, 'This book has already been returned.');

  await Book.updateOne({ _id: book._id }, { $inc: { availableCopies: 1 } });
  sendResponse(res, 200, 'Book returned successfully.', updatedBorrow);
};

module.exports = { borrowBook, returnBook };
