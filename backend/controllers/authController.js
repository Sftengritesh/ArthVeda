const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'A proper email is required' });
    }

    const domain = email.split('@')[1];

    // Deep Validation: DNS & MX checking on domain
    try {
      const dns = require('dns').promises;
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return res.status(400).json({ success: false, message: 'Email domain cannot receive mail (No MX records)' });
      }
    } catch (dnsErr) {
      return res.status(400).json({ success: false, message: 'Invalid email domain (Verification failed)' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user (password hash is handled in User model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    const tokens = generateTokens(user._id);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const tokens = generateTokens(user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
};
