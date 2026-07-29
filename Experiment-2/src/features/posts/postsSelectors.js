import { createSelector } from '@reduxjs/toolkit';
import { postsAdapterSelectors } from './postsSlice';
import { selectAllPlatforms } from '../platforms/platformsSelectors';

// --- Basic selectors ---
export const selectAllPosts = postsAdapterSelectors.selectAll;
export const selectPostById = postsAdapterSelectors.selectById;
export const selectPostsStatus = (state) => state.posts.status;

// --- Derived state: filter by platform (used by the optional filter dropdown) ---
export const selectPostsByPlatform = createSelector(
  [selectAllPosts, (state, platformId) => platformId],
  (posts, platformId) =>
    !platformId || platformId === 'all' ? posts : posts.filter((p) => p.platformId === platformId)
);

// --- Derived state: search + platform filter combined ---
export const selectFilteredPosts = createSelector(
  [selectAllPosts, (state, filters) => filters],
  (posts, { platformId, search }) => {
    let result = posts;
    if (platformId && platformId !== 'all') {
      result = result.filter((p) => p.platformId === platformId);
    }
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(term));
    }
    return result;
  }
);

// --- Derived/aggregated state: the exact "Posts Summary" panel from the reference ---
// (All posts, count per platform, Draft posts, Published count)
export const selectPostsSummary = createSelector(
  [selectAllPosts, selectAllPlatforms],
  (posts, platforms) => {
    const byPlatform = platforms.map((platform) => ({
      platformId: platform.id,
      platformName: platform.name,
      count: posts.filter((p) => p.platformId === platform.id).length,
    }));

    const draftCount = posts.filter((p) => p.status === 'draft').length;
    const publishedCount = posts.filter((p) => p.status === 'published').length;

    return {
      total: posts.length,
      byPlatform,
      draftCount,
      publishedCount,
    };
  }
);
