import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchArticles();
  }, [user]);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles/my-articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await api.delete(`/articles/${articleId}`);
      setArticles(articles.filter(a => a._id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/new-article" className="btn btn-primary">
          Write a New Article
        </Link>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          My Articles
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'reading-list' ? 'active' : ''}`}
          onClick={() => navigate('/reading-list')}
        >
          Reading List
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : activeTab === 'articles' ? (
        <div className="articles-grid">
          {articles.length > 0 ? (
            articles.map(article => (
              <div key={article._id} style={{ position: 'relative' }}>
                <ArticleCard article={article} />
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginTop: '0.5rem',
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem'
                }}>
                  <Link 
                    to={`/edit-article/${article._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(article._id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h2>No articles yet</h2>
              <p>Start writing your first article!</p>
              <Link to="/new-article" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Write an Article
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
