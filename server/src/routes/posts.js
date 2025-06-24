import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET /api/posts - get all posts with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().skip(skip).limit(limit).populate('category'),
      Post.countDocuments()
    ]);

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - create a new post (protected)
router.post(
  '/',
  auth,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const post = new Post({
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
      });
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/:id - update post (protected)
router.put(
  '/:id',
  auth,
  async (req, res, next) => {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
















export default router;});  }    next(err);  } catch (err) {    res.status(204).end();    }      return res.status(404).json({ message: 'Post not found' });    if (!post) {    const post = await Post.findByIdAndDelete(req.params.id);  try {router.delete('/:id', auth, async (req, res, next) => {// DELETE /api/posts/:id - delete post (protected));  }
});

export default router;