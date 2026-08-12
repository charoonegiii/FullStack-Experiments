import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please add title and content for the post.');
      return;
    }

    setLoading(true);
    postService.createPost({ title: form.title, content: form.content, author: currentUser.name })
      .then(() => {
        setSuccess('Post created successfully. Redirecting...');
        setTimeout(() => navigate('/posts'), 900);
      })
      .catch(err => {
        setError(err.message || 'Unable to create the post.');
      })
      .finally(() => setLoading(false));
  }

  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Create Post</p>
          <h1>Add new course content</h1>
          <p className="muted">Only Admin and Editor roles can create posts in this system.</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter post title"
            />
          </label>

          <label className="form-label">
            Content
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="textarea-field"
              rows="8"
              placeholder="Add a concise description or summary"
            />
          </label>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/posts')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreatePost;
