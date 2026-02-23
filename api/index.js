import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
import authRoutes from '../server/routes/auth.js';
import articleRoutes from '../server/routes/articles.js';
import userRoutes from '../server/routes/users.js';
import commentRoutes from '../server/routes/comments.js';
import tagRoutes from '../server/routes/tags.js';

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dev.to Clone API is running' });
});

// MongoDB connection for Vercel
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Vercel serverless function handler
export default async function handler(req, res) {
  // Connect to MongoDB on each request
  await connectDB();
  
  // Send the request to Express
  return app(req, res);
}
