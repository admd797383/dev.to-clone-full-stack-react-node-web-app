import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const TagArticles = () => {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTagArticles();
  }, [slug]);

  const fetchTagArticles = async () => {
    try {
      const response = await api.get(`/tags/${slug}`);
      setTag(response.data.tag);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching tag articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div style={{ 
        padding: '2rem', 
        background: 'var(--bg-secondary)', 
        borderRadius: 'var(--border-radius)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ marginBottom: '0.5rem' }}>#{tag?.name || slug}</h1>
        {tag?.description && (
          <p style={{ color: 'var(--text-secondary)' }}>{tag.description}</p>
        )}
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Articles</h2>
      
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
