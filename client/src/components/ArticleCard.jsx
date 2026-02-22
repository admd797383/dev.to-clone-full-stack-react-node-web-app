import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ArticleCard = ({ article, onBookmarkChange }) => {
  const {
    title,
    description,
    slug,
    tags,
    author,
    publishedAt,
    readingTime,
    likes,
    commentsCount,
    views,
    isBookmarked
  } = article;

  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(isBookmarked || false);
  const [bookmarking, setBookmarking] = useState(false);

  const formattedDate = publishedAt 
    ? format(new Date(publishedAt), 'MMM d')
    : '';

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    if (bookmarking) return;

    setBookmarking(true);
    try {
      const response = await api.post(`/articles/${article._id}/bookmark`);
      setBookmarked(response.data.bookmarked);
      if (onBookmarkChange) {
        onBookmarkChange(response.data.bookmarked);
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <article className="article-card">
      <div className="article-card-header">
        <Link to={`/${author?.username}`}>
          <img 
            src={author?.avatar || 'https://i.pravatar.cc/150?u=default'} 
            alt={author?.username}
            className="article-card-avatar"
          />
        </Link>
        <div className="article-card-author">
          <Link to={`/${author?.username}`}>
            <strong>{author?.name || author?.username}</strong>
          </Link>
          <span> • {formattedDate}</span>
        </div>
        {user && (
          <button 
            className={`article-card-bookmark ${bookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
            disabled={bookmarking}
            title={bookmarked ? 'Remove from reading list' : 'Add to reading list'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        )}
      </div>

      <h2 className="article-card-title">
        <Link to={`/article/${slug}`}>{title}</Link>
      </h2>

      {description && (
        <p className="article-card-description">{description}</p>
      )}

      <div className="article-card-meta">
        {tags && tags.length > 0 && (
          <div className="article-card-tags">
            {tags.slice(0, 4).map((tag, index) => {
              const tagName = typeof tag === 'object' ? tag.name : tag;
              const tagSlug = typeof tag === 'object' ? tag.slug : tag;
              if (!tagName) return null;
              return (
                <Link key={index} to={`/tag/${tagSlug}`} className="tag">
                  #{tagName}
                </Link>
              );
            })}
          </div>
        )}
        
        <div className="article-card-stats">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {likes?.length || 0}
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {commentsCount || 0}
          </span>
          <span>
            {readingTime} min read
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
