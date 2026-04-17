const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');

// ─── Register ────────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('name', 'Name must be at least 2 characters').isLength({ min: 2 }),

    check('email', 'Please include a valid email').isEmail().normalizeEmail(),

    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('password', 'Password must contain at least one uppercase letter').matches(/[A-Z]/),
    check('password', 'Password must contain at least one number').matches(/\d/),
  ],
  register
);

// ─── Login ────────────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

module.exports = router;