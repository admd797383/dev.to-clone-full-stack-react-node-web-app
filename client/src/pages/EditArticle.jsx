import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditArticle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchArticle();
  }, [id, user]);

  const fetchArticle = async () => {
    try {
      // We need to fetch the article first - for now just use the ID
      // In production, you'd have an endpoint to get article by ID
      setTitle('');
      setContent('');
      setLoading(false);
    } catch (err) {
      setError('Article not found');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.put(`/articles/${id}`, {
        title,
        content,
        description,
        tags: tagsArray,
        coverImage,
        published
      });
      
      navigate(`/article/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Edit Article</h1>
      
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
            placeholder="Brief description of your article"
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
            Publish
          </label>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
