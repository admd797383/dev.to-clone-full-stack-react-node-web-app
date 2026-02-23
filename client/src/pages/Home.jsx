import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { ArticleCardSkeleton } from '../components/SkeletonLoader';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async (pageNum = 1) => {
    try {
      const response = await api.get(`/articles?page=${pageNum}&limit=5`);
      
      if (pageNum === 1) {
        setArticles(response.data.articles);
      } else {
        setArticles(prev => [...prev, ...response.data.articles]);
      }
      
      // Determine if there are more pages
      const moreAvailable = pageNum < response.data.totalPages;
      setHasMore(moreAvailable);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchArticles(page + 1);
    }
  };

  const { isLoading, setNoMore } = useInfiniteScroll(
    loadMore,
    300,
    !loading && hasMore
  );

  // Update hasMore status when it changes
  useEffect(() => {
    if (!hasMore) {
      setNoMore();
    }
  }, [hasMore, setNoMore]);

  if (loading) {
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
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      </div>
    );
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
          articles.map((article) => (
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

      {/* Loading more indicator */}
      {isLoading && hasMore && (
        <div className="loading-more" style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'var(--text-secondary)'
        }}>
          <div className="spinner" style={{
            width: '24px',
            height: '24px',
            border: '3px solid var(--bg-tertiary)',
            borderTopColor: 'var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '0.5rem' }}>Loading more articles...</p>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && articles.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'var(--text-secondary)'
        }}>
          <p>You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default Home;
