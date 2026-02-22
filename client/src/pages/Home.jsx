import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Set sample articles for demo
      setArticles(getSampleArticles());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <h1 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        marginBottom: '1.5rem',
        color: 'var(--text-primary)'
      }}>
        Latest Articles
      </h1>
      
      <div className="articles-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <div className="empty-state">
            <h2>No articles yet</h2>
            <p>Be the first to publish an article!</p>
            <Link to="/new-article" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Write an Article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample data for demo
const getSampleArticles = () => [
  {
    _id: '1',
    title: 'Getting Started with React in 2024',
    description: 'A comprehensive guide to learning React, covering hooks, state management, and best practices for modern web development.',
    slug: 'getting-started-with-react-2024',
    tags: ['react', 'javascript', 'webdev'],
    author: { username: 'johndoe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 8,
    likes: [{ _id: '1' }, { _id: '2' }],
    commentsCount: 5,
    views: 120
  },
  {
    _id: '2',
    title: 'Building REST APIs with Node.js and Express',
    description: 'Learn how to create robust and scalable REST APIs using Node.js and Express framework.',
    slug: 'building-rest-apis-nodejs-express',
    tags: ['nodejs', 'express', 'api'],
    author: { username: 'janedoe', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=jane' },
    publishedAt: '2024-01-14T15:30:00Z',
    readingTime: 12,
    likes: [{ _id: '1' }],
    commentsCount: 3,
    views: 85
  },
  {
    _id: '3',
    title: 'CSS Grid vs Flexbox: When to Use Which?',
    description: 'A detailed comparison between CSS Grid and Flexbox to help you choose the right layout tool.',
    slug: 'css-grid-vs-flexbox',
    tags: ['css', 'webdesign', 'frontend'],
    author: { username: 'webdev', name: 'Web Dev', avatar: 'https://i.pravatar.cc/150?u=webdev' },
    publishedAt: '2024-01-13T09:00:00Z',
    readingTime: 6,
    likes: [{ _id: '1' }, { _id: '2' }, { _id: '3' }],
    commentsCount: 8,
    views: 200
  },
  {
    _id: '4',
    title: 'Understanding TypeScript Generics',
    description: 'A deep dive into TypeScript generics and how they can make your code more reusable and type-safe.',
    slug: 'understanding-typescript-generics',
    tags: ['typescript', 'programming', 'tutorial'],
    author: { username: 'coder', name: 'Code Master', avatar: 'https://i.pravatar.cc/150?u=coder' },
    publishedAt: '2024-01-12T14:00:00Z',
    readingTime: 10,
    likes: [{ _id: '1' }, { _id: '2' }],
    commentsCount: 4,
    views: 150
  },
  {
    _id: '5',
    title: 'The Future of Web Development in 2024',
    description: 'Exploring emerging trends and technologies that will shape web development in the coming year.',
    slug: 'future-web-development-2024',
    tags: ['webdev', 'trends', 'future'],
    author: { username: 'techguru', name: 'Tech Guru', avatar: 'https://i.pravatar.cc/150?u=techguru' },
    publishedAt: '2024-01-11T11:00:00Z',
    readingTime: 7,
    likes: [{ _id: '1' }],
    commentsCount: 12,
    views: 300
  }
];

export default Home;
