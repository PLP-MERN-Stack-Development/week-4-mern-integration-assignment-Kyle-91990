const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// POST /api/users/register
router.post('/register',
  body('username').notEmpty(),
  body('password').isLength({ min: 5 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const hashed = await bcrypt.hash(req.body.password, 10);
      const user = new User({ username: req.body.username, password: hashed });
      await user.save();
      res.status(201).json({ message: 'User registered' });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/users/login
router.post('/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
