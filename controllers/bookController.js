const { matchedData } = require('express-validator');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/sendResponse');

const getFields = (req) => matchedData(req, { locations: ['body'] });
const getQueryText = (value) => (typeof value === 'string' ? value.trim() : '');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createBook = async (req, res) => {
  const book = await Book.create({ ...getFields(req), createdBy: req.user._id });
  sendResponse(res, 201, 'Book created successfully.', book);
};

const getBooks = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const filter = {};
  const search = getQueryText(req.query.search);
  const category = getQueryText(req.query.category);

  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };
  if (category) filter.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };

  const direction = ['asc', '1'].includes(String(req.query.sort).toLowerCase()) ? 1 : -1;
  const [books, total] = await Promise.all([
    Book.find(filter).sort({ createdAt: direction }).skip((page - 1) * limit).limit(limit),
    Book.countDocuments(filter)
  ]);

  sendResponse(res, 200, 'Books retrieved successfully.', {
    books,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
};

const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found.');
  sendResponse(res, 200, 'Book retrieved successfully.', book);
};

const updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found.');

  const isOwner = book.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Only the book owner or an admin can update this book.');
  }

  Object.assign(book, getFields(req));
  await book.save();
  sendResponse(res, 200, 'Book updated successfully.', book);
};

const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found.');

  const isOwner = book.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Only the book owner or an admin can delete this book.');
  }

  if (await Borrow.exists({ book: book._id, status: 'BORROWED' })) {
    throw new ApiError(409, 'A book with active borrow records cannot be deleted.');
  }

  await book.deleteOne();
  sendResponse(res, 200, 'Book deleted successfully.', { id: book._id });
};

module.exports = { createBook, getBooks, getBook, updateBook, deleteBook };
