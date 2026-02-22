import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const TagArticles = () => {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTagArticles();
  }, [slug]);

  const fetchTagArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tags/${slug}`);
      setTag(response.data.tag);
      setArticles(response.data.articles);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Error fetching tag articles:', err);
      setError(err.response?.data?.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        padding: '2rem', 
        background: 'var(--bg-secondary)', 
        borderRadius: 'var(--border-radius)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--primary-color)' }}>#</span>
          {tag?.name || slug}
        </h1>
        {tag?.description && (
          <p style={{ color: 'var(--text-secondary)' }}>{tag.description}</p>
        )}
        {total > 0 && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {total} {total === 1 ? 'article' : 'articles'}
          </p>
        )}
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Latest Articles</h2>
      
      <div className="articles-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <div className="empty-state">
            <h2>No articles yet</h2>
            <p>Be the first to publish an article with this tag!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagArticles;
