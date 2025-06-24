const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/comments/:postId - get comments for a post
router.get('/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// POST /api/comments/:postId - add comment to a post (protected)
router.post(
  '/:postId',
  auth,
  body('text').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const comment = new Comment({
        post: req.params.postId,
        author: req.user.userId,
        text: req.body.text
      });
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
