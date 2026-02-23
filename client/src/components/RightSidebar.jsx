import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RightSidebar = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags/popular');
      setTags(response.data.tags.slice(0, 10));
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Sample tags for demo
      setTags([
        { _id: '1', name: 'javascript', slug: 'javascript' },
        { _id: '2', name: 'react', slug: 'react' },
        { _id: '3', name: 'webdev', slug: 'webdev' },
        { _id: '4', name: 'beginners', slug: 'beginners' },
        { _id: '5', name: 'programming', slug: 'programming' },
        { _id: '6', name: 'tutorial', slug: 'tutorial' },
        { _id: '7', name: 'css', slug: 'css' },
        { _id: '8', name: 'nodejs', slug: 'nodejs' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="right-sidebar">
      <div className="sidebar-card">
        <h3 className="sidebar-card-header">Popular Tags</h3>
        <div className="sidebar-card-content">
          {loading ? (
            <div className="loading">Loading tags...</div>
          ) : (
            <div className="sidebar-tags">
              {tags.map(tag => (
                <Link 
                  key={tag._id} 
                  to={`/tag/${tag.slug}`} 
                  className="sidebar-tag"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {!user && (
        <div className="sidebar-card">
          <h3 className="sidebar-card-header">About Dev.to Clone</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            A community of developers sharing knowledge and helping each other grow.
            Create your account to start writing and engaging with the community.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Get Started
          </Link>
        </div>
      )}

      <div className="sidebar-card">
        <h3 className="sidebar-card-header">Trending</h3>
        <div className="sidebar-card-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {tags.slice(0, 4).map(tag => (
                <p key={tag._id} style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to={`/tag/${tag.slug}`} 
                    style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}
                  >
                    #{tag.name}
                  </Link>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
