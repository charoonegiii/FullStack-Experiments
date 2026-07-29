import React from 'react';
import { useDispatch } from 'react-redux';
import { postDeleted } from '../features/posts/postsSlice';
import { startEditingPost } from '../features/ui/uiSlice';

function PostRow({ post, platformName }) {
  const dispatch = useDispatch();

  return (
    <div style={styles.card}>
      <button
        style={styles.titleBtn}
        onClick={() => dispatch(startEditingPost(post.id))}
      >
        {post.title}
      </button>

      <p style={styles.content}>
        {post.content || "No content available"}
      </p>

      <div style={styles.infoRow}>
        <span style={styles.tag}>
          <strong>Platform:</strong> {platformName}
        </span>

        <span style={styles.tag}>
          <strong>Status:</strong> {post.status}
        </span>
      </div>

      <button
        style={styles.deleteBtn}
        onClick={() => dispatch(postDeleted(post.id))}
      >
        Delete
      </button>
    </div>
  );
}

const styles = {
  card: {
    borderBottom: '1px solid #eee',
    padding: '14px 0',
  },

  titleBtn: {
    background: 'none',
    border: 'none',
    color: '#000',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    padding: 0,
    marginBottom: 8,
    textAlign: 'left',
  },

  content: {
    color: '#555',
    fontSize: 14,
    lineHeight: 1.5,
    margin: '0 0 10px 0',
    whiteSpace: 'pre-wrap',
  },

  infoRow: {
    display: 'flex',
    gap: 20,
    marginBottom: 10,
    fontSize: 13,
  },

  tag: {
    color: '#555',
  },

  deleteBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default React.memo(PostRow);