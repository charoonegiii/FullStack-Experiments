import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilteredPosts,
  selectPostsStatus,
  selectAllPosts,
} from '../features/posts/postsSelectors';
import { selectAllPlatforms } from '../features/platforms/platformsSelectors';
import { selectPlatformFilter, selectSearch, platformFilterChanged, searchChanged } from '../features/ui/uiSlice';
import PostRow from './PostRow';

export default function ExistingPosts() {
  const dispatch = useDispatch();
  const status = useSelector(selectPostsStatus);
  const total = useSelector(selectAllPosts).length;

  const platformFilter = useSelector(selectPlatformFilter);
  const search = useSelector(selectSearch);
  const platforms = useSelector(selectAllPlatforms);

  // Stable filters object so the memoized selector's cache isn't
  // invalidated on every render (only when platformFilter/search change).
  const filters = useMemo(
    () => ({ platformId: platformFilter, search }),
    [platformFilter, search]
  );
  const posts = useSelector((state) => selectFilteredPosts(state, filters));

  const platformNameById = useMemo(
    () => Object.fromEntries(platforms.map((p) => [p.id, p.name])),
    [platforms]
  );

  const handlePlatformChange = useCallback(
    (e) => dispatch(platformFilterChanged(e.target.value)),
    [dispatch]
  );
  const handleSearchChange = useCallback((e) => dispatch(searchChanged(e.target.value)), [dispatch]);

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <h3 style={{ margin: 0 }}>Existing Posts</h3>
        <span style={{ color: '#777', fontSize: 14 }}>{total} total posts</span>
      </div>

      <div style={styles.filterRow}>
        <select value={platformFilter} onChange={handlePlatformChange} style={styles.select}>
          <option value="all">All platforms</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search posts…"
          value={search}
          onChange={handleSearchChange}
          style={styles.search}
        />
      </div>

      {status === 'loading' && <p>Loading posts…</p>}
      {status === 'failed' && <p>Failed to load posts.</p>}
      {status === 'succeeded' && posts.length === 0 && <p>No posts match this filter.</p>}

      <div>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} platformName={platformNameById[post.platformId]} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#f7f8fa',
    border: '1px solid #e2e2e2',
    borderRadius: 12,
    padding: 20,
  },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  filterRow: { display: 'flex', gap: 10, marginBottom: 8 },
  select: { padding: '6px 8px', borderRadius: 8, border: '1px solid #ccc' },
  search: { flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid #ccc' },
};
