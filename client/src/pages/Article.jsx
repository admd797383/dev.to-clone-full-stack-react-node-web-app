import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/articles/${slug}`);
      setArticle(response.data.article);
      setLikesCount(response.data.article.likes.length);
      
      // Fetch comments after getting the article
      if (response.data.article._id) {
        fetchComments(response.data.article._id);
      }
      
      if (user && response.data.article.likes.includes(user.id)) {
        setLiked(true);
      }
      if (user && response.data.article.bookmarks.includes(user.id)) {
        setBookmarked(true);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (articleId) => {
    try {
      const response = await api.get(`/comments/article/${articleId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/articles/${article._id}/like`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/articles/${article._id}/bookmark`);
      setBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await api.post('/comments', {
        content: newComment,
        articleId: article._id
      });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const response = await api.post('/comments', {
        content: replyContent,
        articleId: article._id,
        parentCommentId
      });
      
      // Update comments with new reply - handle both top-level and nested replies
      const addReplyToComment = (comments, parentId, newReply) => {
        return comments.map(comment => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies, parentId, newReply)
            };
          }
          return comment;
        });
      };
      
      const updatedComments = addReplyToComment(comments, parentCommentId, response.data.comment);
      setComments(updatedComments);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment._id} className={`comment ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <img 
          src={comment.author?.avatar || '/default-avatar.svg'} 
          alt={comment.author?.username}
          className="comment-avatar"
        />
        <Link to={`/${comment.author?.username}`} className="comment-author">
          {comment.author?.name || comment.author?.username}
        </Link>
        <span className="comment-date">
          {format(new Date(comment.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
      <div className="comment-content">
        {comment.content}
      </div>
      {user && (
        <div className="comment-actions">
          <button 
            className="comment-action-btn"
            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
          >
            Reply
          </button>
        </div>
      )}
      
      {/* Reply Form */}
      {replyingTo === comment._id && (
        <form 
          className="comment-reply-form" 
          onSubmit={(e) => handleReply(e, comment._id)}
        >
          <textarea
            placeholder={`Reply to ${comment.author?.name || comment.author?.username}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={2}
          />
          <div className="comment-reply-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Reply
            </button>
          </div>
        </form>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !article) {
    return (
      <div className="form-container">
        <h2>{error || 'Article not found'}</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go Home
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.username === article.author.username;

  return (
    <div className="article-view">
      <header className="article-header">
        <h1 className="article-title">{article.title}</h1>
        
        <div className="article-meta">
          <Link to={`/${article.author.username}`} className="article-author-info">
            <img 
              src={article.author.avatar || '/default-avatar.svg'} 
              alt={article.author.username}
              className="article-author-avatar"
            />
            <div>
              <div className="article-author-name">{article.author.name}</div>
              <div className="article-author-username">@{article.author.username}</div>
            </div>
          </Link>
          
          <div className="article-stats">
            <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
            <span>{article.readingTime} min read</span>
            <span>{article.views} views</span>
          </div>
        </div>
      </header>

      {article.coverImage && (
        <img 
          src={article.coverImage} 
          alt={article.title}
          className="article-cover-image"
        />
      )}

      <div className="article-content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      <div className="article-actions">
        <button 
          className={`btn ${liked ? 'btn-primary' : 'btn-secondary'}`}
          onClick={handleLike}
        >
          {liked ? '❤️ Liked' : '🤍 Like'} {likesCount}
        </button>
        
        <button 
          className={`btn ${bookmarked ? 'btn-primary' : 'btn-secondary'}`}
          onClick={handleBookmark}
        >
          {bookmarked ? '🔖 Saved' : '🔖 Save'}
        </button>

        {isAuthor && (
          <Link to={`/edit-article/${article._id}`} className="btn btn-secondary">
            Edit Article
          </Link>
        )}
      </div>

      {article.tags && article.tags.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          {article.tags.map(tag => (
            <Link key={tag} to={`/tag/${tag}`} className="tag" style={{ marginRight: '0.5rem' }}>
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>
        
        {user ? (
          <form className="comment-form" onSubmit={handleComment}>
            <textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Post Comment
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}

        <div className="comments-list">
          {comments.map(comment => renderComment(comment))}
          
          {comments.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Article;
