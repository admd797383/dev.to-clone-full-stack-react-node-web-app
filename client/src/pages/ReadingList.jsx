import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { ReadingListSkeleton } from '../components/SkeletonLoader';

const ReadingList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchReadingList();
  }, [user]);

  const fetchReadingList = async () => {
    try {
      const response = await api.get('/articles/reading-list');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = async (isBookmarked) => {
    if (!isBookmarked) {
      // Article was removed from reading list, refresh the list
      fetchReadingList();
    }
  };

  if (!user || loading) {
    return <ReadingListSkeleton />;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Reading List</h1>
      
      <div className="articles-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard 
              key={article._id} 
              article={{...article, isBookmarked: true}} 
              onBookmarkChange={handleBookmarkChange}
            />
          ))
        ) : (
          <div className="reading-list-empty">
            <h2>Your reading list is empty</h2>
            <p>Save articles to read later by clicking the bookmark icon.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Explore Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingList;
