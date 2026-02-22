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
            src={author?.avatar || '/default-avatar.png'} 
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

      {tags && tags.length > 0 && (
        <div className="article-card-tags">
          {tags.slice(0, 4).map((tag, index) => (
            <Link key={index} to={`/tag/${tag}`} className="tag">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="article-card-footer">
        <div className="article-card-stats">
          <span>❤️ {likes?.length || 0}</span>
          <span>💬 {commentsCount || 0}</span>
          <span>👁️ {views || 0}</span>
        </div>
        <span>{readingTime} min read</span>
      </div>
    </article>
  );
};

export default ArticleCard;
