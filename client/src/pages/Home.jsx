import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    fetchPopularTags();
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

  const fetchPopularTags = async () => {
    try {
      const response = await api.get('/tags/popular');
      setTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags(getSampleTags());
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="two-column">
      <div>
        <h1 style={{ marginBottom: '1.5rem' }}>Latest Articles</h1>
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

      <aside className="sidebar">
        <h3 className="sidebar-title">Popular Tags</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map(tag => (
            <Link key={tag._id} to={`/tag/${tag.slug}`} className="tag">
              {tag.name}
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 className="sidebar-title">About Dev.to Clone</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            A community of developers sharing knowledge and helping each other grow. 
            Create your account to start writing and engaging with the community.
          </p>
        </div>
      </aside>
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
  }
];

const getSampleTags = () => [
  { _id: '1', name: 'javascript', slug: 'javascript' },
  { _id: '2', name: 'react', slug: 'react' },
  { _id: '3', name: 'nodejs', slug: 'nodejs' },
  { _id: '4', name: 'css', slug: 'css' },
  { _id: '5', name: 'webdev', slug: 'webdev' },
  { _id: '6', name: 'programming', slug: 'programming' },
  { _id: '7', name: 'tutorial', slug: 'tutorial' },
  { _id: '8', name: 'beginners', slug: 'beginners' }
];

export default Home;
