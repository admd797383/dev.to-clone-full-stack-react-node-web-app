import express from 'express';
import Tag from '../models/Tag.js';
import Article from '../models/Article.js';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const tags = await Tag.find()
      .sort({ articlesCount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Tag.countDocuments();

    res.json({
      success: true,
      tags,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get popular tags
router.get('/popular', async (req, res) => {
  try {
    const tags = await Tag.find()
      .sort({ articlesCount: -1 })
      .limit(10);

    res.json({
      success: true,
      tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single tag
router.get('/:slug', async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    // Get articles with this tag (case-insensitive match)
    const { page = 1, limit = 10 } = req.query;
    
    const articles = await Article.find({ 
      tags: { $regex: new RegExp('^' + tag.name + '$', 'i') },
      published: true 
    })
      .populate('author', 'username name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Article.countDocuments({ 
      tags: { $regex: new RegExp('^' + tag.name + '$', 'i') },
      published: true 
    });

    res.json({
      success: true,
      tag,
      articles,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Follow tag
router.post('/:id/follow', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    const followIndex = tag.followers.indexOf(req.user?._id);
    if (followIndex > -1) {
      tag.followers.splice(followIndex, 1);
    } else if (req.user) {
      tag.followers.push(req.user._id);
    } else {
      return res.status(401).json({
        success: false,
        message: 'Please login to follow tags'
      });
    }

    await tag.save();

    res.json({
      success: true,
      following: followIndex === -1,
      followersCount: tag.followers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
