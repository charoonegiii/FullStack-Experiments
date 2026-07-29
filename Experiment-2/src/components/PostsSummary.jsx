import React from 'react';
import { useSelector } from 'react-redux';
import { selectPostsSummary } from '../features/posts/postsSelectors';

// createSelector means this only recomputes when posts or platforms
// actually change — not on every render triggered by unrelated ui state
// (e.g. typing in the search box, which lives in a different slice).
function PostsSummary() {
  const summary = useSelector(selectPostsSummary);

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>Posts Summary</h3>
      <div style={styles.row}>All posts: {summary.total}</div>
      {summary.byPlatform.map((p) => (
        <div style={styles.row} key={p.platformId}>
          {p.platformName} posts: {p.count}
        </div>
      ))}
      <div style={styles.row}>Draft posts: {summary.draftCount}</div>
      <div style={styles.row}>Published count: {summary.publishedCount}</div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e2e2e2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  heading: { marginTop: 0, marginBottom: 12 },
  row: { fontSize: 14, color: '#333', marginBottom: 4, textAlign: 'center' },
};

export default React.memo(PostsSummary);
