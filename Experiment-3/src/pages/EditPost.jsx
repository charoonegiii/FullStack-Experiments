import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/postService';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    postService.getPostById(id)
      .then(post => {
        setForm({ title: post.title, content: post.content });
        setLoading(false);
      })
      .catch(() => {
        setError('The requested post was not found.');
        setLoading(false);
      });
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please enter both title and content.');
      return;
    }

    postService.updatePost(id, { title: form.title, content: form.content })
      .then(() => {
        setSuccess('Post updated successfully. Redirecting to posts...');
        setTimeout(() => navigate('/posts'), 900);
      })
      .catch(err => {
        setError(err.message || 'Unable to update post.');
      });
  }

  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Edit Post</p>
          <h1>Update post details</h1>
          <p className="muted">Modify the title and content, then save your changes.</p>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">Loading post details...</div>
      ) : (
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
                placeholder="Update post title"
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
                placeholder="Update the post content"
              />
            </label>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/posts')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default EditPost;
