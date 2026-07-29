import React from 'react';
import { useDispatch } from 'react-redux';
import { postDeleted } from '../features/posts/postsSlice';
import { startEditingPost } from '../features/ui/uiSlice';

// React.memo: this row only re-renders if its own post/platformName props
// change — typing in a search box or editing a different post won't
// re-render every other row, as long as parents pass stable references.
function PostRow({ post, platformName }) {
  const dispatch = useDispatch();

  return (
    <div style={styles.row}>
      <button
        style={styles.titleBtn}
        onClick={() => dispatch(startEditingPost(post.id))}
      >
        {post.title}
      </button>

      <span style={styles.tag}>{platformName}</span>
      <span style={styles.tag}>{post.status}</span>

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
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },

  titleBtn: {
    flex: 1,
    textAlign: 'left',
    background: 'none',
    border: 'none',
    color: '#000',          // <-- Makes the title black
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    padding: 0,
  },

  tag: {
    fontSize: 13,
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