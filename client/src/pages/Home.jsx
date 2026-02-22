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

export default Home;
