const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Article = require('../models/Article');

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get comments for an article
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      article: req.params.articleId,
      parentComment: null
    })
      .populate('author', 'username name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username name avatar' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, articleId, parentCommentId } = req.body;

    const comment = await Comment.create({
      content,
      article: articleId,
      author: req.user._id,
      parentComment: parentCommentId || null
    });

    // Update article comments count
    await Article.findByIdAndUpdate(articleId, {
      $inc: { commentsCount: 1 }
    });

    // If it's a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    await comment.populate('author', 'username name avatar');

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = content || comment.content;
    await comment.save();

    await comment.populate('author', 'username name avatar');

    res.json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Update article comments count
    await Article.findByIdAndUpdate(comment.article, {
      $inc: { commentsCount: -1 }
    });

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Like comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const likeIndex = comment.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likesCount: comment.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
