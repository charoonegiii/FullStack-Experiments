import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import platformsReducer from '../features/platforms/platformsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer, // data state
    platforms: platformsReducer, // data state
    ui: uiReducer, // ui state — kept separate from the above
  },
});
