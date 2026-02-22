import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Article from '../models/Article.js';

const router = express.Router();

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

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's articles
    const articles = await Article.find({ 
      author: user._id, 
      published: true 
    })
      .populate('author', 'username name avatar')
      .sort({ publishedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.getAvatarUrl(),
        website: user.website,
        twitter: user.twitter,
        github: user.github,
        linkedin: user.linkedin,
        followers: user.followers.length,
        following: user.following.length,
        joinedAt: user.createdAt
      },
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, website, twitter, github, linkedin } = req.body;

    const user = await User.findById(req.user._id);

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.website = website || user.website;
    user.twitter = twitter || user.twitter;
    user.github = github || user.github;
    user.linkedin = linkedin || user.linkedin;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.getAvatarUrl(),
        website: user.website,
        twitter: user.twitter,
        github: user.github,
        linkedin: user.linkedin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Follow user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = await User.findById(req.user._id);

    const followIndex = user.following.indexOf(req.params.id);
    if (followIndex > -1) {
      user.following.splice(followIndex, 1);
      userToFollow.followers.pull(req.user._id);
    } else {
      user.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await user.save();
    await userToFollow.save();

    res.json({
      success: true,
      following: followIndex === -1,
      followersCount: userToFollow.followers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username name avatar');

    res.json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username name avatar');

    res.json({
      success: true,
      following: user.following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get current user's saved articles
router.get('/me/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedArticles',
        populate: { path: 'author', select: 'username name avatar' }
      });

    res.json({
      success: true,
      articles: user.savedArticles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
