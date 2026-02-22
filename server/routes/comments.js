import express from 'express';
import jwt from 'jsonwebtoken';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Article from '../models/Article.js';

const router = express.Router();

// Helper function to transform author object with proper avatar URL
const transformAuthor = (author) => {
  if (!author) return null;
  // Check if it's a Mongoose document with getAvatarUrl method
  const avatar = author.getAvatarUrl ? author.getAvatarUrl() : author.avatar;
  return {
    ...author,
    avatar
  };
};

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
    // Helper function to recursively get and populate comments
    const getPopulatedReplies = async (replies) => {
      if (!replies || replies.length === 0) return [];
      
      const populatedReplies = [];
      for (const reply of replies) {
        // Get the full reply document with author populated
        const fullReply = await Comment.findById(reply._id)
          .populate('author', 'username name avatar');
        
        if (fullReply) {
          // Transform author with proper avatar URL
          const replyObj = fullReply.toObject();
          if (replyObj.author) {
            replyObj.author = transformAuthor(replyObj.author);
          }
          
          if (replyObj.replies && replyObj.replies.length > 0) {
            // Recursively populate nested replies
            replyObj.replies = await getPopulatedReplies(replyObj.replies);
          }
          
          populatedReplies.push(replyObj);
        }
      }
      return populatedReplies;
    };

    // Get top-level comments
    const comments = await Comment.find({ 
      article: req.params.articleId,
      parentComment: null
    })
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 });

    // Transform comments with proper avatar URL and populate replies
    const transformedComments = [];
    for (const comment of comments) {
      const commentObj = comment.toObject();
      if (commentObj.author) {
        commentObj.author = transformAuthor(commentObj.author);
      }
      
      if (commentObj.replies && commentObj.replies.length > 0) {
        commentObj.replies = await getPopulatedReplies(commentObj.replies);
      }
      
      transformedComments.push(commentObj);
    }

    res.json({
      success: true,
      comments: transformedComments
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

    // Transform author with proper avatar URL
    const commentObj = comment.toObject();
    if (commentObj.author) {
      commentObj.author = transformAuthor(commentObj.author);
    }

    res.status(201).json({
      success: true,
      comment: commentObj
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

    // Transform author with proper avatar URL
    const commentObj = comment.toObject();
    if (commentObj.author) {
      commentObj.author = transformAuthor(commentObj.author);
    }

    res.json({
      success: true,
      comment: commentObj
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

export default router;
