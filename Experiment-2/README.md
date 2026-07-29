# Redux Toolkit Lab — Posts & Platforms (Corrected Version)

This is a corrected version, updated after comparing the first draft against
the actual assignment brief and a reference UI screenshot. See "What changed"
below for the full diff.

## How to run

```bash
npm install
npm run dev
```

## Project structure

```
src/
  api/mockApi.js                Mock backend: Facebook/LinkedIn/Twitter, posts with status
  app/store.js                  configureStore() — posts, platforms, ui reducers
  features/
    posts/
      postsSlice.js              Entity-adapter slice, CRUD (add/update/delete), async thunks
      postsSelectors.js          Memoized selectors incl. the exact summary shape
    platforms/
      platformsSlice.js          Entity-adapter slice + fetch thunk
      platformsSelectors.js
    ui/
      uiSlice.js                 SEPARATE slice: editingPostId, platformFilter, search
  components/
    PostForm.jsx                 Unified Add/Edit form (Title, Platform, Status)
    PostsSummary.jsx             "All posts / [Platform] posts / Draft / Published"
    ExistingPosts.jsx            Header + total count + filter/search + list
    PostRow.jsx                  React.memo row; click title to edit, Delete button
  App.jsx                        Two-column layout
  main.jsx
```

## What changed from the first draft (and why)

| Issue found | Fix |
|---|---|
| No `status` field on posts | Added `status: 'draft' \| 'published'` to the post model |
| No way to edit an existing post | `PostForm.jsx` is now a unified Add/Edit form; clicking a post's title in the list loads it into the form for editing, with Save Changes / Cancel |
| "Separation of data state and UI state" wasn't explicitly demonstrated | Added `features/ui/uiSlice.js` — a dedicated slice holding only `editingPostId`, `platformFilter`, and `search`. Posts/platforms slices never touch UI concerns, and vice versa |
| Summary stats didn't match the brief | `selectPostsSummary` (memoized with `createSelector`) now returns exactly: total posts, count per platform, draft count, published count |
| Platforms didn't match reference (had Instagram, missing Facebook) | Mock data now uses Facebook / LinkedIn / Twitter |
| Layout was a single-column filter+list, not the two-column Edit/Existing-Posts layout | `App.jsx` now lays out `PostForm` on the left and `PostsSummary` + `ExistingPosts` on the right |

## How this still covers both experiments

**Experiment 1 (centralized state, normalization, async flow):**
- Single store combining `posts`, `platforms`, `ui` reducers (`app/store.js`)
- `createEntityAdapter` normalizes both posts and platforms
- Full CRUD: `postAdded`, `postUpdated`, `postDeleted`
- `createAsyncThunk` for `fetchPosts`, `fetchPlatforms`, `addPostAsync`, with pending/fulfilled/rejected handling

**Experiment 2 (memoized selectors, optimized rendering):**
- `selectPostsSummary` and `selectFilteredPosts` use `createSelector` so they only recompute when posts/platforms/filters actually change
- `PostRow`, `PostsSummary` wrapped in `React.memo`
- `ExistingPosts.jsx` uses `useMemo` (stable filters object) and `useCallback` (stable handlers) so the memoized selectors' caches and `React.memo` on children both stay effective

## Try it yourself

1. Open React DevTools Profiler.
2. Edit one post's title via the form. Notice other rows in the list don't
   re-render — only the row whose data changed.
3. Type in the search box: rows that stay visible don't re-render, since
   `selectFilteredPosts` is memoized and unaffected rows get the same object
   reference back.
