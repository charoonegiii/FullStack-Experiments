import { createSlice, createAsyncThunk, createEntityAdapter, nanoid } from '@reduxjs/toolkit';
import { fetchPostsApi, createPostApi } from '../../api/mockApi';

// No sortComparer here — we keep insertion/fetch order, matching a typical
// "existing posts" feed rather than re-sorting behind the user's back.
const postsAdapter = createEntityAdapter();

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  return await fetchPostsApi();
});

export const addPostAsync = createAsyncThunk(
  'posts/addPostAsync',
  async ({ title, platformId, status }) => {
    return await createPostApi({ id: nanoid(), title, platformId, status });
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    status: 'idle',
    error: null,
  }),
  reducers: {
    // CRUD: Create
    postAdded: {
      reducer(state, action) {
        postsAdapter.addOne(state, action.payload);
      },
      prepare({ title, platformId, status }) {
        return { payload: { id: nanoid(), title, platformId, status } };
      },
    },
    // CRUD: Update — powers the "Edit Post / Save Changes" flow
    postUpdated(state, action) {
      const { id, changes } = action.payload;
      postsAdapter.updateOne(state, { id, changes });
    },
    // CRUD: Delete
    postDeleted(state, action) {
      postsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPostAsync.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      });
  },
});

export const { postAdded, postUpdated, postDeleted } = postsSlice.actions;
export default postsSlice.reducer;

export const postsAdapterSelectors = postsAdapter.getSelectors((state) => state.posts);
