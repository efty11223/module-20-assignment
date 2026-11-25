const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('phoneNumber').optional().isString().trim()
], validate, register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('password').isString().notEmpty().withMessage('Password is required.')
], validate, login);

module.exports = router;
