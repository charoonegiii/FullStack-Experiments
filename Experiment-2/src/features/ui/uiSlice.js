import { createSlice } from '@reduxjs/toolkit';

// This slice deliberately holds ONLY ui state (which post is being edited,
// current filter/search values) — never domain data. Posts/platforms live
// in their own slices. This separation is what lets the data slices stay
// clean, reusable, and independent of any particular screen's UI needs,
// which is the scalability benefit the experiment brief calls out.
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    editingPostId: null, // null = "add" mode, otherwise "edit" mode
    platformFilter: 'all',
    search: '',
  },
  reducers: {
    startEditingPost(state, action) {
      state.editingPostId = action.payload;
    },
    stopEditingPost(state) {
      state.editingPostId = null;
    },
    platformFilterChanged(state, action) {
      state.platformFilter = action.payload;
    },
    searchChanged(state, action) {
      state.search = action.payload;
    },
  },
});

export const { startEditingPost, stopEditingPost, platformFilterChanged, searchChanged } =
  uiSlice.actions;
export default uiSlice.reducer;

export const selectEditingPostId = (state) => state.ui.editingPostId;
export const selectPlatformFilter = (state) => state.ui.platformFilter;
export const selectSearch = (state) => state.ui.search;
