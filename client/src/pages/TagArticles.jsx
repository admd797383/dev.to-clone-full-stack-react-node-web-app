import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { ArticleCardSkeleton, TagHeaderSkeleton } from '../components/SkeletonLoader';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const TagArticles = () => {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setArticles([]);
    setPage(0);
    setHasMore(true);
    setTag(null);
    fetchTagArticles();
  }, [slug]);

  const fetchTagArticles = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tags/${slug}?page=${pageNum}&limit=5`);
      
      if (pageNum === 1) {
        setTag(response.data.tag);
        setArticles(response.data.articles);
        setTotal(response.data.total);
      } else {
        setArticles(prev => [...prev, ...response.data.articles]);
      }
      
      const moreAvailable = pageNum < response.data.totalPages;
      setHasMore(moreAvailable);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching tag articles:', err);
      setError(err.response?.data?.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchTagArticles(page + 1);
    }
  };

  const { isLoading, setNoMore } = useInfiniteScroll(
    loadMore,
    300,
    !loading && hasMore
  );

  useEffect(() => {
    if (!hasMore) {
      setNoMore();
    }
  }, [hasMore, setNoMore]);

  if (loading && page === 0) {
    return (
      <div>
        <TagHeaderSkeleton />
        <h2 style={{ marginBottom: '1.5rem' }}>Latest Articles</h2>
        <div className="articles-grid">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      </div>
    );
  }

  if (error && page === 0) {
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
          articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <div className="empty-state">
            <h2>No articles yet</h2>
            <p>Be the first to publish an article with this tag!</p>
          </div>
        )}
      </div>

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

      {!hasMore && articles.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'var(--text-secondary)'
        }}>
          <p>You've seen all articles with this tag! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default TagArticles;
