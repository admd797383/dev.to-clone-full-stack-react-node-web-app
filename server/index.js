import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import tagRoutes from './routes/tags.js';

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dev.to Clone API is running' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devto-clone';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Start server anyway for development without MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without MongoDB)`);
    });
  });

export default app;
