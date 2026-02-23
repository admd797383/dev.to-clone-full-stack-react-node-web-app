import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { ArticleCardSkeleton, SearchResultsSkeleton } from '../components/SkeletonLoader';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchArticles();
    }
  }, [query]);

  const searchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/articles/search/${query}`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <SearchResultsSkeleton />
      ) : (
        <div className="articles-grid">
          {articles.length > 0 ? (
            articles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))
          ) : (
            <div className="empty-state">
              <h2>No results found</h2>
              <p>Try different keywords or browse popular tags.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
