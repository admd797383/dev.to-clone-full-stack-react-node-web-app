import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 250
  },
  avatar: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  readingList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password || !candidatePassword) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate gravatar URL
userSchema.methods.getAvatarUrl = function() {
  if (this.avatar) return this.avatar;
  const hash = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const User = mongoose.model('User', userSchema);

export default User;
