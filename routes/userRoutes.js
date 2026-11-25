const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
  getProfile,
  updateProfile,
  getBorrowedBooks
} = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', [
  body('fullName').optional().trim().notEmpty(),
  body('phoneNumber').optional().trim()
], validate, updateProfile);
router.get('/borrowed-books', getBorrowedBooks);

module.exports = router;
