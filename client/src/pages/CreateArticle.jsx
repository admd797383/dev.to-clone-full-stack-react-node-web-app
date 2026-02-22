import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateArticle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const response = await api.post('/articles', {
        title,
        content,
        description,
        tags: tagsArray,
        coverImage,
        published
      });
      
      if (published) {
        navigate(`/article/${response.data.article.slug}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Create New Article</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your article (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="coverImage">Cover Image URL</label>
          <input
            id="coverImage"
            type="url"
            className="form-input"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            className="form-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="javascript, react, webdev"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Content (Markdown supported)</label>
          <textarea
            id="content"
            className="form-input form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here... Markdown is supported!"
            style={{ minHeight: '300px', fontFamily: 'monospace' }}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : published ? 'Publish Article' : 'Save Draft'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
