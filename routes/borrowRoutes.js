const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { borrowBook, returnBook } = require('../controllers/borrowController');

const router = express.Router();

router.post('/', authenticate, body('bookId').isMongoId(), validate, borrowBook);
router.put('/:id/return', authenticate, returnBook);

module.exports = router;
