import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ArticleCard = ({ article }) => {
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
    views
  } = article;

  const formattedDate = publishedAt 
    ? format(new Date(publishedAt), 'MMM d')
    : '';

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
            {tags.slice(0, 4).map((tag, index) => (
              <Link key={index} to={`/tag/${tag}`} className="tag">
                #{tag}
              </Link>
            ))}
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
