import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { SearchResultsSkeleton } from '../components/SkeletonLoader';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setArticles([]);
    setPage(0);
    setHasMore(true);
    if (query) {
      searchArticles();
    }
  }, [query]);

  const searchArticles = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/articles/search/${query}?page=${pageNum}&limit=5`);
      
      if (pageNum === 1) {
        setArticles(response.data.articles);
      } else {
        setArticles(prev => [...prev, ...response.data.articles]);
      }
      
      const moreAvailable = pageNum < response.data.totalPages;
      setHasMore(moreAvailable);
      setPage(pageNum);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading && query) {
      searchArticles(page + 1);
    }
  };

  const { isLoading, setNoMore } = useInfiniteScroll(
    loadMore,
    300,
    !loading && hasMore && !!query
  );

  useEffect(() => {
    if (!hasMore) {
      setNoMore();
    }
  }, [hasMore, setNoMore]);

  return (
    <div>
      <div className="search-header">
        <h1 className="search-title">
          Search Results for <span className="search-query">"{query}"</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {articles.length} {articles.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {loading && page === 0 ? (
        <SearchResultsSkeleton />
      ) : (
        <>
          <div className="articles-grid">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            ) : (
              <div className="empty-state">
                <h2>No results found</h2>
                <p>Try different keywords or browse popular tags.</p>
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
              <p style={{ marginTop: '0.5rem' }}>Loading more results...</p>
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              <p>You've reached the end of results! 🎉</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
