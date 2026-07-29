import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchPlatformsApi } from '../../api/mockApi';

// createEntityAdapter normalizes state into { ids: [], entities: {} }
// instead of a nested array, so lookups are O(1) and there's no duplication.
const platformsAdapter = createEntityAdapter();

export const fetchPlatforms = createAsyncThunk('platforms/fetchPlatforms', async () => {
  return await fetchPlatformsApi();
});

const platformsSlice = createSlice({
  name: 'platforms',
  initialState: platformsAdapter.getInitialState({
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        platformsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default platformsSlice.reducer;
export const platformsAdapterSelectors = platformsAdapter.getSelectors((state) => state.platforms);
