import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Sample tags for demo
      setTags([
        { _id: '1', name: 'javascript', slug: 'javascript', articlesCount: 150 },
        { _id: '2', name: 'react', slug: 'react', articlesCount: 120 },
        { _id: '3', name: 'nodejs', slug: 'nodejs', articlesCount: 95 },
        { _id: '4', name: 'css', slug: 'css', articlesCount: 80 },
        { _id: '5', name: 'webdev', slug: 'webdev', articlesCount: 75 },
        { _id: '6', name: 'programming', slug: 'programming', articlesCount: 60 },
        { _id: '7', name: 'tutorial', slug: 'tutorial', articlesCount: 55 },
        { _id: '8', name: 'beginners', slug: 'beginners', articlesCount: 50 },
        { _id: '9', name: 'python', slug: 'python', articlesCount: 45 },
        { _id: '10', name: 'devops', slug: 'devops', articlesCount: 40 },
        { _id: '11', name: 'career', slug: 'career', articlesCount: 35 },
        { _id: '12', name: 'database', slug: 'database', articlesCount: 30 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Tags</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        A tag is a keyword or label that categorizes your question with other, similar questions.
      </p>
      
      <div className="tags-grid">
        {tags.map(tag => (
          <Link key={tag._id} to={`/tag/${tag.slug}`} className="tag-card">
            <div className="tag-name">#{tag.name}</div>
            <div className="tag-count">{tag.articlesCount || 0} articles</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tags;
