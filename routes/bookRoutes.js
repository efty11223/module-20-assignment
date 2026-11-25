const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const router = express.Router();

const createValidation = ['title', 'author', 'category', 'isbn']
  .map((field) => body(field).trim().notEmpty().withMessage(`${field} is required.`));
const updateValidation = ['title', 'author', 'category', 'isbn']
  .map((field) => body(field).optional().trim().notEmpty());
const otherFields = [
  body('publishedYear').optional().isInt({ min: 0, max: 9999 }).toInt(),
  body('description').optional().isString().trim(),
  body('availableCopies').optional().isInt({ min: 0 }).toInt()
];

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', authenticate, [...createValidation, ...otherFields], validate, createBook);
router.put('/:id', authenticate, [...updateValidation, ...otherFields], validate, updateBook);
router.delete('/:id', authenticate, deleteBook);

module.exports = router;
