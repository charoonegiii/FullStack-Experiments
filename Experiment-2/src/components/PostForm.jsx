import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAdded, postUpdated } from '../features/posts/postsSlice';
import { selectPostById } from '../features/posts/postsSelectors';
import { selectAllPlatforms } from '../features/platforms/platformsSelectors';
import { selectEditingPostId, stopEditingPost } from '../features/ui/uiSlice';

export default function PostForm() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);

  // editingPostId lives in the UI slice (not the posts slice)
  const editingPostId = useSelector(selectEditingPostId);
  const editingPost = useSelector((state) =>
    editingPostId ? selectPostById(state, editingPostId) : undefined
  );
  const isEditing = Boolean(editingPost);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? '');
  const [status, setStatus] = useState('draft');

  // Populate the form whenever the selected post-to-edit changes.
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content || '');
      setPlatformId(editingPost.platformId);
      setStatus(editingPost.status);
    } else {
      setTitle('');
      setContent('');
      setPlatformId(platforms[0]?.id ?? '');
      setStatus('draft');
    }
  }, [editingPost, platforms]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !platformId) return;

    if (isEditing) {
      dispatch(
        postUpdated({
          id: editingPostId,
          changes: {
            title,
            content,
            platformId,
            status,
          },
        })
      );

      dispatch(stopEditingPost());
    } else {
      dispatch(
        postAdded({
          title,
          content,
          platformId,
          status,
        })
      );

      setTitle('');
      setContent('');
    }
  };

  const handleCancel = () => {
    dispatch(stopEditingPost());
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h3 style={styles.heading}>
        {isEditing ? 'Edit Post' : 'Add Post'}
      </h3>

      <label style={styles.label}>Title</label>
      <input
        style={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />

      <label style={styles.label}>Content</label>
      <textarea
        style={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
      />

      <label style={styles.label}>Platform</label>
      <select
        style={styles.input}
        value={platformId}
        onChange={(e) => setPlatformId(e.target.value)}
      >
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label style={styles.label}>Status</label>
      <select
        style={styles.input}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="draft">draft</option>
        <option value="published">published</option>
      </select>

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button type="submit" style={styles.primaryBtn}>
          {isEditing ? 'Save Changes' : 'Add Post'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            style={styles.secondaryBtn}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e2e2e2',
    borderRadius: 12,
    padding: 20,
    width: 300,
  },

  heading: {
    marginTop: 0,
    marginBottom: 16,
  },

  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
    boxSizing: 'border-box',
  },

  textarea: {
    width: '100%',
    minHeight: 100,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  primaryBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  secondaryBtn: {
    background: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};