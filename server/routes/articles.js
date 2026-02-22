const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Article = require('../models/Article');
const User = require('../models/User');
const Tag = require('../models/Tag');

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

// Get all articles (published)
router.get('/', async (req, res) => {
  try {
    const { tag, author, page = 1, limit = 10 } = req.query;
    
    let query = { published: true };
    
    if (tag) {
      query.tags = tag;
    }
    
    if (author) {
      query.author = author;
    }

    const articles = await Article.find(query)
      .populate('author', 'username name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      articles,
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

// Get user's articles (including drafts)
router.get('/my-articles', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const articles = await Article.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Article.countDocuments({ author: req.user._id });

    res.json({
      success: true,
      articles,
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

// Get user's reading list
router.get('/reading-list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'readingList',
        populate: { path: 'author', select: 'username name avatar' }
      });

    res.json({
      success: true,
      articles: user.readingList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'username name avatar bio twitter github website');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create article
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, description, tags, coverImage, published } = req.body;

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const article = await Article.create({
      title,
      slug,
      content,
      description,
      tags: tags || [],
      coverImage,
      author: req.user._id,
      published: published || false,
      publishedAt: published ? new Date() : null
    });

    // Update tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        await Tag.findOneAndUpdate(
          { name: tagName },
          { $inc: { articlesCount: 1 } },
          { upsert: true, new: true }
        );
      }
    }

    await article.populate('author', 'username name avatar');

    res.status(201).json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update article
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, description, tags, coverImage, published } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.description = description || article.description;
    article.tags = tags || article.tags;
    article.coverImage = coverImage || article.coverImage;
    article.published = published !== undefined ? published : article.published;
    
    if (published && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();
    await article.populate('author', 'username name avatar');

    res.json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete article
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    await article.deleteOne();

    res.json({
      success: true,
      message: 'Article deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Like article
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const likeIndex = article.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      article.likes.splice(likeIndex, 1);
    } else {
      article.likes.push(req.user._id);
    }

    await article.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likesCount: article.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Bookmark article
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const bookmarkIndex = article.bookmarks.indexOf(req.user._id);
    if (bookmarkIndex > -1) {
      article.bookmarks.splice(bookmarkIndex, 1);
    } else {
      article.bookmarks.push(req.user._id);
    }

    await article.save();

    // Also add to user's reading list
    const user = await User.findById(req.user._id);
    const readingListIndex = user.readingList.indexOf(article._id);
    if (readingListIndex > -1) {
      user.readingList.splice(readingListIndex, 1);
    } else {
      user.readingList.push(article._id);
    }
    await user.save();

    res.json({
      success: true,
      bookmarked: bookmarkIndex === -1,
      bookmarksCount: article.bookmarks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search articles
router.get('/search/:query', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const articles = await Article.find(
      { 
        $text: { $search: req.params.query },
        published: true 
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'username name avatar');

    const total = articles.length;

    res.json({
      success: true,
      articles,
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

module.exports = router;
