const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  description: {
    type: String,
    maxlength: 300
  },
  coverImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from title
articleSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Calculate reading time (roughly 200 words per minute)
articleSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const words = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200);
  }
  next();
});

// Index for search
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);
